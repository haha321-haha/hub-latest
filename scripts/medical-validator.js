#!/usr/bin/env node

/**
 * 医学术语验证工具 - 北美市场专用
 * 验证医学内容符合FDA标准和北美医学规范
 */

const fs = require('fs');
const path = require('path');

class MedicalValidator {
  constructor() {
    // FDA认证的医学术语数据库
    this.fdaApprovedTerms = {
      // 症状相关
      symptoms: {
        'dysmenorrhea': {
          en: 'Dysmenorrhea',
          zh: '痛经',
          fdaApproved: true,
          category: 'gynecological',
          severity: ['mild', 'moderate', 'severe']
        },
        'endometriosis': {
          en: 'Endometriosis',
          zh: '子宫内膜异位症',
          fdaApproved: true,
          category: 'gynecological',
          severity: ['mild', 'moderate', 'severe']
        },
        'menorrhagia': {
          en: 'Menorrhagia',
          zh: '月经过多',
          fdaApproved: true,
          category: 'gynecological',
          severity: ['mild', 'moderate', 'severe']
        }
      },
      
      // 治疗方法
      treatments: {
        'heat therapy': {
          en: 'Heat Therapy',
          zh: '热敷疗法',
          fdaApproved: true,
          category: 'non_pharmacological',
          evidence: 'strong'
        },
        'acupuncture': {
          en: 'Acupuncture',
          zh: '针灸',
          fdaApproved: true,
          category: 'alternative_medicine',
          evidence: 'moderate'
        },
        'massage': {
          en: 'Massage',
          zh: '按摩',
          fdaApproved: true,
          category: 'non_pharmacological',
          evidence: 'moderate'
        }
      },
      
      // 药物信息
      medications: {
        'ibuprofen': {
          en: 'Ibuprofen',
          zh: '布洛芬',
          fdaApproved: true,
          category: 'NSAID',
          dosage: '400-600mg every 6-8 hours',
          maxDaily: '2400mg',
          warnings: ['Do not exceed recommended dose', 'Consult doctor if symptoms persist']
        },
        'acetaminophen': {
          en: 'Acetaminophen',
          zh: '对乙酰氨基酚',
          fdaApproved: true,
          category: 'analgesic',
          dosage: '500-1000mg every 4-6 hours',
          maxDaily: '4000mg',
          warnings: ['Do not exceed recommended dose', 'Avoid with alcohol']
        }
      }
    };
    
    // FDA合规要求
    this.fdaRequirements = {
      // 必需的免责声明
      requiredDisclaimers: [
        'This information is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment.',
        'Always consult with a qualified healthcare provider for any health concerns.',
        'Individual results may vary.'
      ],
      
      // 禁止的声明
      prohibitedClaims: [
        'cure',
        'treat',
        'diagnose',
        'prevent',
        'guarantee',
        'promise'
      ],
      
      // 必需的警告
      requiredWarnings: [
        'Seek immediate medical attention if you experience severe symptoms',
        'Consult your healthcare provider before starting any new treatment',
        'Stop use and consult a doctor if symptoms worsen'
      ],
      
      // 医疗建议语气检查
      medicalAdvicePatterns: [
        /you should/gi,
        /we recommend/gi,
        /take.*mg/gi,
        /dosage/gi,
        /prescription/gi,
        /doctor.*prescribe/gi
      ],
      
      // 免责声明放置位置
      disclaimerPlacement: [
        'footer',
        'before-medical-content',
        'modal',
        'sidebar'
      ],
      
      // 权威来源验证
      authorizedSources: [
        'FDA',
        'CDC',
        'NIH',
        'Mayo Clinic',
        'WebMD',
        'American College of Obstetricians and Gynecologists',
        'American Medical Association'
      ]
    };
  }

  /**
   * 验证医学内容
   */
  validateMedicalContent(content, locale = 'en') {
    const issues = [];
    const warnings = [];
    
    // 1. 检查医学术语准确性
    const terminologyIssues = this.validateTerminology(content, locale);
    issues.push(...terminologyIssues);
    
    // 2. 检查FDA合规性
    const complianceIssues = this.validateFDACompliance(content);
    issues.push(...complianceIssues);
    
    // 3. 检查药物信息
    const medicationIssues = this.validateMedicationInfo(content);
    issues.push(...medicationIssues);
    
    // 4. 检查安全警告
    const safetyIssues = this.validateSafetyWarnings(content);
    issues.push(...safetyIssues);
    
    // 5. 检查医疗建议语气
    const adviceIssues = this.validateMedicalAdviceTone(content);
    warnings.push(...adviceIssues);
    
    // 6. 检查免责声明放置
    const disclaimerIssues = this.validateDisclaimerPlacement(content);
    warnings.push(...disclaimerIssues);
    
    // 7. 验证引用来源
    const sourceIssues = this.validateSourceAuthority(content);
    warnings.push(...sourceIssues);
    
    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      score: this.calculateScore(issues, content)
    };
  }

  /**
   * 验证医学术语
   */
  validateTerminology(content, locale) {
    const issues = [];
    const allTerms = this.getAllTerms();
    
    // 检查术语准确性
    Object.entries(allTerms).forEach(([category, terms]) => {
      Object.entries(terms).forEach(([key, term]) => {
        const termText = term[locale] || term.en;
        if (content.includes(termText)) {
          // 验证术语使用是否正确
          if (!this.isTermUsedCorrectly(content, termText, term)) {
            issues.push({
              type: 'terminology',
              category,
              term: termText,
              issue: 'Term may be used incorrectly',
              suggestion: this.getTermSuggestion(term)
            });
          }
        }
      });
    });
    
    return issues;
  }

  /**
   * 验证FDA合规性
   */
  validateFDACompliance(content) {
    const issues = [];
    
    // 检查必需的免责声明
    this.fdaRequirements.requiredDisclaimers.forEach(disclaimer => {
      if (!content.includes(disclaimer)) {
        issues.push({
          type: 'fda_compliance',
          issue: 'Missing required disclaimer',
          required: disclaimer,
          suggestion: 'Add the required FDA disclaimer'
        });
      }
    });
    
    // 检查禁止的声明
    this.fdaRequirements.prohibitedClaims.forEach(claim => {
      if (content.toLowerCase().includes(claim)) {
        issues.push({
          type: 'fda_compliance',
          issue: 'Contains prohibited claim',
          prohibited: claim,
          suggestion: 'Remove or rephrase the prohibited claim'
        });
      }
    });
    
    return issues;
  }

  /**
   * 验证药物信息
   */
  validateMedicationInfo(content) {
    const issues = [];
    const medications = this.fdaApprovedTerms.medications;
    
    Object.entries(medications).forEach(([key, medication]) => {
      if (content.includes(medication.en) || content.includes(medication.zh)) {
        // 检查剂量信息
        if (!content.includes(medication.dosage)) {
          issues.push({
            type: 'medication',
            medication: medication.en,
            issue: 'Missing dosage information',
            required: medication.dosage,
            suggestion: 'Add dosage information'
          });
        }
        
        // 检查安全警告
        if (!this.hasRequiredWarnings(content, medication.warnings)) {
          issues.push({
            type: 'medication',
            medication: medication.en,
            issue: 'Missing safety warnings',
            required: medication.warnings,
            suggestion: 'Add safety warnings'
          });
        }
      }
    });
    
    return issues;
  }

  /**
   * 验证安全警告
   */
  validateSafetyWarnings(content) {
    const issues = [];
    
    // 检查必需的安全警告
    this.fdaRequirements.requiredWarnings.forEach(warning => {
      if (!content.includes(warning)) {
        issues.push({
          type: 'safety',
          issue: 'Missing required safety warning',
          required: warning,
          suggestion: 'Add the required safety warning'
        });
      }
    });
    
    return issues;
  }

  /**
   * 验证医疗建议语气
   */
  validateMedicalAdviceTone(content) {
    const warnings = [];
    
    this.fdaRequirements.medicalAdvicePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          warnings.push({
            type: 'medical_advice_tone',
            issue: 'Content may sound like medical advice',
            found: match,
            suggestion: 'Consider rephrasing to be more educational and less prescriptive'
          });
        });
      }
    });
    
    return warnings;
  }

  /**
   * 验证免责声明放置
   */
  validateDisclaimerPlacement(content) {
    const warnings = [];
    
    // 检查免责声明是否在合适的位置
    const hasDisclaimer = this.fdaRequirements.requiredDisclaimers.some(disclaimer => 
      content.includes(disclaimer)
    );
    
    if (hasDisclaimer) {
      // 检查是否在页面底部
      const contentLines = content.split('\n');
      const lastQuarter = contentLines.slice(-Math.floor(contentLines.length / 4));
      const hasDisclaimerInFooter = lastQuarter.some(line => 
        this.fdaRequirements.requiredDisclaimers.some(disclaimer => 
          line.includes(disclaimer)
        )
      );
      
      if (!hasDisclaimerInFooter) {
        warnings.push({
          type: 'disclaimer_placement',
          issue: 'Disclaimer not found in footer area',
          suggestion: 'Consider placing disclaimer in footer or before medical content'
        });
      }
    }
    
    return warnings;
  }

  /**
   * 验证引用来源权威性
   */
  validateSourceAuthority(content) {
    const warnings = [];
    
    // 检查是否引用了权威来源
    const hasAuthorizedSource = this.fdaRequirements.authorizedSources.some(source => 
      content.includes(source)
    );
    
    if (!hasAuthorizedSource) {
      warnings.push({
        type: 'source_authority',
        issue: 'No authoritative medical sources referenced',
        suggestion: 'Consider referencing FDA, CDC, NIH, or other authoritative medical sources'
      });
    }
    
    return warnings;
  }

  /**
   * 获取所有术语
   */
  getAllTerms() {
    return {
      ...this.fdaApprovedTerms.symptoms,
      ...this.fdaApprovedTerms.treatments,
      ...this.fdaApprovedTerms.medications
    };
  }

  /**
   * 检查术语使用是否正确
   */
  isTermUsedCorrectly(content, term, termInfo) {
    // 简单的正确性检查
    // 在实际应用中，这里可以添加更复杂的逻辑
    
    // 检查是否在正确的上下文中使用
    const context = this.getTermContext(content, term);
    
    // 检查是否与FDA批准的信息一致
    if (termInfo.fdaApproved === false) {
      return false;
    }
    
    return true;
  }

  /**
   * 获取术语上下文
   */
  getTermContext(content, term) {
    const index = content.indexOf(term);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + term.length + 50);
    
    return content.substring(start, end);
  }

  /**
   * 检查是否有必需的安全警告
   */
  hasRequiredWarnings(content, warnings) {
    return warnings.some(warning => content.includes(warning));
  }

  /**
   * 获取术语建议
   */
  getTermSuggestion(term) {
    return {
      correctUsage: term.en,
      definition: term.definition || 'No definition available',
      category: term.category || 'general',
      evidence: term.evidence || 'No evidence level specified'
    };
  }

  /**
   * 计算验证分数
   */
  calculateScore(issues, content) {
    const totalChecks = this.getTotalChecks(content);
    const passedChecks = totalChecks - issues.length;
    return Math.max(0, (passedChecks / totalChecks) * 100);
  }

  /**
   * 获取总检查数
   */
  getTotalChecks(content) {
    let checks = 0;
    
    // 术语检查
    const allTerms = this.getAllTerms();
    checks += Object.keys(allTerms).length;
    
    // FDA合规检查
    checks += this.fdaRequirements.requiredDisclaimers.length;
    checks += this.fdaRequirements.prohibitedClaims.length;
    
    // 安全警告检查
    checks += this.fdaRequirements.requiredWarnings.length;
    
    return checks;
  }

  /**
   * 生成验证报告
   */
  generateReport(validationResult) {
    return {
      timestamp: new Date().toISOString(),
      isValid: validationResult.isValid,
      score: validationResult.score,
      totalIssues: validationResult.issues.length,
      issuesByType: this.groupIssuesByType(validationResult.issues),
      recommendations: this.generateRecommendations(validationResult.issues)
    };
  }

  /**
   * 按类型分组问题
   */
  groupIssuesByType(issues) {
    const grouped = {};
    issues.forEach(issue => {
      if (!grouped[issue.type]) {
        grouped[issue.type] = [];
      }
      grouped[issue.type].push(issue);
    });
    return grouped;
  }

  /**
   * 生成建议
   */
  generateRecommendations(issues) {
    const recommendations = [];
    
    if (issues.some(issue => issue.type === 'fda_compliance')) {
      recommendations.push('Review FDA compliance requirements and add missing disclaimers');
    }
    
    if (issues.some(issue => issue.type === 'medication')) {
      recommendations.push('Ensure all medication information includes dosage and safety warnings');
    }
    
    if (issues.some(issue => issue.type === 'terminology')) {
      recommendations.push('Review medical terminology for accuracy and proper usage');
    }
    
    return recommendations;
  }

  /**
   * 验证文件
   */
  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const validation = this.validateMedicalContent(content);
      const report = this.generateReport(validation);
      
      return {
        file: filePath,
        validation,
        report
      };
    } catch (error) {
      return {
        file: filePath,
        error: error.message
      };
    }
  }

  /**
   * 验证项目
   */
  validateProject(projectRoot) {
    const messagesDir = path.join(projectRoot, 'messages');
    const enFile = path.join(messagesDir, 'en.json');
    const zhFile = path.join(messagesDir, 'zh.json');
    
    const results = [];
    
    if (fs.existsSync(enFile)) {
      results.push(this.validateFile(enFile));
    }
    
    if (fs.existsSync(zhFile)) {
      results.push(this.validateFile(zhFile));
    }
    
    return results;
  }
}

// CLI 接口
if (require.main === module) {
  const validator = new MedicalValidator();
  const projectRoot = process.argv[2] || process.cwd();
  
  console.log(`🏥 验证医学内容: ${projectRoot}`);
  
  const results = validator.validateProject(projectRoot);
  
  results.forEach(result => {
    if (result.error) {
      console.error(`❌ 错误: ${result.file} - ${result.error}`);
    } else {
      console.log(`\n📄 文件: ${result.file}`);
      console.log(`分数: ${result.report.score.toFixed(1)}%`);
      console.log(`问题数: ${result.report.totalIssues}`);
      
      if (result.report.totalIssues > 0) {
        console.log('\n🔍 问题详情:');
        Object.entries(result.report.issuesByType).forEach(([type, issues]) => {
          console.log(`\n${type}:`);
          issues.forEach((issue, index) => {
            console.log(`  ${index + 1}. ${issue.issue}`);
            if (issue.suggestion) {
              console.log(`     建议: ${issue.suggestion}`);
            }
          });
        });
        
        console.log('\n💡 建议:');
        result.report.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      } else {
        console.log('✅ 所有医学内容验证通过！');
      }
    }
  });
  
  // 如果有问题，退出码为1
  const hasIssues = results.some(result => !result.error && result.report.totalIssues > 0);
  process.exit(hasIssues ? 1 : 0);
}

module.exports = MedicalValidator;
