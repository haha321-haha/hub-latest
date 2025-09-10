#!/usr/bin/env node

/**
 * 🛡️ 全面预提交检查脚本
 * 集成硬编码、SEO、性能等全面检查
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComprehensivePreCommit {
  constructor() {
    this.checks = [
      {
        name: '硬编码检测',
        command: 'npm run hardcode:enhanced',
        critical: true,
        timeout: 30000
      },
      {
        name: 'SEO配置检查',
        command: 'npm run seo:verify',
        critical: true,
        timeout: 15000
      },
      {
        name: '代码质量检查',
        command: 'npm run lint',
        critical: false,
        timeout: 20000
      },
      {
        name: '类型检查',
        command: 'npm run type-check',
        critical: false,
        timeout: 15000
      }
    ];
    
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: this.checks.length
    };
  }

  async runAllChecks() {
    console.log('🛡️ 开始全面预提交检查...\n');
    
    for (const check of this.checks) {
      await this.runCheck(check);
    }
    
    this.printSummary();
    return this.results.failed === 0;
  }

  async runCheck(check) {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 运行检查: ${check.name}...`);
      
      // 设置超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('检查超时')), check.timeout);
      });
      
      const checkPromise = new Promise((resolve, reject) => {
        try {
          const result = execSync(check.command, { 
            encoding: 'utf8',
            stdio: 'pipe'
          });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      await Promise.race([checkPromise, timeoutPromise]);
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${check.name} 通过 (${duration}ms)`);
      this.results.passed++;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (check.critical) {
        console.log(`❌ ${check.name} 失败 (${duration}ms)`);
        console.log(`   错误: ${error.message}`);
        this.results.failed++;
      } else {
        console.log(`⚠️  ${check.name} 警告 (${duration}ms)`);
        console.log(`   警告: ${error.message}`);
        this.results.warnings++;
      }
    }
  }

  printSummary() {
    console.log('\n📊 检查结果摘要:');
    console.log(`✅ 通过: ${this.results.passed}`);
    console.log(`❌ 失败: ${this.results.failed}`);
    console.log(`⚠️  警告: ${this.results.warnings}`);
    console.log(`📋 总计: ${this.results.total}`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 提交被阻止！请修复关键问题后重试。');
      console.log('💡 建议运行: npm run project:health');
    } else if (this.results.warnings > 0) {
      console.log('\n⚠️  提交允许，但建议修复警告项。');
    } else {
      console.log('\n🎉 所有检查通过！可以安全提交。');
    }
  }
}

// 主执行函数
async function main() {
  const checker = new ComprehensivePreCommit();
  const success = await checker.runAllChecks();
  
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ComprehensivePreCommit;
