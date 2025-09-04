#!/usr/bin/env node

/**
 * 国际化工具链管理脚本
 * 统一管理所有翻译键相关工具
 */

const { execSync } = require('child_process');
const path = require('path');

class I18nToolchain {
  constructor() {
    this.scriptsDir = path.join(__dirname);
    this.tools = {
      extract: 'extract-translation-keys-v3.js',
      validate: 'validate-translation-keys.js',
      structure: 'validate-translation-structure.js',
      sync: 'sync-translation-keys.js',
      audit: 'audit-hardcoding.js',
      cleanup: 'cleanup-unused-keys.js'
    };
  }

  /**
   * 运行工具
   */
  runTool(toolName, args = []) {
    const toolPath = path.join(this.scriptsDir, this.tools[toolName]);
    const command = `node ${toolPath} ${args.join(' ')}`;
    
    console.log(`🔧 运行工具: ${toolName}`);
    console.log(`📝 命令: ${command}\n`);
    
    try {
      execSync(command, { stdio: 'inherit' });
      console.log(`✅ ${toolName} 执行成功\n`);
    } catch (error) {
      console.error(`❌ ${toolName} 执行失败:`, error.message);
      process.exit(1);
    }
  }

  /**
   * 完整工作流
   */
  runFullWorkflow() {
    console.log('🚀 开始国际化工具链完整工作流...\n');
    
    // 1. 提取翻译键
    console.log('📋 步骤 1: 提取翻译键');
    this.runTool('extract');
    
    // 2. 验证翻译键
    console.log('📋 步骤 2: 验证翻译键');
    this.runTool('validate');
    
    // 3. 验证翻译键结构
    console.log('📋 步骤 3: 验证翻译键结构');
    this.runTool('structure');
    
    // 4. 同步翻译键
    console.log('📋 步骤 4: 同步翻译键');
    this.runTool('sync');
    
    // 5. 审计硬编码
    console.log('📋 步骤 5: 审计硬编码');
    this.runTool('audit');
    
    // 6. 清理未使用键
    console.log('📋 步骤 6: 清理未使用键');
    this.runTool('cleanup', ['--dry-run']);
    
    console.log('✅ 完整工作流执行完成！');
  }

  /**
   * 快速检查
   */
  runQuickCheck() {
    console.log('⚡ 开始快速检查...\n');
    
    // 验证翻译键
    this.runTool('validate');
    
    // 验证翻译键结构
    this.runTool('structure');
    
    // 审计硬编码
    this.runTool('audit');
    
    console.log('✅ 快速检查完成！');
  }

  /**
   * 清理工作流
   */
  runCleanupWorkflow() {
    console.log('🧹 开始清理工作流...\n');
    
    // 同步翻译键
    this.runTool('sync');
    
    // 清理未使用键
    this.runTool('cleanup', ['--clean']);
    
    // 验证清理结果
    this.runTool('validate');
    
    console.log('✅ 清理工作流完成！');
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
🌐 国际化工具链管理脚本

用法:
  node i18n-toolchain.js [命令] [选项]

命令:
  full                运行完整工作流
  quick               运行快速检查
  cleanup             运行清理工作流
  extract             提取翻译键
  validate            验证翻译键
  structure           验证翻译键结构
  sync                同步翻译键
  audit               审计硬编码
  clean               清理未使用键

选项:
  --help, -h          显示帮助信息
  --dry-run           模拟运行（不实际修改文件）
  --clean             执行实际清理

示例:
  node i18n-toolchain.js full
  node i18n-toolchain.js quick
  node i18n-toolchain.js cleanup
  node i18n-toolchain.js extract
  node i18n-toolchain.js validate
  node i18n-toolchain.js structure
  node i18n-toolchain.js sync
  node i18n-toolchain.js audit
  node i18n-toolchain.js clean --dry-run
  node i18n-toolchain.js clean --clean

工具说明:
  extract             使用v3版本提取工具，支持命名空间和动态键检测
  validate            验证翻译文件完整性、一致性和质量
  structure           验证翻译键命名规范和结构标准
  sync                同步中英文翻译文件，确保键的一致性
  audit               检测代码中的硬编码文本
  clean               安全地清理未使用的翻译键
`);
  }

  /**
   * 运行命令
   */
  run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const options = args.slice(1);

    if (!command || command === '--help' || command === '-h') {
      this.showHelp();
      return;
    }

    switch (command) {
      case 'full':
        this.runFullWorkflow();
        break;
      case 'quick':
        this.runQuickCheck();
        break;
      case 'cleanup':
        this.runCleanupWorkflow();
        break;
      case 'extract':
        this.runTool('extract');
        break;
      case 'validate':
        this.runTool('validate');
        break;
      case 'structure':
        this.runTool('structure');
        break;
      case 'sync':
        this.runTool('sync');
        break;
      case 'audit':
        this.runTool('audit');
        break;
      case 'clean':
        this.runTool('cleanup', options);
        break;
      default:
        console.error(`❌ 未知命令: ${command}`);
        this.showHelp();
        process.exit(1);
    }
  }
}

// 运行工具链
if (require.main === module) {
  const toolchain = new I18nToolchain();
  toolchain.run();
}

module.exports = I18nToolchain;
