# Pain Tracker Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Data Models](#data-models)
4. [API Reference](#api-reference)
5. [Storage System](#storage-system)
6. [Analytics Engine](#analytics-engine)
7. [Export System](#export-system)
8. [Performance Considerations](#performance-considerations)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Guide](#deployment-guide)
11. [Maintenance and Updates](#maintenance-and-updates)

## Architecture Overview

### System Architecture

The Enhanced Pain Tracker follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  React Components, UI State Management, User Interactions  │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                    │
│  Data Management, Analytics, Validation, Export Logic      │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                       │
│  LocalStorage Adapter, Data Persistence, Backup System    │
├─────────────────────────────────────────────────────────────┤
│                    Browser APIs                            │
│  localStorage, IndexedDB, File API, Canvas API            │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Client-Side First**: All data processing happens locally for privacy
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Responsive Design**: Optimized for mobile and desktop
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Optimized for large datasets (1000+ records)
6. **Internationalization**: Full support for English and Chinese

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Zustand for global state
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS with custom components
- **Testing**: Jest + React Testing Library + Puppeteer
- **Build Tool**: Next.js 14+
- **Internationalization**: next-intl

## Core Components

### Component Hierarchy

```
PainTrackerTool
├── PainTrackerHeader
│   ├── StatsSummary
│   └── QuickActions
├── PainTrackerTabs
│   ├── RecordTab
│   │   ├── PainRecordForm
│   │   ├── FormValidation
│   │   └── SuccessMessage
│   ├── HistoryTab
│   │   ├── FilterControls
│   │   ├── RecordsList
│   │   ├── RecordCard
│   │   └── EditModal
│   ├── AnalyticsTab
│   │   ├── StatsSummary
│   │   ├── PainTrendChart
│   │   ├── PainDistributionChart
│   │   └── PatternInsights
│   └── ExportTab
│       ├── ExportOptions
│       ├── DateRangeSelector
│       └── ExportButtons
└── ErrorBoundary
```

### Key Components

#### PainTrackerTool
Main container component that manages global state and tab navigation.

```typescript
interface PainTrackerToolProps {
  locale: string;
  initialTab?: TabType;
  className?: string;
}
```

#### PainRecordForm
Comprehensive form for recording pain data with real-time validation.

```typescript
interface PainRecordFormProps {
  onSubmit: (record: PainRecordInput) => Promise<void>;
  onReset: () => void;
  initialData?: Partial<PainRecordInput>;
  isEditing?: boolean;
}
```

#### AnalyticsTab
Displays charts, statistics, and insights based on user data.

```typescript
interface AnalyticsTabProps {
  records: PainRecord[];
  analytics: PainAnalytics;
  onRefresh: () => void;
}
```

## Data Models

### Core Data Types

#### PainRecord
Primary data structure for storing pain tracking information.

```typescript
interface PainRecord {
  id: string;                    // Unique identifier
  date: string;                  // ISO date string (YYYY-MM-DD)
  time: string;                  // Time string (HH:MM)
  painLevel: number;             // 0-10 scale
  painTypes: PainType[];         // Array of pain type enums
  locations: PainLocation[];     // Array of location enums
  symptoms: Symptom[];           // Array of symptom enums
  menstrualStatus: MenstrualStatus; // Cycle phase enum
  medications: Medication[];     // Array of medication objects
  effectiveness: number;         // 0-10 treatment effectiveness
  lifestyleFactors: LifestyleFactor[]; // Array of lifestyle data
  notes?: string;                // Optional user notes
  createdAt: Date;              // Record creation timestamp
  updatedAt: Date;              // Last modification timestamp
}
```

#### PainAnalytics
Computed analytics data structure.

```typescript
interface PainAnalytics {
  totalRecords: number;
  averagePainLevel: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  commonPainTypes: Array<{
    type: PainType;
    count: number;
    percentage: number;
  }>;
  effectiveTreatments: Array<{
    treatment: string;
    usageCount: number;
    averageEffectiveness: number;
    successRate: number;
  }>;
  cyclePatterns: Array<{
    phase: MenstrualStatus;
    averagePainLevel: number;
    frequency: number;
    commonSymptoms: Symptom[];
  }>;
  trendData: TrendPoint[];
  insights: string[];
}
```

### Enums and Constants

#### PainType
```typescript
enum PainType {
  CRAMPING = 'cramping',
  ACHING = 'aching',
  SHARP = 'sharp',
  THROBBING = 'throbbing',
  BURNING = 'burning',
  PRESSURE = 'pressure'
}
```

#### MenstrualStatus
```typescript
enum MenstrualStatus {
  BEFORE_PERIOD = 'before_period',
  DAY_1 = 'day_1',
  DAY_2_3 = 'day_2_3',
  DAY_4_PLUS = 'day_4_plus',
  AFTER_PERIOD = 'after_period',
  MID_CYCLE = 'mid_cycle',
  IRREGULAR = 'irregular'
}
```

## API Reference

### PainDataManager

Primary service for data management operations.

#### Methods

##### saveRecord(record: PainRecordInput): Promise<PainRecord>
Saves a new pain record with validation and backup.

```typescript
const record = await dataManager.saveRecord({
  date: '2024-01-15',
  time: '09:30',
  painLevel: 7,
  painTypes: ['cramping'],
  locations: ['lower_abdomen'],
  symptoms: ['nausea'],
  menstrualStatus: 'day_1',
  medications: [],
  effectiveness: 0,
  lifestyleFactors: [],
  notes: 'Severe morning pain'
});
```

##### updateRecord(id: string, updates: Partial<PainRecord>): Promise<PainRecord>
Updates an existing record with validation.

```typescript
const updated = await dataManager.updateRecord('record_id', {
  painLevel: 8,
  notes: 'Pain increased throughout the day'
});
```

##### deleteRecord(id: string): Promise<void>
Deletes a record with backup creation.

```typescript
await dataManager.deleteRecord('record_id');
```

##### getAllRecords(): Promise<PainRecord[]>
Retrieves all records sorted by date (newest first).

```typescript
const records = await dataManager.getAllRecords();
```

##### getRecordsByDateRange(start: Date, end: Date): Promise<PainRecord[]>
Filters records by date range.

```typescript
const records = await dataManager.getRecordsByDateRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

##### searchRecords(query: string): Promise<PainRecord[]>
Searches records by notes, pain types, and medications.

```typescript
const results = await dataManager.searchRecords('severe headache');
```

### AnalyticsEngine

Service for pattern recognition and statistical analysis.

#### Methods

##### calculateAnalytics(records: PainRecord[]): PainAnalytics
Computes comprehensive analytics from pain records.

```typescript
const analytics = analyticsEngine.calculateAnalytics(records);
console.log(`Average pain level: ${analytics.averagePainLevel}`);
```

##### identifyPatterns(records: PainRecord[]): Pattern[]
Identifies recurring patterns in the data.

```typescript
const patterns = analyticsEngine.identifyPatterns(records);
patterns.forEach(pattern => {
  console.log(`Pattern: ${pattern.type}, Confidence: ${pattern.confidence}`);
});
```

##### generateInsights(analytics: PainAnalytics): string[]
Generates human-readable insights and recommendations.

```typescript
const insights = analyticsEngine.generateInsights(analytics);
insights.forEach(insight => console.log(insight));
```

### ExportManager

Service for generating reports and exports.

#### Methods

##### exportToHTML(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<string>
Generates HTML report for medical consultations.

```typescript
const htmlReport = await exportManager.exportToHTML(records, analytics, {
  format: 'html',
  dateRange: { start: new Date('2024-01-01'), end: new Date('2024-03-31') },
  includeCharts: true,
  includeSummary: true,
  includeInsights: true
});
```

##### exportToPDF(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<Blob>
Generates PDF report with medical formatting.

```typescript
const pdfBlob = await exportManager.exportToPDF(records, analytics, options);
const url = URL.createObjectURL(pdfBlob);
window.open(url);
```

## Storage System

### LocalStorageAdapter

Handles all browser storage operations with error handling and backup.

#### Storage Keys
```typescript
const STORAGE_KEYS = {
  PAIN_RECORDS: 'pain_tracker_records',
  USER_PREFERENCES: 'pain_tracker_preferences',
  SCHEMA_VERSION: 'pain_tracker_schema_version',
  METADATA: 'pain_tracker_metadata'
} as const;
```

#### Data Structure
```typescript
interface StoredData {
  records: PainRecord[];
  preferences: UserPreferences;
  schemaVersion: number;
  metadata: {
    version: string;
    lastBackup?: Date;
    totalRecords: number;
  };
}
```

### Backup System

#### Automatic Backups
- Created before any destructive operation
- Limited to 5 most recent backups
- Includes timestamp in backup key
- Automatic cleanup of old backups

#### Manual Backup/Restore
```typescript
// Create manual backup
const exportData = await dataManager.exportData();
localStorage.setItem('manual_backup', JSON.stringify(exportData));

// Restore from backup
const backupData = JSON.parse(localStorage.getItem('manual_backup'));
await dataManager.importData(backupData);
```

### Data Migration

#### Schema Versioning
```typescript
interface MigrationPlan {
  version: number;
  description: string;
  migrate: (oldData: any) => any;
  rollback?: (newData: any) => any;
}
```

#### Migration Process
1. Check current schema version
2. Apply migrations sequentially
3. Update schema version
4. Create backup of migrated data

## Analytics Engine

### Statistical Calculations

#### Pain Level Statistics
```typescript
interface PainStatistics {
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  min: number;
  max: number;
}
```

#### Trend Analysis
- Linear regression for pain trends
- Seasonal decomposition for cycle patterns
- Moving averages for smoothed trends
- Correlation analysis between factors

### Pattern Recognition

#### Menstrual Cycle Patterns
- Identifies cycle length variations
- Correlates pain with cycle phases
- Detects irregular patterns
- Predicts future cycle events

#### Treatment Effectiveness
- Calculates success rates by medication
- Identifies optimal dosages
- Tracks effectiveness over time
- Suggests treatment combinations

### Insight Generation

#### Rule-Based Insights
```typescript
interface InsightRule {
  condition: (analytics: PainAnalytics) => boolean;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: 'health' | 'treatment' | 'pattern' | 'data';
}
```

#### Machine Learning Insights
- Clustering similar pain episodes
- Anomaly detection for unusual patterns
- Predictive modeling for pain forecasting
- Recommendation systems for treatments

## Export System

### Report Templates

#### Medical Report Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>Pain Tracking Report</title>
  <style>/* Medical report styling */</style>
</head>
<body>
  <header>Patient Information</header>
  <section>Executive Summary</section>
  <section>Detailed Records</section>
  <section>Analytics and Insights</section>
  <section>Recommendations</section>
  <footer>Report Generation Info</footer>
</body>
</html>
```

#### PDF Generation
- HTML to PDF conversion using browser APIs
- Consistent styling with existing PDF center
- Optimized for printing and digital viewing
- Embedded charts as base64 images

### Chart Rendering

#### Chart Types
1. **Line Chart**: Pain trends over time
2. **Bar Chart**: Pain level distribution
3. **Pie Chart**: Pain type frequency
4. **Scatter Plot**: Correlation analysis

#### Chart Configuration
```typescript
interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  data: ChartData;
  options: ChartOptions;
  responsive: boolean;
  maintainAspectRatio: boolean;
}
```

## Performance Considerations

### Data Optimization

#### Large Dataset Handling
- Pagination for record lists (50 records per page)
- Virtual scrolling for large datasets
- Lazy loading of chart data
- Data compression for storage

#### Memory Management
- Cleanup of chart instances
- Debounced search and filtering
- Memoization of expensive calculations
- Garbage collection optimization

### Storage Optimization

#### Data Compression
```typescript
interface CompressionStrategy {
  compress: (data: any) => string;
  decompress: (compressed: string) => any;
  ratio: number;
}
```

#### Quota Management
- Monitor storage usage
- Automatic cleanup of old data
- User notifications for storage limits
- Graceful degradation when quota exceeded

### Chart Performance

#### Optimization Strategies
- Data point limiting for large datasets
- Canvas rendering optimizations
- Animation disabling for large charts
- Progressive loading of chart data

## Testing Strategy

### Unit Tests
- **Coverage Target**: 90%+ code coverage
- **Test Files**: `*.test.ts` files alongside source
- **Mocking**: localStorage, Chart.js, browser APIs
- **Assertions**: Jest matchers with custom extensions

### Integration Tests
- **User Workflows**: Complete user journeys
- **Data Flow**: End-to-end data operations
- **Error Scenarios**: Failure handling and recovery
- **Performance**: Large dataset operations

### End-to-End Tests
- **Browser Automation**: Puppeteer for real browser testing
- **User Interactions**: Form submissions, navigation, exports
- **Responsive Design**: Mobile and desktop viewports
- **Accessibility**: Screen reader and keyboard navigation

### Performance Tests
- **Load Testing**: 1000+ record operations
- **Memory Testing**: Memory leak detection
- **Storage Testing**: Quota and performance limits
- **Chart Testing**: Large dataset rendering

## Deployment Guide

### Build Process

#### Development Build
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm run start
```

#### Static Export
```bash
npm run build
npm run export
```

### Environment Configuration

#### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NODE_ENV=production
```

#### Build Optimization
- Tree shaking for unused code
- Code splitting for lazy loading
- Asset optimization and compression
- Service worker for offline functionality

### Browser Compatibility

#### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

#### Polyfills
- localStorage fallback for older browsers
- Chart.js compatibility shims
- CSS Grid fallbacks
- ES6+ feature polyfills

## Maintenance and Updates

### Version Management

#### Semantic Versioning
- **Major**: Breaking changes to data structure
- **Minor**: New features, non-breaking changes
- **Patch**: Bug fixes, performance improvements

#### Release Process
1. Update version in package.json
2. Run full test suite
3. Generate changelog
4. Create release tag
5. Deploy to production

### Data Migration

#### Migration Scripts
```typescript
interface Migration {
  version: string;
  description: string;
  up: (data: any) => any;
  down: (data: any) => any;
}
```

#### Rollback Strategy
- Automatic backups before migrations
- Rollback scripts for each migration
- Version compatibility checks
- User notification of data changes

### Monitoring and Logging

#### Error Tracking
- Client-side error boundaries
- Unhandled promise rejection logging
- Performance monitoring
- User feedback collection

#### Analytics
- Usage pattern tracking (anonymized)
- Feature adoption metrics
- Performance benchmarks
- Error rate monitoring

### Security Updates

#### Regular Maintenance
- Dependency updates
- Security vulnerability patches
- Browser compatibility updates
- Performance optimizations

#### Security Considerations
- Input sanitization
- XSS prevention
- Data validation
- Secure storage practices

---

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Start development server: `npm run dev`

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Pull Request Process
1. Create feature branch
2. Write tests for new functionality
3. Ensure all tests pass
4. Update documentation
5. Submit pull request with description

For additional technical support or questions, please refer to the project repository or contact the development team.