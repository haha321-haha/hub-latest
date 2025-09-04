#!/usr/bin/env node

/**
 * 为understanding-pain页面创建翻译键
 * 基于page.tsx的硬编码内容生成完整的翻译结构
 */

const fs = require('fs');
const path = require('path');

// 定义understanding-pain页面的翻译键结构
const understandingPainTranslations = {
  zh: {
    understandingPainPage: {
      meta: {
        title: "理解痛经 - 痛经健康指南",
        description: "深入了解痛经的原因、类型和生理机制，掌握科学的痛经知识基础。"
      },
      breadcrumb: {
        home: "首页",
        healthGuide: "痛经健康指南",
        currentPage: "理解痛经"
      },
      hero: {
        title: "理解痛经",
        description: "深入了解痛经的原因、类型和生理机制，为有效管理奠定科学基础。"
      },
      whatIsPain: {
        title: "什么是痛经？",
        description1: "痛经（Dysmenorrhea）是指在月经期间或月经前后出现的下腹部疼痛、痉挛或不适感。这是女性最常见的妇科症状之一，影响着全球约80%的育龄女性。",
        description2: "痛经的严重程度因人而异，从轻微的不适到严重影响日常生活的剧烈疼痛都有可能。了解痛经的本质是制定有效管理策略的第一步。"
      },
      types: {
        title: "痛经的类型",
        primary: {
          title: "原发性痛经",
          description: "原发性痛经是最常见的类型，通常在青春期开始后不久出现。这种疼痛是由子宫收缩引起的，没有潜在的病理原因。",
          symptoms: [
            "通常在月经开始前1-2天出现",
            "疼痛集中在下腹部和腰部",
            "可能伴有恶心、呕吐、腹泻",
            "疼痛持续1-3天"
          ]
        },
        secondary: {
          title: "继发性痛经",
          description: "继发性痛经是由潜在的妇科疾病引起的，通常在成年后出现或原有痛经突然加重。需要医疗评估和治疗。",
          symptoms: [
            "可能由子宫内膜异位症引起",
            "子宫肌瘤或腺肌症",
            "盆腔炎性疾病",
            "需要专业医疗诊断"
          ]
        }
      },
      mechanisms: {
        title: "生理机制",
        prostaglandins: {
          title: "前列腺素的作用",
          description: "前列腺素是引起痛经的主要生化因子。在月经期间，子宫内膜释放大量前列腺素，特别是PGF2α和PGE2，这些物质会导致子宫肌肉强烈收缩，压迫血管，减少血流，从而产生疼痛。"
        },
        painPathways: {
          title: "疼痛传导路径",
          description: "痛经的疼痛信号通过交感神经系统传导到脊髓，然后传递到大脑。这个过程涉及多个神经递质和受体，包括内啡肽、血清素等，这也解释了为什么某些治疗方法（如运动、冥想）能够有效缓解疼痛。"
        }
      },
      tcmAnalysis: {
        title: "中医证型分析",
        description: "根据症状特点，中医将痛经细分为几种主要证型，每种证型都有其独特的病理机制和治疗方法：",
        qiStagnation: {
          title: "气滞血瘀型",
          mainSymptoms: "胀痛、刺痛，经血色暗有块",
          painCharacteristics: "固定不移，拒按",
          treatmentPrinciple: "疏肝理气、活血化瘀"
        },
        coldCoagulation: {
          title: "寒凝血瘀型",
          mainSymptoms: "冷痛、绞痛，得热则舒",
          painCharacteristics: "遇寒加剧",
          treatmentPrinciple: "温经散寒、活血通络"
        },
        qiBloodDeficiency: {
          title: "气血虚弱型",
          mainSymptoms: "隐痛、坠痛，喜按",
          painCharacteristics: "疼痛较轻但持续时间长",
          treatmentPrinciple: "补气养血、调经止痛"
        },
        liverKidneyDeficiency: {
          title: "肝肾不足型",
          mainSymptoms: "腰膝酸软，经期提前或延后",
          painCharacteristics: "疼痛绵绵，喜温喜按",
          treatmentPrinciple: "滋补肝肾、调经止痛"
        }
      },
      riskFactors: {
        title: "风险因素",
        description: "了解痛经的风险因素有助于预防和早期干预：",
        factors: [
          "年龄：青春期和年轻女性更容易出现痛经",
          "家族史：有痛经家族史的女性风险更高",
          "生活方式：缺乏运动、压力大、饮食不规律",
          "体重：过轻或过重都可能增加痛经风险",
          "吸烟：吸烟会加重痛经症状"
        ]
      },
      whenToSeekHelp: {
        title: "何时需要就医",
        description: "虽然大多数痛经是正常的，但某些情况下需要及时就医：",
        warningSigns: [
          "疼痛突然加重或性质改变",
          "疼痛持续时间超过3天",
          "伴有发热、恶心、呕吐等严重症状",
          "影响日常生活和工作",
          "使用非处方药无效"
        ]
      },
      prevention: {
        title: "预防措施",
        description: "通过生活方式的调整，可以有效预防和减轻痛经：",
        measures: [
          "保持规律的运动习惯",
          "均衡饮食，减少咖啡因和糖分摄入",
          "学会压力管理技巧",
          "保持充足的睡眠",
          "避免吸烟和过量饮酒"
        ]
      },
      callToAction: {
        title: "开始您的健康管理之旅",
        description: "了解痛经是管理的第一步，接下来我们将为您提供更多实用的解决方案。",
        buttons: {
          learnMore: "了解更多",
          startTracking: "开始追踪",
          getHelp: "寻求帮助"
        }
      }
    }
  },
  en: {
    understandingPainPage: {
      meta: {
        title: "Understanding Menstrual Pain - Health Guide",
        description: "Deep dive into the causes, types, and physiological mechanisms of menstrual pain, master the scientific foundation of menstrual pain knowledge."
      },
      breadcrumb: {
        home: "Home",
        healthGuide: "Health Guide",
        currentPage: "Understanding Pain"
      },
      hero: {
        title: "Understanding Menstrual Pain",
        description: "Deep dive into the causes, types, and physiological mechanisms of menstrual pain to lay a scientific foundation for effective management."
      },
      whatIsPain: {
        title: "What is Menstrual Pain?",
        description1: "Dysmenorrhea refers to lower abdominal pain, cramping, or discomfort that occurs during or around menstruation. It is one of the most common gynecological symptoms, affecting approximately 80% of women of reproductive age worldwide.",
        description2: "The severity of menstrual pain varies from person to person, ranging from mild discomfort to severe pain that significantly impacts daily life. Understanding the nature of menstrual pain is the first step in developing effective management strategies."
      },
      types: {
        title: "Types of Menstrual Pain",
        primary: {
          title: "Primary Dysmenorrhea",
          description: "Primary dysmenorrhea is the most common type, usually appearing shortly after the onset of puberty. This pain is caused by uterine contractions and has no underlying pathological cause.",
          symptoms: [
            "Usually appears 1-2 days before menstruation begins",
            "Pain concentrated in lower abdomen and lower back",
            "May be accompanied by nausea, vomiting, diarrhea",
            "Pain lasts 1-3 days"
          ]
        },
        secondary: {
          title: "Secondary Dysmenorrhea",
          description: "Secondary dysmenorrhea is caused by underlying gynecological conditions, usually appearing in adulthood or when existing pain suddenly worsens. Requires medical evaluation and treatment.",
          symptoms: [
            "May be caused by endometriosis",
            "Uterine fibroids or adenomyosis",
            "Pelvic inflammatory disease",
            "Requires professional medical diagnosis"
          ]
        }
      },
      mechanisms: {
        title: "Physiological Mechanisms",
        prostaglandins: {
          title: "Role of Prostaglandins",
          description: "Prostaglandins are the primary biochemical factors causing menstrual pain. During menstruation, the endometrium releases large amounts of prostaglandins, particularly PGF2α and PGE2, which cause strong uterine muscle contractions, compress blood vessels, reduce blood flow, and thus generate pain."
        },
        painPathways: {
          title: "Pain Transmission Pathways",
          description: "Menstrual pain signals are transmitted through the sympathetic nervous system to the spinal cord and then to the brain. This process involves multiple neurotransmitters and receptors, including endorphins and serotonin, which explains why certain treatments (such as exercise and meditation) can effectively relieve pain."
        }
      },
      tcmAnalysis: {
        title: "Traditional Chinese Medicine Analysis",
        description: "Based on symptom characteristics, Traditional Chinese Medicine categorizes menstrual pain into several main syndrome types, each with unique pathological mechanisms and treatment approaches:",
        qiStagnation: {
          title: "Qi Stagnation and Blood Stasis",
          mainSymptoms: "Distending pain, stabbing pain, dark menstrual blood with clots",
          painCharacteristics: "Fixed location, worse with pressure",
          treatmentPrinciple: "Soothe liver qi, activate blood circulation"
        },
        coldCoagulation: {
          title: "Cold Coagulation and Blood Stasis",
          mainSymptoms: "Cold pain, cramping pain, relieved by warmth",
          painCharacteristics: "Worsened by cold",
          treatmentPrinciple: "Warm meridians, dispel cold, activate blood"
        },
        qiBloodDeficiency: {
          title: "Qi and Blood Deficiency",
          mainSymptoms: "Dull pain, bearing-down pain, likes pressure",
          painCharacteristics: "Mild but long-lasting pain",
          treatmentPrinciple: "Tonify qi and blood, regulate menstruation"
        },
        liverKidneyDeficiency: {
          title: "Liver and Kidney Deficiency",
          mainSymptoms: "Soreness in lower back and knees, irregular periods",
          painCharacteristics: "Dull continuous pain, likes warmth and pressure",
          treatmentPrinciple: "Tonify liver and kidney, regulate menstruation"
        }
      },
      riskFactors: {
        title: "Risk Factors",
        description: "Understanding risk factors for menstrual pain helps with prevention and early intervention:",
        factors: [
          "Age: Adolescent and young women are more prone to menstrual pain",
          "Family history: Women with a family history of menstrual pain have higher risk",
          "Lifestyle: Lack of exercise, high stress, irregular diet",
          "Weight: Being underweight or overweight can increase risk",
          "Smoking: Smoking can worsen menstrual pain symptoms"
        ]
      },
      whenToSeekHelp: {
        title: "When to Seek Medical Help",
        description: "While most menstrual pain is normal, certain situations require prompt medical attention:",
        warningSigns: [
          "Sudden worsening or change in pain nature",
          "Pain lasting more than 3 days",
          "Accompanied by fever, nausea, vomiting or other severe symptoms",
          "Affecting daily life and work",
          "Over-the-counter medications ineffective"
        ]
      },
      prevention: {
        title: "Prevention Measures",
        description: "Through lifestyle adjustments, menstrual pain can be effectively prevented and reduced:",
        measures: [
          "Maintain regular exercise habits",
          "Balanced diet, reduce caffeine and sugar intake",
          "Learn stress management techniques",
          "Get adequate sleep",
          "Avoid smoking and excessive alcohol consumption"
        ]
      },
      callToAction: {
        title: "Start Your Health Management Journey",
        description: "Understanding menstrual pain is the first step in management. Next, we'll provide you with more practical solutions.",
        buttons: {
          learnMore: "Learn More",
          startTracking: "Start Tracking",
          getHelp: "Get Help"
        }
      }
    }
  }
};

// 读取现有的翻译文件
function loadExistingTranslations() {
  const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  
  let zhTranslations = {};
  let enTranslations = {};
  
  try {
    if (fs.existsSync(zhPath)) {
      zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading zh.json:', error.message);
  }
  
  try {
    if (fs.existsSync(enPath)) {
      enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading en.json:', error.message);
  }
  
  return { zhTranslations, enTranslations };
}

// 合并翻译内容
function mergeTranslations() {
  const { zhTranslations, enTranslations } = loadExistingTranslations();
  
  // 合并understandingPainPage翻译
  zhTranslations.understandingPainPage = understandingPainTranslations.zh.understandingPainPage;
  enTranslations.understandingPainPage = understandingPainTranslations.en.understandingPainPage;
  
  return { zhTranslations, enTranslations };
}

// 保存翻译文件
function saveTranslations() {
  const { zhTranslations, enTranslations } = mergeTranslations();
  
  const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  
  try {
    fs.writeFileSync(zhPath, JSON.stringify(zhTranslations, null, 2), 'utf8');
    console.log('✅ 已更新 zh.json');
  } catch (error) {
    console.error('❌ 保存 zh.json 失败:', error.message);
  }
  
  try {
    fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2), 'utf8');
    console.log('✅ 已更新 en.json');
  } catch (error) {
    console.error('❌ 保存 en.json 失败:', error.message);
  }
}

// 运行脚本
if (require.main === module) {
  console.log('🚀 开始创建understanding-pain页面翻译键...');
  saveTranslations();
  console.log('✅ 翻译键创建完成！');
}

module.exports = { understandingPainTranslations, mergeTranslations, saveTranslations };
