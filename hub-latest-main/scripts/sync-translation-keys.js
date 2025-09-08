#!/usr/bin/env node

/**
 * 翻译键同步脚本
 * 用于同步中英文翻译文件，确保键的一致性
 */

const fs = require('fs');
const path = require('path');

class TranslationKeySyncer {
  constructor() {
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.zhFile = path.join(this.messagesDir, 'zh.json');
    this.enFile = path.join(this.messagesDir, 'en.json');
  }

  /**
   * 加载JSON文件
   */
  loadJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`❌ 加载文件失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 保存JSON文件
   */
  saveJsonFile(filePath, data) {
    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error(`❌ 保存文件失败 ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * 扁平化对象键
   */
  flattenKeys(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
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
   * 同步翻译键
   */
  syncKeys() {
    console.log('🔄 开始同步翻译键...');
    
    // 加载翻译文件
    const zhData = this.loadJsonFile(this.zhFile);
    const enData = this.loadJsonFile(this.enFile);
    
    if (!zhData || !enData) {
      console.error('❌ 无法加载翻译文件');
      return false;
    }

    // 扁平化键
    const zhFlattened = this.flattenKeys(zhData);
    const enFlattened = this.flattenKeys(enData);
    
    console.log(`📊 中文键数量: ${Object.keys(zhFlattened).length}`);
    console.log(`📊 英文键数量: ${Object.keys(enFlattened).length}`);

    // 找出差异
    const zhKeys = new Set(Object.keys(zhFlattened));
    const enKeys = new Set(Object.keys(enFlattened));
    
    const missingInEn = [...zhKeys].filter(key => !enKeys.has(key));
    const missingInZh = [...enKeys].filter(key => !zhKeys.has(key));
    const commonKeys = [...zhKeys].filter(key => enKeys.has(key));

    console.log(`📈 共同键数量: ${commonKeys.length}`);
    console.log(`📈 中文独有键: ${missingInEn.length}`);
    console.log(`📈 英文独有键: ${missingInZh.length}`);

    // 同步缺失的键
    let synced = false;

    if (missingInEn.length > 0) {
      console.log(`\n🔧 添加缺失的英文键 (${missingInEn.length}):`);
      missingInEn.forEach(key => {
        // 使用中文键作为英文键的占位符
        enFlattened[key] = `[ZH] ${zhFlattened[key]}`;
        console.log(`  + ${key}`);
      });
      synced = true;
    }

    if (missingInZh.length > 0) {
      console.log(`\n🔧 添加缺失的中文键 (${missingInZh.length}):`);
      missingInZh.forEach(key => {
        // 使用英文键作为中文键的占位符
        zhFlattened[key] = `[EN] ${enFlattened[key]}`;
        console.log(`  + ${key}`);
      });
      synced = true;
    }

    if (synced) {
      // 重建嵌套结构并保存
      const newZhData = this.unflattenKeys(zhFlattened);
      const newEnData = this.unflattenKeys(enFlattened);
      
      if (this.saveJsonFile(this.zhFile, newZhData) && this.saveJsonFile(this.enFile, newEnData)) {
        console.log('\n✅ 翻译键同步完成！');
        return true;
      } else {
        console.error('\n❌ 保存同步结果失败');
        return false;
      }
    } else {
      console.log('\n✅ 翻译键已同步，无需更新');
      return true;
    }
  }

  /**
   * 验证同步结果
   */
  validateSync() {
    console.log('\n🔍 验证同步结果...');
    
    const zhData = this.loadJsonFile(this.zhFile);
    const enData = this.loadJsonFile(this.enFile);
    
    if (!zhData || !enData) {
      return false;
    }

    const zhFlattened = this.flattenKeys(zhData);
    const enFlattened = this.flattenKeys(enData);
    
    const zhKeys = new Set(Object.keys(zhFlattened));
    const enKeys = new Set(Object.keys(enFlattened));
    
    const missingInEn = [...zhKeys].filter(key => !enKeys.has(key));
    const missingInZh = [...enKeys].filter(key => !zhKeys.has(key));

    if (missingInEn.length === 0 && missingInZh.length === 0) {
      console.log('✅ 翻译键完全同步！');
      return true;
    } else {
      console.log(`❌ 仍有差异: 中文独有 ${missingInZh.length}, 英文独有 ${missingInEn.length}`);
      return false;
    }
  }

  /**
   * 运行同步
   */
  run() {
    console.log('🚀 开始翻译键同步...\n');
    
    try {
      const success = this.syncKeys();
      if (success) {
        this.validateSync();
        console.log('\n🎉 同步完成！');
        process.exit(0);
      } else {
        console.log('\n❌ 同步失败！');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ 同步过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行同步
if (require.main === module) {
  const syncer = new TranslationKeySyncer();
  syncer.run();
}

module.exports = TranslationKeySyncer;
