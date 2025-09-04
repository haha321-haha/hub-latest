#!/usr/bin/env node

/**
 * 为relief-methods页面创建翻译键
 * 基于page.tsx的硬编码内容生成完整的翻译结构
 */

const fs = require('fs');
const path = require('path');

// 定义relief-methods页面的翻译键结构
const reliefMethodsTranslations = {
  zh: {
    reliefMethodsPage: {
      meta: {
        title: "A-Z缓解方法 - 痛经健康指南",
        description: "从A到Z的全面缓解方法，包括即时和长期策略，帮助您找到最适合的痛经管理方案。"
      },
      hero: {
        title: "A-Z缓解方法大全",
        description: "从A到Z的全面缓解方法，包括即时和长期策略，帮助您找到最适合的痛经管理方案。"
      },
      methods: {
        A: [
          {
            name: "穴位按摩 (Acupressure)",
            description: "通过按压特定穴位来缓解疼痛"
          },
          {
            name: "芳香疗法 (Aromatherapy)",
            description: "使用精油进行放松和疼痛缓解"
          }
        ],
        B: [
          {
            name: "呼吸练习 (Breathing Exercises)",
            description: "深呼吸技巧帮助放松和减轻疼痛"
          },
          {
            name: "八段锦 (Baduanjin)",
            description: "传统中医气功练习"
          }
        ],
        C: [
          {
            name: "冷敷 (Cold Therapy)",
            description: "适用于炎症性疼痛"
          },
          {
            name: "认知行为疗法 (CBT)",
            description: "改变对疼痛的认知和反应"
          }
        ],
        D: [
          {
            name: "饮食调整 (Diet Modification)",
            description: "抗炎饮食和营养补充"
          },
          {
            name: "舞蹈疗法 (Dance Therapy)",
            description: "通过舞蹈运动缓解疼痛"
          }
        ],
        E: [
          {
            name: "运动 (Exercise)",
            description: "适度运动促进血液循环"
          },
          {
            name: "精油按摩 (Essential Oil Massage)",
            description: "结合按摩和芳香疗法"
          }
        ],
        F: [
          {
            name: "足部反射疗法 (Foot Reflexology)",
            description: "通过足部按摩缓解全身疼痛"
          },
          {
            name: "纤维补充 (Fiber Supplements)",
            description: "改善肠道健康，减少炎症"
          }
        ],
        G: [
          {
            name: "生姜疗法 (Ginger Therapy)",
            description: "天然抗炎和止痛效果"
          },
          {
            name: "引导冥想 (Guided Meditation)",
            description: "通过冥想减轻疼痛感知"
          }
        ],
        H: [
          {
            name: "热疗 (Heat Therapy)",
            description: "使用热敷缓解肌肉紧张"
          },
          {
            name: "草药茶 (Herbal Tea)",
            description: "洋甘菊、薄荷等舒缓茶饮"
          }
        ],
        I: [
          {
            name: "冰敷疗法 (Ice Therapy)",
            description: "减少炎症和麻痹疼痛"
          },
          {
            name: "意象疗法 (Imagery Therapy)",
            description: "通过想象缓解疼痛"
          }
        ],
        J: [
          {
            name: "日记记录 (Journaling)",
            description: "记录疼痛模式和触发因素"
          },
          {
            name: "慢跑 (Jogging)",
            description: "轻度有氧运动促进血液循环"
          }
        ],
        K: [
          {
            name: "膝胸位 (Knee-to-Chest Position)",
            description: "缓解下腹部疼痛的体位"
          },
          {
            name: "昆达里尼瑜伽 (Kundalini Yoga)",
            description: "特殊的瑜伽练习形式"
          }
        ],
        L: [
          {
            name: "薰衣草精油 (Lavender Oil)",
            description: "放松和镇静效果"
          },
          {
            name: "生活方式调整 (Lifestyle Changes)",
            description: "改善整体健康状况"
          }
        ],
        M: [
          {
            name: "按摩疗法 (Massage Therapy)",
            description: "专业按摩缓解肌肉紧张"
          },
          {
            name: "正念冥想 (Mindfulness Meditation)",
            description: "专注当下，减轻疼痛感知"
          }
        ],
        N: [
          {
            name: "营养补充 (Nutritional Supplements)",
            description: "镁、维生素B等营养素"
          },
          {
            name: "自然疗法 (Natural Remedies)",
            description: "草药和天然治疗方法"
          }
        ],
        O: [
          {
            name: "Omega-3脂肪酸 (Omega-3 Fatty Acids)",
            description: "抗炎和疼痛缓解效果"
          },
          {
            name: "有机食品 (Organic Foods)",
            description: "减少化学物质摄入"
          }
        ],
        P: [
          {
            name: "渐进性肌肉放松 (Progressive Muscle Relaxation)",
            description: "系统性放松肌肉群"
          },
          {
            name: "普拉提 (Pilates)",
            description: "核心力量和柔韧性训练"
          }
        ],
        Q: [
          {
            name: "气功 (Qigong)",
            description: "中医传统运动疗法"
          },
          {
            name: "安静休息 (Quiet Rest)",
            description: "在安静环境中休息恢复"
          }
        ],
        R: [
          {
            name: "放松技巧 (Relaxation Techniques)",
            description: "各种放松身心的方法"
          },
          {
            name: "反射疗法 (Reflexology)",
            description: "通过反射点缓解疼痛"
          }
        ],
        S: [
          {
            name: "拉伸运动 (Stretching)",
            description: "温和的拉伸缓解肌肉紧张"
          },
          {
            name: "睡眠优化 (Sleep Optimization)",
            description: "改善睡眠质量促进恢复"
          }
        ],
        T: [
          {
            name: "太极 (Tai Chi)",
            description: "缓慢流畅的运动练习"
          },
          {
            name: "茶疗 (Tea Therapy)",
            description: "药用茶饮缓解症状"
          }
        ],
        U: [
          {
            name: "超声波疗法 (Ultrasound Therapy)",
            description: "深层组织加热治疗"
          },
          {
            name: "理解教育 (Understanding Education)",
            description: "了解痛经机制减少焦虑"
          }
        ],
        V: [
          {
            name: "可视化技巧 (Visualization)",
            description: "心理意象缓解疼痛"
          },
          {
            name: "维生素疗法 (Vitamin Therapy)",
            description: "补充必需维生素"
          }
        ],
        W: [
          {
            name: "温水浴 (Warm Bath)",
            description: "温水浸泡放松肌肉"
          },
          {
            name: "步行 (Walking)",
            description: "轻度运动促进血液循环"
          }
        ],
        X: [
          {
            name: "X光检查 (X-ray Examination)",
            description: "排除器质性病变"
          },
          {
            name: "X因子补充 (X Factor Supplement)",
            description: "特殊营养素补充"
          }
        ],
        Y: [
          {
            name: "瑜伽 (Yoga)",
            description: "身心合一的练习"
          },
          {
            name: "瑜伽冥想 (Yoga Meditation)",
            description: "结合瑜伽和冥想的练习"
          }
        ],
        Z: [
          {
            name: "零压力 (Zero Stress)",
            description: "完全放松的状态"
          },
          {
            name: "禅修 (Zen Meditation)",
            description: "深度冥想练习"
          }
        ]
      },
      categories: {
        immediate: {
          title: "即时缓解",
          description: "痛经发作时立即可以尝试的方法"
        },
        longTerm: {
          title: "长期调理",
          description: "需要持续练习才能见效的方法"
        },
        professional: {
          title: "专业治疗",
          description: "需要专业指导或医疗监督的方法"
        }
      },
      tips: {
        title: "使用建议",
        description: "如何选择和使用这些缓解方法",
        suggestions: [
          "根据疼痛程度选择合适的方法",
          "结合多种方法效果更佳",
          "坚持练习才能看到长期效果",
          "如有疑问请咨询专业医生"
        ]
      }
    }
  },
  en: {
    reliefMethodsPage: {
      meta: {
        title: "A-Z Relief Methods - Health Guide",
        description: "Comprehensive relief methods from A to Z, including immediate and long-term strategies to help you find the most suitable menstrual pain management plan."
      },
      hero: {
        title: "A-Z Relief Methods Guide",
        description: "Comprehensive relief methods from A to Z, including immediate and long-term strategies to help you find the most suitable menstrual pain management plan."
      },
      methods: {
        A: [
          {
            name: "Acupressure",
            description: "Relieve pain by pressing specific acupoints"
          },
          {
            name: "Aromatherapy",
            description: "Use essential oils for relaxation and pain relief"
          }
        ],
        B: [
          {
            name: "Breathing Exercises",
            description: "Deep breathing techniques help relax and reduce pain"
          },
          {
            name: "Baduanjin",
            description: "Traditional Chinese qigong practice"
          }
        ],
        C: [
          {
            name: "Cold Therapy",
            description: "Suitable for inflammatory pain"
          },
          {
            name: "Cognitive Behavioral Therapy",
            description: "Change cognition and response to pain"
          }
        ],
        D: [
          {
            name: "Diet Modification",
            description: "Anti-inflammatory diet and nutritional supplements"
          },
          {
            name: "Dance Therapy",
            description: "Relieve pain through dance movement"
          }
        ],
        E: [
          {
            name: "Exercise",
            description: "Moderate exercise promotes blood circulation"
          },
          {
            name: "Essential Oil Massage",
            description: "Combine massage and aromatherapy"
          }
        ],
        F: [
          {
            name: "Foot Reflexology",
            description: "Relieve whole body pain through foot massage"
          },
          {
            name: "Fiber Supplements",
            description: "Improve gut health and reduce inflammation"
          }
        ],
        G: [
          {
            name: "Ginger Therapy",
            description: "Natural anti-inflammatory and pain relief effects"
          },
          {
            name: "Guided Meditation",
            description: "Reduce pain perception through meditation"
          }
        ],
        H: [
          {
            name: "Heat Therapy",
            description: "Use heat to relieve muscle tension"
          },
          {
            name: "Herbal Tea",
            description: "Soothing teas like chamomile and mint"
          }
        ],
        I: [
          {
            name: "Ice Therapy",
            description: "Reduce inflammation and numb pain"
          },
          {
            name: "Imagery Therapy",
            description: "Relieve pain through visualization"
          }
        ],
        J: [
          {
            name: "Journaling",
            description: "Track pain patterns and triggers"
          },
          {
            name: "Jogging",
            description: "Light aerobic exercise promotes circulation"
          }
        ],
        K: [
          {
            name: "Knee-to-Chest Position",
            description: "Position to relieve lower abdominal pain"
          },
          {
            name: "Kundalini Yoga",
            description: "Special form of yoga practice"
          }
        ],
        L: [
          {
            name: "Lavender Oil",
            description: "Relaxing and calming effects"
          },
          {
            name: "Lifestyle Changes",
            description: "Improve overall health condition"
          }
        ],
        M: [
          {
            name: "Massage Therapy",
            description: "Professional massage to relieve muscle tension"
          },
          {
            name: "Mindfulness Meditation",
            description: "Focus on present moment, reduce pain perception"
          }
        ],
        N: [
          {
            name: "Nutritional Supplements",
            description: "Nutrients like magnesium and vitamin B"
          },
          {
            name: "Natural Remedies",
            description: "Herbal and natural treatment methods"
          }
        ],
        O: [
          {
            name: "Omega-3 Fatty Acids",
            description: "Anti-inflammatory and pain relief effects"
          },
          {
            name: "Organic Foods",
            description: "Reduce chemical intake"
          }
        ],
        P: [
          {
            name: "Progressive Muscle Relaxation",
            description: "Systematically relax muscle groups"
          },
          {
            name: "Pilates",
            description: "Core strength and flexibility training"
          }
        ],
        Q: [
          {
            name: "Qigong",
            description: "Traditional Chinese movement therapy"
          },
          {
            name: "Quiet Rest",
            description: "Rest and recover in quiet environment"
          }
        ],
        R: [
          {
            name: "Relaxation Techniques",
            description: "Various methods to relax body and mind"
          },
          {
            name: "Reflexology",
            description: "Relieve pain through reflex points"
          }
        ],
        S: [
          {
            name: "Stretching",
            description: "Gentle stretching to relieve muscle tension"
          },
          {
            name: "Sleep Optimization",
            description: "Improve sleep quality to promote recovery"
          }
        ],
        T: [
          {
            name: "Tai Chi",
            description: "Slow and flowing movement practice"
          },
          {
            name: "Tea Therapy",
            description: "Medicinal teas to relieve symptoms"
          }
        ],
        U: [
          {
            name: "Ultrasound Therapy",
            description: "Deep tissue heating treatment"
          },
          {
            name: "Understanding Education",
            description: "Understanding pain mechanisms reduces anxiety"
          }
        ],
        V: [
          {
            name: "Visualization",
            description: "Mental imagery for pain relief"
          },
          {
            name: "Vitamin Therapy",
            description: "Supplement essential vitamins"
          }
        ],
        W: [
          {
            name: "Warm Bath",
            description: "Warm water soaking to relax muscles"
          },
          {
            name: "Walking",
            description: "Light exercise to promote circulation"
          }
        ],
        X: [
          {
            name: "X-ray Examination",
            description: "Exclude organic lesions"
          },
          {
            name: "X Factor Supplement",
            description: "Special nutrient supplementation"
          }
        ],
        Y: [
          {
            name: "Yoga",
            description: "Mind-body practice"
          },
          {
            name: "Yoga Meditation",
            description: "Combined yoga and meditation practice"
          }
        ],
        Z: [
          {
            name: "Zero Stress",
            description: "Complete relaxation state"
          },
          {
            name: "Zen Meditation",
            description: "Deep meditation practice"
          }
        ]
      },
      categories: {
        immediate: {
          title: "Immediate Relief",
          description: "Methods you can try immediately when menstrual pain occurs"
        },
        longTerm: {
          title: "Long-term Conditioning",
          description: "Methods that require consistent practice to see results"
        },
        professional: {
          title: "Professional Treatment",
          description: "Methods that require professional guidance or medical supervision"
        }
      },
      tips: {
        title: "Usage Tips",
        description: "How to choose and use these relief methods",
        suggestions: [
          "Choose appropriate methods based on pain level",
          "Combining multiple methods works better",
          "Consistent practice is needed for long-term results",
          "Consult a professional doctor if you have questions"
        ]
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
  
  // 合并reliefMethodsPage翻译
  zhTranslations.reliefMethodsPage = reliefMethodsTranslations.zh.reliefMethodsPage;
  enTranslations.reliefMethodsPage = reliefMethodsTranslations.en.reliefMethodsPage;
  
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
  console.log('🚀 开始创建relief-methods页面翻译键...');
  saveTranslations();
  console.log('✅ 翻译键创建完成！');
}

module.exports = { reliefMethodsTranslations, mergeTranslations, saveTranslations };
