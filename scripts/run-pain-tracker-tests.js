#!/usr/bin/env node

/**
 * Pain Tracker Test Runner
 * Comprehensive test execution script with reporting and validation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const testConfig = {
  unit: {
    name: 'Unit Tests',
    pattern: 'lib/pain-tracker/__tests__/*.test.ts',
    timeout: 30000,
    coverage: true
  },
  integration: {
    name: 'Integration Tests',
    pattern: 'lib/pain-tracker/__tests__/*.integration.test.ts',
    timeout: 60000,
    coverage: true
  },
  performance: {
    name: 'Performance Tests',
    pattern: 'lib/pain-tracker/__tests__/Performance.test.ts',
    timeout: 120000,
    coverage: false
  },
  e2e: {
    name: 'End-to-End Tests',
    pattern: 'tests/e2e/pain-tracker-e2e.test.js',
    timeout: 180000,
    coverage: false,
    requiresServer: true
  }
};

// Coverage thresholds
const coverageThresholds = {
  global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  painTracker: { statements: 90, branches: 90, functions: 90, lines: 90 }
};

class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      coverage: null,
      startTime: Date.now(),
      endTime: null
    };
    this.serverProcess = null;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logHeader(message) {
    const border = '='.repeat(60);
    this.log(border, 'cyan');
    this.log(`  ${message}`, 'cyan');
    this.log(border, 'cyan');
  }

  logSection(message) {
    this.log(`\n${'-'.repeat(40)}`, 'blue');
    this.log(`  ${message}`, 'blue');
    this.log(`${'-'.repeat(40)}`, 'blue');
  }

  async startDevServer() {
    if (this.serverProcess) {
      return;
    }

    this.log('Starting development server for E2E tests...', 'yellow');
    
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        env: { ...process.env, PORT: '3001' }
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server failed to start within timeout'));
        }
      }, 30000);

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready') || output.includes('started server')) {
          if (!serverReady) {
            serverReady = true;
            clearTimeout(timeout);
            this.log('Development server started successfully', 'green');
            // Wait a bit more for server to be fully ready
            setTimeout(resolve, 2000);
          }
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Error') && !serverReady) {
          clearTimeout(timeout);
          reject(new Error(`Server startup error: ${error}`));
        }
      });

      this.serverProcess.on('error', (error) => {
        if (!serverReady) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    });
  }

  stopDevServer() {
    if (this.serverProcess) {
      this.log('Stopping development server...', 'yellow');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
    }
  }

  async runTestSuite(suiteKey, options = {}) {
    const suite = testConfig[suiteKey];
    if (!suite) {
      throw new Error(`Unknown test suite: ${suiteKey}`);
    }

    this.logSection(`Running ${suite.name}`);

    // Start server if required
    if (suite.requiresServer && !this.serverProcess) {
      await this.startDevServer();
    }

    const jestArgs = [
      suite.pattern,
      '--testTimeout', suite.timeout.toString(),
      '--verbose'
    ];

    if (suite.coverage && !options.noCoverage) {
      jestArgs.push('--coverage');
    }

    if (options.watch) {
      jestArgs.push('--watch');
    }

    if (options.updateSnapshots) {
      jestArgs.push('--updateSnapshot');
    }

    try {
      const result = execSync(`npx jest ${jestArgs.join(' ')}`, {
        stdio: 'inherit',
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_ENV: 'test',
          TEST_URL: 'http://localhost:3001'
        }
      });

      this.log(`✅ ${suite.name} completed successfully`, 'green');
      this.results.passed++;
      return true;
    } catch (error) {
      this.log(`❌ ${suite.name} failed`, 'red');
      this.results.failed++;
      
      if (options.failFast) {
        throw error;
      }
      return false;
    }
  }

  async runAllTests(options = {}) {
    this.logHeader('Pain Tracker Test Suite');
    
    const suitesToRun = options.suites || Object.keys(testConfig);
    
    for (const suiteKey of suitesToRun) {
      try {
        await this.runTestSuite(suiteKey, options);
      } catch (error) {
        if (options.failFast) {
          this.log(`Test execution stopped due to failure in ${suiteKey}`, 'red');
          break;
        }
      }
      this.results.total++;
    }

    this.results.endTime = Date.now();
    this.generateReport();
  }

  async runCoverageReport() {
    this.logSection('Generating Coverage Report');
    
    try {
      execSync('npx jest --coverage --coverageReporters=text --coverageReporters=html', {
        stdio: 'inherit'
      });
      
      this.log('✅ Coverage report generated successfully', 'green');
      this.log('📊 View detailed report: open coverage/lcov-report/index.html', 'cyan');
    } catch (error) {
      this.log('❌ Coverage report generation failed', 'red');
      console.error(error.message);
    }
  }

  validateCoverage() {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    
    if (!fs.existsSync(coveragePath)) {
      this.log('⚠️  Coverage summary not found', 'yellow');
      return false;
    }

    try {
      const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      const total = coverage.total;
      
      this.log('\n📊 Coverage Summary:', 'cyan');
      this.log(`   Statements: ${total.statements.pct}%`, 'blue');
      this.log(`   Branches: ${total.branches.pct}%`, 'blue');
      this.log(`   Functions: ${total.functions.pct}%`, 'blue');
      this.log(`   Lines: ${total.lines.pct}%`, 'blue');

      // Check thresholds
      const meetsThreshold = (
        total.statements.pct >= coverageThresholds.global.statements &&
        total.branches.pct >= coverageThresholds.global.branches &&
        total.functions.pct >= coverageThresholds.global.functions &&
        total.lines.pct >= coverageThresholds.global.lines
      );

      if (meetsThreshold) {
        this.log('✅ Coverage thresholds met', 'green');
      } else {
        this.log('❌ Coverage thresholds not met', 'red');
        this.log(`   Required: ${JSON.stringify(coverageThresholds.global)}`, 'yellow');
      }

      return meetsThreshold;
    } catch (error) {
      this.log('❌ Error reading coverage summary', 'red');
      console.error(error.message);
      return false;
    }
  }

  generateReport() {
    this.logSection('Test Execution Summary');
    
    const duration = this.results.endTime - this.results.startTime;
    const durationStr = `${(duration / 1000).toFixed(2)}s`;
    
    this.log(`📊 Test Results:`, 'cyan');
    this.log(`   Total Suites: ${this.results.total}`, 'blue');
    this.log(`   Passed: ${this.results.passed}`, 'green');
    this.log(`   Failed: ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'blue');
    this.log(`   Duration: ${durationStr}`, 'blue');
    
    if (this.results.failed === 0) {
      this.log('\n🎉 All tests passed!', 'green');
    } else {
      this.log('\n💥 Some tests failed!', 'red');
    }

    // Generate JSON report
    const reportPath = path.join(process.cwd(), 'test-results.json');
    const report = {
      ...this.results,
      timestamp: new Date().toISOString(),
      duration: duration,
      success: this.results.failed === 0
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`📄 Detailed report saved to: ${reportPath}`, 'cyan');
  }

  async cleanup() {
    this.stopDevServer();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    suites: null,
    watch: args.includes('--watch'),
    coverage: args.includes('--coverage'),
    noCoverage: args.includes('--no-coverage'),
    failFast: args.includes('--fail-fast'),
    updateSnapshots: args.includes('--update-snapshots')
  };

  // Parse suite selection
  const suiteArg = args.find(arg => arg.startsWith('--suites='));
  if (suiteArg) {
    options.suites = suiteArg.split('=')[1].split(',');
  }

  const runner = new TestRunner();

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Test execution interrupted');
    await runner.cleanup();
    process.exit(1);
  });

  process.on('SIGTERM', async () => {
    await runner.cleanup();
    process.exit(0);
  });

  try {
    // Show help if requested
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
Pain Tracker Test Runner

Usage: node scripts/run-pain-tracker-tests.js [options]

Options:
  --suites=<list>        Run specific test suites (unit,integration,performance,e2e)
  --watch               Run tests in watch mode
  --coverage            Generate coverage report
  --no-coverage         Skip coverage generation
  --fail-fast           Stop on first failure
  --update-snapshots    Update Jest snapshots
  --help, -h            Show this help message

Examples:
  node scripts/run-pain-tracker-tests.js
  node scripts/run-pain-tracker-tests.js --suites=unit,integration
  node scripts/run-pain-tracker-tests.js --coverage --fail-fast
  node scripts/run-pain-tracker-tests.js --watch --suites=unit
      `);
      return;
    }

    // Run tests
    await runner.runAllTests(options);

    // Generate coverage report if requested
    if (options.coverage) {
      await runner.runCoverageReport();
      runner.validateCoverage();
    }

    // Exit with appropriate code
    process.exit(runner.results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('💥 Test runner error:', error.message);
    await runner.cleanup();
    process.exit(1);
  } finally {
    await runner.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;