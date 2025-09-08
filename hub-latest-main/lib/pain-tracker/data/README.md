# PainDataManager

The `PainDataManager` is the core data management service for the Enhanced Pain Tracker. It provides comprehensive CRUD operations, data filtering, querying capabilities, and data management features.

## Features

### Core CRUD Operations
- **Save Record**: Create new pain records with validation
- **Update Record**: Modify existing records with validation
- **Delete Record**: Remove records with confirmation
- **Get Record**: Retrieve individual records by ID
- **Get All Records**: Retrieve all stored records

### Advanced Querying
- **Date Range Filtering**: Get records within specific date ranges
- **Pain Level Filtering**: Filter by minimum/maximum pain levels
- **Menstrual Status Filtering**: Filter by cycle phase
- **Text Search**: Search across notes, medications, symptoms, etc.

### Data Management
- **Export/Import**: Full data backup and restore capabilities
- **Data Statistics**: Calculate usage statistics and insights
- **Data Cleanup**: Remove duplicates and optimize storage
- **Error Recovery**: Automatic backup and recovery mechanisms

## Usage

```typescript
import { PainDataManager } from '@/lib/pain-tracker';

// Create instance
const dataManager = new PainDataManager();

// Save a new record
const newRecord = await dataManager.saveRecord({
  date: '2024-01-15',
  time: '14:30',
  painLevel: 7,
  painTypes: ['cramping'],
  locations: ['lower_abdomen'],
  symptoms: ['nausea'],
  menstrualStatus: 'day_2_3',
  medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
  effectiveness: 8,
  lifestyleFactors: [{ factor: 'stress_level', value: 6 }],
  notes: 'Severe morning pain'
});

// Get records by date range
const recentRecords = await dataManager.getRecordsByDateRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

// Search records
const searchResults = await dataManager.searchRecords('ibuprofen');

// Export data for backup
const exportData = await dataManager.exportData();

// Get statistics
const stats = await dataManager.getDataStatistics();
console.log(`Total records: ${stats.totalRecords}`);
console.log(`Average pain level: ${stats.averagePainLevel}`);
```

## Error Handling

The PainDataManager uses the `PainTrackerError` class for consistent error handling:

```typescript
try {
  await dataManager.saveRecord(invalidRecord);
} catch (error) {
  if (error instanceof PainTrackerError) {
    console.log(`Error type: ${error.code}`);
    console.log(`Message: ${error.message}`);
  }
}
```

## Data Validation

All records are automatically validated before saving:
- Pain level must be 0-10
- Date cannot be in the future
- Required fields must be present
- Duplicate detection prevents identical records

## Performance Features

- **Automatic Backups**: Creates backups before destructive operations
- **Data Compression**: Optimizes storage usage
- **Quota Management**: Monitors and manages storage limits
- **Cleanup Operations**: Removes duplicates and optimizes data

## Testing

The PainDataManager includes comprehensive test coverage:
- Unit tests for all methods
- Integration tests for complete workflows
- Error scenario testing
- Performance testing with large datasets

Run tests with:
```bash
npx jest lib/pain-tracker/__tests__/PainDataManager.test.ts
npx jest lib/pain-tracker/__tests__/PainDataManager.integration.test.ts
```

## Dependencies

- `LocalStorageAdapter`: For data persistence
- `ValidationService`: For data validation
- `PainTrackerError`: For error handling
- Browser localStorage API