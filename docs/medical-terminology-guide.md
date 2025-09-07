# 医学术语处理规范 - 北美市场

## 概述

本规范专门针对北美市场的Period Hub项目，确保医学术语的准确性、一致性和专业性。

## 核心原则

1. **准确性优先**: 所有医学术语必须准确无误
2. **循证医学**: 基于最新的医学研究和指南
3. **用户友好**: 确保普通用户能够理解
4. **文化适应**: 考虑北美用户的文化背景

## 医学术语分类

### 1. 症状相关 (Symptoms)
```json
{
  "medical": {
    "symptoms": {
      "dysmenorrhea": {
        "en": "Dysmenorrhea",
        "zh": "痛经",
        "definition": "Painful menstrual periods",
        "severity": "primary|secondary"
      },
      "endometriosis": {
        "en": "Endometriosis",
        "zh": "子宫内膜异位症",
        "definition": "Condition where tissue similar to the lining of the uterus grows outside the uterus",
        "severity": "mild|moderate|severe"
      }
    }
  }
}
```

### 2. 治疗方法 (Treatments)
```json
{
  "medical": {
    "treatments": {
      "heatTherapy": {
        "en": "Heat Therapy",
        "zh": "热敷疗法",
        "description": "Application of heat to relieve pain",
        "temperature": "40-45°C",
        "duration": "15-20 minutes"
      },
      "acupuncture": {
        "en": "Acupuncture",
        "zh": "针灸",
        "description": "Traditional Chinese medicine technique using thin needles",
        "frequency": "1-2 times per week",
        "duration": "20-30 minutes per session"
      }
    }
  }
}
```

### 3. 药物信息 (Medications)
```json
{
  "medical": {
    "medications": {
      "ibuprofen": {
        "en": "Ibuprofen",
        "zh": "布洛芬",
        "dosage": "400-600mg every 6-8 hours",
        "maxDaily": "2400mg",
        "warnings": ["Do not exceed recommended dose", "Consult doctor if symptoms persist"]
      },
      "acetaminophen": {
        "en": "Acetaminophen",
        "zh": "对乙酰氨基酚",
        "dosage": "500-1000mg every 4-6 hours",
        "maxDaily": "4000mg",
        "warnings": ["Do not exceed recommended dose", "Avoid with alcohol"]
      }
    }
  }
}
```

### 4. 安全警告 (Safety Warnings)
```json
{
  "medical": {
    "warnings": {
      "high": {
        "en": "Seek immediate medical attention if you experience severe pain, fever, or unusual symptoms",
        "zh": "如出现剧烈疼痛、发烧或异常症状，请立即就医"
      },
      "medium": {
        "en": "Consult your healthcare provider if symptoms persist or worsen",
        "zh": "如症状持续或加重，请咨询医疗保健提供者"
      },
      "low": {
        "en": "Monitor your symptoms and consult a healthcare provider if needed",
        "zh": "监测症状，如需要请咨询医疗保健提供者"
      }
    }
  }
}
```

## 术语标准化

### 1. 核心医学术语表
```typescript
const coreMedicalTerms = {
  // 症状
  symptoms: {
    dysmenorrhea: { en: "Dysmenorrhea", zh: "痛经" },
    endometriosis: { en: "Endometriosis", zh: "子宫内膜异位症" },
    menorrhagia: { en: "Menorrhagia", zh: "月经过多" },
    amenorrhea: { en: "Amenorrhea", zh: "闭经" }
  },
  
  // 治疗方法
  treatments: {
    heatTherapy: { en: "Heat Therapy", zh: "热敷疗法" },
    acupuncture: { en: "Acupuncture", zh: "针灸" },
    massage: { en: "Massage", zh: "按摩" },
    yoga: { en: "Yoga", zh: "瑜伽" },
    aromatherapy: { en: "Aromatherapy", zh: "芳香疗法" }
  },
  
  // 药物
  medications: {
    ibuprofen: { en: "Ibuprofen", zh: "布洛芬" },
    acetaminophen: { en: "Acetaminophen", zh: "对乙酰氨基酚" },
    naproxen: { en: "Naproxen", zh: "萘普生" }
  }
};
```

### 2. 术语验证规则
```typescript
const validationRules = {
  // 医学术语必须包含定义
  requiresDefinition: true,
  
  // 药物信息必须包含剂量
  requiresDosage: true,
  
  // 治疗方法必须包含安全信息
  requiresSafetyInfo: true,
  
  // 警告级别必须明确
  requiresWarningLevel: true
};
```

## 内容审核流程

### 1. 自动检测
```typescript
class MedicalContentDetector {
  // 检测医学术语
  detectMedicalTerms(text: string): string[] {
    const terms = [];
    
    // 检测症状术语
    Object.keys(coreMedicalTerms.symptoms).forEach(term => {
      if (text.includes(term) || text.includes(coreMedicalTerms.symptoms[term].zh)) {
        terms.push(term);
      }
    });
    
    // 检测治疗方法术语
    Object.keys(coreMedicalTerms.treatments).forEach(term => {
      if (text.includes(term) || text.includes(coreMedicalTerms.treatments[term].zh)) {
        terms.push(term);
      }
    });
    
    return terms;
  }
  
  // 检测药物信息
  detectMedicationInfo(text: string): boolean {
    const medicationKeywords = ['mg', 'dosage', 'dose', 'tablet', 'capsule'];
    return medicationKeywords.some(keyword => text.includes(keyword));
  }
  
  // 检测安全警告
  detectSafetyWarnings(text: string): boolean {
    const warningKeywords = ['warning', 'caution', 'danger', 'side effect', 'contraindication'];
    return warningKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }
}
```

### 2. 审核标准
```typescript
interface MedicalAuditCriteria {
  // 准确性检查
  accuracy: {
    terminologyCorrect: boolean;
    dosageAccurate: boolean;
    safetyInfoComplete: boolean;
  };
  
  // 完整性检查
  completeness: {
    hasDefinition: boolean;
    hasDosage: boolean;
    hasWarnings: boolean;
  };
  
  // 一致性检查
  consistency: {
    terminologyConsistent: boolean;
    formatConsistent: boolean;
    styleConsistent: boolean;
  };
}
```

## 北美市场特殊考虑

### 1. 文化适应性
```json
{
  "cultural": {
    "measurements": {
      "temperature": "Fahrenheit (°F) for user display, Celsius (°C) for medical accuracy",
      "weight": "Pounds (lbs) for user display, Kilograms (kg) for medical accuracy",
      "height": "Feet and inches for user display, Centimeters (cm) for medical accuracy"
    },
    "language": {
      "tone": "Professional but approachable",
      "style": "Clear and concise",
      "avoid": "Medical jargon without explanation"
    }
  }
}
```

### 2. 法律合规
```json
{
  "legal": {
    "disclaimers": {
      "medical": "This information is for educational purposes only and should not replace professional medical advice",
      "liability": "Period Hub is not responsible for any health outcomes",
      "consultation": "Always consult with a qualified healthcare provider"
    },
    "fda": {
      "compliance": "All medical information must comply with FDA guidelines",
      "claims": "No unsubstantiated health claims",
      "evidence": "All treatments must be evidence-based"
    }
  }
}
```

## 质量保证

### 1. 自动验证
```typescript
class MedicalContentValidator {
  // 验证医学术语
  validateMedicalTerms(content: string): ValidationResult {
    const issues = [];
    
    // 检查术语准确性
    const terms = this.detectMedicalTerms(content);
    terms.forEach(term => {
      if (!this.isValidTerm(term)) {
        issues.push(`Invalid medical term: ${term}`);
      }
    });
    
    // 检查药物信息
    if (this.detectMedicationInfo(content)) {
      if (!this.hasDosageInfo(content)) {
        issues.push('Medication information missing dosage');
      }
      if (!this.hasSafetyWarnings(content)) {
        issues.push('Medication information missing safety warnings');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
```

### 2. 人工审核
```typescript
interface MedicalAuditProcess {
  // 审核人员要求
  auditor: {
    qualifications: "Medical degree or relevant healthcare experience",
    training: "Period Hub medical content guidelines",
    certification: "Annual medical content review certification"
  };
  
  // 审核流程
  process: {
    step1: "Automatic detection and flagging",
    step2: "Professional medical review",
    step3: "Quality assurance check",
    step4: "Final approval and publication"
  };
  
  // 审核标准
  standards: {
    accuracy: "100% medical accuracy required",
    completeness: "All required information present",
    consistency: "Consistent with medical guidelines"
  };
}
```

## 工具和资源

### 1. 医学术语数据库
```typescript
// 医学术语数据库
const medicalTerminologyDB = {
  // 症状数据库
  symptoms: {
    dysmenorrhea: {
      definition: "Painful menstrual periods",
      causes: ["Primary", "Secondary"],
      treatments: ["NSAIDs", "Heat therapy", "Exercise"],
      severity: ["Mild", "Moderate", "Severe"]
    }
  },
  
  // 治疗方法数据库
  treatments: {
    heatTherapy: {
      effectiveness: "High",
      safety: "Very safe",
      evidence: "Strong evidence",
      contraindications: ["Burns", "Open wounds"]
    }
  }
};
```

### 2. 验证工具
```bash
# 医学术语验证
./scripts/validate-medical-terms.js

# 药物信息检查
./scripts/check-medication-info.js

# 安全警告验证
./scripts/validate-safety-warnings.js
```

## 实施指南

### 1. 内容创建流程
1. **识别医学术语**: 自动检测内容中的医学术语
2. **验证准确性**: 对照医学术语数据库验证
3. **添加必要信息**: 确保包含定义、剂量、警告等
4. **专业审核**: 由医疗专业人士审核
5. **质量检查**: 最终质量保证检查

### 2. 维护流程
1. **定期更新**: 根据最新医学研究更新术语
2. **用户反馈**: 收集用户反馈并改进
3. **合规检查**: 确保符合FDA和其他法规要求
4. **性能监控**: 监控内容效果和用户满意度

## 总结

这个医学术语处理规范确保：

1. **准确性**: 所有医学术语都经过专业验证
2. **一致性**: 在整个应用中保持术语一致
3. **合规性**: 符合北美市场的法规要求
4. **用户友好**: 确保普通用户能够理解
5. **可维护性**: 建立清晰的维护流程

遵循这个规范将确保Period Hub项目在北美市场的医学内容专业、准确且合规。

