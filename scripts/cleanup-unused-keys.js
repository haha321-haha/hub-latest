#!/usr/bin/env node

/**
 * 翻译键清理工具
 * 安全地清理未使用的翻译键，避免误删
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TranslationKeyCleaner {
  constructor() {
    this.appDir = path.join(__dirname, '..', 'app');
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.zhPath = path.join(this.messagesDir, 'zh.json');
    this.enPath = path.join(this.messagesDir, 'en.json');
    this.backupDir = path.join(this.messagesDir, 'backups');
    
    this.usedKeys = new Set();
    this.unusedKeys = new Set();
    this.whitelistKeys = new Set();
    this.dynamicKeys = new Set();
    
    this.cleanupStats = {
      totalKeys: 0,
      unusedKeys: 0,
      whitelistedKeys: 0,
      dynamicKeys: 0,
      removedKeys: 0,
      keptKeys: 0
    };
  }

  /**
   * 初始化白名单
   */
  initializeWhitelist() {
    // 常见的动态键模式
    const commonDynamicPatterns = [
      'painTracker.symptoms',
      'painTracker.levels',
      'painTracker.locations',
      'painTracker.triggers',
      'painTracker.activities',
      'healthGuide.sections',
      'scenarioSolutions.scenarios',
      'naturalTherapies.categories',
      'teenHealth.topics',
      'interactiveTools.components',
      'common.buttons',
      'common.messages',
      'common.labels',
      'common.placeholders',
      'common.errors',
      'common.success'
    ];

    commonDynamicPatterns.forEach(pattern => {
      this.whitelistKeys.add(pattern);
    });

    // 添加通配符模式
    this.whitelistKeys.add('*.title');
    this.whitelistKeys.add('*.description');
    this.whitelistKeys.add('*.subtitle');
    this.whitelistKeys.add('*.cta');
    this.whitelistKeys.add('*.button');
    this.whitelistKeys.add('*.label');
    this.whitelistKeys.add('*.placeholder');
    this.whitelistKeys.add('*.error');
    this.whitelistKeys.add('*.success');
    this.whitelistKeys.add('*.loading');
    this.whitelistKeys.add('*.empty');
    this.whitelistKeys.add('*.notFound');
  }

  /**
   * 扫描代码中使用的翻译键
   */
  scanUsedKeys() {
    console.log('🔍 扫描代码中使用的翻译键...');
    
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: this.appDir,
      ignore: ['**/node_modules/**', '**/.next/**', '**/test/**', '**/tests/**']
    });

    files.forEach(file => {
      const filePath = path.join(this.appDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 匹配 t('key') 或 t("key") 模式
      const tMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (tMatches) {
        tMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          this.usedKeys.add(key);
        });
      }

      // 匹配 getTranslations 中的键
      const getTMatches = content.match(/getTranslations\([^)]*\)/g);
      if (getTMatches) {
        getTMatches.forEach(match => {
          const keyMatch = match.match(/getTranslations\([^)]*['"`]([^'"`]+)['"`]/);
          if (keyMatch) {
            this.usedKeys.add(keyMatch[1]);
          }
        });
      }

      // 匹配模板字符串中的动态键
      const templateMatches = content.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/g);
      if (templateMatches) {
        templateMatches.forEach(match => {
          const dynamicPattern = match.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/)[1];
          this.dynamicKeys.add(dynamicPattern);
        });
      }
    });

    console.log(`✅ 发现 ${this.usedKeys.size} 个使用的翻译键`);
    console.log(`✅ 发现 ${this.dynamicKeys.size} 个动态键模式`);
  }

  /**
   * 加载翻译文件
   */
  loadTranslationFiles() {
    let zhTranslations = {};
    let enTranslations = {};

    try {
      if (fs.existsSync(this.zhPath)) {
        const zhContent = fs.readFileSync(this.zhPath, 'utf8');
        zhTranslations = JSON.parse(zhContent);
      }
    } catch (error) {
      console.error('❌ 加载 zh.json 失败:', error.message);
    }

    try {
      if (fs.existsSync(this.enPath)) {
        const enContent = fs.readFileSync(this.enPath, 'utf8');
        enTranslations = JSON.parse(enContent);
      }
    } catch (error) {
      console.error('❌ 加载 en.json 失败:', error.message);
    }

    return { zhTranslations, enTranslations };
  }

  /**
   * 扁平化翻译键对象
   */
  flattenKeys(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nested = this.flattenKeys(obj[key], prefix ? `${prefix}.${key}` : key);
        Object.assign(flattened, nested);
      } else {
        flattened[prefix ? `${prefix}.${key}` : key] = obj[key];
      }
    }
    
    return flattened;
  }

  /**
   * 重建嵌套对象
   */
  unflattenKeys(flattened) {
    const result = {};
    
    for (const key in flattened) {
      const keys = key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = flattened[key];
    }
    
    return result;
  }

  /**
   * 检查键是否在白名单中
   */
  isWhitelisted(key) {
    // 直接匹配
    if (this.whitelistKeys.has(key)) {
      return true;
    }

    // 通配符匹配
    for (const whitelistKey of this.whitelistKeys) {
      if (whitelistKey.includes('*')) {
        const pattern = whitelistKey.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(key)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 检查键是否是动态键
   */
  isDynamicKey(key) {
    for (const dynamicPattern of this.dynamicKeys) {
      if (key.includes(dynamicPattern) || dynamicPattern.includes(key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 分析未使用的键
   */
  analyzeUnusedKeys() {
    console.log('🔍 分析未使用的翻译键...');
    
    const { zhTranslations, enTranslations } = this.loadTranslationFiles();
    
    // 扁平化所有翻译键
    const zhFlattened = this.flattenKeys(zhTranslations);
    const enFlattened = this.flattenKeys(enTranslations);
    
    // 获取所有键
    const allKeys = new Set([
      ...Object.keys(zhFlattened),
      ...Object.keys(enFlattened)
    ]);

    this.cleanupStats.totalKeys = allKeys.size;

    allKeys.forEach(key => {
      if (!this.usedKeys.has(key)) {
        if (this.isWhitelisted(key)) {
          this.cleanupStats.whitelistedKeys++;
          console.log(`🛡️  白名单保护: ${key}`);
        } else if (this.isDynamicKey(key)) {
          this.cleanupStats.dynamicKeys++;
          console.log(`🔄 动态键保护: ${key}`);
        } else {
          this.unusedKeys.add(key);
          this.cleanupStats.unusedKeys++;
        }
      }
    });

    console.log(`✅ 发现 ${this.cleanupStats.unusedKeys} 个未使用的翻译键`);
    console.log(`✅ 白名单保护 ${this.cleanupStats.whitelistedKeys} 个键`);
    console.log(`✅ 动态键保护 ${this.cleanupStats.dynamicKeys} 个键`);
  }

  /**
   * 清理未使用的键
   */
  cleanupUnusedKeys(dryRun = true) {
    console.log(`\n🧹 ${dryRun ? '模拟' : '执行'}清理未使用的翻译键...`);
    
    const { zhTranslations, enTranslations } = this.loadTranslationFiles();
    
    // 扁平化翻译键
    const zhFlattened = this.flattenKeys(zhTranslations);
    const enFlattened = this.flattenKeys(enTranslations);
    
    // 创建清理后的版本
    const cleanedZh = { ...zhFlattened };
    const cleanedEn = { ...enFlattened };
    
    let removedCount = 0;
    
    this.unusedKeys.forEach(key => {
      if (cleanedZh[key]) {
        delete cleanedZh[key];
        removedCount++;
        console.log(`🗑️  ${dryRun ? '将删除' : '已删除'} 中文键: ${key}`);
      }
      
      if (cleanedEn[key]) {
        delete cleanedEn[key];
        removedCount++;
        console.log(`🗑️  ${dryRun ? '将删除' : '已删除'} 英文键: ${key}`);
      }
    });

    if (!dryRun && removedCount > 0) {
      // 创建备份
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(this.zhPath, path.join(this.backupDir, `zh-before-cleanup-${timestamp}.json`));
      fs.copyFileSync(this.enPath, path.join(this.backupDir, `en-before-cleanup-${timestamp}.json`));

      // 重建嵌套结构并保存
      const finalZh = this.unflattenKeys(cleanedZh);
      const finalEn = this.unflattenKeys(cleanedEn);

      try {
        fs.writeFileSync(this.zhPath, JSON.stringify(finalZh, null, 2), 'utf8');
        console.log('✅ 已更新 zh.json');
      } catch (error) {
        console.error('❌ 保存 zh.json 失败:', error.message);
      }

      try {
        fs.writeFileSync(this.enPath, JSON.stringify(finalEn, null, 2), 'utf8');
        console.log('✅ 已更新 en.json');
      } catch (error) {
        console.error('❌ 保存 en.json 失败:', error.message);
      }
    }

    this.cleanupStats.removedKeys = removedCount;
    this.cleanupStats.keptKeys = this.cleanupStats.totalKeys - removedCount;

    return removedCount;
  }

  /**
   * 生成清理报告
   */
  generateReport() {
    console.log('\n📊 翻译键清理报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 统计信息:`);
    console.log(`  - 总键数: ${this.cleanupStats.totalKeys}`);
    console.log(`  - 未使用键: ${this.cleanupStats.unusedKeys}`);
    console.log(`  - 白名单保护: ${this.cleanupStats.whitelistedKeys}`);
    console.log(`  - 动态键保护: ${this.cleanupStats.dynamicKeys}`);
    console.log(`  - 已删除键: ${this.cleanupStats.removedKeys}`);
    console.log(`  - 保留键: ${this.cleanupStats.keptKeys}`);

    if (this.unusedKeys.size > 0) {
      console.log(`\n🗑️  未使用的键 (前20个):`);
      Array.from(this.unusedKeys).slice(0, 20).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.unusedKeys.size > 20) {
        console.log(`  ... 还有 ${this.unusedKeys.size - 20} 个未使用的键`);
      }
    }

    console.log(`\n💡 建议:`);
    if (this.cleanupStats.unusedKeys > 0) {
      console.log(`  - 运行 --dry-run 查看将要删除的键`);
      console.log(`  - 运行 --clean 执行实际清理`);
      console.log(`  - 检查白名单是否需要调整`);
    } else {
      console.log(`  - ✅ 没有发现未使用的翻译键`);
    }
  }

  /**
   * 运行清理
   */
  run() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const clean = args.includes('--clean');

    this.initializeWhitelist();
    this.scanUsedKeys();
    this.analyzeUnusedKeys();
    
    if (clean) {
      this.cleanupUnusedKeys(false);
    } else {
      this.cleanupUnusedKeys(true);
    }
    
    this.generateReport();
    
    console.log('\n' + '='.repeat(50));
    if (this.cleanupStats.unusedKeys > 0) {
      if (clean) {
        console.log('✅ 清理完成！');
      } else {
        console.log('💡 使用 --clean 参数执行实际清理');
      }
    } else {
      console.log('✅ 没有需要清理的翻译键');
    }
  }
}

// 运行清理
if (require.main === module) {
  const cleaner = new TranslationKeyCleaner();
  cleaner.run();
}

module.exports = TranslationKeyCleaner;
