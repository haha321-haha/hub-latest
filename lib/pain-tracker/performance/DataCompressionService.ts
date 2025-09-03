// DataCompressionService - Implements data compression for local storage efficiency
// Provides compression, decompression, and storage optimization

import {
  PainRecord,
  StoredData,
  CompressionResult,
  PainTrackerError
} from '../../../types/pain-tracker';

export interface DataCompressionServiceInterface {
  compressData(data: any): Promise<CompressionResult>;
  decompressData(compressedData: string): Promise<any>;
  compressRecords(records: PainRecord[]): Promise<string>;
  decompressRecords(compressedRecords: string): Promise<PainRecord[]>;
  getCompressionRatio(originalSize: number, compressedSize: number): number;
  optimizeStorageData(data: StoredData): Promise<StoredData>;
}

export class DataCompressionService implements DataCompressionServiceInterface {
  private compressionLevel: 'none' | 'basic' | 'advanced' = 'basic';
  private compressionThreshold = 1024; // Only compress data larger than 1KB

  constructor(compressionLevel: 'none' | 'basic' | 'advanced' = 'basic') {
    this.compressionLevel = compressionLevel;
  }

  /**
   * Compress any data object
   */
  async compressData(data: any): Promise<CompressionResult> {
    try {
      const originalString = JSON.stringify(data);
      const originalSize = new Blob([originalString]).size;

      // Skip compression for small data
      if (originalSize < this.compressionThreshold) {
        return {
          compressedData: originalString,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 1,
          compressionTime: 0,
          algorithm: 'none'
        };
      }

      const startTime = performance.now();
      let compressedData: string;
      let algorithm: string;

      switch (this.compressionLevel) {
        case 'none':
          compressedData = originalString;
          algorithm = 'none';
          break;
        case 'basic':
          compressedData = await this.basicCompress(originalString);
          algorithm = 'basic';
          break;
        case 'advanced':
          compressedData = await this.advancedCompress(originalString);
          algorithm = 'lz-string';
          break;
        default:
          compressedData = originalString;
          algorithm = 'none';
      }

      const compressionTime = performance.now() - startTime;
      const compressedSize = new Blob([compressedData]).size;
      const compressionRatio = this.getCompressionRatio(originalSize, compressedSize);

      return {
        compressedData,
        originalSize,
        compressedSize,
        compressionRatio,
        compressionTime,
        algorithm
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to compress data',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Decompress data
   */
  async decompressData(compressedData: string): Promise<any> {
    try {
      // Try to detect compression algorithm from data format
      const algorithm = this.detectCompressionAlgorithm(compressedData);
      
      let decompressedString: string;

      switch (algorithm) {
        case 'none':
          decompressedString = compressedData;
          break;
        case 'basic':
          decompressedString = await this.basicDecompress(compressedData);
          break;
        case 'lz-string':
          decompressedString = await this.advancedDecompress(compressedData);
          break;
        default:
          // Fallback: try to parse as-is
          decompressedString = compressedData;
      }

      return JSON.parse(decompressedString);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to decompress data',
        'DATA_CORRUPTION',
        error
      );
    }
  }

  /**
   * Compress pain records specifically
   */
  async compressRecords(records: PainRecord[]): Promise<string> {
    try {
      // Optimize records before compression
      const optimizedRecords = this.optimizeRecords(records);
      const compressionResult = await this.compressData(optimizedRecords);
      return compressionResult.compressedData;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to compress pain records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Decompress pain records specifically
   */
  async decompressRecords(compressedRecords: string): Promise<PainRecord[]> {
    try {
      const decompressedData = await this.decompressData(compressedRecords);
      return this.deserializeRecords(decompressedData);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to decompress pain records',
        'DATA_CORRUPTION',
        error
      );
    }
  }

  /**
   * Calculate compression ratio
   */
  getCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 1;
    return Math.round((compressedSize / originalSize) * 100) / 100;
  }

  /**
   * Optimize stored data structure
   */
  async optimizeStorageData(data: StoredData): Promise<StoredData> {
    try {
      return {
        ...data,
        records: this.optimizeRecords(data.records),
        preferences: this.optimizePreferences(data.preferences),
        metadata: this.optimizeMetadata(data.metadata)
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to optimize storage data',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get compression statistics for monitoring
   */
  async getCompressionStats(data: any): Promise<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    estimatedSavings: number;
  }> {
    const compressionResult = await this.compressData(data);
    const estimatedSavings = compressionResult.originalSize - compressionResult.compressedSize;

    return {
      originalSize: compressionResult.originalSize,
      compressedSize: compressionResult.compressedSize,
      compressionRatio: compressionResult.compressionRatio,
      estimatedSavings
    };
  }

  // Private compression methods

  private async basicCompress(data: string): Promise<string> {
    // Basic compression using JSON minification and simple string replacement
    let compressed = data;
    
    // Remove unnecessary whitespace
    compressed = compressed.replace(/\s+/g, ' ').trim();
    
    // Replace common repeated strings with shorter tokens
    const replacements = [
      { pattern: '"painLevel":', replacement: '"pl":' },
      { pattern: '"painTypes":', replacement: '"pt":' },
      { pattern: '"locations":', replacement: '"loc":' },
      { pattern: '"symptoms":', replacement: '"sym":' },
      { pattern: '"menstrualStatus":', replacement: '"ms":' },
      { pattern: '"medications":', replacement: '"med":' },
      { pattern: '"effectiveness":', replacement: '"eff":' },
      { pattern: '"lifestyleFactors":', replacement: '"lf":' },
      { pattern: '"createdAt":', replacement: '"ca":' },
      { pattern: '"updatedAt":', replacement: '"ua":' },
      { pattern: '"notes":', replacement: '"n":' }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      compressed = compressed.replace(new RegExp(pattern, 'g'), replacement);
    });

    return `BASIC:${compressed}`;
  }

  private async basicDecompress(compressedData: string): Promise<string> {
    if (!compressedData.startsWith('BASIC:')) {
      throw new Error('Invalid basic compression format');
    }

    let decompressed = compressedData.substring(6); // Remove 'BASIC:' prefix

    // Reverse the replacements
    const replacements = [
      { pattern: '"n":', replacement: '"notes":' },
      { pattern: '"ua":', replacement: '"updatedAt":' },
      { pattern: '"ca":', replacement: '"createdAt":' },
      { pattern: '"lf":', replacement: '"lifestyleFactors":' },
      { pattern: '"eff":', replacement: '"effectiveness":' },
      { pattern: '"med":', replacement: '"medications":' },
      { pattern: '"ms":', replacement: '"menstrualStatus":' },
      { pattern: '"sym":', replacement: '"symptoms":' },
      { pattern: '"loc":', replacement: '"locations":' },
      { pattern: '"pt":', replacement: '"painTypes":' },
      { pattern: '"pl":', replacement: '"painLevel":' }
    ];

    replacements.forEach(({ pattern, replacement }) => {
      decompressed = decompressed.replace(new RegExp(pattern, 'g'), replacement);
    });

    return decompressed;
  }

  private async advancedCompress(data: string): Promise<string> {
    // Advanced compression using LZ-string algorithm
    // For now, implement a simple dictionary-based compression
    
    const dictionary = this.buildCompressionDictionary(data);
    let compressed = data;
    
    // Replace common patterns with dictionary references
    dictionary.forEach((replacement, pattern) => {
      compressed = compressed.replace(new RegExp(pattern, 'g'), replacement);
    });

    // Add dictionary to the beginning of compressed data
    const dictionaryString = JSON.stringify(Array.from(dictionary.entries()));
    return `ADVANCED:${dictionaryString}|${compressed}`;
  }

  private async advancedDecompress(compressedData: string): Promise<string> {
    if (!compressedData.startsWith('ADVANCED:')) {
      throw new Error('Invalid advanced compression format');
    }

    const content = compressedData.substring(9); // Remove 'ADVANCED:' prefix
    const separatorIndex = content.indexOf('|');
    
    if (separatorIndex === -1) {
      throw new Error('Invalid advanced compression format');
    }

    const dictionaryString = content.substring(0, separatorIndex);
    const compressedContent = content.substring(separatorIndex + 1);

    const dictionaryArray = JSON.parse(dictionaryString);
    const dictionary = new Map(dictionaryArray);

    let decompressed = compressedContent;

    // Reverse the dictionary replacements
    dictionary.forEach((replacement, pattern) => {
      decompressed = decompressed.replace(new RegExp(String(replacement), 'g'), String(pattern));
    });

    return decompressed;
  }

  private detectCompressionAlgorithm(data: string): string {
    if (data.startsWith('BASIC:')) return 'basic';
    if (data.startsWith('ADVANCED:')) return 'lz-string';
    
    // Try to parse as JSON to detect uncompressed data
    try {
      JSON.parse(data);
      return 'none';
    } catch {
      // If it's not valid JSON, assume it's compressed but unknown format
      return 'basic';
    }
  }

  private buildCompressionDictionary(data: string): Map<string, string> {
    const dictionary = new Map<string, string>();
    const patterns = [
      // Common JSON patterns
      '{"id":"',
      '","date":"',
      '","time":"',
      '","painLevel":',
      ',"painTypes":[',
      ',"locations":[',
      ',"symptoms":[',
      ',"menstrualStatus":"',
      ',"medications":[',
      ',"effectiveness":',
      ',"lifestyleFactors":[',
      ',"notes":"',
      ',"createdAt":"',
      ',"updatedAt":"',
      // Common values
      '"cramping"',
      '"aching"',
      '"sharp"',
      '"throbbing"',
      '"burning"',
      '"pressure"',
      '"lower_abdomen"',
      '"lower_back"',
      '"upper_thighs"',
      '"pelvis"',
      '"side"',
      '"whole_abdomen"'
    ];

    patterns.forEach((pattern, index) => {
      // Create short replacement tokens
      const replacement = `§${index.toString(36)}§`;
      dictionary.set(pattern, replacement);
    });

    return dictionary;
  }

  private optimizeRecords(records: PainRecord[]): PainRecord[] {
    return records.map(record => ({
      ...record,
      // Remove empty arrays and null values
      painTypes: record.painTypes.filter(Boolean),
      locations: record.locations.filter(Boolean),
      symptoms: record.symptoms.filter(Boolean),
      medications: record.medications.filter(med => med.name && med.name.trim()),
      lifestyleFactors: record.lifestyleFactors?.filter(Boolean) || [],
      // Trim notes
      notes: record.notes?.trim() || undefined
    }));
  }

  private optimizePreferences(preferences: any): any {
    if (!preferences) return preferences;

    return {
      ...preferences,
      // Remove empty arrays and default values
      defaultMedications: preferences.defaultMedications?.filter(Boolean) || [],
      // Optimize nested objects
      reminderSettings: preferences.reminderSettings ? {
        ...preferences.reminderSettings,
        // Remove disabled reminders
        ...(preferences.reminderSettings.enabled === false ? {} : preferences.reminderSettings)
      } : undefined
    };
  }

  private optimizeMetadata(metadata: any): any {
    if (!metadata) return metadata;

    return {
      ...metadata,
      // Keep only essential metadata
      lastModified: metadata.lastModified,
      recordCount: metadata.recordCount,
      dataSize: metadata.dataSize,
      version: metadata.version
    };
  }

  private deserializeRecords(data: any): PainRecord[] {
    if (!Array.isArray(data)) {
      throw new Error('Invalid records data format');
    }

    return data.map(record => ({
      ...record,
      createdAt: new Date(record.createdAt || record.ca),
      updatedAt: new Date(record.updatedAt || record.ua),
      // Ensure arrays are properly initialized
      painTypes: record.painTypes || record.pt || [],
      locations: record.locations || record.loc || [],
      symptoms: record.symptoms || record.sym || [],
      medications: record.medications || record.med || [],
      lifestyleFactors: record.lifestyleFactors || record.lf || []
    }));
  }
}

export default DataCompressionService;