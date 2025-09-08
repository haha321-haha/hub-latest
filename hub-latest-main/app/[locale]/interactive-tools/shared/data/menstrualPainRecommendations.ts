import { ConstitutionType, ConstitutionAnswer } from '../types/constitution';

// 痛经专项穴位建议
export interface MenstrualPainAcupoint {
  name: string;
  description: string;
}

// 文章推荐接口
export interface RecommendedArticle {
  title: string;
  description: string;
  category: string;
  link: string;
}

// 基于体质类型的痛经穴位建议
export const menstrualPainAcupoints: Record<string, Record<ConstitutionType, MenstrualPainAcupoint[]>> = {
  zh: {
    balanced: [
      { name: '三阴交', description: '调理气血，缓解轻微经期不适' },
      { name: '血海', description: '活血调经，维持经期平衡' }
    ],
    qi_deficiency: [
      { name: '气海', description: '补益元气，缓解疲劳型痛经' },
      { name: '足三里', description: '健脾益气，改善体质虚弱' },
      { name: '关元', description: '温补肾阳，增强体质' }
    ],
    yang_deficiency: [
      { name: '关元', description: '温阳散寒，缓解冷痛' },
      { name: '神阙', description: '温中散寒，改善宫寒症状' },
      { name: '肾俞', description: '补肾壮阳，温暖下焦' }
    ],
    yin_deficiency: [
      { name: '太溪', description: '滋阴补肾，缓解燥热症状' },
      { name: '三阴交', description: '滋阴养血，调理月经' },
      { name: '照海', description: '滋肾阴，清虚热' }
    ],
    phlegm_dampness: [
      { name: '丰隆', description: '化痰除湿，缓解腹胀' },
      { name: '阴陵泉', description: '健脾利湿，消除水肿' },
      { name: '中脘', description: '健脾和胃，化湿消胀' }
    ],
    damp_heat: [
      { name: '阴陵泉', description: '清热利湿，缓解湿热症状' },
      { name: '曲池', description: '清热解毒，凉血止痛' },
      { name: '太冲', description: '疏肝清热，调理情绪' }
    ],
    blood_stasis: [
      { name: '血海', description: '活血化瘀，缓解刺痛' },
      { name: '膈俞', description: '活血化瘀，通络止痛' },
      { name: '次髎', description: '活血通络，缓解盆腔瘀血' }
    ],
    qi_stagnation: [
      { name: '太冲', description: '疏肝理气，缓解绞痛' },
      { name: '期门', description: '疏肝解郁，调理情绪' },
      { name: '行间', description: '疏肝泄热，缓解烦躁' }
    ],
    special_diathesis: [
      { name: '百会', description: '调节神经，缓解过敏症状' },
      { name: '风池', description: '疏风解表，调节免疫' },
      { name: '合谷', description: '调气止痛，增强抵抗力' }
    ]
  },
  en: {
    balanced: [
      { name: 'Sanyinjiao (SP6)', description: 'Regulates qi and blood, relieves mild menstrual discomfort' },
      { name: 'Xuehai (SP10)', description: 'Activates blood circulation, maintains menstrual balance' }
    ],
    qi_deficiency: [
      { name: 'Qihai (CV6)', description: 'Tonifies primordial qi, relieves fatigue-type dysmenorrhea' },
      { name: 'Zusanli (ST36)', description: 'Strengthens spleen and qi, improves weak constitution' },
      { name: 'Guanyuan (CV4)', description: 'Warms and tonifies kidney yang, strengthens constitution' }
    ],
    yang_deficiency: [
      { name: 'Guanyuan (CV4)', description: 'Warms yang and disperses cold, relieves cold pain' },
      { name: 'Shenque (CV8)', description: 'Warms the center and disperses cold, improves uterine cold' },
      { name: 'Shenshu (BL23)', description: 'Tonifies kidney and strengthens yang, warms lower jiao' }
    ],
    yin_deficiency: [
      { name: 'Taixi (KI3)', description: 'Nourishes yin and tonifies kidney, relieves heat symptoms' },
      { name: 'Sanyinjiao (SP6)', description: 'Nourishes yin and blood, regulates menstruation' },
      { name: 'Zhaohai (KI6)', description: 'Nourishes kidney yin, clears deficiency heat' }
    ],
    phlegm_dampness: [
      { name: 'Fenglong (ST40)', description: 'Transforms phlegm and eliminates dampness, relieves bloating' },
      { name: 'Yinlingquan (SP9)', description: 'Strengthens spleen and drains dampness, reduces edema' },
      { name: 'Zhongwan (CV12)', description: 'Strengthens spleen and stomach, transforms dampness' }
    ],
    damp_heat: [
      { name: 'Yinlingquan (SP9)', description: 'Clears heat and drains dampness, relieves damp-heat symptoms' },
      { name: 'Quchi (LI11)', description: 'Clears heat and detoxifies, cools blood and stops pain' },
      { name: 'Taichong (LR3)', description: 'Soothes liver and clears heat, regulates emotions' }
    ],
    blood_stasis: [
      { name: 'Xuehai (SP10)', description: 'Activates blood and resolves stasis, relieves stabbing pain' },
      { name: 'Geshu (BL17)', description: 'Activates blood and resolves stasis, unblocks meridians' },
      { name: 'Ciliao (BL32)', description: 'Activates blood and unblocks meridians, relieves pelvic stasis' }
    ],
    qi_stagnation: [
      { name: 'Taichong (LR3)', description: 'Soothes liver and regulates qi, relieves cramping pain' },
      { name: 'Qimen (LR14)', description: 'Soothes liver and relieves depression, regulates emotions' },
      { name: 'Xingjian (LR2)', description: 'Soothes liver and drains heat, relieves irritability' }
    ],
    special_diathesis: [
      { name: 'Baihui (GV20)', description: 'Regulates nervous system, relieves allergic symptoms' },
      { name: 'Fengchi (GB20)', description: 'Expels wind and releases exterior, regulates immunity' },
      { name: 'Hegu (LI4)', description: 'Regulates qi and stops pain, strengthens resistance' }
    ]
  }
};

// 基于体质类型的生活方式建议
export const menstrualPainLifestyleTips: Record<string, Record<ConstitutionType, string[]>> = {
  zh: {
    balanced: [
      '保持规律的作息时间',
      '适量运动，如散步、瑜伽',
      '经期注意保暖，避免受凉',
      '保持心情愉快，避免过度紧张'
    ],
    qi_deficiency: [
      '充足睡眠，避免熬夜',
      '选择温和的运动，避免剧烈活动',
      '经期多休息，减少体力消耗',
      '注意营养补充，多吃补气食物'
    ],
    yang_deficiency: [
      '注意保暖，特别是腹部和腰部',
      '避免生冷食物，多喝温开水',
      '适当进行温和的有氧运动',
      '经期可用热水袋敷腹部'
    ],
    yin_deficiency: [
      '避免熬夜，保证充足睡眠',
      '减少辛辣刺激性食物',
      '多吃滋阴润燥的食物',
      '保持情绪稳定，避免急躁'
    ],
    phlegm_dampness: [
      '控制体重，避免过度肥胖',
      '减少甜腻食物的摄入',
      '增加有氧运动，促进代谢',
      '保持环境干燥，避免潮湿'
    ],
    damp_heat: [
      '饮食清淡，避免油腻食物',
      '多吃清热利湿的食物',
      '保持心情舒畅，避免急躁',
      '注意个人卫生，保持清洁'
    ],
    blood_stasis: [
      '适当运动，促进血液循环',
      '避免久坐不动',
      '经期可进行轻柔按摩',
      '保持情绪稳定，避免生气'
    ],
    qi_stagnation: [
      '学会情绪管理，保持心情舒畅',
      '适当进行舒缓运动，如瑜伽',
      '避免压力过大，学会放松',
      '可以听音乐、冥想来缓解压力'
    ],
    special_diathesis: [
      '避免接触过敏原',
      '增强体质，提高免疫力',
      '注意环境卫生，减少刺激',
      '必要时寻求专业医疗建议'
    ]
  },
  en: {
    balanced: [
      'Maintain regular sleep schedule',
      'Moderate exercise like walking and yoga',
      'Keep warm during menstruation, avoid cold',
      'Stay positive and avoid excessive stress'
    ],
    qi_deficiency: [
      'Get adequate sleep, avoid staying up late',
      'Choose gentle exercises, avoid intense activities',
      'Rest more during menstruation, reduce physical exertion',
      'Focus on nutrition, eat qi-tonifying foods'
    ],
    yang_deficiency: [
      'Keep warm, especially abdomen and lower back',
      'Avoid cold foods, drink warm water',
      'Engage in gentle aerobic exercises',
      'Use heating pad on abdomen during menstruation'
    ],
    yin_deficiency: [
      'Avoid staying up late, ensure adequate sleep',
      'Reduce spicy and irritating foods',
      'Eat yin-nourishing and moistening foods',
      'Maintain emotional stability, avoid irritability'
    ],
    phlegm_dampness: [
      'Control weight, avoid excessive obesity',
      'Reduce intake of sweet and greasy foods',
      'Increase aerobic exercise to boost metabolism',
      'Keep environment dry, avoid humidity'
    ],
    damp_heat: [
      'Eat light diet, avoid greasy foods',
      'Eat heat-clearing and dampness-draining foods',
      'Stay calm and avoid irritability',
      'Maintain personal hygiene and cleanliness'
    ],
    blood_stasis: [
      'Exercise appropriately to promote blood circulation',
      'Avoid prolonged sitting',
      'Gentle massage during menstruation',
      'Maintain emotional stability, avoid anger'
    ],
    qi_stagnation: [
      'Learn emotional management, stay cheerful',
      'Engage in soothing exercises like yoga',
      'Avoid excessive stress, learn to relax',
      'Listen to music or meditate to relieve stress'
    ],
    special_diathesis: [
      'Avoid contact with allergens',
      'Strengthen constitution and boost immunity',
      'Pay attention to environmental hygiene, reduce irritation',
      'Seek professional medical advice when necessary'
    ]
  }
};

// 基于体质和症状的文章推荐
export const getRecommendedArticles = (
  constitutionType: ConstitutionType,
  answers: ConstitutionAnswer[],
  locale: string
): RecommendedArticle[] => {
  const baseArticles: Record<string, RecommendedArticle[]> = {
    zh: [
      {
        title: '痛经的自然与物理疗法综合指南：15种科学验证的缓解方法',
        description: '详细介绍热敷、按摩、瑜伽等自然疗法，以及穴位按摩的具体操作方法，帮助您自然缓解痛经。',
        category: '自然疗法',
        link: '/zh/articles/natural-physical-therapy-comprehensive-guide'
      },
      {
        title: '痛经药物治疗专业指南：NSAIDs安全用药与剂量计算',
        description: '专业的痛经药物治疗指南，包括布洛芬、萘普生等NSAIDs的安全用药方法和剂量计算。',
        category: '药物治疗',
        link: '/zh/articles/nsaid-menstrual-pain-professional-guide'
      }
    ],
    en: [
      {
        title: 'Comprehensive Guide to Natural and Physical Therapies for Menstrual Pain',
        description: 'Detailed introduction to natural therapies such as heat therapy, massage, yoga, and specific acupoint massage techniques to naturally relieve menstrual pain.',
        category: 'Natural Therapy',
        link: '/en/articles/natural-physical-therapy-comprehensive-guide'
      },
      {
        title: 'Professional Guide to Menstrual Pain Medication: Safe Use of NSAIDs and Dosage Calculation',
        description: 'Professional guide to menstrual pain medication, including safe use and dosage calculation of NSAIDs like ibuprofen and naproxen.',
        category: 'Medical Treatment',
        link: '/en/articles/nsaid-menstrual-pain-professional-guide'
      }
    ]
  };

  // 基于体质类型添加特定文章推荐
  const constitutionSpecificArticles: Record<string, Partial<Record<ConstitutionType, RecommendedArticle[]>>> = {
    zh: {
      qi_deficiency: [
        {
          title: '气虚体质痛经调理：补气养血的中医方案',
          description: '针对气虚体质的痛经特点，提供补气养血的中医调理方案，包括食疗、穴位按摩等。',
          category: '体质调理',
          link: '/zh/interactive-tools/constitution-test'
        }
      ],
      yang_deficiency: [
        {
          title: '阳虚体质痛经调理：温阳散寒的调理方法',
          description: '专门针对阳虚体质的痛经调理，重点介绍温阳散寒的方法和注意事项。',
          category: '体质调理',
          link: '/zh/interactive-tools/constitution-test'
        }
      ],
      blood_stasis: [
        {
          title: '血瘀体质痛经调理：活血化瘀的有效方法',
          description: '针对血瘀体质的痛经特点，提供活血化瘀的调理方案和生活指导。',
          category: '体质调理',
          link: '/zh/interactive-tools/constitution-test'
        }
      ]
    },
    en: {
      qi_deficiency: [
        {
          title: 'Qi Deficiency Constitution Menstrual Pain Management: TCM Solutions for Qi and Blood Tonification',
          description: 'Targeted TCM solutions for qi deficiency constitution menstrual pain, including dietary therapy and acupoint massage.',
          category: 'Constitution Care',
          link: '/en/interactive-tools/constitution-test'
        }
      ],
      yang_deficiency: [
        {
          title: 'Yang Deficiency Constitution Menstrual Pain Management: Warming Yang and Dispersing Cold',
          description: 'Specialized care for yang deficiency constitution menstrual pain, focusing on warming yang and dispersing cold methods.',
          category: 'Constitution Care',
          link: '/en/interactive-tools/constitution-test'
        }
      ],
      blood_stasis: [
        {
          title: 'Blood Stasis Constitution Menstrual Pain Management: Effective Blood Circulation Methods',
          description: 'Targeted solutions for blood stasis constitution menstrual pain, providing blood circulation and stasis resolution guidance.',
          category: 'Constitution Care',
          link: '/en/interactive-tools/constitution-test'
        }
      ]
    }
  };

  const articles = [...(baseArticles[locale] || baseArticles.zh)];
  
  // 添加体质特定的文章
  const constitutionArticles = constitutionSpecificArticles[locale]?.[constitutionType];
  if (constitutionArticles) {
    articles.push(...constitutionArticles);
  }

  return articles.slice(0, 3); // 返回最多3篇文章
};

// 社交沟通模板
export interface CommunicationTemplate {
  scenario: string;
  templates: {
    title: string;
    content: string;
    tone: 'casual' | 'formal' | 'intimate';
  }[];
}

export const communicationTemplates: Record<string, CommunicationTemplate[]> = {
  zh: [
    {
      scenario: '与伴侣沟通',
      templates: [
        {
          title: '温和告知',
          content: '亲爱的，我今天经期疼痛比较严重，可能需要多休息一下。如果我看起来不太舒服，请不要担心，这是正常的生理反应。',
          tone: 'intimate'
        },
        {
          title: '寻求理解',
          content: '我现在有些痛经，可能情绪会有些波动，不是因为你做错了什么。能给我一些时间和空间吗？',
          tone: 'intimate'
        },
        {
          title: '请求帮助',
          content: '我现在肚子很痛，能帮我准备一杯热水吗？或者陪我安静地待一会儿就好。',
          tone: 'intimate'
        }
      ]
    },
    {
      scenario: '与朋友沟通',
      templates: [
        {
          title: '约会改期',
          content: '不好意思，我今天身体不太舒服（经期疼痛），可能没办法保持最佳状态。我们能改到下次吗？',
          tone: 'casual'
        },
        {
          title: '聚会参与',
          content: '我会参加聚会，但可能需要早点回家休息。如果我看起来有点疲惫，请理解一下～',
          tone: 'casual'
        },
        {
          title: '寻求支持',
          content: '姐妹，我现在痛经痛得厉害，你有什么好的缓解方法吗？或者就是想找人聊聊。',
          tone: 'casual'
        }
      ]
    },
    {
      scenario: '与同事/领导沟通',
      templates: [
        {
          title: '请假申请',
          content: '您好，我今天身体不适，可能需要请假半天/一天。我会尽快处理紧急工作，其他事务明天补上。',
          tone: 'formal'
        },
        {
          title: '工作调整',
          content: '不好意思，我今天身体有些不适，可能工作效率会受影响。如果有紧急事务，请优先安排。',
          tone: 'formal'
        },
        {
          title: '会议参与',
          content: '我可能需要在会议中途短暂离开一下，不是对会议内容不感兴趣，而是身体原因。',
          tone: 'formal'
        }
      ]
    }
  ],
  en: [
    {
      scenario: 'Communicating with Partner',
      templates: [
        {
          title: 'Gentle Notification',
          content: 'Honey, I\'m experiencing severe menstrual cramps today and might need some extra rest. If I seem uncomfortable, please don\'t worry - it\'s a normal physiological response.',
          tone: 'intimate'
        },
        {
          title: 'Seeking Understanding',
          content: 'I\'m having period pain right now and my emotions might be a bit up and down. It\'s not because you did anything wrong. Could you give me some time and space?',
          tone: 'intimate'
        },
        {
          title: 'Asking for Help',
          content: 'I\'m having really bad cramps right now. Could you help me get some hot water? Or just stay with me quietly for a while.',
          tone: 'intimate'
        }
      ]
    },
    {
      scenario: 'Communicating with Friends',
      templates: [
        {
          title: 'Rescheduling Dates',
          content: 'Sorry, I\'m not feeling well today (period pain) and might not be at my best. Could we reschedule for another time?',
          tone: 'casual'
        },
        {
          title: 'Party Participation',
          content: 'I\'ll join the party, but I might need to head home early to rest. Please understand if I seem a bit tired~',
          tone: 'casual'
        },
        {
          title: 'Seeking Support',
          content: 'Girl, I\'m having terrible period cramps right now. Do you have any good relief methods? Or I just want someone to talk to.',
          tone: 'casual'
        }
      ]
    },
    {
      scenario: 'Communicating with Colleagues/Boss',
      templates: [
        {
          title: 'Leave Request',
          content: 'Hello, I\'m not feeling well today and may need to take half a day/full day off. I\'ll handle urgent work as soon as possible and catch up on other tasks tomorrow.',
          tone: 'formal'
        },
        {
          title: 'Work Adjustment',
          content: 'Sorry, I\'m feeling a bit unwell today and my work efficiency might be affected. Please prioritize urgent matters if any.',
          tone: 'formal'
        },
        {
          title: 'Meeting Participation',
          content: 'I might need to step out briefly during the meeting. It\'s not because I\'m not interested in the content, but due to health reasons.',
          tone: 'formal'
        }
      ]
    }
  ]
};

// 应急包物品推荐
export interface EmergencyKitItem {
  category: string;
  items: {
    name: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export const emergencyKitRecommendations: Record<string, Record<ConstitutionType, EmergencyKitItem[]>> = {
  zh: {
    balanced: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '小包纸巾', reason: '日常清洁需要', priority: 'medium' }
        ]
      },
      {
        category: '舒缓用品',
        items: [
          { name: '暖宝宝', reason: '温热缓解轻微不适', priority: 'medium' },
          { name: '保温杯', reason: '随时补充温水', priority: 'medium' },
          { name: '薄荷糖', reason: '提神醒脑，缓解疲劳', priority: 'low' }
        ]
      }
    ],
    qi_deficiency: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '能量小零食', reason: '及时补充体力', priority: 'high' }
        ]
      },
      {
        category: '补气用品',
        items: [
          { name: '红枣茶包', reason: '补气养血，缓解疲劳', priority: 'high' },
          { name: '暖宝宝', reason: '温暖身体，提升阳气', priority: 'high' },
          { name: '小毯子', reason: '保暖休息，避免受凉', priority: 'medium' }
        ]
      },
      {
        category: '应急药品',
        items: [
          { name: '维生素B群', reason: '支持神经系统，缓解疲劳', priority: 'medium' },
          { name: '葡萄糖片', reason: '快速补充能量', priority: 'low' }
        ]
      }
    ],
    yang_deficiency: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '保温杯', reason: '随时饮用热水', priority: 'high' }
        ]
      },
      {
        category: '温阳用品',
        items: [
          { name: '暖宝宝', reason: '持续温暖，驱散寒气', priority: 'high' },
          { name: '暖宫贴', reason: '专门温暖腹部', priority: 'high' },
          { name: '生姜茶包', reason: '温中散寒，暖胃驱寒', priority: 'high' }
        ]
      },
      {
        category: '保暖用品',
        items: [
          { name: '薄外套', reason: '随时增添衣物保暖', priority: 'medium' },
          { name: '暖手宝', reason: '温暖手部，促进循环', priority: 'medium' },
          { name: '保暖袜', reason: '足部保暖，防止寒从脚起', priority: 'low' }
        ]
      }
    ],
    yin_deficiency: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '保湿喷雾', reason: '缓解干燥，滋润肌肤', priority: 'medium' }
        ]
      },
      {
        category: '滋阴用品',
        items: [
          { name: '蜂蜜柠檬茶', reason: '滋阴润燥，缓解内热', priority: 'high' },
          { name: '润喉糖', reason: '滋润咽喉，缓解干燥', priority: 'medium' },
          { name: '保湿面膜', reason: '滋润肌肤，缓解干燥', priority: 'low' }
        ]
      },
      {
        category: '镇静用品',
        items: [
          { name: '薰衣草精油', reason: '舒缓情绪，帮助放松', priority: 'medium' },
          { name: '眼罩', reason: '遮光休息，缓解疲劳', priority: 'low' }
        ]
      }
    ],
    phlegm_dampness: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '干爽粉', reason: '保持身体干爽', priority: 'medium' }
        ]
      },
      {
        category: '化湿用品',
        items: [
          { name: '陈皮茶包', reason: '健脾化湿，消除胀气', priority: 'high' },
          { name: '薄荷茶', reason: '清香化湿，提神醒脑', priority: 'medium' },
          { name: '除湿贴', reason: '局部除湿，保持干爽', priority: 'low' }
        ]
      },
      {
        category: '消胀用品',
        items: [
          { name: '消化酶片', reason: '帮助消化，减少胀气', priority: 'medium' },
          { name: '按摩球', reason: '促进循环，消除水肿', priority: 'low' }
        ]
      }
    ],
    damp_heat: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '抗菌洗手液', reason: '清洁杀菌，预防感染', priority: 'medium' }
        ]
      },
      {
        category: '清热用品',
        items: [
          { name: '菊花茶包', reason: '清热解毒，降火消炎', priority: 'high' },
          { name: '绿茶包', reason: '清热利湿，抗氧化', priority: 'medium' },
          { name: '清凉贴', reason: '局部降温，缓解热感', priority: 'low' }
        ]
      },
      {
        category: '清洁用品',
        items: [
          { name: '私处清洁湿巾', reason: '专用清洁，预防炎症', priority: 'medium' },
          { name: '漱口水', reason: '口腔清洁，去除异味', priority: 'low' }
        ]
      }
    ],
    blood_stasis: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '止痛药', reason: '缓解刺痛，改善循环', priority: 'high' }
        ]
      },
      {
        category: '活血用品',
        items: [
          { name: '红花茶包', reason: '活血化瘀，缓解疼痛', priority: 'high' },
          { name: '暖宝宝', reason: '温热促循环，缓解瘀滞', priority: 'high' },
          { name: '按摩膏', reason: '局部按摩，促进血液循环', priority: 'medium' }
        ]
      },
      {
        category: '舒缓用品',
        items: [
          { name: '热敷袋', reason: '深度热敷，缓解深层疼痛', priority: 'medium' },
          { name: '按摩球', reason: '穴位按摩，疏通经络', priority: 'low' }
        ]
      }
    ],
    qi_stagnation: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '止痛药', reason: '缓解绞痛，舒缓情绪', priority: 'high' }
        ]
      },
      {
        category: '疏肝用品',
        items: [
          { name: '玫瑰花茶包', reason: '疏肝解郁，调节情绪', priority: 'high' },
          { name: '柠檬精油', reason: '芳香疏肝，提升心情', priority: 'medium' },
          { name: '暖宝宝', reason: '温暖腹部，缓解痉挛', priority: 'high' }
        ]
      },
      {
        category: '情绪调节',
        items: [
          { name: '舒缓音乐', reason: '放松心情，缓解压力', priority: 'medium' },
          { name: '减压玩具', reason: '转移注意力，释放压力', priority: 'low' }
        ]
      }
    ],
    special_diathesis: [
      {
        category: '基础必需品',
        items: [
          { name: '卫生巾/棉条', reason: '基本生理需求', priority: 'high' },
          { name: '湿纸巾', reason: '保持清洁卫生', priority: 'high' },
          { name: '抗过敏药', reason: '预防过敏反应', priority: 'high' }
        ]
      },
      {
        category: '防护用品',
        items: [
          { name: '口罩', reason: '过滤空气，减少过敏原', priority: 'high' },
          { name: '免洗洗手液', reason: '随时清洁，减少接触', priority: 'medium' },
          { name: '防过敏贴', reason: '皮肤保护，预防接触性过敏', priority: 'medium' }
        ]
      },
      {
        category: '应急药品',
        items: [
          { name: '抗组胺药', reason: '快速缓解过敏症状', priority: 'high' },
          { name: '肾上腺素笔', reason: '严重过敏时的救命药物', priority: 'medium' },
          { name: '舒缓喷雾', reason: '缓解皮肤过敏不适', priority: 'low' }
        ]
      }
    ]
  },
  en: {
    balanced: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Small tissue packs', reason: 'Daily cleaning needs', priority: 'medium' }
        ]
      },
      {
        category: 'Comfort Items',
        items: [
          { name: 'Heat pads', reason: 'Warm relief for mild discomfort', priority: 'medium' },
          { name: 'Thermos bottle', reason: 'Stay hydrated with warm water', priority: 'medium' },
          { name: 'Mint candies', reason: 'Refresh and relieve fatigue', priority: 'low' }
        ]
      }
    ],
    qi_deficiency: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Energy snacks', reason: 'Timely energy replenishment', priority: 'high' }
        ]
      },
      {
        category: 'Qi-Tonifying Items',
        items: [
          { name: 'Jujube tea bags', reason: 'Tonify qi and blood, relieve fatigue', priority: 'high' },
          { name: 'Heat pads', reason: 'Warm body, boost yang qi', priority: 'high' },
          { name: 'Small blanket', reason: 'Keep warm and rest, avoid catching cold', priority: 'medium' }
        ]
      },
      {
        category: 'Emergency Supplements',
        items: [
          { name: 'Vitamin B complex', reason: 'Support nervous system, relieve fatigue', priority: 'medium' },
          { name: 'Glucose tablets', reason: 'Quick energy boost', priority: 'low' }
        ]
      }
    ],
    yang_deficiency: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Thermos bottle', reason: 'Drink hot water anytime', priority: 'high' }
        ]
      },
      {
        category: 'Yang-Warming Items',
        items: [
          { name: 'Heat pads', reason: 'Continuous warmth, dispel cold', priority: 'high' },
          { name: 'Abdominal heat patches', reason: 'Specifically warm abdomen', priority: 'high' },
          { name: 'Ginger tea bags', reason: 'Warm center, dispel cold from stomach', priority: 'high' }
        ]
      },
      {
        category: 'Warming Items',
        items: [
          { name: 'Light jacket', reason: 'Add layers for warmth anytime', priority: 'medium' },
          { name: 'Hand warmers', reason: 'Warm hands, promote circulation', priority: 'medium' },
          { name: 'Warm socks', reason: 'Keep feet warm, prevent cold from feet', priority: 'low' }
        ]
      }
    ],
    yin_deficiency: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Moisturizing spray', reason: 'Relieve dryness, moisturize skin', priority: 'medium' }
        ]
      },
      {
        category: 'Yin-Nourishing Items',
        items: [
          { name: 'Honey lemon tea', reason: 'Nourish yin, moisten dryness, relieve internal heat', priority: 'high' },
          { name: 'Throat lozenges', reason: 'Moisten throat, relieve dryness', priority: 'medium' },
          { name: 'Moisturizing face mask', reason: 'Moisturize skin, relieve dryness', priority: 'low' }
        ]
      },
      {
        category: 'Calming Items',
        items: [
          { name: 'Lavender essential oil', reason: 'Soothe emotions, help relaxation', priority: 'medium' },
          { name: 'Eye mask', reason: 'Block light for rest, relieve fatigue', priority: 'low' }
        ]
      }
    ],
    phlegm_dampness: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Drying powder', reason: 'Keep body dry', priority: 'medium' }
        ]
      },
      {
        category: 'Dampness-Resolving Items',
        items: [
          { name: 'Tangerine peel tea bags', reason: 'Strengthen spleen, resolve dampness, eliminate bloating', priority: 'high' },
          { name: 'Mint tea', reason: 'Fragrant dampness resolution, refresh mind', priority: 'medium' },
          { name: 'Moisture-absorbing patches', reason: 'Local moisture removal, stay dry', priority: 'low' }
        ]
      },
      {
        category: 'Anti-Bloating Items',
        items: [
          { name: 'Digestive enzyme tablets', reason: 'Aid digestion, reduce bloating', priority: 'medium' },
          { name: 'Massage ball', reason: 'Promote circulation, eliminate edema', priority: 'low' }
        ]
      }
    ],
    damp_heat: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Antibacterial hand sanitizer', reason: 'Clean and sterilize, prevent infection', priority: 'medium' }
        ]
      },
      {
        category: 'Heat-Clearing Items',
        items: [
          { name: 'Chrysanthemum tea bags', reason: 'Clear heat, detoxify, reduce inflammation', priority: 'high' },
          { name: 'Green tea bags', reason: 'Clear heat, drain dampness, antioxidant', priority: 'medium' },
          { name: 'Cooling patches', reason: 'Local cooling, relieve heat sensation', priority: 'low' }
        ]
      },
      {
        category: 'Cleansing Items',
        items: [
          { name: 'Intimate cleansing wipes', reason: 'Specialized cleaning, prevent inflammation', priority: 'medium' },
          { name: 'Mouthwash', reason: 'Oral hygiene, remove odors', priority: 'low' }
        ]
      }
    ],
    blood_stasis: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Pain relievers', reason: 'Relieve stabbing pain, improve circulation', priority: 'high' }
        ]
      },
      {
        category: 'Blood-Activating Items',
        items: [
          { name: 'Safflower tea bags', reason: 'Activate blood, resolve stasis, relieve pain', priority: 'high' },
          { name: 'Heat pads', reason: 'Warm heat promotes circulation, relieves stasis', priority: 'high' },
          { name: 'Massage balm', reason: 'Local massage, promote blood circulation', priority: 'medium' }
        ]
      },
      {
        category: 'Soothing Items',
        items: [
          { name: 'Hot compress bags', reason: 'Deep heat therapy, relieve deep pain', priority: 'medium' },
          { name: 'Massage ball', reason: 'Acupoint massage, unblock meridians', priority: 'low' }
        ]
      }
    ],
    qi_stagnation: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Pain relievers', reason: 'Relieve cramping pain, soothe emotions', priority: 'high' }
        ]
      },
      {
        category: 'Liver-Soothing Items',
        items: [
          { name: 'Rose tea bags', reason: 'Soothe liver, relieve depression, regulate emotions', priority: 'high' },
          { name: 'Lemon essential oil', reason: 'Aromatic liver soothing, uplift mood', priority: 'medium' },
          { name: 'Heat pads', reason: 'Warm abdomen, relieve spasms', priority: 'high' }
        ]
      },
      {
        category: 'Mood Regulation',
        items: [
          { name: 'Soothing music', reason: 'Relax mood, relieve stress', priority: 'medium' },
          { name: 'Stress relief toys', reason: 'Divert attention, release stress', priority: 'low' }
        ]
      }
    ],
    special_diathesis: [
      {
        category: 'Basic Essentials',
        items: [
          { name: 'Sanitary pads/tampons', reason: 'Basic physiological needs', priority: 'high' },
          { name: 'Wet wipes', reason: 'Maintain cleanliness and hygiene', priority: 'high' },
          { name: 'Anti-allergy medication', reason: 'Prevent allergic reactions', priority: 'high' }
        ]
      },
      {
        category: 'Protective Items',
        items: [
          { name: 'Face masks', reason: 'Filter air, reduce allergens', priority: 'high' },
          { name: 'Hand sanitizer', reason: 'Clean anytime, reduce contact', priority: 'medium' },
          { name: 'Anti-allergy patches', reason: 'Skin protection, prevent contact allergies', priority: 'medium' }
        ]
      },
      {
        category: 'Emergency Medications',
        items: [
          { name: 'Antihistamines', reason: 'Quickly relieve allergy symptoms', priority: 'high' },
          { name: 'Epinephrine pen', reason: 'Life-saving medication for severe allergies', priority: 'medium' },
          { name: 'Soothing spray', reason: 'Relieve skin allergy discomfort', priority: 'low' }
        ]
      }
    ]
  }
};

// 场景化生活建议
export interface ScenarioAdvice {
  scenario: string;
  icon: string;
  tips: string[];
}

export const scenarioBasedAdvice: Record<string, Record<ConstitutionType, ScenarioAdvice[]>> = {
  zh: {
    balanced: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '保持良好坐姿，每小时起身活动5分钟',
          '办公桌常备温水杯，保持充足水分',
          '适当调节空调温度，避免过冷',
          '工作间隙可做简单的颈肩放松操'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '选择舒适的鞋子，减少足部疲劳',
          '公共交通上可听轻音乐放松心情',
          '避免长时间低头看手机',
          '提前准备好保暖外套'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '选择舒适宽松的衣物',
          '聚会时适量饮食，避免过饱',
          '主动选择温热的饮品',
          '必要时可提前告知亲近朋友'
        ]
      }
    ],
    qi_deficiency: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '工作强度适中，避免过度劳累',
          '午休时间尽量小憩15-20分钟',
          '常备红枣茶或桂圆茶补气',
          '重要会议前可按压足三里穴提神'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '避免早高峰拥挤，可适当错峰出行',
          '通勤包里备好小零食补充能量',
          '选择有座位的交通方式',
          '疲劳时可按压合谷穴缓解'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '聚会时间不宜过长，适时休息',
          '选择营养丰富、易消化的食物',
          '避免过于激烈的娱乐活动',
          '可以坐着参与，减少站立时间'
        ]
      }
    ],
    yang_deficiency: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '办公室常备小毯子或暖宝宝',
          '选择温热的午餐，避免生冷食物',
          '座位尽量远离空调出风口',
          '工作间隙可做暖身小运动'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '出门前检查保暖措施是否充足',
          '随身携带保温杯装热水',
          '避免在寒冷环境中久待',
          '可在包里放暖手宝'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '选择温暖的聚会场所',
          '避免冰镇饮料和生冷食物',
          '可以带一件薄外套备用',
          '聚会后注意保暖回家'
        ]
      }
    ],
    yin_deficiency: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '保持办公环境适度湿润',
          '多喝温开水，少喝咖啡',
          '避免长时间对着电脑屏幕',
          '中午可以闭目养神片刻'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '避免在烈日下长时间等车',
          '可以听舒缓音乐平静心情',
          '通勤时间可做深呼吸练习',
          '保持心情平和，避免急躁'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '避免过于嘈杂的聚会环境',
          '选择清淡的食物，少吃辛辣',
          '聚会时间适中，不宜过晚',
          '保持情绪稳定，避免过度兴奋'
        ]
      }
    ],
    phlegm_dampness: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '保持办公环境通风干燥',
          '午餐选择清淡少油的食物',
          '工作间隙可做简单伸展运动',
          '避免久坐，定时起身活动'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '选择透气性好的衣物',
          '避免在潮湿环境中久留',
          '可以做一些简单的活动筋骨',
          '保持心情愉快，避免沉闷'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '避免过量饮食，特别是甜腻食物',
          '选择有氧活动类型的聚会',
          '多与朋友交流，保持活跃',
          '聚会后可以散步消食'
        ]
      }
    ],
    damp_heat: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '保持办公环境清洁干爽',
          '多喝绿茶或菊花茶清热',
          '避免辛辣刺激的外卖食物',
          '工作压力大时可做放松练习'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '选择吸汗透气的衣物',
          '避免在闷热环境中久待',
          '保持心情平静，避免烦躁',
          '可以听清淡的音乐舒缓情绪'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '选择清爽的聚会环境',
          '避免油腻、辛辣、酒精类食物',
          '聚会时间不宜过长',
          '保持情绪稳定，避免激动'
        ]
      }
    ],
    blood_stasis: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '避免长时间保持同一姿势',
          '定时做颈肩和腰部活动',
          '工作间隙可按摩手部穴位',
          '保持心情舒畅，避免郁闷'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '在车上可做简单的踝关节运动',
          '避免紧身衣物限制血液循环',
          '可以听欢快的音乐调节心情',
          '到站后可以快走几分钟'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '选择活跃一些的聚会活动',
          '避免久坐不动的聚会形式',
          '多与朋友交流，保持心情愉快',
          '可以参与一些轻松的运动'
        ]
      }
    ],
    qi_stagnation: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '工作压力大时及时调节情绪',
          '可以在办公室放一些绿植',
          '午休时可以到户外走走',
          '与同事保持良好的沟通'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '通勤时可以听喜欢的音乐',
          '避免在拥挤时段出行',
          '可以做深呼吸缓解压力',
          '保持积极乐观的心态'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '多参与轻松愉快的聚会',
          '与朋友分享心情，释放压力',
          '选择开阔明亮的聚会场所',
          '避免过于严肃的话题'
        ]
      }
    ],
    special_diathesis: [
      {
        scenario: '办公场景',
        icon: '💼',
        tips: [
          '注意办公环境的过敏原',
          '保持办公用品的清洁',
          '避免使用刺激性的清洁用品',
          '工作压力大时注意调节'
        ]
      },
      {
        scenario: '通勤路上',
        icon: '🚇',
        tips: [
          '避免接触可能的过敏原',
          '在空气质量差时戴口罩',
          '选择相对清洁的交通工具',
          '随身携带必要的应急药物'
        ]
      },
      {
        scenario: '社交聚会',
        icon: '👥',
        tips: [
          '提前了解聚会环境和食物',
          '避免接触已知的过敏原',
          '必要时提前告知朋友注意事项',
          '随身携带抗过敏药物'
        ]
      }
    ]
  },
  en: {
    balanced: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Maintain good posture, stand and move for 5 minutes every hour',
          'Keep a water bottle at your desk for adequate hydration',
          'Adjust air conditioning temperature appropriately, avoid overcooling',
          'Do simple neck and shoulder relaxation exercises during breaks'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Choose comfortable shoes to reduce foot fatigue',
          'Listen to light music on public transport to relax',
          'Avoid looking down at phone for extended periods',
          'Prepare warm outerwear in advance'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Choose comfortable and loose-fitting clothing',
          'Eat moderately at gatherings, avoid overeating',
          'Actively choose warm beverages',
          'Inform close friends in advance if necessary'
        ]
      }
    ],
    qi_deficiency: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Moderate work intensity, avoid overexertion',
          'Take 15-20 minute naps during lunch break',
          'Keep jujube tea or longan tea for qi tonification',
          'Press Zusanli acupoint before important meetings for energy'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Avoid rush hour crowds, consider off-peak travel',
          'Pack small snacks in commute bag for energy',
          'Choose transportation with seating when possible',
          'Press Hegu acupoint when feeling fatigued'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Keep gathering time moderate, rest when needed',
          'Choose nutritious, easily digestible foods',
          'Avoid overly vigorous entertainment activities',
          'Participate while seated, reduce standing time'
        ]
      }
    ],
    yang_deficiency: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Keep small blankets or heating pads in office',
          'Choose warm lunch, avoid cold foods',
          'Sit away from air conditioning vents',
          'Do warming exercises during work breaks'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Check warmth measures before leaving home',
          'Carry thermos with hot water',
          'Avoid prolonged stays in cold environments',
          'Keep hand warmers in bag'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Choose warm gathering venues',
          'Avoid iced drinks and cold foods',
          'Bring a light jacket as backup',
          'Stay warm when heading home after gatherings'
        ]
      }
    ],
    yin_deficiency: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Maintain moderate humidity in office environment',
          'Drink more warm water, less coffee',
          'Avoid prolonged computer screen exposure',
          'Close eyes and rest briefly at noon'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Avoid waiting in direct sunlight for extended periods',
          'Listen to soothing music to calm mood',
          'Practice deep breathing during commute',
          'Stay calm and avoid irritability'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Avoid overly noisy gathering environments',
          'Choose light foods, eat less spicy food',
          'Keep gathering time moderate, not too late',
          'Maintain emotional stability, avoid overexcitement'
        ]
      }
    ],
    phlegm_dampness: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Keep office environment ventilated and dry',
          'Choose light, low-oil foods for lunch',
          'Do simple stretching exercises during breaks',
          'Avoid prolonged sitting, stand and move regularly'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Choose breathable clothing',
          'Avoid prolonged stays in humid environments',
          'Do simple joint movements',
          'Stay cheerful, avoid feeling stuffy'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Avoid overeating, especially sweet and greasy foods',
          'Choose aerobic activity-type gatherings',
          'Communicate actively with friends, stay active',
          'Take a walk after gatherings to aid digestion'
        ]
      }
    ],
    damp_heat: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Keep office environment clean and dry',
          'Drink more green tea or chrysanthemum tea for heat clearing',
          'Avoid spicy and irritating takeout foods',
          'Do relaxation exercises when work stress is high'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Choose sweat-wicking, breathable clothing',
          'Avoid prolonged stays in stuffy environments',
          'Stay calm, avoid irritability',
          'Listen to light music to soothe emotions'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Choose refreshing gathering environments',
          'Avoid greasy, spicy, and alcoholic foods',
          'Keep gathering time moderate',
          'Maintain emotional stability, avoid excitement'
        ]
      }
    ],
    blood_stasis: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Avoid maintaining same posture for long periods',
          'Do regular neck, shoulder, and waist movements',
          'Massage hand acupoints during work breaks',
          'Stay cheerful, avoid feeling depressed'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Do simple ankle exercises while on transport',
          'Avoid tight clothing that restricts blood circulation',
          'Listen to upbeat music to regulate mood',
          'Walk briskly for a few minutes after getting off'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Choose more active gathering activities',
          'Avoid sedentary gathering formats',
          'Communicate more with friends, stay happy',
          'Participate in some light exercises'
        ]
      }
    ],
    qi_stagnation: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Regulate emotions promptly when work stress is high',
          'Place some green plants in the office',
          'Go outdoors for a walk during lunch break',
          'Maintain good communication with colleagues'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Listen to favorite music during commute',
          'Avoid traveling during crowded times',
          'Do deep breathing to relieve stress',
          'Maintain positive and optimistic attitude'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Participate more in relaxed and pleasant gatherings',
          'Share feelings with friends, release stress',
          'Choose open and bright gathering venues',
          'Avoid overly serious topics'
        ]
      }
    ],
    special_diathesis: [
      {
        scenario: 'Office Environment',
        icon: '💼',
        tips: [
          'Pay attention to allergens in office environment',
          'Keep office supplies clean',
          'Avoid using irritating cleaning products',
          'Pay attention to regulation when work stress is high'
        ]
      },
      {
        scenario: 'Commuting',
        icon: '🚇',
        tips: [
          'Avoid contact with potential allergens',
          'Wear mask when air quality is poor',
          'Choose relatively clean transportation',
          'Carry necessary emergency medications'
        ]
      },
      {
        scenario: 'Social Gatherings',
        icon: '👥',
        tips: [
          'Learn about gathering environment and food in advance',
          'Avoid contact with known allergens',
          'Inform friends of precautions if necessary',
          'Carry anti-allergy medications'
        ]
      }
    ]
  }
};
