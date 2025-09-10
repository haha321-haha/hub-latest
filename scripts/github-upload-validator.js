#!/usr/bin/env node

/**
 * 🚀 GitHub上传前全面验证脚本
 * 确保代码质量、SEO、性能等全面达标
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitHubUploadValidator {
  constructor() {
    this.validationSteps = [
      {
        name: '硬编码全面检测',
        command: 'npm run hardcode:enhanced',
        critical: true,
        description: '检测所有类型的硬编码问题'
      },
      {
        name: 'SEO配置验证',
        command: 'npm run seo:verify',
        critical: true,
        description: '验证SEO配置完整性'
      },
      {
        name: '性能预算检查',
        command: 'npm run perf:budget-check',
        critical: true,
        description: '检查性能指标是否达标'
      },
      {
        name: '代码质量检查',
        command: 'npm run lint',
        critical: false,
        description: '检查代码风格和规范'
      },
      {
        name: '类型检查',
        command: 'npm run type-check',
        critical: false,
        description: 'TypeScript类型检查'
      },
      {
        name: '构建测试',
        command: 'npm run build',
        critical: true,
        description: '确保项目可以正常构建'
      },
      {
        name: '测试套件',
        command: 'npm test',
        critical: false,
        description: '运行所有测试用例'
      }
    ];
    
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: this.validationSteps.length,
      startTime: Date.now()
    };
  }

  async validateBeforeUpload() {
    console.log('🚀 开始GitHub上传前全面验证...\n');
    console.log('📋 验证步骤:');
    this.validationSteps.forEach((step, index) => {
      const critical = step.critical ? '🚨' : 'ℹ️';
      console.log(`   ${index + 1}. ${critical} ${step.name}: ${step.description}`);
    });
    console.log('');

    for (const step of this.validationSteps) {
      await this.runValidationStep(step);
    }
    
    this.printValidationSummary();
    return this.results.failed === 0;
  }

  async runValidationStep(step) {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 验证: ${step.name}...`);
      
      const result = execSync(step.command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 60000 // 60秒超时
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${step.name} 通过 (${duration}ms)`);
      this.results.passed++;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (step.critical) {
        console.log(`❌ ${step.name} 失败 (${duration}ms)`);
        console.log(`   错误: ${error.message}`);
        this.results.failed++;
      } else {
        console.log(`⚠️  ${step.name} 警告 (${duration}ms)`);
        console.log(`   警告: ${error.message}`);
        this.results.warnings++;
      }
    }
  }

  printValidationSummary() {
    const totalTime = Date.now() - this.results.startTime;
    
    console.log('\n📊 验证结果摘要:');
    console.log(`✅ 通过: ${this.results.passed}`);
    console.log(`❌ 失败: ${this.results.failed}`);
    console.log(`⚠️  警告: ${this.results.warnings}`);
    console.log(`📋 总计: ${this.results.total}`);
    console.log(`⏱️  耗时: ${Math.round(totalTime / 1000)}秒`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 上传被阻止！请修复关键问题后重试。');
      console.log('💡 建议运行以下命令修复问题:');
      console.log('   npm run project:health');
      console.log('   npm run hardcode:enhanced:fix');
      console.log('   npm run seo:fix');
    } else if (this.results.warnings > 0) {
      console.log('\n⚠️  上传允许，但建议修复警告项以提高代码质量。');
      console.log('💡 建议运行: npm run project:health');
    } else {
      console.log('\n🎉 所有验证通过！可以安全上传到GitHub。');
      console.log('🚀 建议执行上传命令:');
      console.log('   git add .');
      console.log('   git commit -m "feat: 优化硬编码和SEO配置"');
      console.log('   git push origin main');
    }
  }

  // 生成验证报告
  generateValidationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      recommendations: this.getRecommendations(),
      nextSteps: this.getNextSteps()
    };

    const reportFile = `reports/github-upload-validation-${Date.now()}.json`;
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 验证报告已保存: ${reportFile}`);
    
    return report;
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.results.failed > 0) {
      recommendations.push('立即修复所有关键问题');
      recommendations.push('运行 npm run project:health 进行全面检查');
    }
    
    if (this.results.warnings > 0) {
      recommendations.push('考虑修复警告项以提高代码质量');
    }
    
    recommendations.push('定期运行验证脚本确保代码质量');
    recommendations.push('建立团队代码审查流程');
    
    return recommendations;
  }

  getNextSteps() {
    const steps = [];
    
    if (this.results.failed === 0) {
      steps.push('可以安全上传到GitHub');
      steps.push('通知团队代码已更新');
      steps.push('监控部署后的性能指标');
    } else {
      steps.push('修复所有关键问题');
      steps.push('重新运行验证脚本');
      steps.push('确认修复效果后再上传');
    }
    
    return steps;
  }
}

// 主执行函数
async function main() {
  const validator = new GitHubUploadValidator();
  const success = await validator.validateBeforeUpload();
  
  if (success) {
    validator.generateValidationReport();
  }
  
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GitHubUploadValidator;
