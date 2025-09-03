# Pain Tracker Testing Guide

## Overview

This document provides comprehensive guidance for testing the Enhanced Pain Tracker system. The testing strategy includes unit tests, integration tests, end-to-end tests, and performance tests to ensure reliability, functionality, and performance.

## Test Structure

```
lib/pain-tracker/__tests__/
├── AnalyticsEngine.test.ts          # Analytics functionality tests
├── ExportManager.test.ts            # Export system tests
├── LocalStorageAdapter.test.ts      # Storage layer tests
├── PainDataManager.test.ts          # Core data management tests
├── PainDataManager.integration.test.ts # Integration tests
├── Performance.test.ts              # Performance and load tests
├── UserWorkflows.integration.test.ts # End-to-end workflow tests
└── ValidationService.test.ts        # Data validation tests

tests/e2e/
├── pain-tracker-e2e.test.js        # Browser automation tests
└── translation-e2e.test.js         # Existing translation tests

tests/
├── setup.js                        # Jest test setup
└── translation-system.test.js      # Existing translation tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Suites

#### Unit Tests Only
```bash
npm run test:unit
```

#### Integration Tests
```bash
npm run test:integration
```

#### Performance Tests
```bash
npm run test:performance
```

#### End-to-End Tests
```bash
npm run test:e2e
```

#### Pain Tracker Specific Tests
```bash
npm run test:pain-tracker
```

## Test Categories

### Unit Tests

Unit tests focus on individual components and functions in isolation.

#### PainDataManager Tests
- **File**: `PainDataManager.test.ts`
- **Coverage**: CRUD operations, validation, error handling
- **Key Test Cases**:
  - Record saving with validation
  - Record updating and deletion
  - Data filtering and searching
  - Error handling for invalid data
  - Duplicate detection

#### AnalyticsEngine Tests
- **File**: `AnalyticsEngine.test.ts`
- **Coverage**: Statistical calculations, pattern recognition, insights
- **Key Test Cases**:
  - Analytics calculation accuracy
  - Pattern identification algorithms
  - Insight generation logic
  - Trend prediction accuracy
  - Correlation analysis

#### ValidationService Tests
- **File**: `ValidationService.test.ts`
- **Coverage**: Data validation rules, sanitization, error messages
- **Key Test Cases**:
  - Field validation (required, format, range)
  - Data sanitization (XSS prevention)
  - Duplicate checking logic
  - Import data validation
  - Error message accuracy

#### LocalStorageAdapter Tests
- **File**: `LocalStorageAdapter.test.ts`
- **Coverage**: Storage operations, backup system, error recovery
- **Key Test Cases**:
  - Save/load operations
  - Backup creation and restoration
  - Storage quota handling
  - Error recovery mechanisms
  - Data migration support

#### ExportManager Tests
- **File**: `ExportManager.test.ts`
- **Coverage**: Report generation, format conversion, medical summaries
- **Key Test Cases**:
  - HTML report generation
  - PDF export functionality
  - Medical summary creation
  - Chart rendering in exports
  - Export option handling

### Integration Tests

Integration tests verify that components work together correctly.

#### Data Flow Integration
- **File**: `PainDataManager.integration.test.ts`
- **Coverage**: Complete data operations with real storage
- **Key Test Cases**:
  - End-to-end record lifecycle
  - Storage and retrieval consistency
  - Backup and restore workflows
  - Data migration scenarios

#### User Workflow Integration
- **File**: `UserWorkflows.integration.test.ts`
- **Coverage**: Complete user journeys from recording to export
- **Key Test Cases**:
  - Record → History → Analytics → Export workflow
  - Data persistence across operations
  - Search and filtering workflows
  - Error recovery scenarios
  - Large dataset handling

### End-to-End Tests

E2E tests use browser automation to test the complete user experience.

#### Browser Automation Tests
- **File**: `pain-tracker-e2e.test.js`
- **Tool**: Puppeteer
- **Coverage**: Real browser interactions, UI functionality
- **Key Test Cases**:
  - Form submission and validation
  - Tab navigation and state management
  - Chart rendering and interaction
  - Export functionality
  - Mobile responsiveness
  - Accessibility compliance

### Performance Tests

Performance tests ensure the system handles large datasets efficiently.

#### Load Testing
- **File**: `Performance.test.ts`
- **Coverage**: Large dataset operations, memory usage, response times
- **Key Test Cases**:
  - 1000+ record operations
  - Analytics calculation performance
  - Chart rendering with large datasets
  - Memory leak detection
  - Storage quota management

## Test Configuration

### Jest Configuration

The Jest configuration is defined in `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/lib'],
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.(test|spec).{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: ['next/babel']
    }]
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!**/docs/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'lib/pain-tracker/**/*.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000
};
```

### Test Setup

The test setup file (`tests/setup.js`) includes:
- Custom Jest matchers
- Global mocks and configurations
- Environment variable setup
- Console output management

### Mocking Strategy

#### LocalStorage Mock
```javascript
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
```

#### Chart.js Mock
```javascript
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));
```

## Writing Tests

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Arrange: Set up test environment
  });

  it('should do something specific', () => {
    // Arrange: Set up test data
    const testData = createTestData();
    
    // Act: Execute the function/method
    const result = functionUnderTest(testData);
    
    // Assert: Verify the results
    expect(result).toEqual(expectedResult);
  });
});
```

### Test Naming Conventions

- **Describe blocks**: Use the component/function name
- **Test cases**: Use "should [expected behavior] when [condition]"
- **Variables**: Use descriptive names that explain the test scenario

### Test Data Generation

Use helper functions to generate consistent test data:

```typescript
const generateTestRecord = (overrides = {}) => ({
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
  notes: 'Test record',
  ...overrides
});
```

### Async Testing

Use proper async/await patterns for testing asynchronous operations:

```typescript
it('should save record asynchronously', async () => {
  const record = generateTestRecord();
  
  const savedRecord = await dataManager.saveRecord(record);
  
  expect(savedRecord).toMatchObject(record);
  expect(savedRecord.id).toBeDefined();
});
```

### Error Testing

Test both success and failure scenarios:

```typescript
it('should throw error for invalid data', async () => {
  const invalidRecord = { painLevel: 15 }; // Invalid pain level
  
  await expect(dataManager.saveRecord(invalidRecord))
    .rejects.toThrow('Record validation failed');
});
```

## Coverage Requirements

### Coverage Thresholds

- **Global Coverage**: 80% minimum
- **Pain Tracker Modules**: 90% minimum
- **Critical Functions**: 95% minimum

### Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output during test runs
- **LCOV**: For CI/CD integration
- **HTML**: Detailed browser-viewable reports in `coverage/` directory

### Viewing Coverage

```bash
# Generate and view HTML coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

### GitHub Actions

Example CI configuration for automated testing:

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

### Pre-commit Hooks

Use Husky to run tests before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## Debugging Tests

### Running Individual Tests

```bash
# Run specific test file
npx jest PainDataManager.test.ts

# Run specific test case
npx jest -t "should save record successfully"

# Run with verbose output
npx jest --verbose
```

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Console Debugging

Add debug output to tests:

```typescript
it('should calculate analytics', () => {
  const result = analyticsEngine.calculateAnalytics(testRecords);
  console.log('Analytics result:', JSON.stringify(result, null, 2));
  expect(result.totalRecords).toBe(testRecords.length);
});
```

## Performance Testing

### Load Testing

Test with large datasets to ensure performance:

```typescript
it('should handle 1000 records efficiently', async () => {
  const largeDataset = generateTestRecords(1000);
  
  const startTime = performance.now();
  const analytics = analyticsEngine.calculateAnalytics(largeDataset);
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(2000); // 2 seconds max
  expect(analytics.totalRecords).toBe(1000);
});
```

### Memory Testing

Monitor memory usage during tests:

```typescript
it('should not cause memory leaks', () => {
  const initialMemory = process.memoryUsage().heapUsed;
  
  // Perform operations that might cause memory leaks
  for (let i = 0; i < 100; i++) {
    const analytics = analyticsEngine.calculateAnalytics(testRecords);
    // Clear references
    analytics.trendData.length = 0;
  }
  
  if (global.gc) global.gc();
  
  const finalMemory = process.memoryUsage().heapUsed;
  const memoryIncrease = finalMemory - initialMemory;
  
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
});
```

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Keep tests focused** on a single behavior or outcome
4. **Use setup and teardown** methods to avoid code duplication

### Test Data Management

1. **Use factories** for generating test data
2. **Avoid hardcoded values** that might become outdated
3. **Create realistic test scenarios** that match actual usage
4. **Test edge cases** and boundary conditions

### Mocking Guidelines

1. **Mock external dependencies** (APIs, localStorage, etc.)
2. **Don't mock the code under test**
3. **Use minimal mocks** that still provide realistic behavior
4. **Reset mocks** between tests to avoid interference

### Assertion Best Practices

1. **Use specific matchers** (toEqual vs toBe vs toMatchObject)
2. **Test both positive and negative cases**
3. **Verify all important aspects** of the result
4. **Use meaningful error messages** in custom matchers

## Troubleshooting

### Common Issues

#### Tests Timing Out
- Increase timeout in Jest configuration
- Check for unresolved promises
- Ensure proper cleanup in afterEach hooks

#### Mock Issues
- Verify mock setup in beforeEach
- Check mock implementation matches expected interface
- Clear mocks between tests

#### Coverage Issues
- Check file paths in coverage configuration
- Ensure test files are properly named
- Verify imports are correctly resolved

### Getting Help

1. Check Jest documentation for specific issues
2. Review existing test files for patterns
3. Use `--verbose` flag for detailed test output
4. Check browser console for E2E test issues

---

This testing guide ensures comprehensive coverage of the Enhanced Pain Tracker functionality while maintaining high code quality and reliability standards.