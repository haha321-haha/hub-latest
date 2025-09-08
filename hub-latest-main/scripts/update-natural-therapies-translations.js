#!/usr/bin/env node

/**
 * 更新natural-therapies页面的完整翻译键
 * 基于修复后的page-fixed.tsx创建完整的翻译结构
 */

const fs = require('fs');
const path = require('path');

// 完整的natural-therapies页面翻译键
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
            description: "物理疗法通过外部物理手段改善血液循环、缓解肌肉紧张，是最直接有效的痛经缓解方法。",
            methods: {
              heatTherapy: {
                name: "热敷疗法",
                description: "使用热水袋、暖宫贴等，温度40-45°C，每次15-20分钟"
              },
              massage: {
                name: "按摩疗法",
                description: "腹部顺时针按摩、腰部按压，促进血液循环"
              },
              tens: {
                name: "TENS疗法",
                description: "经皮神经电刺激，阻断疼痛信号传导"
              },
              warmBath: {
                name: "温水浴",
                description: "38-40°C温水浸泡15-20分钟，全身放松"
              }
            }
          },
          herbal: {
            title: "草药疗法",
            subtitle: "草药茶、中药、补充剂等",
            description: "草药疗法利用植物的天然活性成分调节激素平衡、减少炎症，是温和而有效的调理方式。",
            methods: {
              gingerTea: {
                name: "姜茶",
                description: "生姜具有抗炎作用，每日2-3杯温姜茶"
              },
              angelicaTonic: {
                name: "当归补血汤",
                description: "传统中药方剂，调理气血，建议咨询中医师"
              },
              chamomileTea: {
                name: "洋甘菊茶",
                description: "具有镇静和抗痉挛作用，睡前饮用"
              },
              eveningPrimrose: {
                name: "月见草油",
                description: "富含γ-亚麻酸，调节前列腺素平衡"
              }
            }
          },
          dietary: {
            title: "饮食调整",
            subtitle: "抗炎饮食、营养补充等",
            description: "通过科学的饮食调整，补充关键营养素，减少炎症反应，从根本上改善痛经症状。",
            methods: {
              omega3: {
                name: "增加Omega-3",
                description: "深海鱼、亚麻籽、核桃等，每周2-3次"
              },
              magnesium: {
                name: "补充镁元素",
                description: "黑巧克力、香蕉、杏仁，每日300-400mg"
              },
              reduceSugar: {
                name: "减少糖分摄入",
                description: "避免精制糖和加工食品，稳定血糖"
              },
              increaseFiber: {
                name: "增加纤维",
                description: "全谷物、蔬菜水果，促进激素代谢"
              }
            }
          },
          yoga: {
            title: "瑜伽运动",
            subtitle: "瑜伽体式、温和运动等",
            description: "通过规律的运动练习，促进内啡肽释放，改善血液循环，缓解痛经症状。",
            methods: {
              yogaPoses: {
                name: "瑜伽体式",
                description: "猫式、婴儿式、蝴蝶式等舒缓体式"
              },
              breathing: {
                name: "呼吸练习",
                description: "腹式呼吸、4-7-8呼吸法等放松技巧"
              },
              meditation: {
                name: "冥想练习",
                description: "正念冥想，专注当下，减少压力"
              },
              gentleExercise: {
                name: "温和运动",
                description: "散步、游泳、太极等低强度运动"
              }
            }
          },
          aromatherapy: {
            title: "芳香疗法",
            subtitle: "精油按摩、香薰等",
            description: "利用精油的芳香分子，通过嗅觉和皮肤吸收，调节情绪和生理功能。",
            methods: {
              essentialOils: {
                name: "精油选择",
                description: "薰衣草、洋甘菊、玫瑰等舒缓精油"
              },
              diffusion: {
                name: "香薰扩散",
                description: "使用香薰机或扩香石，营造舒缓环境"
              },
              massage: {
                name: "精油按摩",
                description: "稀释后按摩腹部和腰部，促进血液循环"
              },
              bath: {
                name: "芳香浴",
                description: "在温水中加入精油，全身放松"
              }
            }
          },
          acupuncture: {
            title: "针灸艾灸",
            subtitle: "传统中医疗法",
            description: "通过刺激特定穴位，调节气血运行，平衡阴阳，缓解痛经症状。",
            methods: {
              acupuncture: {
                name: "针灸治疗",
                description: "专业针灸师操作，刺激相关穴位"
              },
              moxibustion: {
                name: "艾灸疗法",
                description: "使用艾条温热刺激穴位，温经散寒"
              },
              cupping: {
                name: "拔罐疗法",
                description: "通过负压刺激，促进血液循环"
              },
              acupressure: {
                name: "穴位按压",
                description: "自我按压关元、三阴交等穴位"
              }
            }
          },
          psychological: {
            title: "心理调节",
            subtitle: "冥想、呼吸法等",
            description: "通过心理调节减少压力，改善整体健康状况，缓解痛经症状。",
            methods: {
              meditation: {
                name: "冥想练习",
                description: "正念冥想，专注当下，减少焦虑"
              },
              breathing: {
                name: "呼吸技巧",
                description: "4-7-8呼吸法、腹式呼吸等放松技巧"
              },
              relaxation: {
                name: "放松训练",
                description: "渐进式肌肉放松，全身放松练习"
              },
              cognitive: {
                name: "认知调节",
                description: "改变对疼痛的认知，积极应对"
              }
            }
          },
          comprehensive: {
            title: "综合方案",
            subtitle: "个性化组合疗法",
            description: "结合多种方法，制定个性化的调理方案，全面改善痛经问题。",
            methods: {
              personalized: {
                name: "个性化方案",
                description: "根据个人体质和症状制定专属方案"
              },
              combination: {
                name: "组合疗法",
                description: "多种方法协同作用，提高效果"
              },
              monitoring: {
                name: "效果监测",
                description: "定期评估效果，调整治疗方案"
              },
              adjustment: {
                name: "动态调整",
                description: "根据效果反馈，灵活调整方案"
              }
            }
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
            description: "Physical therapy improves blood circulation and relieves muscle tension through external physical means, making it the most direct and effective method for menstrual pain relief.",
            methods: {
              heatTherapy: {
                name: "Heat Therapy",
                description: "Use hot water bottles, heating pads at 40-45°C for 15-20 minutes"
              },
              massage: {
                name: "Massage Therapy",
                description: "Clockwise abdominal massage, lower back pressure to promote circulation"
              },
              tens: {
                name: "TENS Therapy",
                description: "Transcutaneous electrical nerve stimulation blocks pain signal transmission"
              },
              warmBath: {
                name: "Warm Bath",
                description: "Soak in 38-40°C warm water for 15-20 minutes for full body relaxation"
              }
            }
          },
          herbal: {
            title: "Herbal Therapy",
            subtitle: "Herbal teas, TCM, supplements, etc.",
            description: "Herbal therapy uses natural active compounds from plants to regulate hormonal balance and reduce inflammation, providing gentle yet effective conditioning.",
            methods: {
              gingerTea: {
                name: "Ginger Tea",
                description: "Ginger has anti-inflammatory properties, 2-3 cups of warm ginger tea daily"
              },
              angelicaTonic: {
                name: "Angelica Blood Tonic",
                description: "Traditional Chinese medicine formula for qi and blood regulation, consult TCM practitioner"
              },
              chamomileTea: {
                name: "Chamomile Tea",
                description: "Has sedative and antispasmodic effects, drink before bedtime"
              },
              eveningPrimrose: {
                name: "Evening Primrose Oil",
                description: "Rich in γ-linolenic acid, helps balance prostaglandins"
              }
            }
          },
          dietary: {
            title: "Dietary Adjustment",
            subtitle: "Anti-inflammatory diet, nutrition, etc.",
            description: "Through scientific dietary adjustments and key nutrient supplementation, reduce inflammatory responses and fundamentally improve menstrual pain symptoms.",
            methods: {
              omega3: {
                name: "Increase Omega-3",
                description: "Deep sea fish, flaxseeds, walnuts, 2-3 times per week"
              },
              magnesium: {
                name: "Magnesium Supplement",
                description: "Dark chocolate, bananas, almonds, 300-400mg daily"
              },
              reduceSugar: {
                name: "Reduce Sugar Intake",
                description: "Avoid refined sugar and processed foods, stabilize blood sugar"
              },
              increaseFiber: {
                name: "Increase Fiber",
                description: "Whole grains, fruits and vegetables, promote hormone metabolism"
              }
            }
          },
          yoga: {
            title: "Yoga & Exercise",
            subtitle: "Yoga poses, gentle exercise, etc.",
            description: "Through regular exercise practice, promote endorphin release, improve blood circulation, and relieve menstrual pain symptoms.",
            methods: {
              yogaPoses: {
                name: "Yoga Poses",
                description: "Cat pose, child's pose, butterfly pose and other soothing poses"
              },
              breathing: {
                name: "Breathing Exercises",
                description: "Abdominal breathing, 4-7-8 breathing and other relaxation techniques"
              },
              meditation: {
                name: "Meditation Practice",
                description: "Mindfulness meditation, focus on the present, reduce stress"
              },
              gentleExercise: {
                name: "Gentle Exercise",
                description: "Walking, swimming, tai chi and other low-intensity exercises"
              }
            }
          },
          aromatherapy: {
            title: "Aromatherapy",
            subtitle: "Essential oil massage, diffusion, etc.",
            description: "Use aromatic molecules of essential oils through olfactory and skin absorption to regulate mood and physiological functions.",
            methods: {
              essentialOils: {
                name: "Essential Oil Selection",
                description: "Lavender, chamomile, rose and other soothing essential oils"
              },
              diffusion: {
                name: "Aromatherapy Diffusion",
                description: "Use diffusers or aroma stones to create a soothing environment"
              },
              massage: {
                name: "Essential Oil Massage",
                description: "Dilute and massage abdomen and lower back to promote circulation"
              },
              bath: {
                name: "Aromatherapy Bath",
                description: "Add essential oils to warm water for full body relaxation"
              }
            }
          },
          acupuncture: {
            title: "Acupuncture & Moxibustion",
            subtitle: "Traditional Chinese medicine",
            description: "By stimulating specific acupoints, regulate qi and blood circulation, balance yin and yang, and relieve menstrual pain symptoms.",
            methods: {
              acupuncture: {
                name: "Acupuncture Treatment",
                description: "Professional acupuncturist operation, stimulate related acupoints"
              },
              moxibustion: {
                name: "Moxibustion Therapy",
                description: "Use moxa sticks to warm and stimulate acupoints, warm meridians and dispel cold"
              },
              cupping: {
                name: "Cupping Therapy",
                description: "Stimulate through negative pressure to promote blood circulation"
              },
              acupressure: {
                name: "Acupressure",
                description: "Self-press Guanyuan, Sanyinjiao and other acupoints"
              }
            }
          },
          psychological: {
            title: "Psychological Techniques",
            subtitle: "Meditation, breathing techniques, etc.",
            description: "Reduce stress through psychological regulation and improve overall health to relieve menstrual pain symptoms.",
            methods: {
              meditation: {
                name: "Meditation Practice",
                description: "Mindfulness meditation, focus on the present, reduce anxiety"
              },
              breathing: {
                name: "Breathing Techniques",
                description: "4-7-8 breathing, abdominal breathing and other relaxation techniques"
              },
              relaxation: {
                name: "Relaxation Training",
                description: "Progressive muscle relaxation, full body relaxation exercises"
              },
              cognitive: {
                name: "Cognitive Regulation",
                description: "Change perception of pain, positive coping"
              }
            }
          },
          comprehensive: {
            title: "Comprehensive Plans",
            subtitle: "Personalized combination therapy",
            description: "Combine multiple methods to create personalized conditioning plans and comprehensively improve menstrual pain problems.",
            methods: {
              personalized: {
                name: "Personalized Plan",
                description: "Develop exclusive plans based on individual constitution and symptoms"
              },
              combination: {
                name: "Combination Therapy",
                description: "Multiple methods work synergistically to improve effectiveness"
              },
              monitoring: {
                name: "Effect Monitoring",
                description: "Regularly evaluate effects and adjust treatment plans"
              },
              adjustment: {
                name: "Dynamic Adjustment",
                description: "Flexibly adjust plans based on effect feedback"
              }
            }
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
  console.log('🚀 开始更新natural-therapies页面完整翻译键...');
  saveTranslations();
  console.log('✅ 翻译键更新完成！');
}

module.exports = { naturalTherapiesTranslations, mergeTranslations, saveTranslations };
