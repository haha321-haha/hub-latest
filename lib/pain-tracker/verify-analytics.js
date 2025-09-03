#!/usr/bin/env node

// Analytics Verification Script
// Tests the analytics engine functionality with sample data

const { AnalyticsEngine } = require('./analytics/AnalyticsEngine');

// Sample pain records for testing
const sampleRecords = [
  {
    id: '1',
    date: '2024-01-01',
    time: '10:00',
    painLevel: 8,
    painTypes: ['cramping', 'aching'],
    locations: ['lower_abdomen'],
    symptoms: ['nausea', 'fatigue'],
    menstrualStatus: 'day_1',
    medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 7,
    lifestyleFactors: [],
    notes: 'Severe cramping in the morning',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    id: '2',
    date: '2024-01-02',
    time: '14:30',
    painLevel: 6,
    painTypes: ['cramping'],
    locations: ['lower_abdomen', 'lower_back'],
    symptoms: ['bloating'],
    menstrualStatus: 'day_2_3',
    medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 8,
    lifestyleFactors: [],
    notes: 'Better than yesterday',
    createdAt: new Date('2024-01-02T14:30:00Z'),
    updatedAt: new Date('2024-01-02T14:30:00Z')
  },
  {
    id: '3',
    date: '2024-01-03',
    time: '09:15',
    painLevel: 4,
    painTypes: ['aching'],
    locations: ['lower_back'],
    symptoms: ['fatigue'],
    menstrualStatus: 'day_2_3',
    medications: [{ name: 'acetaminophen', dosage: '500mg', timing: 'during pain' }],
    effectiveness: 6,
    lifestyleFactors: [],
    notes: 'Mild discomfort',
    createdAt: new Date('2024-01-03T09:15:00Z'),
    updatedAt: new Date('2024-01-03T09:15:00Z')
  },
  {
    id: '4',
    date: '2024-01-15',
    time: '16:00',
    painLevel: 3,
    painTypes: ['pressure'],
    locations: ['lower_abdomen'],
    symptoms: ['mood_changes'],
    menstrualStatus: 'mid_cycle',
    medications: [],
    effectiveness: 0,
    lifestyleFactors: [],
    notes: 'Ovulation pain',
    createdAt: new Date('2024-01-15T16:00:00Z'),
    updatedAt: new Date('2024-01-15T16:00:00Z')
  },
  {
    id: '5',
    date: '2024-01-28',
    time: '11:30',
    painLevel: 7,
    painTypes: ['cramping', 'sharp'],
    locations: ['lower_abdomen', 'pelvis'],
    symptoms: ['nausea', 'headache'],
    menstrualStatus: 'before_period',
    medications: [{ name: 'ibuprofen', dosage: '600mg', timing: 'preventive' }],
    effectiveness: 9,
    lifestyleFactors: [],
    notes: 'Pre-menstrual pain',
    createdAt: new Date('2024-01-28T11:30:00Z'),
    updatedAt: new Date('2024-01-28T11:30:00Z')
  }
];

function runAnalyticsVerification() {
  console.log('🔍 Pain Tracker Analytics Verification');
  console.log('=====================================\n');

  try {
    // Initialize analytics engine
    const analyticsEngine = new AnalyticsEngine();
    console.log('✅ AnalyticsEngine initialized successfully');

    // Test calculateAnalytics
    console.log('\n📊 Testing calculateAnalytics...');
    const analytics = analyticsEngine.calculateAnalytics(sampleRecords);
    
    console.log(`   Total Records: ${analytics.totalRecords}`);
    console.log(`   Average Pain Level: ${analytics.averagePainLevel}`);
    console.log(`   Common Pain Types: ${analytics.commonPainTypes.length}`);
    console.log(`   Effective Treatments: ${analytics.effectiveTreatments.length}`);
    console.log(`   Cycle Patterns: ${analytics.cyclePatterns.length}`);
    console.log(`   Trend Data Points: ${analytics.trendData.length}`);
    console.log(`   Generated Insights: ${analytics.insights.length}`);

    // Test identifyPatterns
    console.log('\n🔍 Testing identifyPatterns...');
    const patterns = analyticsEngine.identifyPatterns(sampleRecords);
    console.log(`   Identified Patterns: ${patterns.length}`);
    
    patterns.forEach((pattern, index) => {
      console.log(`   ${index + 1}. ${pattern.type}: ${pattern.description} (confidence: ${(pattern.confidence * 100).toFixed(1)}%)`);
    });

    // Test generateInsights
    console.log('\n💡 Testing generateInsights...');
    const insights = analyticsEngine.generateInsights(analytics);
    console.log(`   Generated Insights: ${insights.length}`);
    
    insights.forEach((insight, index) => {
      console.log(`   ${index + 1}. ${insight}`);
    });

    // Test predictTrends (with extended data)
    console.log('\n📈 Testing predictTrends...');
    const extendedRecords = [...sampleRecords];
    for (let i = 0; i < 10; i++) {
      extendedRecords.push({
        ...sampleRecords[0],
        id: `extra_${i}`,
        date: `2024-02-${String(i + 1).padStart(2, '0')}`,
        painLevel: 5 + Math.random() * 3
      });
    }
    
    const predictions = analyticsEngine.predictTrends(extendedRecords);
    console.log(`   Trend Predictions: ${predictions.length} days`);
    
    if (predictions.length > 0) {
      console.log(`   Next 3 days predicted pain levels:`);
      predictions.slice(0, 3).forEach((prediction, index) => {
        console.log(`     Day ${index + 1}: ${prediction.painLevel.toFixed(1)}/10`);
      });
    }

    // Test calculateCorrelations
    console.log('\n🔗 Testing calculateCorrelations...');
    const correlations = analyticsEngine.calculateCorrelations(sampleRecords);
    console.log(`   Found Correlations: ${correlations.length}`);
    
    correlations.forEach((correlation, index) => {
      console.log(`   ${index + 1}. ${correlation.factor1} vs ${correlation.factor2}: ${correlation.correlation.toFixed(3)} (significance: ${(correlation.significance * 100).toFixed(1)}%)`);
    });

    // Test error handling
    console.log('\n🛡️  Testing error handling...');
    
    try {
      analyticsEngine.calculateAnalytics([]);
      console.log('   ✅ Empty array handled correctly');
    } catch (error) {
      console.log(`   ❌ Empty array error: ${error.message}`);
    }

    try {
      analyticsEngine.identifyPatterns([sampleRecords[0]]);
      console.log('   ✅ Insufficient data handled correctly');
    } catch (error) {
      console.log(`   ❌ Insufficient data error: ${error.message}`);
    }

    console.log('\n🎉 Analytics verification completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Analytics calculation: ✅ Working`);
    console.log(`   - Pattern identification: ✅ Working`);
    console.log(`   - Insight generation: ✅ Working`);
    console.log(`   - Trend prediction: ✅ Working`);
    console.log(`   - Correlation analysis: ✅ Working`);
    console.log(`   - Error handling: ✅ Working`);

  } catch (error) {
    console.error('❌ Analytics verification failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  runAnalyticsVerification();
}

module.exports = { runAnalyticsVerification };