#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🚀 开始部署前检查...\n'));

const checks = [
  {
    name: 'ESLint 代码规范检查',
    command: 'npm run lint',
    description: '检查代码规范和潜在问题'
  },
  {
    name: 'TypeScript 类型检查',
    command: 'npx tsc --noEmit',
    description: '验证TypeScript类型定义'
  },
  {
    name: 'Next.js 构建测试',
    command: 'npm run build',
    description: '完整构建测试，确保生产环境可用'
  }
];

let allPassed = true;

for (const check of checks) {
  console.log(chalk.yellow(`📋 ${check.name}...`));
  console.log(chalk.gray(`   ${check.description}`));
  
  try {
    execSync(check.command, { stdio: 'pipe' });
    console.log(chalk.green(`✅ ${check.name} 通过\n`));
  } catch (error) {
    console.log(chalk.red(`❌ ${check.name} 失败`));
    console.log(chalk.red(`错误信息: ${error.message}\n`));
    allPassed = false;
  }
}

if (allPassed) {
  console.log(chalk.green.bold('🎉 所有检查通过！可以安全部署到GitHub和Vercel'));
  console.log(chalk.blue('📝 建议的部署命令:'));
  console.log(chalk.gray('   git add .'));
  console.log(chalk.gray('   git commit -m "🚀 Ready for deployment"'));
  console.log(chalk.gray('   git push'));
} else {
  console.log(chalk.red.bold('🚨 检查失败！请修复错误后再部署'));
  console.log(chalk.yellow('💡 修复建议:'));
  console.log(chalk.gray('   1. 查看上面的错误信息'));
  console.log(chalk.gray('   2. 修复相关问题'));
  console.log(chalk.gray('   3. 重新运行此检查脚本'));
  process.exit(1);
}