/**
 * Period Hub 阶段2：批量生成17个新PDF HTML文件
 * 从13个PDF扩展到30个PDF的内容创建脚本
 */

const fs = require('fs');
const path = require('path');

// 17个新PDF资源的配置
const newPDFResources = [
  // 即时缓解分类 (+4个)
  {
    id: 'emergency-pain-relief-card',
    title: { zh: '紧急疼痛缓解卡片', en: 'Emergency Pain Relief Card' },
    description: { zh: '便携式紧急疼痛缓解方法速查卡', en: 'Portable quick reference card for emergency pain relief methods' },
    category: 'immediate',
    content: {
      zh: [
        '紧急疼痛缓解方法',
        '1. 深呼吸 - 4秒吸气，6秒呼气，重复5次',
        '2. 热敷 - 使用热水袋或热毛巾敷在下腹部15分钟',
        '3. 轻柔按摩 - 顺时针按摩下腹部和腰部',
        '4. 放松姿势 - 采用胎儿式侧卧或膝胸位',
        '5. 药物缓解 - 按医嘱服用止痛药物',
        '紧急联系：如疼痛剧烈且持续，立即就医'
      ],
      en: [
        'Emergency Pain Relief Methods',
        '1. Deep Breathing - Inhale 4 seconds, exhale 6 seconds, repeat 5 times',
        '2. Heat Application - Use heating pad or warm towel on lower abdomen for 15 minutes',
        '3. Gentle Massage - Clockwise massage of lower abdomen and lower back',
        '4. Relaxation Position - Fetal position or knee-chest position',
        '5. Medication - Take pain relief medication as prescribed',
        'Emergency Contact: Seek immediate medical attention for severe persistent pain'
      ]
    }
  },
  {
    id: '5-minute-relief-checklist',
    title: { zh: '5分钟快速缓解检查清单', en: '5-Minute Quick Relief Checklist' },
    description: { zh: '即时可用的5分钟快速缓解步骤清单', en: 'Instant-use 5-minute quick relief step checklist' },
    category: 'immediate',
    content: {
      zh: [
        '5分钟快速缓解步骤',
        '第1分钟：找到舒适位置，放松身体',
        '第2分钟：开始深呼吸练习，调节呼吸节奏',
        '第3分钟：轻柔按摩疼痛部位，促进血液循环',
        '第4分钟：应用热敷或冷敷（根据个人喜好）',
        '第5分钟：保持放松状态，评估疼痛缓解程度',
        '注意：如果疼痛未缓解，请考虑其他治疗方法'
      ],
      en: [
        '5-Minute Quick Relief Steps',
        'Minute 1: Find comfortable position, relax body',
        'Minute 2: Begin deep breathing exercise, regulate breathing rhythm',
        'Minute 3: Gentle massage of painful area, promote blood circulation',
        'Minute 4: Apply heat or cold therapy (according to personal preference)',
        'Minute 5: Maintain relaxed state, evaluate pain relief progress',
        'Note: If pain persists, consider additional treatment methods'
      ]
    }
  },
  {
    id: 'heat-therapy-guide-pdf',
    title: { zh: '热疗完整指南PDF版', en: 'Complete Heat Therapy Guide PDF' },
    description: { zh: '详细的热疗使用方法和注意事项指南', en: 'Detailed guide on heat therapy methods and precautions' },
    category: 'immediate',
    content: {
      zh: [
        '热疗完整指南',
        '一、热疗原理：通过温热刺激促进血液循环，缓解肌肉紧张',
        '二、热疗方法：',
        '• 热水袋：温度40-45°C，敷15-20分钟',
        '• 热毛巾：温热毛巾敷患处，每5分钟更换',
        '• 温水浴：38-40°C温水浸泡15-20分钟',
        '三、注意事项：',
        '• 避免过热导致烫伤',
        '• 皮肤敏感者谨慎使用',
        '• 急性炎症期不宜使用'
      ],
      en: [
        'Complete Heat Therapy Guide',
        '1. Heat Therapy Principles: Thermal stimulation promotes blood circulation and relieves muscle tension',
        '2. Heat Therapy Methods:',
        '• Heating Pad: Temperature 40-45°C, apply for 15-20 minutes',
        '• Hot Towel: Apply warm towel to affected area, change every 5 minutes',
        '• Warm Bath: Soak in 38-40°C water for 15-20 minutes',
        '3. Precautions:',
        '• Avoid overheating to prevent burns',
        '• Use cautiously for sensitive skin',
        '• Not recommended during acute inflammation'
      ]
    }
  },
  {
    id: 'workplace-relief-toolkit',
    title: { zh: '职场疼痛缓解工具包', en: 'Workplace Pain Relief Toolkit' },
    description: { zh: '办公环境下的疼痛管理和缓解方案', en: 'Pain management and relief solutions for office environments' },
    category: 'immediate',
    content: {
      zh: [
        '职场疼痛缓解工具包',
        '一、办公室友好的缓解方法：',
        '• 座椅调整：保持正确坐姿，减少腰部压力',
        '• 桌下小热垫：可调节温度的便携式热垫',
        '• 呼吸练习：不引人注意的深呼吸技巧',
        '二、工作间隙安排：',
        '• 每小时起身活动5分钟',
        '• 简单的伸展运动',
        '三、应急用品：',
        '• 便携式热贴，止痛药物，舒缓茶包'
      ],
      en: [
        'Workplace Pain Relief Toolkit',
        '1. Office-Friendly Relief Methods:',
        '• Chair Adjustment: Maintain proper posture, reduce lower back pressure',
        '• Under-desk Heating Pad: Portable adjustable temperature heating pad',
        '• Breathing Exercises: Discreet deep breathing techniques',
        '2. Work Break Schedule:',
        '• Stand and move for 5 minutes every hour',
        '• Simple stretching exercises',
        '3. Emergency Supplies:',
        '• Portable heat patches, pain relief medication, soothing tea bags'
      ]
    }
  },

  // 计划准备分类 (+3个)
  {
    id: 'monthly-preparation-planner',
    title: { zh: '月度准备计划表', en: 'Monthly Preparation Planner' },
    description: { zh: '提前规划经期健康管理的月度计划工具', en: 'Monthly planning tool for advance menstrual health management' },
    category: 'preparation',
    content: {
      zh: [
        '月度准备计划表',
        '一、周期前准备（1-7天）：',
        '• 饮食调整：增加抗炎食物摄入',
        '• 运动安排：适度有氧运动',
        '• 心理准备：放松练习，压力管理',
        '二、周期中管理（1-5天）：',
        '• 症状监测：记录疼痛程度和症状',
        '• 缓解措施：热敷、按摩、药物',
        '三、周期后恢复（1-3天）：',
        '• 营养补充：铁质和维生素补充',
        '• 身体恢复：轻度运动恢复'
      ],
      en: [
        'Monthly Preparation Planner',
        '1. Pre-Cycle Preparation (1-7 days):',
        '• Dietary Adjustment: Increase anti-inflammatory food intake',
        '• Exercise Schedule: Moderate aerobic exercise',
        '• Mental Preparation: Relaxation practice, stress management',
        '2. During Cycle Management (1-5 days):',
        '• Symptom Monitoring: Record pain levels and symptoms',
        '• Relief Measures: Heat therapy, massage, medication',
        '3. Post-Cycle Recovery (1-3 days):',
        '• Nutritional Support: Iron and vitamin supplementation',
        '• Physical Recovery: Light exercise resumption'
      ]
    }
  },
  {
    id: 'stress-management-workbook',
    title: { zh: '压力管理工作册', en: 'Stress Management Workbook' },
    description: { zh: '经期压力管理的实用练习册和指导手册', en: 'Practical workbook and guide for menstrual stress management' },
    category: 'preparation',
    content: {
      zh: [
        '压力管理工作册',
        '一、压力识别练习：',
        '• 身体信号：头痛、肌肉紧张、疲劳',
        '• 情绪信号：焦虑、易怒、情绪低落',
        '• 行为信号：食欲变化、睡眠问题',
        '二、压力缓解技巧：',
        '• 深呼吸法：4-7-8呼吸技巧',
        '• 渐进性肌肉放松',
        '• 正念冥想练习',
        '三、日常压力管理：',
        '• 时间管理技巧',
        '• 边界设定方法',
        '• 支持系统建立'
      ],
      en: [
        'Stress Management Workbook',
        '1. Stress Identification Exercises:',
        '• Physical Signals: Headaches, muscle tension, fatigue',
        '• Emotional Signals: Anxiety, irritability, mood changes',
        '• Behavioral Signals: Appetite changes, sleep problems',
        '2. Stress Relief Techniques:',
        '• Deep Breathing: 4-7-8 breathing technique',
        '• Progressive muscle relaxation',
        '• Mindfulness meditation practice',
        '3. Daily Stress Management:',
        '• Time management skills',
        '• Boundary setting methods',
        '• Support system building'
      ]
    }
  },
  {
    id: 'sleep-quality-improvement-guide',
    title: { zh: '睡眠质量改善指南', en: 'Sleep Quality Improvement Guide' },
    description: { zh: '经期睡眠优化的详细指导和实用技巧', en: 'Detailed guidance and practical tips for menstrual sleep optimization' },
    category: 'preparation',
    content: {
      zh: [
        '睡眠质量改善指南',
        '一、睡眠环境优化：',
        '• 温度控制：保持18-22°C室温',
        '• 光线管理：使用遮光窗帘',
        '• 噪音控制：耳塞或白噪音',
        '二、睡前准备：',
        '• 放松活动：热水澡、阅读、冥想',
        '• 避免刺激：咖啡因、电子设备',
        '三、睡眠姿势：',
        '• 侧卧位：减少腹部压力',
        '• 枕头支撑：膝盖间放置小枕头'
      ],
      en: [
        'Sleep Quality Improvement Guide',
        '1. Sleep Environment Optimization:',
        '• Temperature Control: Maintain 18-22°C room temperature',
        '• Light Management: Use blackout curtains',
        '• Noise Control: Earplugs or white noise',
        '2. Pre-sleep Preparation:',
        '• Relaxing Activities: Hot bath, reading, meditation',
        '• Avoid Stimulants: Caffeine, electronic devices',
        '3. Sleep Positions:',
        '• Side-lying: Reduces abdominal pressure',
        '• Pillow Support: Place small pillow between knees'
      ]
    }
  },

  // 学习理解分类 (+4个)
  {
    id: 'menstrual-cycle-education-guide',
    title: { zh: '月经周期教育指南', en: 'Menstrual Cycle Education Guide' },
    description: { zh: '全面的月经周期科学教育和健康知识材料', en: 'Comprehensive scientific education material about menstrual cycle and health' },
    category: 'learning',
    content: {
      zh: [
        '月经周期教育指南',
        '一、生理周期基础：',
        '• 月经期（1-5天）：子宫内膜脱落',
        '• 卵泡期（1-13天）：卵泡发育',
        '• 排卵期（14天）：卵子释放',
        '• 黄体期（15-28天）：黄体形成',
        '二、激素变化：',
        '• 雌激素和孕激素的周期性变化',
        '• 对身体和情绪的影响',
        '三、健康管理：',
        '• 周期追踪的重要性',
        '• 异常情况的识别'
      ],
      en: [
        'Menstrual Cycle Education Guide',
        '1. Physiological Cycle Basics:',
        '• Menstrual Phase (1-5 days): Endometrial shedding',
        '• Follicular Phase (1-13 days): Follicle development',
        '• Ovulation (Day 14): Egg release',
        '• Luteal Phase (15-28 days): Corpus luteum formation',
        '2. Hormonal Changes:',
        '• Cyclical changes in estrogen and progesterone',
        '• Effects on body and emotions',
        '3. Health Management:',
        '• Importance of cycle tracking',
        '• Identifying abnormal conditions'
      ]
    }
  },
  {
    id: 'pain-research-summary-2024',
    title: { zh: '2024痛经研究摘要', en: '2024 Pain Research Summary' },
    description: { zh: '2024年最新痛经研究成果和科学进展汇总', en: '2024 latest menstrual pain research findings and scientific progress summary' },
    category: 'learning',
    content: {
      zh: [
        '2024痛经研究摘要',
        '一、最新研究发现：',
        '• 遗传因素对痛经的影响机制',
        '• 肠道微生物与经期疼痛的关联',
        '• 新型治疗方法的临床试验结果',
        '二、治疗方法进展：',
        '• 个性化治疗方案的发展',
        '• 非药物治疗的有效性研究',
        '三、预防策略：',
        '• 生活方式干预的长期效果',
        '• 营养补充剂的作用机制'
      ],
      en: [
        '2024 Pain Research Summary',
        '1. Latest Research Findings:',
        '• Genetic factors influence mechanisms on dysmenorrhea',
        '• Gut microbiome connection to menstrual pain',
        '• Clinical trial results of novel treatment methods',
        '2. Treatment Method Progress:',
        '• Development of personalized treatment approaches',
        '• Effectiveness studies of non-pharmacological treatments',
        '3. Prevention Strategies:',
        '• Long-term effects of lifestyle interventions',
        '• Mechanisms of action of nutritional supplements'
      ]
    }
  },
  {
    id: 'medical-consultation-preparation',
    title: { zh: '就医咨询准备指南', en: 'Medical Consultation Preparation Guide' },
    description: { zh: '就医前的准备工作和问题清单指导', en: 'Guidance for preparation and question checklist before medical appointments' },
    category: 'learning',
    content: {
      zh: [
        '就医咨询准备指南',
        '一、就医前准备：',
        '• 症状记录：疼痛程度、持续时间、发生频率',
        '• 病史整理：既往疾病、手术史、过敏史',
        '• 药物清单：当前使用的所有药物',
        '二、重要问题清单：',
        '• 我的症状是否正常？',
        '• 需要做哪些检查？',
        '• 有什么治疗选择？',
        '三、沟通技巧：',
        '• 准确描述症状',
        '• 主动询问不明白的地方'
      ],
      en: [
        'Medical Consultation Preparation Guide',
        '1. Pre-Appointment Preparation:',
        '• Symptom Record: Pain level, duration, frequency',
        '• Medical History: Past illnesses, surgery history, allergies',
        '• Medication List: All currently used medications',
        '2. Important Questions Checklist:',
        '• Are my symptoms normal?',
        '• What tests do I need?',
        '• What treatment options are available?',
        '3. Communication Skills:',
        '• Accurately describe symptoms',
        '• Actively ask about unclear points'
      ]
    }
  },
  {
    id: 'global-health-perspectives',
    title: { zh: '全球健康视角报告', en: 'Global Health Perspectives Report' },
    description: { zh: '不同文化背景下经期健康管理方法的比较研究', en: 'Comparative study of menstrual health management across different cultural backgrounds' },
    category: 'learning',
    content: {
      zh: [
        '全球健康视角报告',
        '一、文化差异分析：',
        '• 亚洲：传统中医理论与现代医学结合',
        '• 欧洲：预防医学和整体健康管理',
        '• 北美：个性化医疗和科技应用',
        '二、治疗方法比较：',
        '• 草药治疗的全球应用',
        '• 物理疗法的文化差异',
        '三、最佳实践总结：',
        '• 跨文化有效的治疗方法',
        '• 可借鉴的健康管理模式'
      ],
      en: [
        'Global Health Perspectives Report',
        '1. Cultural Differences Analysis:',
        '• Asia: Combination of traditional Chinese medicine and modern medicine',
        '• Europe: Preventive medicine and holistic health management',
        '• North America: Personalized medicine and technology applications',
        '2. Treatment Method Comparison:',
        '• Global application of herbal treatments',
        '• Cultural differences in physical therapy',
        '3. Best Practices Summary:',
        '• Cross-culturally effective treatment methods',
        '• Referenceable health management models'
      ]
    }
  },

  // 长期管理分类 (+6个)
  {
    id: 'long-term-health-planner',
    title: { zh: '长期健康规划师', en: 'Long-term Health Planner' },
    description: { zh: '年度健康管理和目标设定的专业工具', en: 'Professional tool for annual health management and goal setting' },
    category: 'management',
    content: {
      zh: [
        '长期健康规划师',
        '一、年度健康目标设定：',
        '• SMART目标原则应用',
        '• 短期、中期、长期目标分解',
        '• 可量化的健康指标',
        '二、定期评估计划：',
        '• 月度健康回顾',
        '• 季度目标调整',
        '• 年度健康评估',
        '三、持续改进策略：',
        '• 数据驱动的决策',
        '• 专业咨询的整合',
        '• 个人经验的总结'
      ],
      en: [
        'Long-term Health Planner',
        '1. Annual Health Goal Setting:',
        '• SMART goal principles application',
        '• Short-term, medium-term, long-term goal breakdown',
        '• Quantifiable health indicators',
        '2. Regular Assessment Plan:',
        '• Monthly health review',
        '• Quarterly goal adjustment',
        '• Annual health evaluation',
        '3. Continuous Improvement Strategies:',
        '• Data-driven decision making',
        '• Professional consultation integration',
        '• Personal experience summarization'
      ]
    }
  },
  {
    id: 'personal-health-journal',
    title: { zh: '个人健康日记模板', en: 'Personal Health Journal Template' },
    description: { zh: '长期健康追踪和记录的日记模板工具', en: 'Journal template tool for long-term health tracking and recording' },
    category: 'management',
    content: {
      zh: [
        '个人健康日记模板',
        '一、每日记录项目：',
        '• 身体状况：疼痛、疲劳、能量水平',
        '• 情绪状态：心情、压力水平、睡眠质量',
        '• 生活方式：饮食、运动、工作压力',
        '二、周期性记录：',
        '• 月经周期追踪',
        '• 症状变化趋势',
        '三、反思分析：',
        '• 模式识别',
        '• 改进机会',
        '• 成功经验总结'
      ],
      en: [
        'Personal Health Journal Template',
        '1. Daily Recording Items:',
        '• Physical Condition: Pain, fatigue, energy levels',
        '• Emotional State: Mood, stress levels, sleep quality',
        '• Lifestyle: Diet, exercise, work stress',
        '2. Cyclical Records:',
        '• Menstrual cycle tracking',
        '• Symptom change trends',
        '3. Reflective Analysis:',
        '• Pattern recognition',
        '• Improvement opportunities',
        '• Success experience summary'
      ]
    }
  },
  {
    id: 'nutrition-meal-planning-kit',
    title: { zh: '营养膳食规划工具包', en: 'Nutrition Meal Planning Kit' },
    description: { zh: '长期营养管理和膳食规划的实用工具包', en: 'Practical toolkit for long-term nutrition management and meal planning' },
    category: 'management',
    content: {
      zh: [
        '营养膳食规划工具包',
        '一、营养需求评估：',
        '• 基础代谢率计算',
        '• 微量营养素需求',
        '• 特殊时期营养调整',
        '二、膳食规划工具：',
        '• 周计划模板',
        '• 食物替换指南',
        '• 购物清单生成器',
        '三、营养监测：',
        '• 营养摄入追踪表',
        '• 身体反应记录',
        '• 调整建议指南'
      ],
      en: [
        'Nutrition Meal Planning Kit',
        '1. Nutritional Needs Assessment:',
        '• Basal metabolic rate calculation',
        '• Micronutrient requirements',
        '• Special period nutrition adjustments',
        '2. Meal Planning Tools:',
        '• Weekly planning templates',
        '• Food substitution guides',
        '• Shopping list generator',
        '3. Nutrition Monitoring:',
        '• Nutritional intake tracking sheets',
        '• Body response records',
        '• Adjustment recommendation guides'
      ]
    }
  },
  {
    id: 'exercise-routine-builder',
    title: { zh: '运动计划构建器', en: 'Exercise Routine Builder' },
    description: { zh: '个性化运动计划制定和执行的指导工具', en: 'Guidance tool for creating and implementing personalized exercise routines' },
    category: 'management',
    content: {
      zh: [
        '运动计划构建器',
        '一、运动评估：',
        '• 当前体能水平测试',
        '• 运动偏好调查',
        '• 时间可用性分析',
        '二、计划制定：',
        '• 有氧运动安排',
        '• 力量训练计划',
        '• 柔韧性练习',
        '三、执行支持：',
        '• 进度追踪工具',
        '• 动机维持策略',
        '• 调整指导原则'
      ],
      en: [
        'Exercise Routine Builder',
        '1. Exercise Assessment:',
        '• Current fitness level testing',
        '• Exercise preference survey',
        '• Time availability analysis',
        '2. Plan Development:',
        '• Cardiovascular exercise scheduling',
        '• Strength training plans',
        '• Flexibility exercises',
        '3. Implementation Support:',
        '• Progress tracking tools',
        '• Motivation maintenance strategies',
        '• Adjustment guidance principles'
      ]
    }
  },
  {
    id: 'lifestyle-assessment-toolkit',
    title: { zh: '生活方式评估工具包', en: 'Lifestyle Assessment Toolkit' },
    description: { zh: '全面的生活方式健康评估和优化工具', en: 'Comprehensive lifestyle health assessment and optimization tool' },
    category: 'management',
    content: {
      zh: [
        '生活方式评估工具包',
        '一、评估维度：',
        '• 饮食习惯评分',
        '• 运动习惯分析',
        '• 睡眠质量评估',
        '• 压力管理能力',
        '二、评估工具：',
        '• 自评问卷',
        '• 行为记录表',
        '• 健康指标测量',
        '三、改进计划：',
        '• 优先级排序',
        '• 逐步改进策略',
        '• 效果评估方法'
      ],
      en: [
        'Lifestyle Assessment Toolkit',
        '1. Assessment Dimensions:',
        '• Dietary habits scoring',
        '• Exercise habits analysis',
        '• Sleep quality assessment',
        '• Stress management capabilities',
        '2. Assessment Tools:',
        '• Self-evaluation questionnaires',
        '• Behavior recording sheets',
        '• Health indicator measurements',
        '3. Improvement Plans:',
        '• Priority ranking',
        '• Gradual improvement strategies',
        '• Effectiveness evaluation methods'
      ]
    }
  },
  {
    id: 'sustainable-health-strategies',
    title: { zh: '可持续健康策略指南', en: 'Sustainable Health Strategies Guide' },
    description: { zh: '长期可持续健康管理策略的指导手册', en: 'Guidance manual for long-term sustainable health management strategies' },
    category: 'management',
    content: {
      zh: [
        '可持续健康策略指南',
        '一、可持续性原则：',
        '• 渐进式改变',
        '• 个人化适应',
        '• 系统性思维',
        '二、策略框架：',
        '• 习惯形成理论',
        '• 行为改变模型',
        '• 动机维持机制',
        '三、实施指导：',
        '• 阶段性目标设定',
        '• 挫折应对策略',
        '• 支持系统建立'
      ],
      en: [
        'Sustainable Health Strategies Guide',
        '1. Sustainability Principles:',
        '• Gradual changes',
        '• Personal adaptation',
        '• Systems thinking',
        '2. Strategic Framework:',
        '• Habit formation theory',
        '• Behavior change models',
        '• Motivation maintenance mechanisms',
        '3. Implementation Guidance:',
        '• Phased goal setting',
        '• Setback coping strategies',
        '• Support system establishment'
      ]
    }
  }
];

// 生成标准HTML模板
function generatePDFHTML(resource, locale) {
  const lang = locale;
  const title = resource.title[locale];
  const description = resource.description[locale];
  const content = resource.content[locale];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Period Hub</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            background-color: #ffffff;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            border-bottom: 3px solid #9333ea;
            padding-bottom: 30px;
            margin-bottom: 40px;
            text-align: center;
        }
        
        .title {
            color: #9333ea;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.2;
        }
        
        .subtitle {
            color: #666;
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 400;
        }
        
        .source {
            color: #888;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .content {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .content-section {
            margin-bottom: 30px;
        }
        
        .content-item {
            margin-bottom: 16px;
            padding: 12px 0;
            font-size: 16px;
            line-height: 1.6;
        }
        
        .content-item:first-child {
            font-size: 20px;
            font-weight: 600;
            color: #9333ea;
            margin-bottom: 24px;
        }
        
        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        
        .footer a {
            color: #9333ea;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        /* 移动端响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 20px;
                font-size: 14px;
            }
            
            .title {
                font-size: 24px;
            }
            
            .subtitle {
                font-size: 16px;
            }
            
            .content-item {
                font-size: 14px;
            }
            
            .content-item:first-child {
                font-size: 18px;
            }
        }
        
        @media (max-width: 480px) {
            body {
                padding: 15px;
            }
            
            .title {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 14px;
            }
        }
        
        /* 打印样式 */
        @media print {
            body {
                margin: 20px;
                padding: 0;
                color: #000;
            }
            
            .header {
                border-bottom: 2px solid #000;
            }
            
            .title {
                color: #000;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${title}</h1>
        <p class="subtitle">${description}</p>
        <p class="source">${locale === 'zh' ? '来源：Period Hub 健康资源中心' : 'Source: Period Hub Health Resource Center'}</p>
    </div>
    
    <div class="content">
        <div class="content-section">
            ${content.map(item => `<div class="content-item">${item}</div>`).join('')}
        </div>
    </div>
    
    <div class="footer">
        <p>${locale === 'zh' ? '如需更多信息，请访问：' : 'For more information, visit:'} <a href="https://periodhub.health" target="_blank">periodhub.health</a></p>
        <p>${locale === 'zh' ? '本资源仅供教育参考，不能替代专业医疗建议' : 'This resource is for educational purposes only and cannot replace professional medical advice'}</p>
    </div>
</body>
</html>`;
}

// 创建PDF文件
function createPDFFiles() {
  const pdfDir = path.join(__dirname, '..', 'public', 'pdf-files');
  
  // 确保目录存在
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  let createdCount = 0;
  let skippedCount = 0;

  console.log('🚀 开始创建17个新PDF HTML文件...\n');

  newPDFResources.forEach((resource) => {
    // 创建中文版本
    const zhFilename = `${resource.id}.html`;
    const zhFilepath = path.join(pdfDir, zhFilename);
    
    if (!fs.existsSync(zhFilepath)) {
      const zhContent = generatePDFHTML(resource, 'zh');
      fs.writeFileSync(zhFilepath, zhContent, 'utf8');
      console.log(`✅ 创建中文版: ${zhFilename}`);
      createdCount++;
    } else {
      console.log(`⏭️ 跳过已存在: ${zhFilename}`);
      skippedCount++;
    }

    // 创建英文版本
    const enFilename = `${resource.id}-en.html`;
    const enFilepath = path.join(pdfDir, enFilename);
    
    if (!fs.existsSync(enFilepath)) {
      const enContent = generatePDFHTML(resource, 'en');
      fs.writeFileSync(enFilepath, enContent, 'utf8');
      console.log(`✅ 创建英文版: ${enFilename}`);
      createdCount++;
    } else {
      console.log(`⏭️ 跳过已存在: ${enFilename}`);
      skippedCount++;
    }
  });

  console.log('\n📊 创建完成统计:');
  console.log(`✅ 成功创建: ${createdCount} 个文件`);
  console.log(`⏭️ 跳过已存在: ${skippedCount} 个文件`);
  console.log(`🎯 总计PDF资源: ${newPDFResources.length} 个新资源 (每个包含中英文版本)`);
  
  return {
    created: createdCount,
    skipped: skippedCount,
    total: newPDFResources.length
  };
}

// 执行创建
if (require.main === module) {
  try {
    const result = createPDFFiles();
    console.log('\n🎉 PDF文件创建任务完成！');
    
    if (result.created > 0) {
      console.log('💡 下一步：测试新PDF的预览和下载功能');
    }
  } catch (error) {
    console.error('❌ 创建PDF文件时出错:', error);
    process.exit(1);
  }
}

module.exports = { newPDFResources, generatePDFHTML, createPDFFiles }; 