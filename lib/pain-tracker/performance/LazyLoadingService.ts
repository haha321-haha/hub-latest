// LazyLoadingService - Implements lazy loading for historical records and charts
// Provides pagination, virtual scrolling, and progressive data loading

import {
  PainRecord,
  PaginationOptions,
  LazyLoadResult,
  PainTrackerError
} from '../../../types/pain-tracker';

export interface LazyLoadingServiceInterface {
  loadRecordsPaginated(options: PaginationOptions): Promise<LazyLoadResult<PainRecord>>;
  loadRecordsVirtual(startIndex: number, endIndex: number): Promise<PainRecord[]>;
  preloadNextBatch(currentPage: number, pageSize: number): Promise<void>;
  clearCache(): void;
  getCacheStats(): { size: number; hitRate: number };
}

export class LazyLoadingService implements LazyLoadingServiceInterface {
  private cache = new Map<string, PainRecord[]>();
  private cacheHits = 0;
  private cacheMisses = 0;
  private maxCacheSize = 50; // Maximum number of cached pages
  private preloadBuffer = 2; // Number of pages to preload ahead

  /**
   * Load records with pagination support
   */
  async loadRecordsPaginated(options: PaginationOptions): Promise<LazyLoadResult<PainRecord>> {
    try {
      const {
        page = 1,
        pageSize = 20,
        sortBy = 'date',
        sortOrder = 'desc',
        filters = {}
      } = options;

      const cacheKey = this.generateCacheKey(options);
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        this.cacheHits++;
        const cachedRecords = this.cache.get(cacheKey)!;
        
        return {
          data: cachedRecords,
          pagination: {
            currentPage: page,
            pageSize,
            totalItems: await this.getTotalRecordCount(filters),
            totalPages: Math.ceil(await this.getTotalRecordCount(filters) / pageSize),
            hasNextPage: page * pageSize < await this.getTotalRecordCount(filters),
            hasPreviousPage: page > 1
          },
          fromCache: true
        };
      }

      this.cacheMisses++;

      // Load records from storage
      const allRecords = await this.loadAllRecords();
      
      // Apply filters
      const filteredRecords = this.applyFilters(allRecords, filters);
      
      // Apply sorting
      const sortedRecords = this.applySorting(filteredRecords, sortBy, sortOrder);
      
      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRecords = sortedRecords.slice(startIndex, endIndex);
      
      // Cache the result
      this.cacheRecords(cacheKey, paginatedRecords);
      
      // Preload next batch if needed
      if (options.preload !== false) {
        this.preloadNextBatch(page, pageSize).catch(console.warn);
      }

      return {
        data: paginatedRecords,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: filteredRecords.length,
          totalPages: Math.ceil(filteredRecords.length / pageSize),
          hasNextPage: endIndex < filteredRecords.length,
          hasPreviousPage: page > 1
        },
        fromCache: false
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to load paginated records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Load records for virtual scrolling
   */
  async loadRecordsVirtual(startIndex: number, endIndex: number): Promise<PainRecord[]> {
    try {
      const cacheKey = `virtual_${startIndex}_${endIndex}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        this.cacheHits++;
        return this.cache.get(cacheKey)!;
      }

      this.cacheMisses++;

      // Load all records and slice the required range
      const allRecords = await this.loadAllRecords();
      const virtualRecords = allRecords.slice(startIndex, endIndex);
      
      // Cache the result
      this.cacheRecords(cacheKey, virtualRecords);
      
      return virtualRecords;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to load virtual records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Preload next batch of records for smoother navigation
   */
  async preloadNextBatch(currentPage: number, pageSize: number): Promise<void> {
    try {
      const nextPage = currentPage + 1;
      const preloadOptions: PaginationOptions = {
        page: nextPage,
        pageSize,
        preload: false // Prevent recursive preloading
      };

      // Only preload if not already cached
      const cacheKey = this.generateCacheKey(preloadOptions);
      if (!this.cache.has(cacheKey)) {
        await this.loadRecordsPaginated(preloadOptions);
      }
    } catch (error) {
      // Preloading failures should not affect main functionality
      console.warn('Failed to preload next batch:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Get cache performance statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? this.cacheHits / totalRequests : 0;
    
    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Load records in batches to avoid memory issues
   */
  async loadRecordsBatch(batchSize: number = 100): Promise<PainRecord[]> {
    try {
      const allRecords: PainRecord[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const batch = await this.loadRecordsBatchFromStorage(offset, batchSize);
        allRecords.push(...batch);
        
        hasMore = batch.length === batchSize;
        offset += batchSize;

        // Yield control to prevent blocking the UI
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      return allRecords;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to load records in batches',
        'STORAGE_ERROR',
        error
      );
    }
  }

  // Private helper methods

  private generateCacheKey(options: PaginationOptions): string {
    const { page, pageSize, sortBy, sortOrder, filters } = options;
    const filterKey = JSON.stringify(filters || {});
    return `${page}_${pageSize}_${sortBy}_${sortOrder}_${filterKey}`;
  }

  private async loadAllRecords(): Promise<PainRecord[]> {
    // This would typically load from the data manager
    // For now, return empty array - will be integrated with actual data manager
    return Promise.resolve([]);
  }

  private async getTotalRecordCount(filters: any = {}): Promise<number> {
    const allRecords = await this.loadAllRecords();
    const filteredRecords = this.applyFilters(allRecords, filters);
    return filteredRecords.length;
  }

  private applyFilters(records: PainRecord[], filters: any): PainRecord[] {
    let filteredRecords = [...records];

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.date);
        if (filters.startDate && recordDate < new Date(filters.startDate)) {
          return false;
        }
        if (filters.endDate && recordDate > new Date(filters.endDate)) {
          return false;
        }
        return true;
      });
    }

    // Pain level filter
    if (filters.minPainLevel !== undefined || filters.maxPainLevel !== undefined) {
      filteredRecords = filteredRecords.filter(record => {
        if (filters.minPainLevel !== undefined && record.painLevel < filters.minPainLevel) {
          return false;
        }
        if (filters.maxPainLevel !== undefined && record.painLevel > filters.maxPainLevel) {
          return false;
        }
        return true;
      });
    }

    // Menstrual status filter
    if (filters.menstrualStatus) {
      filteredRecords = filteredRecords.filter(record => 
        record.menstrualStatus === filters.menstrualStatus
      );
    }

    // Text search filter
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase();
      filteredRecords = filteredRecords.filter(record => {
        return (
          record.notes?.toLowerCase().includes(searchTerm) ||
          record.painTypes.some(type => type.toLowerCase().includes(searchTerm)) ||
          record.locations.some(location => location.toLowerCase().includes(searchTerm)) ||
          record.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm))
        );
      });
    }

    return filteredRecords;
  }

  private applySorting(records: PainRecord[], sortBy: string, sortOrder: 'asc' | 'desc'): PainRecord[] {
    return [...records].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'painLevel':
          comparison = a.painLevel - b.painLevel;
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private cacheRecords(key: string, records: PainRecord[]): void {
    // Implement LRU cache eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, records);
  }

  private async loadRecordsBatchFromStorage(offset: number, batchSize: number): Promise<PainRecord[]> {
    // This would load a specific batch from storage
    // Implementation depends on the storage adapter
    return Promise.resolve([]);
  }
}

export default LazyLoadingService;