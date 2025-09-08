'use client';

import { useState, useEffect, useCallback } from 'react';
import { PainEntry, PainEntryFormData, PainStatistics, ValidationError } from '../types';
import { 
  validatePainEntry, 
  calculateStatistics, 
  saveToStorage, 
  loadFromStorage, 
  clearStorage,
  createStorageKey 
} from '../utils';
import { STORAGE_KEYS } from '../constants';

interface UsePainTrackerReturn {
  // Data
  entries: PainEntry[];
  statistics: PainStatistics;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addEntry: (data: PainEntryFormData) => Promise<{ success: boolean; errors?: ValidationError[] }>;
  updateEntry: (id: string, data: Partial<PainEntryFormData>) => Promise<{ success: boolean; errors?: ValidationError[] }>;
  deleteEntry: (id: string) => Promise<boolean>;
  clearAllEntries: () => Promise<boolean>;
  
  // Utilities
  getEntry: (id: string) => PainEntry | undefined;
  getEntriesInRange: (startDate: string, endDate: string) => PainEntry[];
  exportData: (format: 'json' | 'csv') => void;
  
  // State management
  refreshData: () => void;
  setError: (error: string | null) => void;
}

export const usePainTracker = (userId?: string): UsePainTrackerReturn => {
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [statistics, setStatistics] = useState<PainStatistics>({
    totalEntries: 0,
    averagePain: 0,
    maxPain: 0,
    minPain: 0,
    mostCommonSymptoms: [],
    mostEffectiveRemedies: [],
    painFrequency: {},
    trendDirection: 'stable'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = createStorageKey(userId || 'anonymous', 'pain_records');

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const savedEntries = loadFromStorage<PainEntry[]>(storageKey);
        if (savedEntries && Array.isArray(savedEntries)) {
          setEntries(savedEntries);
          setStatistics(calculateStatistics(savedEntries));
        }
      } catch (err) {
        console.error('Failed to load pain tracker data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storageKey]);

  // Save data to storage whenever entries change
  useEffect(() => {
    if (!isLoading && entries.length >= 0) {
      const success = saveToStorage(storageKey, entries);
      if (!success) {
        setError('Failed to save data. Please try again.');
      }
    }
  }, [entries, storageKey, isLoading]);

  // Recalculate statistics when entries change
  useEffect(() => {
    setStatistics(calculateStatistics(entries));
  }, [entries]);

  const addEntry = useCallback(async (data: PainEntryFormData): Promise<{ success: boolean; errors?: ValidationError[] }> => {
    try {
      setError(null);
      
      // Validate the entry
      const validationErrors = validatePainEntry(data);
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors };
      }

      // Check for duplicate dates - 允许用户选择是否覆盖
      const existingEntry = entries.find(entry => entry.date === data.date);
      if (existingEntry) {
        // 如果用户明确表示要覆盖，则删除旧记录
        if ((data as any).overwrite === true) {
          setEntries(prev => prev.filter(entry => entry.date !== data.date));
        } else {
          return {
            success: false,
            errors: [{
              field: 'date',
              message: 'An entry for this date already exists. Do you want to overwrite it?',
              code: 'DUPLICATE_DATE'
            }]
          };
        }
      }

      // Create new entry
      const now = new Date().toISOString();
      const newEntry: PainEntry = {
        id: `pain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        location: data.location || [],
        symptoms: data.symptoms || [],
        remedies: data.remedies || [],
        createdAt: now,
        updatedAt: now
      };

      // Add to entries
      setEntries(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to add entry:', err);
      setError('Failed to add entry. Please try again.');
      return { success: false, errors: [{ field: 'general', message: 'Failed to add entry', code: 'ADD_ERROR' }] };
    }
  }, [entries]);

  const updateEntry = useCallback(async (id: string, data: Partial<PainEntryFormData>): Promise<{ success: boolean; errors?: ValidationError[] }> => {
    try {
      setError(null);
      
      const existingEntry = entries.find(entry => entry.id === id);
      if (!existingEntry) {
        return { 
          success: false, 
          errors: [{ field: 'id', message: 'Entry not found', code: 'NOT_FOUND' }] 
        };
      }

      // Merge with existing data
      const updatedData = { ...existingEntry, ...data };
      
      // Validate the updated entry
      const validationErrors = validatePainEntry(updatedData);
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors };
      }

      // Check for duplicate dates (excluding current entry)
      if (data.date && data.date !== existingEntry.date) {
        const duplicateEntry = entries.find(entry => entry.id !== id && entry.date === data.date);
        if (duplicateEntry) {
          return { 
            success: false, 
            errors: [{ 
              field: 'date', 
              message: 'An entry for this date already exists', 
              code: 'DUPLICATE_DATE' 
            }] 
          };
        }
      }

      // Update entry
      const updatedEntry: PainEntry = {
        ...existingEntry,
        ...data,
        updatedAt: new Date().toISOString()
      };

      setEntries(prev => 
        prev.map(entry => entry.id === id ? updatedEntry : entry)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      
      return { success: true };
    } catch (err) {
      console.error('Failed to update entry:', err);
      setError('Failed to update entry. Please try again.');
      return { success: false, errors: [{ field: 'general', message: 'Failed to update entry', code: 'UPDATE_ERROR' }] };
    }
  }, [entries]);

  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const entryExists = entries.some(entry => entry.id === id);
      if (!entryExists) {
        setError('Entry not found');
        return false;
      }

      setEntries(prev => prev.filter(entry => entry.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setError('Failed to delete entry. Please try again.');
      return false;
    }
  }, [entries]);

  const clearAllEntries = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      setEntries([]);
      const success = clearStorage(storageKey);
      if (!success) {
        setError('Failed to clear data. Please try again.');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to clear entries:', err);
      setError('Failed to clear data. Please try again.');
      return false;
    }
  }, [storageKey]);

  const getEntry = useCallback((id: string): PainEntry | undefined => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  const getEntriesInRange = useCallback((startDate: string, endDate: string): PainEntry[] => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return entryDate >= start && entryDate <= end;
    });
  }, [entries]);

  const exportData = useCallback((format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(entries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pain-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // CSV export logic would go here
        // For now, just export as JSON
        exportData('json');
      }
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('Failed to export data. Please try again.');
    }
  }, [entries]);

  const refreshData = useCallback(() => {
    const savedEntries = loadFromStorage<PainEntry[]>(storageKey);
    if (savedEntries && Array.isArray(savedEntries)) {
      setEntries(savedEntries);
    }
  }, [storageKey]);

  return {
    // Data
    entries,
    statistics,
    isLoading,
    error,
    
    // Actions
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllEntries,
    
    // Utilities
    getEntry,
    getEntriesInRange,
    exportData,
    
    // State management
    refreshData,
    setError
  };
};
