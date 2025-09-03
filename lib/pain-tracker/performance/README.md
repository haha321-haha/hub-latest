# Pain Tracker Performance Optimization Module

This module provides comprehensive performance optimizations for the Enhanced Pain Tracker, including lazy loading, data compression, memory management, and chart performance optimizations.

## Overview

The performance optimization module addresses the following key areas:

1. **Lazy Loading** - Efficient data loading with pagination and virtual scrolling
2. **Data Compression** - Storage space optimization through data compression
3. **Data Cleanup** - Automatic cleanup of old and duplicate records
4. **Chart Performance** - Optimization for large dataset visualization
5. **Memory Management** - Memory monitoring and cleanup for chart instances
6. **Storage Quota Management** - Storage usage monitoring and optimization

## Components

### PerformanceManager

The main orchestrator that integrates all performance optimization services.

```typescript
import { PerformanceManager } from './lib/pain-tracker/performance';

const performanceManager = new PerformanceManager();

// Get performance report
const report = await performanceManager.getPerformanceReport();

// Optimize overall performance
const result = await performanceManager.optimizeOverallPerformance();
```

### LazyLoadingService

Provides pagination and virtual scrolling for large datasets.

```typescript
import { LazyLoadingService } from './lib/pain-tracker/performance';

const lazyLoader = new LazyLoadingService();

// Load paginated records
const result = await lazyLoader.loadRecordsPaginated({
  page: 1,
  pageSize: 20,
  sortBy: 'date',
  sortOrder: 'desc'
});

// Load records for virtual scrolling
const virtualRecords = await lazyLoader.loadRecordsVirtual(0, 50);
```

### DataCompressionService

Compresses data to reduce storage usage.

```typescript
import { DataCompressionService } from './lib/pain-tracker/performance';

const compressor = new DataCompressionService('advanced');

// Compress data
const compressed = await compressor.compressData(largeDataset);

// Decompress data
const decompressed = await compressor.decompressData(compressed);
```

### DataCleanupService

Automatically cleans up old and duplicate records.

```typescript
import { DataCleanupService } from './lib/pain-tracker/performance';

const cleaner = new DataCleanupService();

// Perform cleanup
const result = await cleaner.performCleanup({
  maxRecords: 1000,
  maxAgeMonths: 24,
  removeDuplicates: true
});

// Schedule automatic cleanup
cleaner.scheduleAutomaticCleanup(24 * 60 * 60 * 1000); // Daily
```

### ChartPerformanceOptimizer

Optimizes chart rendering for large datasets.

```typescript
import { ChartPerformanceOptimizer } from './lib/pain-tracker/performance';

const optimizer = new ChartPerformanceOptimizer();

// Optimize chart data
const optimizedData = await optimizer.optimizeDataForChart(
  largeDataset,
  'line',
  { maxPoints: 200, samplingMethod: 'adaptive' }
);

// Optimize chart options
const optimizedOptions = optimizer.optimizeChartOptions(baseOptions, dataSize);
```

### MemoryManager

Monitors and manages memory usage, especially for chart instances.

```typescript
import { MemoryManager } from './lib/pain-tracker/performance';

const memoryManager = new MemoryManager();

// Monitor memory usage
const memoryInfo = memoryManager.monitorMemoryUsage();

// Register chart instance for management
memoryManager.registerChartInstance('chart-1', chartInstance);

// Cleanup memory
await memoryManager.cleanupChartInstances();
```

### StorageQuotaManager

Monitors storage quota and optimizes usage.

```typescript
import { StorageQuotaManager } from './lib/pain-tracker/performance';

const quotaManager = new StorageQuotaManager();

// Monitor quota usage
const quotaInfo = await quotaManager.monitorQuotaUsage();

// Optimize storage
const result = await quotaManager.optimizeStorageUsage();

// Handle quota exceeded
if (quotaInfo.usagePercentage > 0.9) {
  await quotaManager.handleQuotaExceeded();
}
```

## Performance Thresholds

The module uses the following performance thresholds:

### Data Size Thresholds
- **Small**: ≤ 50 records
- **Medium**: 51-200 records  
- **Large**: 201-1000 records
- **Extra Large**: > 1000 records

### Chart Optimization Thresholds
- **Animation Disable**: > 500 data points
- **Tooltip Optimization**: > 1000 data points
- **Point Rendering Disable**: > 1000 data points

### Memory Thresholds
- **Warning**: 50MB heap usage
- **Critical**: 100MB heap usage
- **Max Cache Size**: 20MB
- **Max Chart Instances**: 10

### Storage Thresholds
- **Warning**: 80% of quota
- **Critical**: 90% of quota
- **Emergency**: 95% of quota

## Optimization Strategies

### For Small Datasets (≤ 50 records)
- No optimization needed
- Full data loading
- All features enabled

### For Medium Datasets (51-200 records)
- Light optimization
- Basic data cleaning
- Minimal chart optimizations

### For Large Datasets (201-1000 records)
- Lazy loading with pagination
- Data sampling for charts
- Memory monitoring
- Automatic cleanup scheduling

### For Extra Large Datasets (> 1000 records)
- Aggressive optimization
- Virtual scrolling
- Data compression
- Chart data buckets
- Progressive loading
- Emergency cleanup procedures

## Integration Examples

### React Component Integration

```typescript
import React, { useEffect, useState } from 'react';
import { PerformanceManager } from './lib/pain-tracker/performance';

function OptimizedPainTracker() {
  const [performanceManager] = useState(() => new PerformanceManager());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await performanceManager.loadRecordsPaginated({
          page: 1,
          pageSize: 20
        });
        setRecords(result.data);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      performanceManager.destroy();
    };
  }, [performanceManager]);

  return (
    <div>
      {loading ? 'Loading...' : `Loaded ${records.length} records`}
    </div>
  );
}
```

### Chart Component Integration

```typescript
import React, { useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartPerformanceOptimizer, MemoryManager } from './lib/pain-tracker/performance';

function OptimizedChart({ data, chartId }) {
  const optimizer = useMemo(() => new ChartPerformanceOptimizer(), []);
  const memoryManager = useMemo(() => new MemoryManager(), []);
  const [optimizedData, setOptimizedData] = useState([]);

  useEffect(() => {
    const optimizeData = async () => {
      const optimized = await optimizer.optimizeDataForChart(data, 'line');
      setOptimizedData(optimized);
    };

    optimizeData();
  }, [data, optimizer]);

  const handleChartRef = useCallback((chartInstance) => {
    if (chartInstance) {
      memoryManager.registerChartInstance(chartId, chartInstance);
    }
  }, [chartId, memoryManager]);

  const chartOptions = useMemo(() => {
    return optimizer.optimizeChartOptions({}, data.length);
  }, [optimizer, data.length]);

  return (
    <Line
      ref={handleChartRef}
      data={optimizedData}
      options={chartOptions}
    />
  );
}
```

## Monitoring and Debugging

### Performance Report

```typescript
const report = await performanceManager.getPerformanceReport();

console.log('Performance Score:', report.performanceScore);
console.log('Memory Usage:', report.memory.usedJSHeapSize);
console.log('Storage Usage:', report.storage.usagePercentage);
console.log('Recommendations:', report.recommendations);
```

### Cache Statistics

```typescript
const cacheStats = lazyLoadingService.getCacheStats();
console.log('Cache Hit Rate:', cacheStats.hitRate);
console.log('Cache Size:', cacheStats.size);
```

### Memory Monitoring

```typescript
const memoryInfo = memoryManager.monitorMemoryUsage();
console.log('Memory Usage:', memoryInfo.usedJSHeapSize / 1024 / 1024, 'MB');
```

## Best Practices

1. **Initialize Early**: Create performance manager instances early in your application lifecycle
2. **Cleanup Resources**: Always call `destroy()` methods when components unmount
3. **Monitor Performance**: Regularly check performance reports and act on recommendations
4. **Configure for Device**: Use `configureForDevice()` to optimize for different device capabilities
5. **Handle Errors**: Implement proper error handling for all async operations
6. **Test with Large Datasets**: Test your application with realistic large datasets
7. **Monitor Memory**: Keep an eye on memory usage, especially with chart-heavy interfaces

## Configuration Options

### Compression Levels
- `none`: No compression
- `basic`: Simple JSON optimization and string replacement
- `advanced`: Dictionary-based compression with LZ-string

### Sampling Methods
- `uniform`: Even distribution sampling
- `adaptive`: Variance-based sampling
- `importance`: Score-based sampling

### Cleanup Options
```typescript
const cleanupOptions = {
  maxRecords: 1000,
  maxAgeMonths: 24,
  removeDuplicates: true,
  removeIncompleteRecords: false,
  archiveOldRecords: true,
  compactStorage: true
};
```

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in chart instances
   - Ensure proper cleanup of event listeners
   - Monitor cache size and clear when necessary

2. **Poor Chart Performance**
   - Enable data sampling for large datasets
   - Disable animations for datasets > 500 points
   - Use chart data buckets for trend visualization

3. **Storage Quota Exceeded**
   - Enable automatic cleanup
   - Archive old records
   - Use data compression
   - Clear temporary data

4. **Slow Data Loading**
   - Implement lazy loading with pagination
   - Use virtual scrolling for large lists
   - Enable data preloading

### Debug Mode

Enable debug logging by setting:
```typescript
localStorage.setItem('pain_tracker_debug', 'true');
```

This will provide detailed logging of all performance operations.

## Future Enhancements

- Web Workers for background data processing
- IndexedDB integration for better storage management
- Service Worker caching for offline performance
- Real-time performance monitoring dashboard
- Automated performance testing and benchmarking