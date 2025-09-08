// LocalStorageAdapter Unit Tests
// Comprehensive test suite for local storage operations

import LocalStorageAdapter from '../storage/LocalStorageAdapter';
import { STORAGE_KEYS } from '../../../types/pain-tracker';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
});

// Mock navigator.storage
Object.defineProperty(global, 'navigator', {
  value: {
    storage: {
      estimate: jest.fn().mockResolvedValue({
        usage: 1024,
        quota: 5 * 1024 * 1024
      })
    }
  }
});

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new LocalStorageAdapter();
  });

  describe('save', () => {
    it('should save data to localStorage', async () => {
      const testData = [{ id: '1', name: 'test' }];
      
      await adapter.save(STORAGE_KEYS.PAIN_RECORDS, testData);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        JSON.stringify(testData)
      );
    });

    it('should handle save errors gracefully', async () => {
      const testData = [{ id: '1', name: 'test' }];
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      await expect(adapter.save(STORAGE_KEYS.PAIN_RECORDS, testData))
        .rejects.toThrow('Failed to save data to localStorage');
    });

    it('should handle circular references in data', async () => {
      const circularData: any = { id: '1' };
      circularData.self = circularData;
      
      await expect(adapter.save(STORAGE_KEYS.PAIN_RECORDS, circularData))
        .rejects.toThrow('Failed to save data to localStorage');
    });
  });

  describe('load', () => {
    it('should load data from localStorage', async () => {
      const testData = [{ id: '1', name: 'test' }];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));
      
      const result = await adapter.load(STORAGE_KEYS.PAIN_RECORDS);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PAIN_RECORDS);
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent data', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = await adapter.load(STORAGE_KEYS.PAIN_RECORDS);
      
      expect(result).toBeNull();
    });

    it('should handle corrupted JSON data', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      await expect(adapter.load(STORAGE_KEYS.PAIN_RECORDS))
        .rejects.toThrow('Failed to load data from localStorage');
    });

    it('should handle localStorage access errors', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      await expect(adapter.load(STORAGE_KEYS.PAIN_RECORDS))
        .rejects.toThrow('Failed to load data from localStorage');
    });
  });

  describe('remove', () => {
    it('should remove data from localStorage', async () => {
      await adapter.remove(STORAGE_KEYS.PAIN_RECORDS);
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.PAIN_RECORDS);
    });

    it('should handle remove errors gracefully', async () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove failed');
      });
      
      await expect(adapter.remove(STORAGE_KEYS.PAIN_RECORDS))
        .rejects.toThrow('Failed to remove data from localStorage');
    });
  });

  describe('clear', () => {
    it('should clear all pain tracker data', async () => {
      await adapter.clear();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.PAIN_RECORDS);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_PREFERENCES);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.SCHEMA_VERSION);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.METADATA);
    });

    it('should handle clear errors gracefully', async () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Clear failed');
      });
      
      await expect(adapter.clear())
        .rejects.toThrow('Failed to clear localStorage');
    });
  });

  describe('getSize', () => {
    it('should calculate storage size correctly', async () => {
      const testData = JSON.stringify([{ id: '1', name: 'test' }]);
      mockLocalStorage.getItem
        .mockReturnValueOnce(testData)
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('{}');
      
      const size = await adapter.getSize();
      
      expect(size).toBe(testData.length + 2 + 1 + 2); // Sum of all data lengths
    });

    it('should handle missing data when calculating size', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const size = await adapter.getSize();
      
      expect(size).toBe(0);
    });
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(adapter.isAvailable()).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      const originalLocalStorage = global.localStorage;
      delete (global as any).localStorage;
      
      const newAdapter = new LocalStorageAdapter();
      expect(newAdapter.isAvailable()).toBe(false);
      
      global.localStorage = originalLocalStorage;
    });

    it('should return false when localStorage throws errors', () => {
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      
      const newAdapter = new LocalStorageAdapter();
      expect(newAdapter.isAvailable()).toBe(false);
      
      mockLocalStorage.setItem = originalSetItem;
    });
  });

  describe('getQuotaInfo', () => {
    it('should return quota information', async () => {
      const quotaInfo = await adapter.getQuotaInfo();
      
      expect(quotaInfo).toEqual({
        usage: 1024,
        quota: 5 * 1024 * 1024,
        available: 5 * 1024 * 1024 - 1024
      });
    });

    it('should handle quota API not available', async () => {
      delete (global.navigator as any).storage;
      
      const quotaInfo = await adapter.getQuotaInfo();
      
      expect(quotaInfo).toEqual({
        usage: 0,
        quota: 0,
        available: 0
      });
    });

    it('should handle quota API errors', async () => {
      global.navigator.storage!.estimate = jest.fn().mockRejectedValue(new Error('Quota error'));
      
      const quotaInfo = await adapter.getQuotaInfo();
      
      expect(quotaInfo).toEqual({
        usage: 0,
        quota: 0,
        available: 0
      });
    });
  });

  describe('createAutoBackup', () => {
    it('should create automatic backup', async () => {
      const testData = [{ id: '1', name: 'test' }];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));
      
      await adapter.createAutoBackup();
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringMatching(/^pain_tracker_backup_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        expect.any(String)
      );
    });

    it('should handle backup creation errors', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Backup failed');
      });
      
      await expect(adapter.createAutoBackup())
        .rejects.toThrow('Failed to create automatic backup');
    });

    it('should limit number of backups', async () => {
      // Mock existing backups
      mockLocalStorage.key
        .mockReturnValueOnce('pain_tracker_backup_2024-01-01T10:00:00')
        .mockReturnValueOnce('pain_tracker_backup_2024-01-02T10:00:00')
        .mockReturnValueOnce('pain_tracker_backup_2024-01-03T10:00:00')
        .mockReturnValueOnce('pain_tracker_backup_2024-01-04T10:00:00')
        .mockReturnValueOnce('pain_tracker_backup_2024-01-05T10:00:00')
        .mockReturnValueOnce(null);
      
      mockLocalStorage.length = 5;
      mockLocalStorage.getItem.mockReturnValue('{}');
      
      await adapter.createAutoBackup();
      
      // Should remove oldest backup
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('pain_tracker_backup_2024-01-01T10:00:00');
    });
  });

  describe('listBackups', () => {
    it('should list available backups', async () => {
      mockLocalStorage.key
        .mockReturnValueOnce('pain_tracker_backup_2024-01-01T10:00:00')
        .mockReturnValueOnce('pain_tracker_backup_2024-01-02T10:00:00')
        .mockReturnValueOnce('other_key')
        .mockReturnValueOnce(null);
      
      mockLocalStorage.length = 3;
      
      const backups = await adapter.listBackups();
      
      expect(backups).toEqual([
        'pain_tracker_backup_2024-01-02T10:00:00',
        'pain_tracker_backup_2024-01-01T10:00:00'
      ]);
    });

    it('should return empty array when no backups exist', async () => {
      mockLocalStorage.length = 0;
      
      const backups = await adapter.listBackups();
      
      expect(backups).toEqual([]);
    });
  });

  describe('restoreFromBackup', () => {
    it('should restore data from backup', async () => {
      const backupData = {
        records: [{ id: '1', name: 'test' }],
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(backupData));
      
      await adapter.restoreFromBackup('pain_tracker_backup_2024-01-01T10:00:00');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        JSON.stringify(backupData.records)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(backupData.preferences)
      );
    });

    it('should handle non-existent backup', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      await expect(adapter.restoreFromBackup('non_existent_backup'))
        .rejects.toThrow('Backup not found');
    });

    it('should handle corrupted backup data', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      await expect(adapter.restoreFromBackup('corrupted_backup'))
        .rejects.toThrow('Failed to restore from backup');
    });
  });

  describe('cleanupOldBackups', () => {
    it('should remove backups older than retention period', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days old
      
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 1); // 1 day old
      
      mockLocalStorage.key
        .mockReturnValueOnce(`pain_tracker_backup_${oldDate.toISOString()}`)
        .mockReturnValueOnce(`pain_tracker_backup_${recentDate.toISOString()}`)
        .mockReturnValueOnce(null);
      
      mockLocalStorage.length = 2;
      
      await adapter.cleanupOldBackups();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        `pain_tracker_backup_${oldDate.toISOString()}`
      );
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith(
        `pain_tracker_backup_${recentDate.toISOString()}`
      );
    });
  });

  describe('export', () => {
    it('should export all data', async () => {
      const records = [{ id: '1', name: 'test' }];
      const preferences = { theme: 'light' };
      const metadata = { version: '1.0' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(records))
        .mockReturnValueOnce(JSON.stringify(preferences))
        .mockReturnValueOnce('1')
        .mockReturnValueOnce(JSON.stringify(metadata));
      
      const exportData = await adapter.export();
      
      expect(exportData).toEqual({
        records,
        preferences,
        schemaVersion: 1,
        metadata,
        exportDate: expect.any(Date)
      });
    });

    it('should handle missing data during export', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const exportData = await adapter.export();
      
      expect(exportData).toEqual({
        records: [],
        preferences: {},
        schemaVersion: 1,
        metadata: {},
        exportDate: expect.any(Date)
      });
    });
  });

  describe('restore', () => {
    it('should restore data from export', async () => {
      const importData = {
        records: [{ id: '1', name: 'test' }],
        preferences: { theme: 'light' },
        schemaVersion: 1,
        metadata: { version: '1.0' }
      };
      
      await adapter.restore(JSON.stringify(importData));
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        JSON.stringify(importData.records)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(importData.preferences)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.SCHEMA_VERSION,
        '1'
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.METADATA,
        JSON.stringify(importData.metadata)
      );
    });

    it('should handle invalid restore data', async () => {
      await expect(adapter.restore('invalid json'))
        .rejects.toThrow('Failed to restore data');
    });

    it('should handle missing required fields in restore data', async () => {
      const invalidData = { invalid: 'data' };
      
      await expect(adapter.restore(JSON.stringify(invalidData)))
        .rejects.toThrow('Invalid restore data format');
    });
  });

  describe('migration support', () => {
    it('should handle schema version updates', async () => {
      mockLocalStorage.getItem.mockReturnValue('0'); // Old schema version
      
      const currentVersion = await adapter.load(STORAGE_KEYS.SCHEMA_VERSION);
      expect(currentVersion).toBe('0');
      
      await adapter.save(STORAGE_KEYS.SCHEMA_VERSION, 1);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.SCHEMA_VERSION, '1');
    });
  });

  describe('error recovery', () => {
    it('should attempt recovery on storage errors', async () => {
      let callCount = 0;
      mockLocalStorage.setItem.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Temporary error');
        }
        return undefined;
      });
      
      // Should retry and succeed on second attempt
      await adapter.save(STORAGE_KEYS.PAIN_RECORDS, []);
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retry attempts', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Persistent error');
      });
      
      await expect(adapter.save(STORAGE_KEYS.PAIN_RECORDS, []))
        .rejects.toThrow('Failed to save data to localStorage');
    });
  });
});