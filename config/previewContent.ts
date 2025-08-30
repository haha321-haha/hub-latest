/**
 * PDF预览内容配置
 * Period Hub PDF Preview Content Configuration
 */

export interface PreviewContent {
  /** PDF资源ID */
  id: string;
  /** 预览标题 */
  title: {
    zh: string;
    en: string;
  };
  /** 核心要点 */
  keyPoints: {
    zh: string[];
    en: string[];
  };
  /** 适用场景 */
  useCase: {
    zh: string;
    en: string;
  };
  /** 预计使用时间 */
  estimatedTime: {
    zh: string;
    en: string;
  };
  /** 预览内容（30-50%的关键信息） */
  previewSections: {
    zh: PreviewSection[];
    en: PreviewSection[];
  };
  /** 完整版包含的额外内容 */
  fullVersionIncludes: {
    zh: string[];
    en: string[];
  };
}

export interface PreviewSection {
  /** 章节标题 */
  title: string;
  /** 章节内容 */
  content: string[];
  /** 是否为重点章节 */
  isHighlight?: boolean;
}

/**
 * 5个核心PDF资源的预览内容配置
 */
export const PREVIEW_CONTENT: PreviewContent[] = [
  // 1. 疼痛追踪表
  {
    id: 'pain-tracking-form',
    title: {
      zh: '疼痛追踪表',
      en: 'Pain Tracking Form'
    },
    keyPoints: {
      zh: [
        '准确记录疼痛强度和时间',
        '识别疼痛模式和触发因素',
        '为医生诊断提供重要数据',
        '制定个性化治疗方案'
      ],
      en: [
        'Accurately record pain intensity and timing',
        'Identify pain patterns and triggers',
        'Provide important data for medical diagnosis',
        'Develop personalized treatment plans'
      ]
    },
    useCase: {
      zh: '适合需要系统记录疼痛情况，准备就医或寻求专业建议的用户',
      en: 'Suitable for users who need to systematically record pain conditions for medical consultation'
    },
    estimatedTime: {
      zh: '每次记录2-3分钟，建议连续追踪3个月经周期',
      en: '2-3 minutes per record, recommended tracking for 3 menstrual cycles'
    },
    previewSections: {
      zh: [
        {
          title: '疼痛强度评分标准',
          content: [
            '0分：无疼痛',
            '1-3分：轻度疼痛，不影响日常活动',
            '4-6分：中度疼痛，影响部分日常活动',
            '7-10分：重度疼痛，严重影响生活质量'
          ],
          isHighlight: true
        },
        {
          title: '记录要点',
          content: [
            '疼痛开始时间和持续时长',
            '疼痛位置和性质描述',
            '伴随症状（恶心、头痛等）',
            '使用的缓解方法和效果'
          ]
        },
        {
          title: '医生沟通要点',
          content: [
            '整理3个月的疼痛数据趋势',
            '标注异常疼痛的具体情况',
            '记录尝试过的治疗方法'
          ]
        }
      ],
      en: [
        {
          title: 'Pain Intensity Rating Scale',
          content: [
            '0: No pain',
            '1-3: Mild pain, does not affect daily activities',
            '4-6: Moderate pain, affects some daily activities',
            '7-10: Severe pain, seriously affects quality of life'
          ],
          isHighlight: true
        },
        {
          title: 'Recording Key Points',
          content: [
            'Pain onset time and duration',
            'Pain location and nature description',
            'Accompanying symptoms (nausea, headache, etc.)',
            'Relief methods used and their effectiveness'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的疼痛评估量表',
        '症状记录模板',
        '医生沟通指导',
        '数据分析图表模板',
        '治疗效果追踪表'
      ],
      en: [
        'Detailed pain assessment scale',
        'Symptom recording templates',
        'Doctor communication guidance',
        'Data analysis chart templates',
        'Treatment effectiveness tracking'
      ]
    }
  },

  // 2. 校园应急清单
  {
    id: 'campus-emergency-checklist',
    title: {
      zh: '校园应急清单',
      en: 'Campus Emergency Checklist'
    },
    keyPoints: {
      zh: [
        '学校环境下的应急处理方案',
        '必备物品清单和存放建议',
        '与老师和同学的沟通技巧',
        '紧急情况下的求助流程'
      ],
      en: [
        'Emergency response plan for school environment',
        'Essential items checklist and storage suggestions',
        'Communication skills with teachers and classmates',
        'Help-seeking process in emergencies'
      ]
    },
    useCase: {
      zh: '适合在校学生，特别是初次经历经期或经期不规律的学生',
      en: 'Suitable for students, especially those experiencing their first period or irregular cycles'
    },
    estimatedTime: {
      zh: '准备时间15分钟，应急处理5分钟内',
      en: '15 minutes preparation time, emergency response within 5 minutes'
    },
    previewSections: {
      zh: [
        {
          title: '应急包必备物品',
          content: [
            '卫生巾/棉条（2-3片备用）',
            '湿纸巾和干纸巾',
            '一次性内裤或备用内裤',
            '小包装止痛药（如布洛芬）',
            '密封袋（处理用过的物品）'
          ],
          isHighlight: true
        },
        {
          title: '紧急情况处理步骤',
          content: [
            '1. 保持冷静，寻找最近的洗手间',
            '2. 使用应急包中的物品进行处理',
            '3. 如需帮助，联系信任的老师或同学',
            '4. 记录情况，为下次做好准备'
          ]
        }
      ],
      en: [
        {
          title: 'Emergency Kit Essentials',
          content: [
            'Sanitary pads/tampons (2-3 backup)',
            'Wet wipes and dry tissues',
            'Disposable or spare underwear',
            'Small pack pain relievers (like ibuprofen)',
            'Sealed bags (for used items)'
          ],
          isHighlight: true
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的应急包组装指南',
        '不同场景的应对策略',
        '与学校护士的沟通模板',
        '家长通知模板',
        '长期管理建议'
      ],
      en: [
        'Detailed emergency kit assembly guide',
        'Response strategies for different scenarios',
        'Communication templates with school nurse',
        'Parent notification templates',
        'Long-term management advice'
      ]
    }
  },

  // 3. 经期营养计划
  {
    id: 'menstrual-cycle-nutrition-plan',
    title: {
      zh: '经期营养计划',
      en: 'Menstrual Cycle Nutrition Plan'
    },
    keyPoints: {
      zh: [
        '科学的经期营养指导方案',
        '缓解经期症状的食物选择',
        '不同经期阶段的营养需求',
        '实用的饮食计划和食谱'
      ],
      en: [
        'Scientific menstrual nutrition guidance',
        'Food choices to relieve menstrual symptoms',
        'Nutritional needs for different menstrual phases',
        'Practical meal plans and recipes'
      ]
    },
    useCase: {
      zh: '适合希望通过饮食改善经期不适，建立健康饮食习惯的用户',
      en: 'Suitable for users who want to improve menstrual discomfort through diet and establish healthy eating habits'
    },
    estimatedTime: {
      zh: '制定计划30分钟，日常执行每餐5-10分钟',
      en: '30 minutes to create plan, 5-10 minutes per meal for daily execution'
    },
    previewSections: {
      zh: [
        {
          title: '经期营养核心原则',
          content: [
            '增加铁质摄入：红肉、菠菜、豆类',
            '补充镁元素：坚果、全谷物、深绿色蔬菜',
            '摄入优质蛋白：鱼类、蛋类、豆制品',
            '避免高糖高盐食物，减少炎症反应'
          ],
          isHighlight: true
        },
        {
          title: '缓解疼痛的食物',
          content: [
            '生姜：天然抗炎，缓解疼痛',
            '鱼类：富含Omega-3，减少炎症',
            '樱桃：天然褪黑素，改善睡眠',
            '黑巧克力：释放内啡肽，改善情绪'
          ]
        }
      ],
      en: [
        {
          title: 'Core Nutrition Principles',
          content: [
            'Increase iron intake: red meat, spinach, legumes',
            'Supplement magnesium: nuts, whole grains, dark leafy greens',
            'Consume quality protein: fish, eggs, soy products',
            'Avoid high sugar and salt foods to reduce inflammation'
          ],
          isHighlight: true
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '完整的4周营养计划',
        '50+经期友好食谱',
        '营养素补充指南',
        '购物清单模板',
        '症状改善追踪表'
      ],
      en: [
        'Complete 4-week nutrition plan',
        '50+ period-friendly recipes',
        'Nutritional supplement guide',
        'Shopping list templates',
        'Symptom improvement tracking'
      ]
    }
  },

  // 4. 健康习惯清单
  {
    id: 'healthy-habits-checklist',
    title: {
      zh: '健康习惯清单',
      en: 'Healthy Habits Checklist'
    },
    keyPoints: {
      zh: [
        '建立有益于经期健康的日常习惯',
        '系统性的生活方式改善指导',
        '可追踪的习惯养成计划',
        '长期健康管理策略'
      ],
      en: [
        'Establish daily habits beneficial for menstrual health',
        'Systematic lifestyle improvement guidance',
        'Trackable habit formation plan',
        'Long-term health management strategies'
      ]
    },
    useCase: {
      zh: '适合希望通过改善生活习惯来减少经期不适的用户',
      en: 'Suitable for users who want to reduce menstrual discomfort by improving lifestyle habits'
    },
    estimatedTime: {
      zh: '习惯建立需要21-66天，每日检查5分钟',
      en: '21-66 days to establish habits, 5 minutes daily check-in'
    },
    previewSections: {
      zh: [
        {
          title: '核心健康习惯',
          content: [
            '规律作息：每天同一时间睡觉起床',
            '适量运动：每周150分钟中等强度运动',
            '充足水分：每日8-10杯水',
            '压力管理：冥想、深呼吸、瑜伽'
          ],
          isHighlight: true
        },
        {
          title: '经期特殊护理',
          content: [
            '经期前一周减少咖啡因摄入',
            '增加温热食物，避免生冷',
            '保持腹部和腰部温暖',
            '适当减少高强度运动'
          ]
        }
      ],
      en: [
        {
          title: 'Core Health Habits',
          content: [
            'Regular schedule: sleep and wake at same time daily',
            'Moderate exercise: 150 minutes weekly',
            'Adequate hydration: 8-10 glasses of water daily',
            'Stress management: meditation, deep breathing, yoga'
          ],
          isHighlight: true
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '21天习惯养成计划',
        '每日检查清单',
        '进度追踪工具',
        '习惯堆叠策略',
        '挫折应对指南'
      ],
      en: [
        '21-day habit formation plan',
        'Daily checklist',
        'Progress tracking tools',
        'Habit stacking strategies',
        'Setback recovery guide'
      ]
    }
  },

  // 5. 自然疗法效果评估表
  {
    id: 'natural-therapy-assessment',
    title: {
      zh: '自然疗法效果评估表',
      en: 'Natural Therapy Assessment'
    },
    keyPoints: {
      zh: [
        '系统评估不同自然疗法的个人效果',
        '科学记录疗法使用前后的症状变化',
        '帮助找到最适合自己的治疗组合',
        '提供个性化的疗法调整建议'
      ],
      en: [
        'Systematically assess personal effectiveness of different natural therapies',
        'Scientifically record symptom changes before and after therapy use',
        'Help find the most suitable treatment combination for you',
        'Provide personalized therapy adjustment recommendations'
      ]
    },
    useCase: {
      zh: '适用于正在尝试或计划尝试自然疗法缓解痛经的女性，帮助客观评估疗效',
      en: 'Suitable for women who are trying or planning to try natural therapies for menstrual pain relief, helping to objectively assess effectiveness'
    },
    estimatedTime: {
      zh: '首次填写15分钟，后续跟踪每次5分钟',
      en: 'Initial completion 15 minutes, follow-up tracking 5 minutes each time'
    },
    previewSections: {
      zh: [
        {
          title: '评估表使用指南',
          content: [
            '本评估表旨在帮助您系统性地评估各种自然疗法的个人效果，找到最适合自己的缓解方案。',
            '建议在开始任何新的自然疗法前先记录基线症状，然后定期跟踪变化。',
            '评估周期建议为2-4周，以获得较为准确的效果判断。'
          ],
          isHighlight: true
        },
        {
          title: '基线症状记录',
          content: [
            '疼痛强度：使用1-10分量表记录平时的疼痛程度',
            '疼痛持续时间：记录疼痛通常持续多长时间',
            '伴随症状：如头痛、恶心、情绪变化等',
            '对日常生活的影响程度：工作、学习、社交等方面'
          ]
        },
        {
          title: '自然疗法分类评估',
          content: [
            '物理疗法：热敷、按摩、运动等',
            '草药疗法：中药茶饮、草本补充剂等',
            '饮食调整：抗炎饮食、营养补充等',
            '心理技巧：冥想、呼吸法、瑜伽等'
          ]
        }
      ],
      en: [
        {
          title: 'Assessment Guide',
          content: [
            'This assessment form is designed to help you systematically evaluate the personal effectiveness of various natural therapies and find the most suitable relief solutions for you.',
            'It is recommended to record baseline symptoms before starting any new natural therapy, then regularly track changes.',
            'The assessment cycle is recommended to be 2-4 weeks to obtain relatively accurate effectiveness judgment.'
          ],
          isHighlight: true
        },
        {
          title: 'Baseline Symptom Recording',
          content: [
            'Pain intensity: Use a 1-10 scale to record your usual pain level',
            'Pain duration: Record how long the pain usually lasts',
            'Accompanying symptoms: Such as headaches, nausea, mood changes, etc.',
            'Impact on daily life: Work, study, social activities, etc.'
          ]
        },
        {
          title: 'Natural Therapy Category Assessment',
          content: [
            'Physical therapy: Heat therapy, massage, exercise, etc.',
            'Herbal therapy: TCM teas, herbal supplements, etc.',
            'Dietary adjustments: Anti-inflammatory diet, nutritional supplements, etc.',
            'Psychological techniques: Meditation, breathing methods, yoga, etc.'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的疗法效果评分系统',
        '症状变化趋势分析图表',
        '个性化疗法组合建议',
        '副作用和注意事项记录',
        '与医生沟通的专业术语对照',
        '长期跟踪和调整指导'
      ],
      en: [
        'Detailed therapy effectiveness scoring system',
        'Symptom change trend analysis charts',
        'Personalized therapy combination recommendations',
        'Side effects and precautions recording',
        'Professional terminology reference for doctor communication',
        'Long-term tracking and adjustment guidance'
      ]
    }
  },

  // 6. 家长沟通指导手册
  {
    id: 'parent-communication-guide',
    title: {
      zh: '家长沟通指导手册',
      en: 'Parent Communication Guide'
    },
    keyPoints: {
      zh: [
        '帮助家长理解青春期女儿的生理变化',
        '提供科学、温和的沟通方式',
        '建立信任和支持的亲子关系',
        '处理紧急情况的实用指导'
      ],
      en: [
        'Help parents understand physiological changes in teenage daughters',
        'Provide scientific and gentle communication methods',
        'Build trusting and supportive parent-child relationships',
        'Practical guidance for handling emergencies'
      ]
    },
    useCase: {
      zh: '适合有青春期女儿的家长，特别是初次面对女儿经期问题的父母',
      en: 'Suitable for parents with teenage daughters, especially those facing their daughter\'s menstrual issues for the first time'
    },
    estimatedTime: {
      zh: '阅读时间20分钟，实践应用持续进行',
      en: '20 minutes reading time, continuous practical application'
    },
    previewSections: {
      zh: [
        {
          title: '理解青春期生理变化',
          content: [
            '青春期是女孩身体发育的重要阶段，月经初潮通常在10-15岁之间出现',
            '初期月经可能不规律，这是正常现象，需要耐心和理解',
            '生理变化可能伴随情绪波动，家长需要给予更多关爱和支持',
            '及时提供正确的生理知识，消除恐惧和羞耻感'
          ],
          isHighlight: true
        },
        {
          title: '有效沟通技巧',
          content: [
            '选择合适的时机和环境进行交流',
            '使用科学、准确的词汇，避免隐晦或羞涩的表达',
            '倾听女儿的感受和担忧，给予情感支持',
            '分享自己的经历，让女儿感到不孤单'
          ]
        },
        {
          title: '应急处理指导',
          content: [
            '提前准备应急包，教会女儿如何使用',
            '建立紧急联系方式，确保女儿能及时求助',
            '了解学校的相关政策和支持措施',
            '与老师建立良好沟通，共同关注女儿的需求'
          ]
        }
      ],
      en: [
        {
          title: 'Understanding Adolescent Physiological Changes',
          content: [
            'Adolescence is an important stage of physical development for girls, with menarche typically occurring between ages 10-15',
            'Early menstruation may be irregular, which is normal and requires patience and understanding',
            'Physical changes may be accompanied by emotional fluctuations, requiring more care and support from parents',
            'Provide correct physiological knowledge promptly to eliminate fear and shame'
          ],
          isHighlight: true
        },
        {
          title: 'Effective Communication Skills',
          content: [
            'Choose appropriate timing and environment for communication',
            'Use scientific and accurate vocabulary, avoid vague or shy expressions',
            'Listen to your daughter\'s feelings and concerns, provide emotional support',
            'Share your own experiences to make your daughter feel less alone'
          ]
        },
        {
          title: 'Emergency Response Guidance',
          content: [
            'Prepare emergency kits in advance and teach your daughter how to use them',
            'Establish emergency contact methods to ensure your daughter can seek help promptly',
            'Understand school policies and support measures',
            'Build good communication with teachers to jointly address your daughter\'s needs'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的青春期发育时间表和里程碑',
        '不同年龄段的沟通策略和话术模板',
        '常见问题解答和专家建议',
        '紧急情况处理流程图',
        '与学校和医生的协作指南',
        '长期支持和关爱的实用建议'
      ],
      en: [
        'Detailed adolescent development timeline and milestones',
        'Communication strategies and templates for different age groups',
        'FAQ and expert advice',
        'Emergency response flowcharts',
        'Collaboration guidelines with schools and doctors',
        'Practical advice for long-term support and care'
      ]
    }
  },

  // 7. 教师健康管理手册
  {
    id: 'teacher-health-manual',
    title: {
      zh: '教师健康管理手册',
      en: 'Teacher Health Manual'
    },
    keyPoints: {
      zh: [
        '学校环境下的经期健康管理',
        '识别和应对学生的经期不适',
        '创建支持性的校园环境',
        '与家长和医务人员的协作'
      ],
      en: [
        'Menstrual health management in school environment',
        'Identify and respond to students\' menstrual discomfort',
        'Create supportive campus environment',
        'Collaboration with parents and medical staff'
      ]
    },
    useCase: {
      zh: '适合中小学教师、学校卫生人员和教育管理者',
      en: 'Suitable for primary and secondary school teachers, school health personnel, and education administrators'
    },
    estimatedTime: {
      zh: '培训时间30分钟，日常应用随时进行',
      en: '30 minutes training time, daily application as needed'
    },
    previewSections: {
      zh: [
        {
          title: '识别经期不适的学生',
          content: [
            '观察学生的行为变化：注意力不集中、情绪波动、频繁请假等',
            '身体症状识别：面色苍白、捂腹部、坐立不安等表现',
            '学习表现变化：成绩下降、参与度降低、缺勤增加',
            '建立观察记录，及时发现需要帮助的学生'
          ],
          isHighlight: true
        },
        {
          title: '应对策略和支持措施',
          content: [
            '提供私密的休息空间，允许学生适当休息',
            '准备基本的应急用品：卫生巾、热水袋、止痛药等',
            '调整课堂活动，减少剧烈运动要求',
            '与学生进行私下沟通，了解具体需求'
          ]
        },
        {
          title: '创建支持性环境',
          content: [
            '在教室或办公室准备应急包',
            '建立学生求助的便捷渠道',
            '开展健康教育，消除同学间的误解',
            '与校医务室建立快速联系机制'
          ]
        }
      ],
      en: [
        {
          title: 'Identifying Students with Menstrual Discomfort',
          content: [
            'Observe behavioral changes: lack of concentration, mood swings, frequent absences',
            'Physical symptom recognition: pale complexion, holding abdomen, restlessness',
            'Academic performance changes: declining grades, reduced participation, increased absences',
            'Maintain observation records to identify students who need help promptly'
          ],
          isHighlight: true
        },
        {
          title: 'Response Strategies and Support Measures',
          content: [
            'Provide private rest space, allow students appropriate rest',
            'Prepare basic emergency supplies: sanitary pads, hot water bottles, pain relievers',
            'Adjust classroom activities, reduce vigorous exercise requirements',
            'Communicate privately with students to understand specific needs'
          ]
        },
        {
          title: 'Creating Supportive Environment',
          content: [
            'Prepare emergency kits in classrooms or offices',
            'Establish convenient channels for students to seek help',
            'Conduct health education to eliminate misunderstandings among classmates',
            'Establish quick contact mechanism with school medical office'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '完整的学生健康评估表格',
        '与家长沟通的标准流程',
        '紧急情况处理预案',
        '健康教育课程设计方案',
        '法律法规和政策指导',
        '案例分析和最佳实践分享'
      ],
      en: [
        'Complete student health assessment forms',
        'Standard procedures for communicating with parents',
        'Emergency response plans',
        'Health education curriculum design',
        'Legal regulations and policy guidance',
        'Case studies and best practice sharing'
      ]
    }
  },

  // 8. 教师协作手册
  {
    id: 'teacher-collaboration-handbook',
    title: {
      zh: '教师协作手册',
      en: 'Teacher Collaboration Handbook'
    },
    keyPoints: {
      zh: [
        '多学科教师间的协作机制',
        '理解和支持经期不适的学生',
        '建立校园关爱网络',
        '专业发展和培训指导'
      ],
      en: [
        'Collaboration mechanisms among multidisciplinary teachers',
        'Understanding and supporting students with menstrual discomfort',
        'Building campus care networks',
        'Professional development and training guidance'
      ]
    },
    useCase: {
      zh: '适合学校教师团队、年级组长和教学管理人员',
      en: 'Suitable for school teaching teams, grade leaders, and teaching administrators'
    },
    estimatedTime: {
      zh: '团队培训45分钟，协作实施持续进行',
      en: '45 minutes team training, continuous collaborative implementation'
    },
    previewSections: {
      zh: [
        {
          title: '建立协作机制',
          content: [
            '成立学生健康关爱小组，包括班主任、任课教师、校医等',
            '建立信息共享机制，及时沟通学生情况',
            '制定统一的应对标准和流程',
            '定期召开协作会议，总结经验和改进措施'
          ],
          isHighlight: true
        },
        {
          title: '理解学生需求',
          content: [
            '认识经期对学生学习和生活的影响',
            '了解不同年龄段学生的特点和需求',
            '掌握基本的生理健康知识',
            '培养同理心和耐心，给予学生理解和支持'
          ]
        },
        {
          title: '实施支持措施',
          content: [
            '课堂教学中的灵活调整',
            '考试和作业的人性化安排',
            '体育课和课外活动的适当调整',
            '心理支持和情感关怀'
          ]
        }
      ],
      en: [
        {
          title: 'Establishing Collaboration Mechanisms',
          content: [
            'Form student health care groups including homeroom teachers, subject teachers, school doctors',
            'Establish information sharing mechanisms to communicate student situations promptly',
            'Develop unified response standards and procedures',
            'Hold regular collaboration meetings to summarize experiences and improvements'
          ],
          isHighlight: true
        },
        {
          title: 'Understanding Student Needs',
          content: [
            'Recognize the impact of menstruation on students\' learning and life',
            'Understand characteristics and needs of students at different ages',
            'Master basic physiological health knowledge',
            'Develop empathy and patience, provide understanding and support to students'
          ]
        },
        {
          title: 'Implementing Support Measures',
          content: [
            'Flexible adjustments in classroom teaching',
            'Humanized arrangements for exams and assignments',
            'Appropriate adjustments for PE classes and extracurricular activities',
            'Psychological support and emotional care'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的协作流程图和责任分工',
        '学生个案管理和跟踪系统',
        '家校沟通的标准模板',
        '教师培训课程和资源',
        '效果评估和持续改进方案',
        '相关法规政策和伦理指导'
      ],
      en: [
        'Detailed collaboration flowcharts and responsibility assignments',
        'Student case management and tracking systems',
        'Standard templates for home-school communication',
        'Teacher training courses and resources',
        'Effectiveness evaluation and continuous improvement plans',
        'Relevant regulations, policies, and ethical guidance'
      ]
    }
  },

  // 9. 特定痛经管理指南
  {
    id: 'specific-menstrual-pain-management-guide',
    title: {
      zh: '特定痛经管理指南',
      en: 'Specific Menstrual Pain Management Guide'
    },
    keyPoints: {
      zh: [
        '针对不同类型痛经的个性化方案',
        '原发性和继发性痛经的区别',
        '多种缓解方法的组合使用',
        '何时需要寻求医疗帮助'
      ],
      en: [
        'Personalized solutions for different types of menstrual pain',
        'Distinction between primary and secondary dysmenorrhea',
        'Combined use of multiple relief methods',
        'When to seek medical help'
      ]
    },
    useCase: {
      zh: '适合经历严重痛经或需要个性化管理方案的用户',
      en: 'Suitable for users experiencing severe menstrual pain or needing personalized management plans'
    },
    estimatedTime: {
      zh: '评估15分钟，制定方案30分钟，执行因人而异',
      en: '15 minutes assessment, 30 minutes plan creation, execution varies by individual'
    },
    previewSections: {
      zh: [
        {
          title: '痛经类型识别',
          content: [
            '原发性痛经：无器质性病变，通常青春期开始',
            '继发性痛经：由疾病引起，如子宫内膜异位症',
            '疼痛特征：痉挛性、胀痛、放射痛',
            '伴随症状：恶心、头痛、腹泻等'
          ],
          isHighlight: true
        },
        {
          title: '分级管理策略',
          content: [
            '轻度疼痛：热敷、轻度运动、放松技巧',
            '中度疼痛：非处方止痛药+物理疗法',
            '重度疼痛：处方药物+综合治疗',
            '紧急情况：立即就医的警告信号'
          ]
        }
      ],
      en: [
        {
          title: 'Pain Type Identification',
          content: [
            'Primary dysmenorrhea: no organic disease, usually starts in adolescence',
            'Secondary dysmenorrhea: caused by diseases like endometriosis',
            'Pain characteristics: cramping, aching, radiating pain',
            'Associated symptoms: nausea, headache, diarrhea'
          ],
          isHighlight: true
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的痛经评估工具',
        '个性化治疗方案模板',
        '药物使用指导',
        '医生沟通准备清单',
        '长期管理计划'
      ],
      en: [
        'Detailed pain assessment tools',
        'Personalized treatment plan templates',
        'Medication usage guidance',
        'Doctor communication preparation checklist',
        'Long-term management plan'
      ]
    }
  },

  // 10. 并发症管理指南
  {
    id: 'menstrual-pain-complications-management',
    title: {
      zh: '并发症管理指南',
      en: 'Menstrual Pain Complications Management'
    },
    keyPoints: {
      zh: [
        '识别经期并发症的早期征象',
        '常见并发症的应对策略',
        '紧急情况的处理流程',
        '预防并发症的有效措施'
      ],
      en: [
        'Identify early signs of menstrual complications',
        'Response strategies for common complications',
        'Emergency response procedures',
        'Effective measures to prevent complications'
      ]
    },
    useCase: {
      zh: '适合经历严重经期症状或有并发症风险的用户',
      en: 'Suitable for users experiencing severe menstrual symptoms or at risk of complications'
    },
    estimatedTime: {
      zh: '学习指南20分钟，应急处理5-10分钟',
      en: '20 minutes to learn guide, 5-10 minutes for emergency response'
    },
    previewSections: {
      zh: [
        {
          title: '警告信号识别',
          content: [
            '异常大量出血：超过正常月经量2倍以上',
            '持续性剧烈疼痛：止痛药无法缓解',
            '发热症状：体温超过38.5°C',
            '严重恶心呕吐：无法进食或饮水'
          ],
          isHighlight: true
        },
        {
          title: '常见并发症类型',
          content: [
            '贫血：长期大量出血导致',
            '感染：不当卫生习惯引起',
            '血栓：长期卧床或激素影响',
            '情绪障碍：严重经前综合征'
          ]
        },
        {
          title: '紧急处理步骤',
          content: [
            '1. 立即停止剧烈活动，保持平躺',
            '2. 记录症状时间和严重程度',
            '3. 联系医疗机构或拨打急救电话',
            '4. 准备病史资料和用药记录'
          ]
        }
      ],
      en: [
        {
          title: 'Warning Signs Recognition',
          content: [
            'Abnormally heavy bleeding: more than twice normal flow',
            'Persistent severe pain: unrelieved by pain medication',
            'Fever symptoms: temperature above 38.5°C',
            'Severe nausea and vomiting: unable to eat or drink'
          ],
          isHighlight: true
        },
        {
          title: 'Common Complication Types',
          content: [
            'Anemia: caused by long-term heavy bleeding',
            'Infection: caused by improper hygiene habits',
            'Blood clots: prolonged bed rest or hormonal effects',
            'Mood disorders: severe premenstrual syndrome'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的症状评估量表',
        '并发症预防检查清单',
        '紧急联系信息模板',
        '医院就诊准备指南',
        '康复期护理建议',
        '长期监测计划'
      ],
      en: [
        'Detailed symptom assessment scales',
        'Complication prevention checklists',
        'Emergency contact information templates',
        'Hospital visit preparation guide',
        'Recovery period care advice',
        'Long-term monitoring plan'
      ]
    }
  },

  // 11. 镁与肠道健康指南
  {
    id: 'magnesium-gut-health-guide',
    title: {
      zh: '镁与肠道健康指南',
      en: 'Magnesium & Gut Health Guide'
    },
    keyPoints: {
      zh: [
        '镁元素对经期健康的重要作用',
        '肠道健康与经期症状的关联',
        '科学的镁补充方法和剂量',
        '改善肠道菌群的实用建议'
      ],
      en: [
        'Important role of magnesium in menstrual health',
        'Connection between gut health and menstrual symptoms',
        'Scientific magnesium supplementation methods and dosages',
        'Practical advice for improving gut microbiome'
      ]
    },
    useCase: {
      zh: '适合有消化问题、经期不适或希望通过营养改善症状的用户',
      en: 'Suitable for users with digestive issues, menstrual discomfort, or those wanting to improve symptoms through nutrition'
    },
    estimatedTime: {
      zh: '阅读15分钟，制定补充计划10分钟',
      en: '15 minutes reading, 10 minutes to create supplementation plan'
    },
    previewSections: {
      zh: [
        {
          title: '镁的生理作用',
          content: [
            '肌肉放松：缓解子宫收缩引起的疼痛',
            '神经调节：改善情绪波动和焦虑',
            '激素平衡：支持雌激素和孕激素代谢',
            '炎症控制：减少前列腺素的产生'
          ],
          isHighlight: true
        },
        {
          title: '肠道健康的重要性',
          content: [
            '肠道菌群影响激素代谢',
            '炎症反应与经期症状相关',
            '营养吸收影响整体健康',
            '肠脑轴调节情绪和疼痛感知'
          ]
        },
        {
          title: '镁的食物来源',
          content: [
            '深绿色蔬菜：菠菜、羽衣甘蓝',
            '坚果种子：杏仁、南瓜子、芝麻',
            '全谷物：燕麦、糙米、藜麦',
            '豆类：黑豆、扁豆、鹰嘴豆'
          ]
        }
      ],
      en: [
        {
          title: 'Physiological Functions of Magnesium',
          content: [
            'Muscle relaxation: relieves pain from uterine contractions',
            'Nerve regulation: improves mood swings and anxiety',
            'Hormone balance: supports estrogen and progesterone metabolism',
            'Inflammation control: reduces prostaglandin production'
          ],
          isHighlight: true
        },
        {
          title: 'Importance of Gut Health',
          content: [
            'Gut microbiome affects hormone metabolism',
            'Inflammatory response related to menstrual symptoms',
            'Nutrient absorption affects overall health',
            'Gut-brain axis regulates mood and pain perception'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '详细的镁补充剂选择指南',
        '个性化剂量计算方法',
        '肠道健康评估工具',
        '益生菌和益生元推荐',
        '饮食计划和食谱',
        '症状改善追踪表'
      ],
      en: [
        'Detailed magnesium supplement selection guide',
        'Personalized dosage calculation methods',
        'Gut health assessment tools',
        'Probiotic and prebiotic recommendations',
        'Meal plans and recipes',
        'Symptom improvement tracking sheets'
      ]
    }
  },

  // 12. 站桩八段锦图解指南
  {
    id: 'zhan-zhuang-baduanjin-illustrated-guide',
    title: {
      zh: '站桩八段锦图解指南',
      en: 'Standing Meditation & Eight Brocades Illustrated Guide'
    },
    keyPoints: {
      zh: [
        '传统中医养生功法的现代应用',
        '缓解经期疼痛的温和运动',
        '改善气血循环和身体平衡',
        '简单易学的日常保健方法'
      ],
      en: [
        'Modern application of traditional Chinese health practices',
        'Gentle exercise to relieve menstrual pain',
        'Improve blood circulation and body balance',
        'Simple and easy-to-learn daily health methods'
      ]
    },
    useCase: {
      zh: '适合喜欢传统养生方法、希望通过温和运动改善经期不适的用户',
      en: 'Suitable for users who prefer traditional health methods and want to improve menstrual discomfort through gentle exercise'
    },
    estimatedTime: {
      zh: '学习动作15分钟，每日练习10-20分钟',
      en: '15 minutes to learn movements, 10-20 minutes daily practice'
    },
    previewSections: {
      zh: [
        {
          title: '站桩基本姿势',
          content: [
            '双脚与肩同宽，脚尖微微外展',
            '膝盖微屈，重心下沉',
            '脊柱挺直，头顶百会穴上提',
            '双臂自然下垂，肩膀放松'
          ],
          isHighlight: true
        },
        {
          title: '八段锦核心动作预览',
          content: [
            '双手托天理三焦：调节内分泌',
            '左右开弓似射雕：疏通经络',
            '调理脾胃须单举：改善消化',
            '五劳七伤往后瞧：缓解疲劳'
          ]
        },
        {
          title: '经期练习要点',
          content: [
            '动作要轻柔缓慢，避免剧烈运动',
            '呼吸要深长自然，配合动作节奏',
            '如有不适立即停止，不要勉强',
            '经期前3天可适当减少练习强度'
          ]
        }
      ],
      en: [
        {
          title: 'Basic Standing Posture',
          content: [
            'Feet shoulder-width apart, toes slightly turned out',
            'Knees slightly bent, center of gravity lowered',
            'Spine straight, crown of head lifted up',
            'Arms naturally hanging, shoulders relaxed'
          ],
          isHighlight: true
        },
        {
          title: 'Core Eight Brocades Movements Preview',
          content: [
            'Holding up the sky with both hands: regulates endocrine',
            'Drawing the bow left and right: unblocks meridians',
            'Single hand raise for spleen and stomach: improves digestion',
            'Looking back to prevent fatigue: relieves tiredness'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '完整的12式动作图解',
        '详细的呼吸配合指导',
        '不同体质的练习调整',
        '常见错误和纠正方法',
        '进阶练习计划',
        '经期特殊注意事项'
      ],
      en: [
        'Complete 12-movement illustrated guide',
        'Detailed breathing coordination guidance',
        'Practice adjustments for different constitutions',
        'Common mistakes and correction methods',
        'Advanced practice plans',
        'Special precautions during menstruation'
      ]
    }
  },
  {
    id: 'us-insurance-quick-reference-card',
    title: {
      zh: '美国医疗保险快速参考卡',
      en: 'US Medical Insurance Quick Reference Card'
    },
    keyPoints: {
      zh: [
        '2025年Medicare Part D覆盖缺口期完全取消',
        '年度自付上限$2,000生效',
        '金属计划费用对比一目了然',
        '常见药物自付费用参考',
        '保险申诉流程详细指导',
        '紧急情况覆盖标准'
      ],
      en: [
        '2025 Medicare Part D coverage gap completely eliminated',
        'Annual out-of-pocket maximum $2,000 in effect',
        'Metal plan cost comparison at a glance',
        'Common medication copay reference',
        'Detailed insurance appeal process guidance',
        'Emergency situation coverage criteria'
      ]
    },
    useCase: {
      zh: '适用于需要快速查阅美国医疗保险关键信息的痛经患者，特别是保险选择、费用计算和申诉流程',
      en: 'Suitable for menstrual pain patients who need quick access to key US medical insurance information, especially insurance selection, cost calculation, and appeal processes'
    },
    estimatedTime: {
      zh: '5-10分钟快速查阅',
      en: '5-10 minutes quick reference'
    },
    previewSections: {
      zh: [
        {
          title: '2025年关键政策更新',
          content: [
            'Medicare Part D"覆盖缺口期"已完全取消',
            '新的三阶段结构：自付额→初始覆盖→灾难性覆盖',
            'ACA补贴无上限政策延续至2025年底',
            '年度自付上限$2,000生效'
          ],
          isHighlight: true
        },
        {
          title: '金属计划对比',
          content: [
            'Bronze: $250-400/月，适合年轻健康女性',
            'Silver: $350-600/月，中低收入者推荐',
            'Gold: $500-800/月，慢性痛经患者',
            'Platinum: $700+/月，复杂病症患者'
          ]
        },
        {
          title: '常见药物费用',
          content: [
            'NSAIDs（布洛芬）：$5-15/月',
            '激素避孕药：$0-30/月（ACA强制覆盖）',
            'COX-2抑制剂：$30-100/月',
            '省钱技巧：选择通用药+90天供应'
          ]
        }
      ],
      en: [
        {
          title: '2025 Key Policy Updates',
          content: [
            'Medicare Part D "coverage gap" completely eliminated',
            'New three-phase structure: deductible→initial coverage→catastrophic coverage',
            'ACA subsidy cap removal extended through 2025',
            'Annual out-of-pocket maximum $2,000 in effect'
          ],
          isHighlight: true
        },
        {
          title: 'Metal Plan Comparison',
          content: [
            'Bronze: $250-400/month, suitable for young healthy women',
            'Silver: $350-600/month, recommended for low-moderate income',
            'Gold: $500-800/month, chronic menstrual pain patients',
            'Platinum: $700+/month, complex condition patients'
          ]
        },
        {
          title: 'Common Medication Costs',
          content: [
            'NSAIDs (Ibuprofen): $5-15/month',
            'Hormonal contraceptives: $0-30/month (ACA mandatory coverage)',
            'COX-2 inhibitors: $30-100/month',
            'Money-saving tip: Choose generic + 90-day supply'
          ]
        }
      ]
    },
    fullVersionIncludes: {
      zh: [
        '完整的费用计算公式和实例',
        '详细的申诉流程图和时间节点',
        '低收入解决方案和援助计划',
        '紧急情况覆盖标准和证明材料',
        '重要联系方式和官方网站',
        '2025年政策时间节点提醒',
        '收入资格快查表',
        '行动清单和准备事项'
      ],
      en: [
        'Complete cost calculation formulas and examples',
        'Detailed appeal process flowchart and timelines',
        'Low-income solutions and assistance programs',
        'Emergency situation coverage criteria and documentation',
        'Important contact information and official websites',
        '2025 policy timeline reminders',
        'Income eligibility quick reference table',
        'Action checklist and preparation items'
      ]
    }
  }
];

/**
 * 根据ID获取预览内容
 */
export function getPreviewContentById(id: string): PreviewContent | undefined {
  return PREVIEW_CONTENT.find(content => content.id === id);
}

/**
 * 获取所有可预览的资源ID
 */
export function getPreviewableResourceIds(): string[] {
  return PREVIEW_CONTENT.map(content => content.id);
}
