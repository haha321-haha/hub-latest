# 国际化标准化流程和规范

## 📋 目录
1. [概述](#概述)
2. [HTML源文件标准化处理](#html源文件标准化处理)
3. [医学内容翻译审核流程](#医学内容翻译审核流程)
4. [内容模板防硬编码](#内容模板防硬编码)
5. [长期建设方案](#长期建设方案)
6. [质量保证流程](#质量保证流程)

## 概述

本文档建立了Period Hub项目的国际化标准化流程，确保所有内容符合医学准确性、技术规范性和用户体验标准。

### 核心原则
- **医学准确性优先**: 所有医疗术语必须经过专业审核
- **技术规范性**: 使用标准化的翻译键命名和结构
- **用户体验一致性**: 确保中英文版本功能完全一致
- **可维护性**: 建立清晰的代码结构和文档

## HTML源文件标准化处理

### 1. HTML实体解码

#### 问题识别
```typescript
// 常见HTML实体问题
const htmlEntities = {
  '&amp;': '&',           // 和号
  '&lt;': '<',            // 小于号
  '&gt;': '>',            // 大于号
  '&quot;': '"',          // 引号
  '&#39;': "'",           // 单引号
  '&nbsp;': ' ',          // 不间断空格
  '&deg;': '°',           // 度数符号
  '&plusmn;': '±',        // 正负号
  '&times;': '×',         // 乘号
  '&mdash;': '—',         // 长破折号
  '&hellip;': '…'         // 省略号
};
```

#### 解决方案
```typescript
// HTML解码工具
export const htmlDecode = (str: string): string => {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&mdash;': '—',
    '&hellip;': '…'
  };
  
  return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => 
    entities[entity] || entity
  );
};

// 使用示例
const cleanText = htmlDecode('温度范围：40&deg;C &plusmn; 2&deg;C');
// 结果: '温度范围：40°C ± 2°C'
```

### 2. 内容清理流程

#### 步骤1: 自动检测
```bash
# 检测HTML实体的脚本
grep -r "&[a-zA-Z0-9#]\+;" app/ components/ --include="*.tsx" --include="*.ts"
```

#### 步骤2: 批量处理
```typescript
// 批量清理工具
const cleanHtmlEntities = async (filePath: string) => {
  const content = await fs.readFile(filePath, 'utf-8');
  const cleaned = htmlDecode(content);
  await fs.writeFile(filePath, cleaned);
  console.log(`Cleaned HTML entities in ${filePath}`);
};
```

## 医学内容翻译审核流程

### 1. 医学术语白名单

```typescript
// 核心医学术语
const medicalTerms = {
  // 症状相关
  symptoms: {
    zh: ['痛经', '月经不调', '经期疼痛', '下腹痛', '腰痛'],
    en: ['dysmenorrhea', 'menstrual irregularity', 'period pain', 'lower abdominal pain', 'back pain']
  },
  
  // 治疗方法
  treatments: {
    zh: ['热敷', '针灸', '按摩', '瑜伽', '芳香疗法'],
    en: ['heat therapy', 'acupuncture', 'massage', 'yoga', 'aromatherapy']
  },
  
  // 药物相关
  medications: {
    zh: ['布洛芬', '对乙酰氨基酚', '非甾体抗炎药'],
    en: ['ibuprofen', 'acetaminophen', 'NSAIDs']
  }
};
```

### 2. 审核流程

#### 阶段1: 自动检测
```typescript
interface MedicalTranslationAudit {
  id: string;
  originalText: string;
  translatedText: string;
  medicalTerms: string[];
  auditStatus: 'pending' | 'approved' | 'rejected';
  auditor: string;
  auditDate: Date;
  notes: string;
  confidence: number; // 0-1, 自动检测的置信度
}

const detectMedicalTerms = (text: string): string[] => {
  const allTerms = [
    ...medicalTerms.symptoms.zh,
    ...medicalTerms.symptoms.en,
    ...medicalTerms.treatments.zh,
    ...medicalTerms.treatments.en,
    ...medicalTerms.medications.zh,
    ...medicalTerms.medications.en
  ];
  
  return allTerms.filter(term => text.includes(term));
};
```

#### 阶段2: 专业审核
```typescript
// 审核工作流
const medicalAuditWorkflow = {
  // 1. 自动标记需要审核的内容
  markForAudit: (translation: string) => {
    const terms = detectMedicalTerms(translation);
    return terms.length > 0 ? 'requires_audit' : 'auto_approved';
  },
  
  // 2. 专业审核
  professionalAudit: (auditId: string, auditor: string, decision: 'approved' | 'rejected', notes: string) => {
    // 更新审核状态
    updateAuditStatus(auditId, decision, auditor, notes);
  },
  
  // 3. 质量保证
  qualityAssurance: (auditId: string) => {
    // 验证审核质量
    return validateAuditQuality(auditId);
  }
};
```

### 3. 审核标准

#### 医学准确性标准
- ✅ **症状描述**: 必须使用标准医学术语
- ✅ **治疗方法**: 必须符合循证医学证据
- ✅ **药物信息**: 必须准确无误，包含剂量和注意事项
- ✅ **安全警告**: 必须完整传达安全信息

#### 语言质量标准
- ✅ **术语一致性**: 同一概念在整个应用中保持术语一致
- ✅ **文化适应性**: 考虑文化差异，使用适当的表达方式
- ✅ **用户友好性**: 确保普通用户能够理解

## 内容模板防硬编码

### 1. 翻译键命名规范

```typescript
// 命名空间结构
const namespaceStructure = {
  // 页面级别
  pages: {
    naturalTherapies: {
      // 页面元数据
      meta: {
        title: string;
        description: string;
        keywords: string[];
      };
      
      // 页面内容
      content: {
        hero: {
          title: string;
          subtitle: string;
          description: string;
        };
        
        sections: {
          [sectionName: string]: {
            title: string;
            subtitle: string;
            description: string;
            items: {
              [itemName: string]: {
                title: string;
                description: string;
                details: string[];
              };
            };
          };
        };
      };
    };
  };
  
  // 组件级别
  components: {
    bottomRecommendations: {
      title: string;
      items: string[];
    };
  };
  
  // 通用内容
  common: {
    buttons: {
      submit: string;
      cancel: string;
      save: string;
    };
    messages: {
      loading: string;
      error: string;
      success: string;
    };
  };
};
```

### 2. 模板生成工具

```typescript
// 翻译键模板生成器
class TranslationTemplateGenerator {
  // 生成页面模板
  generatePageTemplate(pageName: string, sections: string[]) {
    const template = {
      [pageName]: {
        meta: {
          title: '{{page_title}}',
          description: '{{page_description}}',
          keywords: ['{{keyword1}}', '{{keyword2}}']
        },
        content: {
          hero: {
            title: '{{hero_title}}',
            subtitle: '{{hero_subtitle}}',
            description: '{{hero_description}}'
          }
        }
      }
    };
    
    // 为每个section添加模板
    sections.forEach(section => {
      template[pageName].content[section] = {
        title: `{{${section}_title}}`,
        subtitle: `{{${section}_subtitle}}`,
        description: `{{${section}_description}}`,
        items: {}
      };
    });
    
    return template;
  }
  
  // 生成组件模板
  generateComponentTemplate(componentName: string, props: string[]) {
    const template = {
      [componentName]: {}
    };
    
    props.forEach(prop => {
      template[componentName][prop] = `{{${componentName}_${prop}}}`;
    });
    
    return template;
  }
}
```

### 3. 硬编码检测和预防

```typescript
// 硬编码检测工具
class HardcodeDetector {
  // 检测模式
  private patterns = [
    /locale === 'zh' \? '([^']+)' : '([^']+)'/g,  // 条件字符串
    /locale === 'zh' \? "([^"]+)" : "([^"]+)"/g,  // 条件字符串（双引号）
    /'([^']+)' : '([^']+)'/g,                      // 对象字面量
    /"([^"]+)" : "([^"]+)"/g                       // 对象字面量（双引号）
  ];
  
  // 扫描文件
  scanFile(filePath: string): HardcodeReport[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const reports: HardcodeReport[] = [];
    
    this.patterns.forEach((pattern, index) => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        reports.push({
          file: filePath,
          line: this.getLineNumber(content, match.index!),
          pattern: pattern.source,
          match: match[0],
          suggestion: this.generateSuggestion(match, index)
        });
      }
    });
    
    return reports;
  }
  
  // 生成修复建议
  private generateSuggestion(match: RegExpMatchArray, patternIndex: number): string {
    const [fullMatch, zhText, enText] = match;
    
    // 生成翻译键建议
    const keySuggestion = this.generateKeySuggestion(zhText);
    
    return `Replace with: t('${keySuggestion}')`;
  }
  
  // 生成翻译键建议
  private generateKeySuggestion(text: string): string {
    // 基于文本内容生成有意义的键名
    const words = text.split(/\s+/).slice(0, 3);
    return words.map(word => 
      word.toLowerCase().replace(/[^\w]/g, '')
    ).join('.');
  }
}
```

## 长期建设方案

### 1. 内容管理工具架构

```typescript
// 内容管理系统
interface ContentManagementSystem {
  // 翻译管理
  translations: {
    create: (namespace: string, key: string, content: TranslationContent) => Promise<void>;
    update: (id: string, content: TranslationContent) => Promise<void>;
    delete: (id: string) => Promise<void>;
    search: (query: string) => Promise<TranslationItem[]>;
    validate: (content: TranslationContent) => ValidationResult;
  };
  
  // 硬编码检测
  hardcodeDetection: {
    scan: (filePath: string) => Promise<HardcodeReport[]>;
    scanAll: () => Promise<HardcodeReport[]>;
    autoFix: (report: HardcodeReport) => Promise<AutoFixResult>;
    validate: (fix: AutoFix) => Promise<boolean>;
  };
  
  // 医学内容审核
  medicalAudit: {
    extractTerms: (text: string) => string[];
    validateAccuracy: (translation: string) => Promise<AuditResult>;
    getApprovedTranslations: () => Promise<ApprovedTranslation[]>;
    scheduleAudit: (translationId: string, auditor: string) => Promise<void>;
  };
  
  // 质量保证
  qualityAssurance: {
    checkConsistency: () => Promise<ConsistencyReport>;
    checkCompleteness: () => Promise<CompletenessReport>;
    generateReport: () => Promise<QualityReport>;
  };
}
```

### 2. 自动化工作流

```typescript
// 自动化工作流
class I18nWorkflow {
  // 新内容添加流程
  async addNewContent(content: NewContent): Promise<void> {
    // 1. 生成翻译键
    const translationKey = this.generateTranslationKey(content);
    
    // 2. 创建翻译模板
    const template = this.createTranslationTemplate(content);
    
    // 3. 检测医学术语
    const medicalTerms = this.detectMedicalTerms(content.text);
    
    // 4. 如果需要审核，加入审核队列
    if (medicalTerms.length > 0) {
      await this.scheduleMedicalAudit(translationKey, content);
    }
    
    // 5. 添加到翻译文件
    await this.addToTranslationFiles(translationKey, template);
  }
  
  // 硬编码修复流程
  async fixHardcode(hardcodeReport: HardcodeReport): Promise<void> {
    // 1. 生成翻译键
    const translationKey = this.generateTranslationKey(hardcodeReport);
    
    // 2. 创建翻译内容
    const translationContent = this.createTranslationContent(hardcodeReport);
    
    // 3. 添加到翻译文件
    await this.addToTranslationFiles(translationKey, translationContent);
    
    // 4. 替换代码中的硬编码
    await this.replaceHardcode(hardcodeReport, translationKey);
    
    // 5. 验证修复结果
    await this.validateFix(hardcodeReport.file, translationKey);
  }
}
```

### 3. 监控和报告系统

```typescript
// 监控系统
class I18nMonitoring {
  // 实时监控
  async monitorHardcode(): Promise<void> {
    const reports = await this.scanAllFiles();
    const newHardcodes = await this.filterNewHardcodes(reports);
    
    if (newHardcodes.length > 0) {
      await this.notifyTeam(newHardcodes);
      await this.createIssue(newHardcodes);
    }
  }
  
  // 质量报告
  async generateQualityReport(): Promise<QualityReport> {
    return {
      totalTranslations: await this.countTranslations(),
      hardcodeCount: await this.countHardcodes(),
      medicalAuditPending: await this.countPendingAudits(),
      consistencyScore: await this.calculateConsistency(),
      completenessScore: await this.calculateCompleteness(),
      lastUpdated: new Date()
    };
  }
}
```

## 质量保证流程

### 1. 自动化测试

```typescript
// 国际化测试套件
describe('Internationalization Tests', () => {
  // 翻译键完整性测试
  test('All translation keys are present', async () => {
    const usedKeys = await extractUsedTranslationKeys();
    const availableKeys = await extractAvailableTranslationKeys();
    
    const missingKeys = usedKeys.filter(key => !availableKeys.includes(key));
    expect(missingKeys).toHaveLength(0);
  });
  
  // 硬编码检测测试
  test('No hardcoded strings in components', async () => {
    const hardcodeReports = await scanAllFiles();
    expect(hardcodeReports).toHaveLength(0);
  });
  
  // 医学术语一致性测试
  test('Medical terms are consistent', async () => {
    const medicalTerms = await extractMedicalTerms();
    const inconsistencies = await findInconsistencies(medicalTerms);
    expect(inconsistencies).toHaveLength(0);
  });
});
```

### 2. 人工审核流程

```typescript
// 审核流程
const auditProcess = {
  // 1. 自动预审核
  preAudit: async (content: string) => {
    const medicalTerms = detectMedicalTerms(content);
    const confidence = calculateConfidence(content);
    
    return {
      requiresAudit: medicalTerms.length > 0 || confidence < 0.8,
      medicalTerms,
      confidence
    };
  },
  
  // 2. 专业审核
  professionalAudit: async (content: string, auditor: string) => {
    const auditResult = await performMedicalAudit(content);
    
    return {
      approved: auditResult.approved,
      notes: auditResult.notes,
      auditor,
      auditDate: new Date()
    };
  },
  
  // 3. 质量检查
  qualityCheck: async (auditResult: AuditResult) => {
    return validateAuditQuality(auditResult);
  }
};
```

## 实施计划

### 阶段1: 基础设施（1-2周）
- [ ] 建立HTML解码工具
- [ ] 创建医学术语白名单
- [ ] 开发硬编码检测工具
- [ ] 建立翻译键命名规范

### 阶段2: 核心功能（2-3周）
- [ ] 实现医学内容审核流程
- [ ] 开发内容模板系统
- [ ] 建立自动化工作流
- [ ] 创建质量保证流程

### 阶段3: 高级功能（3-4周）
- [ ] 开发内容管理工具
- [ ] 实现监控和报告系统
- [ ] 建立自动化测试套件
- [ ] 完善文档和培训材料

### 阶段4: 优化和维护（持续）
- [ ] 性能优化
- [ ] 功能增强
- [ ] 用户反馈收集
- [ ] 持续改进

## 总结

这个国际化标准化流程和规范将确保：

1. **医学准确性**: 通过专业审核流程保证医疗内容的准确性
2. **技术规范性**: 通过标准化工具和流程保证代码质量
3. **用户体验**: 通过一致性检查保证中英文版本功能一致
4. **可维护性**: 通过自动化工具和清晰文档降低维护成本
5. **可扩展性**: 通过模块化设计支持未来功能扩展

这个方案不仅解决了当前的问题，还为未来的国际化工作建立了坚实的基础。

