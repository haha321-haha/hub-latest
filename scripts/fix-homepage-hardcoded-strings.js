#!/usr/bin/env node

/**
 * Fix Homepage Hardcoded Strings
 * Automatically fixes the most common hardcoded string patterns in the homepage
 */

const fs = require('fs');
const path = require('path');

class HomepageStringFixer {
  constructor() {
    this.fixes = [];
    this.homepageFile = 'app/[locale]/page.tsx';
  }

  fixHomepageStrings() {
    console.log('🔧 Fixing homepage hardcoded strings...');
    
    try {
      let content = fs.readFileSync(this.homepageFile, 'utf8');
      let hasChanges = false;

      // Add homePageT translation hook
      if (!content.includes('homePageT')) {
        content = content.replace(
          'const commonT = await getTranslations({ locale, namespace: \'common\' });',
          'const commonT = await getTranslations({ locale, namespace: \'common\' });\n  const homePageT = await getTranslations({ locale, namespace: \'homePageContent\' });'
        );
        hasChanges = true;
        console.log('✅ Added homePageT translation hook');
      }

      // Fix common hardcoded patterns
      const replacements = [
        // Search placeholder
        {
          old: `placeholder={locale === 'zh' ? '🔍 快速搜索痛经解决方案...' : '🔍 Quick search for pain relief solutions...'}`,
          new: `placeholder={homePageT('searchPlaceholder', locale === 'en' ? '🔍 Quick search for pain relief solutions...' : '🔍 快速搜索痛经解决方案...')}`
        },
        // Search tips
        {
          old: `{locale === 'zh'
                    ? '💡 试试搜索"5分钟缓解"、"热敷"、"前列腺素"'
                    : '💡 Try searching "5-minute relief", "heat therapy", "prostaglandins"'
                  }`,
          new: `{homePageT('searchTips', locale === 'en' ? '💡 Try searching "5-minute relief", "heat therapy", "prostaglandins"' : '💡 试试搜索"5分钟缓解"、"热敷"、"前列腺素"')}`
        },
        // Statistics section title
        {
          old: `{locale === 'zh' ? '数据说话，效果可见' : 'Data-Driven Results'}`,
          new: `{homePageT('statistics.title', locale === 'en' ? 'Data-Driven Results' : '数据说话，效果可见')}`
        },
        // Statistics description
        {
          old: `{locale === 'zh'
                ? '基于真实用户反馈和科学研究的数据统计'
                : 'Statistics based on real user feedback and scientific research'
              }`,
          new: `{homePageT('statistics.description', locale === 'en' ? 'Statistics based on real user feedback and scientific research' : '基于真实用户反馈和科学研究的数据统计')}`
        },
        // Statistics items
        {
          old: `{locale === 'zh' ? '用户症状改善' : 'Users Report Improvement'}`,
          new: `{homePageT('statistics.improvement', locale === 'en' ? 'Users Report Improvement' : '用户症状改善')}`
        },
        {
          old: `{locale === 'zh' ? '10万+' : '100K+'}`,
          new: `{homePageT('statistics.users', locale === 'en' ? '100K+' : '10万+')}`
        },
        {
          old: `{locale === 'zh' ? '累计用户' : 'Total Users'}`,
          new: `{homePageT('statistics.totalUsers', locale === 'en' ? 'Total Users' : '累计用户')}`
        },
        {
          old: `{locale === 'zh' ? '在线支持' : 'Online Support'}`,
          new: `{homePageT('statistics.support', locale === 'en' ? 'Online Support' : '在线支持')}`
        },
        {
          old: `{locale === 'zh' ? '专业文章' : 'Expert Articles'}`,
          new: `{homePageT('statistics.articles', locale === 'en' ? 'Expert Articles' : '专业文章')}`
        },
        // Health Guide section
        {
          old: `{locale === 'zh' ? '痛经健康指南' : 'Health Guide'}`,
          new: `{homePageT('healthGuide.title', locale === 'en' ? 'Health Guide' : '痛经健康指南')}`
        },
        {
          old: `{locale === 'zh'
                  ? '全面的痛经健康知识体系，从基础理解到高级管理策略，助您掌握经期健康。'
                  : 'Comprehensive menstrual health knowledge system, from basic understanding to advanced management strategies.'
                }`,
          new: `{homePageT('healthGuide.description', locale === 'en' ? 'Comprehensive menstrual health knowledge system, from basic understanding to advanced management strategies.' : '全面的痛经健康知识体系，从基础理解到高级管理策略，助您掌握经期健康。')}`
        },
        // Smart Tools section
        {
          old: `{locale === 'zh' ? '智能健康工具' : 'Smart Health Tools'}`,
          new: `{homePageT('smartTools.title', locale === 'en' ? 'Smart Health Tools' : '智能健康工具')}`
        },
        {
          old: `{locale === 'zh'
                ? '专业的评估和追踪工具，帮助您更好地了解和管理经期健康'
                : 'Professional assessment and tracking tools to help you better understand and manage your menstrual health'
              }`,
          new: `{homePageT('smartTools.description', locale === 'en' ? 'Professional assessment and tracking tools to help you better understand and manage your menstrual health' : '专业的评估和追踪工具，帮助您更好地了解和管理经期健康')}`
        },
        // Medical Disclaimer
        {
          old: `{locale === 'zh' ? '医疗免责声明' : 'Medical Disclaimer'}`,
          new: `{homePageT('medicalDisclaimer', locale === 'en' ? 'Medical Disclaimer' : '医疗免责声明')}`
        }
      ];

      // Apply replacements
      replacements.forEach((replacement, index) => {
        if (content.includes(replacement.old)) {
          content = content.replace(replacement.old, replacement.new);
          hasChanges = true;
          console.log(`✅ Fixed hardcoded string ${index + 1}/${replacements.length}`);
        }
      });

      if (hasChanges) {
        fs.writeFileSync(this.homepageFile, content);
        console.log('✅ Homepage hardcoded strings fixed successfully');
        return true;
      } else {
        console.log('ℹ️  No changes needed in homepage');
        return false;
      }

    } catch (error) {
      console.error('❌ Error fixing homepage strings:', error.message);
      return false;
    }
  }

  generateTranslationKeys() {
    console.log('📝 Generating translation keys for homepage...');
    
    const zhKeys = {
      homePageContent: {
        searchPlaceholder: "🔍 快速搜索痛经解决方案...",
        searchTips: "💡 试试搜索\"5分钟缓解\"、\"热敷\"、\"前列腺素\"",
        statistics: {
          title: "数据说话，效果可见",
          description: "基于真实用户反馈和科学研究的数据统计",
          improvement: "用户症状改善",
          users: "10万+",
          totalUsers: "累计用户",
          support: "在线支持",
          articles: "专业文章"
        },
        healthGuide: {
          title: "痛经健康指南",
          description: "全面的痛经健康知识体系，从基础理解到高级管理策略，助您掌握经期健康。"
        },
        smartTools: {
          title: "智能健康工具",
          description: "专业的评估和追踪工具，帮助您更好地了解和管理经期健康"
        },
        medicalDisclaimer: "医疗免责声明"
      }
    };

    const enKeys = {
      homePageContent: {
        searchPlaceholder: "🔍 Quick search for pain relief solutions...",
        searchTips: "💡 Try searching \"5-minute relief\", \"heat therapy\", \"prostaglandins\"",
        statistics: {
          title: "Data-Driven Results",
          description: "Statistics based on real user feedback and scientific research",
          improvement: "Users Report Improvement",
          users: "100K+",
          totalUsers: "Total Users",
          support: "Online Support",
          articles: "Expert Articles"
        },
        healthGuide: {
          title: "Health Guide",
          description: "Comprehensive menstrual health knowledge system, from basic understanding to advanced management strategies."
        },
        smartTools: {
          title: "Smart Health Tools",
          description: "Professional assessment and tracking tools to help you better understand and manage your menstrual health"
        },
        medicalDisclaimer: "Medical Disclaimer"
      }
    };

    // Write to translation files
    try {
      // Read existing translation files
      const zhFile = 'messages/zh.json';
      const enFile = 'messages/en.json';
      
      const zhContent = JSON.parse(fs.readFileSync(zhFile, 'utf8'));
      const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      
      // Merge new keys
      Object.assign(zhContent, zhKeys);
      Object.assign(enContent, enKeys);
      
      // Write back to files
      fs.writeFileSync(zhFile, JSON.stringify(zhContent, null, 2));
      fs.writeFileSync(enFile, JSON.stringify(enContent, null, 2));
      
      console.log('✅ Translation keys added successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding translation keys:', error.message);
      return false;
    }
  }

  run() {
    console.log('🚀 Starting homepage hardcoded string fixing...');
    
    // First add translation keys
    const keysAdded = this.generateTranslationKeys();
    if (!keysAdded) {
      console.error('❌ Failed to add translation keys');
      return false;
    }
    
    // Then fix the homepage
    const homepageFixed = this.fixHomepageStrings();
    
    if (homepageFixed) {
      console.log('🎉 Homepage hardcoded string fixing completed successfully!');
      return true;
    } else {
      console.log('ℹ️  Homepage hardcoded string fixing completed with no changes needed');
      return true;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const fixer = new HomepageStringFixer();
  const success = fixer.run();
  process.exit(success ? 0 : 1);
}

module.exports = HomepageStringFixer;
