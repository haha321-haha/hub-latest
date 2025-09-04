#!/usr/bin/env node

/**
 * 为natural-therapies页面创建翻译键
 * 基于page-original.tsx的硬编码内容生成完整的翻译结构
 */

const fs = require('fs');
const path = require('path');

// 定义natural-therapies页面的翻译键结构
const naturalTherapiesTranslations = {
  zh: {
    naturalTherapiesPage: {
      meta: {
        title: "平时调理方案",
        description: "温和的自然方法和生活方式调整，帮助您长期改善痛经问题",
        keywords: "痛经调理,自然疗法,平时调理,经期健康,生活方式调整"
      },
      hero: {
        title: "平时调理方案",
        subtitle: "温和的自然方法和生活方式调整",
        description: "通过科学的生活方式调整和自然疗法，帮助您长期改善痛经问题，建立健康的生活习惯"
      },
      disclaimer: {
        title: "重要医疗免责声明",
        content: "以下信息仅供参考，不能替代专业医疗建议。在尝试任何新的治疗方法前，请务必咨询您的医生。",
        warning: "以下情况请立即就医：",
        conditions: [
          "严重或持续的痛经症状",
          "正在服用处方药物",
          "有慢性疾病或过敏史",
          "怀孕或哺乳期",
          "症状突然加重或性质改变"
        ],
        note: "每个人的身体状况不同，请根据自身情况谨慎选择适合的方法。"
      },
      navigation: {
        title: "快速导航",
        painAssessment: "痛经自测",
        emergencyRelief: "5分钟急救",
        therapyOverview: "疗法概述",
        toolDownloads: "工具下载"
      },
      painAssessment: {
        title: "痛经程度自测",
        description: "了解您的痛经程度，选择最适合的调理方案",
        useExistingTool: "使用现有的痛经评估工具",
        toolDescription: "我们提供专业的痛经评估工具，帮助您准确了解自己的痛经程度",
        startAssessment: "开始痛经评估"
      },
      emergencyRelief: {
        title: "5分钟急救方案",
        description: "痛经发作时的快速缓解方法",
        heatTherapy: {
          title: "立即热敷",
          steps: [
            "热水袋放在下腹部",
            "温度40-45°C，持续15分钟",
            "可同时热敷腰部"
          ]
        },
        breathing: {
          title: "深呼吸放松",
          steps: [
            "腹式呼吸，吸气4秒",
            "屏息4秒，呼气6秒",
            "重复10次"
          ]
        },
        massage: {
          title: "穴位按摩",
          steps: [
            "按压关元穴（脐下3寸）",
            "按压三阴交（内踝上3寸）",
            "每个穴位按压2-3分钟"
          ]
        }
      },
      therapies: {
        title: "痛经自然疗法大全",
        description: "基于循证医学的自然疗法，帮助您找到最适合的调理方法",
        categories: {
          physical: {
            title: "物理疗法",
            subtitle: "热敷、按摩、TENS等",
            description: "通过物理手段缓解疼痛，改善血液循环"
          },
          herbal: {
            title: "草药疗法",
            subtitle: "草药茶、中药、补充剂等",
            description: "利用天然植物的药用价值，温和调理身体"
          },
          dietary: {
            title: "饮食调整",
            subtitle: "抗炎饮食、营养补充等",
            description: "通过科学饮食调节激素平衡，减少炎症"
          },
          yoga: {
            title: "瑜伽运动",
            subtitle: "瑜伽体式、温和运动等",
            description: "规律运动促进内啡肽释放，改善血液循环"
          },
          aromatherapy: {
            title: "芳香疗法",
            subtitle: "精油按摩、香薰等",
            description: "慢性压力是痛经加重的重要因素"
          },
          acupuncture: {
            title: "针灸艾灸",
            subtitle: "传统中医疗法",
            description: "优质睡眠是激素平衡的基础"
          },
          psychological: {
            title: "心理调节",
            subtitle: "冥想、呼吸法等",
            description: "通过心理调节减少压力，改善整体健康状况"
          },
          comprehensive: {
            title: "综合方案",
            subtitle: "个性化组合疗法",
            description: "结合多种方法，制定个性化的调理方案"
          }
        },
        methods: {
          nutrition: {
            title: "营养疗法",
            subtitle: "通过科学饮食调节激素平衡，减少炎症"
          },
          exercise: {
            title: "运动疗法",
            subtitle: "规律运动促进内啡肽释放，改善血液循环"
          },
          stress: {
            title: "压力管理",
            subtitle: "慢性压力是痛经加重的重要因素"
          },
          sleep: {
            title: "睡眠优化",
            subtitle: "优质睡眠是激素平衡的基础"
          }
        }
      },
      sections: {
        longTermImprovement: {
          title: "长期改善",
          description: "通过持续的生活方式调整，从根本上改善痛经问题"
        },
        quickRelief: {
          title: "快速缓解",
          description: "痛经发作时的紧急处理方法"
        },
        prevention: {
          title: "预防措施",
          description: "日常生活中的预防性调理方法"
        }
      },
      buttons: {
        learnMore: "了解更多",
        startNow: "立即开始",
        downloadGuide: "下载指南",
        shareExperience: "分享经验"
      }
    }
  },
  en: {
    naturalTherapiesPage: {
      meta: {
        title: "Daily Conditioning Plan",
        description: "Gentle natural methods and lifestyle adjustments to help you improve menstrual pain long-term",
        keywords: "menstrual pain relief, natural therapy, daily conditioning, menstrual health, lifestyle adjustment"
      },
      hero: {
        title: "Daily Conditioning Plan",
        subtitle: "Gentle natural methods and lifestyle adjustments",
        description: "Through scientific lifestyle adjustments and natural therapies, help you improve menstrual pain long-term and establish healthy habits"
      },
      disclaimer: {
        title: "Important Medical Disclaimer",
        content: "The following information is for reference only and cannot replace professional medical advice. Please consult your doctor before trying any new treatment methods.",
        warning: "Please seek medical attention immediately in the following situations:",
        conditions: [
          "Severe or persistent menstrual pain symptoms",
          "Currently taking prescription medications",
          "History of chronic diseases or allergies",
          "Pregnancy or breastfeeding",
          "Sudden worsening or change in symptom nature"
        ],
        note: "Everyone's physical condition is different, please choose appropriate methods carefully according to your own situation."
      },
      navigation: {
        title: "Quick Navigation",
        painAssessment: "Pain Assessment",
        emergencyRelief: "5-Min Emergency",
        therapyOverview: "Therapy Overview",
        toolDownloads: "Tool Downloads"
      },
      painAssessment: {
        title: "Menstrual Pain Assessment",
        description: "Understand your pain level and choose the most suitable conditioning plan",
        useExistingTool: "Use Existing Pain Assessment Tool",
        toolDescription: "We provide professional menstrual pain assessment tools to help you accurately understand your pain level",
        startAssessment: "Start Pain Assessment"
      },
      emergencyRelief: {
        title: "5-Minute Emergency Relief",
        description: "Quick relief methods when menstrual pain occurs",
        heatTherapy: {
          title: "Immediate Heat Therapy",
          steps: [
            "Place hot water bottle on lower abdomen",
            "Temperature 40-45°C, for 15 minutes",
            "Can simultaneously apply to lower back"
          ]
        },
        breathing: {
          title: "Deep Breathing Relaxation",
          steps: [
            "Abdominal breathing, inhale for 4 seconds",
            "Hold for 4 seconds, exhale for 6 seconds",
            "Repeat 10 times"
          ]
        },
        massage: {
          title: "Acupressure Massage",
          steps: [
            "Press Guanyuan point (3 inches below navel)",
            "Press Sanyinjiao point (3 inches above inner ankle)",
            "Press each point for 2-3 minutes"
          ]
        }
      },
      therapies: {
        title: "Complete Guide to Natural Menstrual Pain Relief",
        description: "Evidence-based natural therapies to help you find the most suitable conditioning methods",
        categories: {
          physical: {
            title: "Physical Therapy",
            subtitle: "Heat therapy, massage, TENS, etc.",
            description: "Relieve pain through physical means and improve blood circulation"
          },
          herbal: {
            title: "Herbal Therapy",
            subtitle: "Herbal teas, TCM, supplements, etc.",
            description: "Utilize the medicinal value of natural plants for gentle body conditioning"
          },
          dietary: {
            title: "Dietary Adjustment",
            subtitle: "Anti-inflammatory diet, nutrition, etc.",
            description: "Regulate hormonal balance and reduce inflammation through scientific diet"
          },
          yoga: {
            title: "Yoga & Exercise",
            subtitle: "Yoga poses, gentle exercise, etc.",
            description: "Regular exercise promotes endorphin release and improves circulation"
          },
          aromatherapy: {
            title: "Aromatherapy",
            subtitle: "Essential oil massage, diffusion, etc.",
            description: "Chronic stress is an important factor in worsening menstrual pain"
          },
          acupuncture: {
            title: "Acupuncture & Moxibustion",
            subtitle: "Traditional Chinese medicine",
            description: "Quality sleep is the foundation of hormonal balance"
          },
          psychological: {
            title: "Psychological Techniques",
            subtitle: "Meditation, breathing techniques, etc.",
            description: "Reduce stress through psychological regulation and improve overall health"
          },
          comprehensive: {
            title: "Comprehensive Plans",
            subtitle: "Personalized combination therapy",
            description: "Combine multiple methods to create personalized conditioning plans"
          }
        },
        methods: {
          nutrition: {
            title: "Nutritional Therapy",
            subtitle: "Regulate hormonal balance and reduce inflammation through scientific diet"
          },
          exercise: {
            title: "Exercise Therapy",
            subtitle: "Regular exercise promotes endorphin release and improves circulation"
          },
          stress: {
            title: "Stress Management",
            subtitle: "Chronic stress is an important factor in worsening menstrual pain"
          },
          sleep: {
            title: "Sleep Optimization",
            subtitle: "Quality sleep is the foundation of hormonal balance"
          }
        }
      },
      sections: {
        longTermImprovement: {
          title: "Long-term Improvement",
          description: "Fundamentally improve menstrual pain through continuous lifestyle adjustments"
        },
        quickRelief: {
          title: "Quick Relief",
          description: "Emergency treatment methods when menstrual pain occurs"
        },
        prevention: {
          title: "Prevention Measures",
          description: "Preventive conditioning methods in daily life"
        }
      },
      buttons: {
        learnMore: "Learn More",
        startNow: "Start Now",
        downloadGuide: "Download Guide",
        shareExperience: "Share Experience"
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
  
  // 合并naturalTherapiesPage翻译
  zhTranslations.naturalTherapiesPage = naturalTherapiesTranslations.zh.naturalTherapiesPage;
  enTranslations.naturalTherapiesPage = naturalTherapiesTranslations.en.naturalTherapiesPage;
  
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
  console.log('🚀 开始创建natural-therapies页面翻译键...');
  saveTranslations();
  console.log('✅ 翻译键创建完成！');
}

module.exports = { naturalTherapiesTranslations, mergeTranslations, saveTranslations };
