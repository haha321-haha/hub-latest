// 本地存储键值
export const STORAGE_KEYS = {
  PAIN_RECORDS: 'periodhub_pain_records',
  ASSESSMENT_ANSWERS: 'periodhub_assessment_answers',
  USER_PREFERENCES: 'periodhub_user_preferences',
  EXPORT_SETTINGS: 'periodhub_export_settings'
} as const;

// 疼痛位置选项
export const PAIN_LOCATIONS = {
  en: [
    { value: 'lower-abdomen', label: 'Lower Abdomen', icon: '🤰', description: 'Lower abdominal area', category: 'core' },
    { value: 'lower-back', label: 'Lower Back', icon: '🔙', description: 'Lower back region', category: 'back' },
    { value: 'upper-back', label: 'Upper Back', icon: '⬆️', description: 'Upper back region', category: 'back' },
    { value: 'thighs', label: 'Inner Thighs', icon: '🦵', description: 'Inner thigh muscles', category: 'legs' },
    { value: 'head', label: 'Head', icon: '🧠', description: 'Head and neck area', category: 'head' },
    { value: 'chest', label: 'Chest/Breasts', icon: '💗', description: 'Chest and breast area', category: 'chest' },
    { value: 'pelvis', label: 'Pelvic Area', icon: '🔻', description: 'Pelvic bowl region', category: 'core' },
    { value: 'joints', label: 'Joints', icon: '🦴', description: 'Various joints throughout body', category: 'joints' }
  ],
  zh: [
    { value: 'lower-abdomen', label: '下腹部', icon: '🤰', description: '下腹部区域', category: '核心' },
    { value: 'lower-back', label: '下背部', icon: '🔙', description: '下背部区域', category: '背部' },
    { value: 'upper-back', label: '上背部', icon: '⬆️', description: '上背部区域', category: '背部' },
    { value: 'thighs', label: '大腿内侧', icon: '🦵', description: '大腿内侧肌肉', category: '腿部' },
    { value: 'head', label: '头部', icon: '🧠', description: '头部和颈部区域', category: '头部' },
    { value: 'chest', label: '胸部/乳房', icon: '💗', description: '胸部和乳房区域', category: '胸部' },
    { value: 'pelvis', label: '盆腔区域', icon: '🔻', description: '盆腔区域', category: '核心' },
    { value: 'joints', label: '关节', icon: '🦴', description: '全身各关节', category: '关节' }
  ]
} as const;

// 症状选项
export const SYMPTOMS = {
  en: [
    { value: 'cramps', label: 'Abdominal Cramps', icon: '😣', category: 'digestive', severity: 'moderate' },
    { value: 'headache', label: 'Headache', icon: '🤕', category: 'neurological', severity: 'mild' },
    { value: 'bloating', label: 'Bloating', icon: '🎈', category: 'digestive', severity: 'mild' },
    { value: 'backache', label: 'Back Pain', icon: '🔙', category: 'musculoskeletal', severity: 'moderate' },
    { value: 'fatigue', label: 'Fatigue', icon: '😴', category: 'systemic', severity: 'mild' },
    { value: 'nausea', label: 'Nausea', icon: '🤢', category: 'digestive', severity: 'moderate' },
    { value: 'mood-swings', label: 'Mood Swings', icon: '😤', category: 'emotional', severity: 'mild' },
    { value: 'breast-tenderness', label: 'Breast Tenderness', icon: '💗', category: 'hormonal', severity: 'mild' },
    { value: 'diarrhea', label: 'Diarrhea', icon: '💩', category: 'digestive', severity: 'moderate' },
    { value: 'constipation', label: 'Constipation', icon: '🚫', category: 'digestive', severity: 'mild' },
    { value: 'dizziness', label: 'Dizziness', icon: '💫', category: 'neurological', severity: 'moderate' },
    { value: 'hot-flashes', label: 'Hot Flashes', icon: '🔥', category: 'hormonal', severity: 'mild' },
    { value: 'cold-sweats', label: 'Cold Sweats', icon: '🥶', category: 'systemic', severity: 'moderate' },
    { value: 'insomnia', label: 'Sleep Problems', icon: '🌙', category: 'neurological', severity: 'moderate' },
    { value: 'anxiety', label: 'Anxiety', icon: '😰', category: 'emotional', severity: 'moderate' },
    { value: 'depression', label: 'Low Mood', icon: '😢', category: 'emotional', severity: 'severe' }
  ],
  zh: [
    { value: 'cramps', label: '腹部痉挛', icon: '😣', category: '消化系统', severity: '中等' },
    { value: 'headache', label: '头痛', icon: '🤕', category: '神经系统', severity: '轻微' },
    { value: 'bloating', label: '腹胀', icon: '🎈', category: '消化系统', severity: '轻微' },
    { value: 'backache', label: '背痛', icon: '🔙', category: '肌肉骨骼', severity: '中等' },
    { value: 'fatigue', label: '疲劳', icon: '😴', category: '全身性', severity: '轻微' },
    { value: 'nausea', label: '恶心', icon: '🤢', category: '消化系统', severity: '中等' },
    { value: 'mood-swings', label: '情绪波动', icon: '😤', category: '情绪', severity: '轻微' },
    { value: 'breast-tenderness', label: '乳房胀痛', icon: '💗', category: '激素', severity: '轻微' },
    { value: 'diarrhea', label: '腹泻', icon: '💩', category: '消化系统', severity: '中等' },
    { value: 'constipation', label: '便秘', icon: '🚫', category: '消化系统', severity: '轻微' },
    { value: 'dizziness', label: '头晕', icon: '💫', category: '神经系统', severity: '中等' },
    { value: 'hot-flashes', label: '潮热', icon: '🔥', category: '激素', severity: '轻微' },
    { value: 'cold-sweats', label: '冷汗', icon: '🥶', category: '全身性', severity: '中等' },
    { value: 'insomnia', label: '睡眠问题', icon: '🌙', category: '神经系统', severity: '中等' },
    { value: 'anxiety', label: '焦虑', icon: '😰', category: '情绪', severity: '中等' },
    { value: 'depression', label: '情绪低落', icon: '😢', category: '情绪', severity: '严重' }
  ]
} as const;

// 缓解方法选项
export const REMEDIES = {
  en: [
    { value: 'heat-therapy', label: 'Heat Therapy', icon: '🔥', description: 'Applying heat to painful areas', category: 'physical', type: 'therapeutic' },
    { value: 'cold-therapy', label: 'Cold Therapy', icon: '🧊', description: 'Applying cold to reduce inflammation', category: 'physical', type: 'therapeutic' },
    { value: 'massage', label: 'Massage', icon: '💆', description: 'Manual manipulation of muscles', category: 'physical', type: 'manual' },
    { value: 'exercise', label: 'Light Exercise', icon: '🚶', description: 'Gentle movement and stretching', category: 'physical', type: 'movement' },
    { value: 'yoga', label: 'Yoga/Stretching', icon: '🧘', description: 'Mindful movement and stretching', category: 'physical', type: 'movement' },
    { value: 'meditation', label: 'Meditation', icon: '🕯️', description: 'Mindfulness and relaxation techniques', category: 'mental', type: 'mindfulness' },
    { value: 'breathing', label: 'Breathing Exercises', icon: '💨', description: 'Controlled breathing techniques', category: 'mental', type: 'mindfulness' },
    { value: 'bath', label: 'Warm Bath', icon: '🛁', description: 'Soaking in warm water', category: 'physical', type: 'therapeutic' },
    { value: 'rest', label: 'Rest/Sleep', icon: '😴', description: 'Adequate rest and sleep', category: 'lifestyle', type: 'rest' },
    { value: 'hydration', label: 'Increased Hydration', icon: '💧', description: 'Drinking more water', category: 'lifestyle', type: 'dietary' },
    { value: 'diet-change', label: 'Dietary Changes', icon: '🥗', description: 'Modifying food intake', category: 'lifestyle', type: 'dietary' },
    { value: 'herbal-tea', label: 'Herbal Tea', icon: '🍵', description: 'Natural herbal remedies', category: 'natural', type: 'herbal' },
    { value: 'supplements', label: 'Supplements', icon: '💊', description: 'Vitamin and mineral supplements', category: 'natural', type: 'supplement' },
    { value: 'medication', label: 'Pain Medication', icon: '💉', description: 'Over-the-counter or prescription medication', category: 'medical', type: 'pharmaceutical' },
    { value: 'acupuncture', label: 'Acupuncture', icon: '📍', description: 'Traditional Chinese medicine practice', category: 'alternative', type: 'traditional' },
    { value: 'aromatherapy', label: 'Aromatherapy', icon: '🌸', description: 'Essential oils for relaxation', category: 'alternative', type: 'natural' }
  ],
  zh: [
    { value: 'heat-therapy', label: '热敷疗法', icon: '🔥', description: '在疼痛部位应用热量', category: '物理', type: '治疗' },
    { value: 'cold-therapy', label: '冷敷疗法', icon: '🧊', description: '应用冷敷减少炎症', category: '物理', type: '治疗' },
    { value: 'massage', label: '按摩', icon: '💆', description: '肌肉的徒手操作', category: '物理', type: '手法' },
    { value: 'exercise', label: '轻度运动', icon: '🚶', description: '温和的运动和伸展', category: '物理', type: '运动' },
    { value: 'yoga', label: '瑜伽/拉伸', icon: '🧘', description: '有意识的移动和伸展', category: '物理', type: '运动' },
    { value: 'meditation', label: '冥想', icon: '🕯️', description: '正念和放松技巧', category: '心理', type: '正念' },
    { value: 'breathing', label: '呼吸练习', icon: '💨', description: '控制呼吸技巧', category: '心理', type: '正念' },
    { value: 'bath', label: '温水浴', icon: '🛁', description: '在温水中浸泡', category: '物理', type: '治疗' },
    { value: 'rest', label: '休息/睡眠', icon: '😴', description: '充分休息和睡眠', category: '生活方式', type: '休息' },
    { value: 'hydration', label: '增加水分摄入', icon: '💧', description: '多喝水', category: '生活方式', type: '饮食' },
    { value: 'diet-change', label: '饮食调整', icon: '🥗', description: '调整食物摄入', category: '生活方式', type: '饮食' },
    { value: 'herbal-tea', label: '草药茶', icon: '🍵', description: '天然草药疗法', category: '天然', type: '草药' },
    { value: 'supplements', label: '营养补充剂', icon: '💊', description: '维生素和矿物质补充剂', category: '天然', type: '补充剂' },
    { value: 'medication', label: '止痛药物', icon: '💉', description: '非处方或处方药物', category: '医疗', type: '药物' },
    { value: 'acupuncture', label: '针灸', icon: '📍', description: '传统中医实践', category: '替代', type: '传统' },
    { value: 'aromatherapy', label: '芳香疗法', icon: '🌸', description: '精油放松', category: '替代', type: '天然' }
  ]
} as const;

// 月经状态选项
export const MENSTRUAL_STATUS = {
  en: [
    { value: 'period', label: 'During Period', icon: '🔴', description: 'Currently menstruating', category: 'menstrual', phase: 'active' },
    { value: 'pre', label: 'Pre-menstrual (1-7 days before)', icon: '🟡', description: 'Premenstrual phase', category: 'menstrual', phase: 'pre' },
    { value: 'post', label: 'Post-menstrual (1-7 days after)', icon: '🟢', description: 'Post-menstrual phase', category: 'menstrual', phase: 'post' },
    { value: 'ovulation', label: 'Around Ovulation', icon: '🥚', description: 'Ovulation period', category: 'menstrual', phase: 'ovulation' },
    { value: 'other', label: 'Other Time', icon: '⚪', description: 'Non-menstrual time', category: 'menstrual', phase: 'other' }
  ],
  zh: [
    { value: 'period', label: '月经期', icon: '🔴', description: '正在月经期间', category: '月经', phase: '活跃期' },
    { value: 'pre', label: '经前期（前1-7天）', icon: '🟡', description: '经前期', category: '月经', phase: '前期' },
    { value: 'post', label: '经后期（后1-7天）', icon: '🟢', description: '经后期', category: '月经', phase: '后期' },
    { value: 'ovulation', label: '排卵期', icon: '🥚', description: '排卵期', category: '月经', phase: '排卵期' },
    { value: 'other', label: '其他时期', icon: '⚪', description: '非月经期', category: '月经', phase: '其他' }
  ]
} as const;

// 疼痛强度描述
export const PAIN_LEVELS = {
  en: [
    { value: 1, label: 'Very Mild', description: 'Barely noticeable', color: '#10b981', culturalNote: 'Most people wouldn\'t mention this' },
    { value: 2, label: 'Mild', description: 'Noticeable but not bothersome', color: '#34d399', culturalNote: 'Often ignored in daily life' },
    { value: 3, label: 'Mild+', description: 'Slightly bothersome', color: '#6ee7b7', culturalNote: 'May affect concentration slightly' },
    { value: 4, label: 'Moderate', description: 'Bothersome but manageable', color: '#fbbf24', culturalNote: 'Common to take notice at this level' },
    { value: 5, label: 'Moderate+', description: 'Quite bothersome', color: '#f59e0b', culturalNote: 'Usually warrants attention and care' },
    { value: 6, label: 'Strong', description: 'Interferes with activities', color: '#fb923c', culturalNote: 'May require rest or remedies' },
    { value: 7, label: 'Strong+', description: 'Difficult to ignore', color: '#f97316', culturalNote: 'Often leads to seeking medical advice' },
    { value: 8, label: 'Severe', description: 'Dominates thoughts', color: '#ef4444', culturalNote: 'Significant impact on quality of life' },
    { value: 9, label: 'Very Severe', description: 'Unable to function', color: '#dc2626', culturalNote: 'Requires immediate attention and care' },
    { value: 10, label: 'Unbearable', description: 'Worst pain imaginable', color: '#b91c1c', culturalNote: 'Emergency medical attention needed' }
  ],
  zh: [
    { value: 1, label: '非常轻微', description: '几乎感觉不到', color: '#10b981', culturalNote: '大多数人不会提及这种程度' },
    { value: 2, label: '轻微', description: '能感觉到但不困扰', color: '#34d399', culturalNote: '日常生活中常被忽略' },
    { value: 3, label: '轻微+', description: '稍有困扰', color: '#6ee7b7', culturalNote: '可能轻微影响注意力' },
    { value: 4, label: '中等', description: '困扰但可管理', color: '#fbbf24', culturalNote: '这个程度通常会引起注意' },
    { value: 5, label: '中等+', description: '相当困扰', color: '#f59e0b', culturalNote: '通常需要关注和照顾' },
    { value: 6, label: '强烈', description: '影响日常活动', color: '#fb923c', culturalNote: '可能需要休息或治疗' },
    { value: 7, label: '强烈+', description: '难以忽视', color: '#f97316', culturalNote: '通常会导致寻求医疗建议' },
    { value: 8, label: '严重', description: '占据思维', color: '#ef4444', culturalNote: '对生活质量有显著影响' },
    { value: 9, label: '非常严重', description: '无法正常功能', color: '#dc2626', culturalNote: '需要立即关注和照顾' },
    { value: 10, label: '无法忍受', description: '能想象的最严重疼痛', color: '#b91c1c', culturalNote: '需要紧急医疗处理' }
  ]
} as const;

// 有效性评级
export const EFFECTIVENESS_LEVELS = {
  en: [
    { value: 1, label: 'Not Helpful', icon: '❌' },
    { value: 2, label: 'Slightly Helpful', icon: '🟡' },
    { value: 3, label: 'Moderately Helpful', icon: '🟠' },
    { value: 4, label: 'Very Helpful', icon: '🟢' },
    { value: 5, label: 'Extremely Helpful', icon: '✅' }
  ],
  zh: [
    { value: 1, label: '无效', icon: '❌' },
    { value: 2, label: '稍有帮助', icon: '🟡' },
    { value: 3, label: '中等帮助', icon: '🟠' },
    { value: 4, label: '很有帮助', icon: '🟢' },
    { value: 5, label: '极其有效', icon: '✅' }
  ]
} as const;

// 图表配置
export const CHART_COLORS = {
  primary: '#ec4899',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  light: '#f3f4f6',
  dark: '#374151'
} as const;

// 疼痛类型选项
export const PAIN_TYPES = {
  en: [
    { value: 'cramping', label: 'Cramping', description: 'Sharp, intermittent pain', icon: '⚡' },
    { value: 'aching', label: 'Aching', description: 'Dull, persistent pain', icon: '💤' },
    { value: 'throbbing', label: 'Throbbing', description: 'Pulsating pain', icon: '💗' },
    { value: 'stabbing', label: 'Stabbing', description: 'Sudden, sharp pain', icon: '🔪' },
    { value: 'pressure', label: 'Pressure', description: 'Tight, squeezing sensation', icon: '🤏' },
    { value: 'burning', label: 'Burning', description: 'Hot, burning sensation', icon: '🔥' }
  ],
  zh: [
    { value: 'cramping', label: '痉挛性疼痛', description: '尖锐、间歇性疼痛', icon: '⚡' },
    { value: 'aching', label: '酸痛', description: '钝痛、持续性疼痛', icon: '💤' },
    { value: 'throbbing', label: '跳痛', description: '搏动性疼痛', icon: '💗' },
    { value: 'stabbing', label: '刺痛', description: '突然的尖锐疼痛', icon: '🔪' },
    { value: 'pressure', label: '压迫感', description: '紧缩、挤压感', icon: '🤏' },
    { value: 'burning', label: '灼烧感', description: '灼热、烧伤感', icon: '🔥' }
  ]
} as const;

// 医学术语（用于翻译测试组件）
export const MEDICAL_TERMS = {
  en: {
    dysmenorrhea: "Dysmenorrhea (Menstrual Pain)",
    primary_dysmenorrhea: "Primary Dysmenorrhea",
    secondary_dysmenorrhea: "Secondary Dysmenorrhea",
    endometriosis: "Endometriosis",
    pms: "Premenstrual Syndrome (PMS)",
    pmdd: "Premenstrual Dysphoric Disorder (PMDD)",
    menorrhagia: "Heavy Menstrual Bleeding",
    oligomenorrhea: "Infrequent Menstruation",
    amenorrhea: "Absence of Menstruation"
  },
  zh: {
    dysmenorrhea: "痛经（经期疼痛）",
    primary_dysmenorrhea: "原发性痛经",
    secondary_dysmenorrhea: "继发性痛经",
    endometriosis: "子宫内膜异位症",
    pms: "经前期综合征（PMS）",
    pmdd: "经前焦虑障碍（PMDD）",
    menorrhagia: "月经过多",
    oligomenorrhea: "月经稀发",
    amenorrhea: "闭经"
  }
} as const;

// 文化适应性描述（用于翻译测试组件）
export const CULTURAL_DESCRIPTIONS = {
  en: {
    painMetaphors: {
      cramping: "Like a fist squeezing your insides",
      aching: "Like a dull weight pressing down",
      throbbing: "Like a heartbeat in your pain",
      stabbing: "Like a sudden knife twist",
      burning: "Like hot coals inside"
    },
    comfortMeasures: {
      heat: "Like a warm hug from inside",
      rest: "Like wrapping yourself in a cocoon",
      tea: "Like liquid comfort flowing through",
      breathing: "Like waves washing pain away",
      massage: "Like gentle hands easing tension"
    }
  },
  zh: {
    painMetaphors: {
      cramping: "像有只手在拧你的内脏",
      aching: "像有块沉重的石头压着",
      throbbing: "像疼痛随着心跳跳动",
      stabbing: "像突然被刀刺了一下",
      burning: "像体内有火炭在烧"
    },
    comfortMeasures: {
      heat: "像从内部给你一个温暖的拥抱",
      rest: "像把自己包裹在茧里",
      tea: "像液体安慰流经全身",
      breathing: "像海浪把疼痛冲走",
      massage: "像温柔的手在缓解紧张"
    }
  }
} as const;

// 扩展的疼痛等级（添加文化适应说明）
export const EXTENDED_PAIN_LEVELS = {
  en: [
    { value: 1, label: 'Very Mild', description: 'Barely noticeable', culturalNote: 'Most people wouldn\'t mention this' },
    { value: 2, label: 'Mild', description: 'Noticeable but not bothersome', culturalNote: 'Often ignored in daily life' },
    { value: 3, label: 'Mild+', description: 'Slightly bothersome', culturalNote: 'May affect concentration slightly' },
    { value: 4, label: 'Moderate', description: 'Bothersome but manageable', culturalNote: 'Common to take notice at this level' },
    { value: 5, label: 'Moderate+', description: 'Quite bothersome', culturalNote: 'Usually warrants attention and care' },
    { value: 6, label: 'Strong', description: 'Interferes with activities', culturalNote: 'May require rest or remedies' },
    { value: 7, label: 'Strong+', description: 'Difficult to ignore', culturalNote: 'Often leads to seeking medical advice' },
    { value: 8, label: 'Severe', description: 'Dominates thoughts', culturalNote: 'Significant impact on quality of life' },
    { value: 9, label: 'Very Severe', description: 'Unable to function', culturalNote: 'Requires immediate attention and care' },
    { value: 10, label: 'Unbearable', description: 'Worst pain imaginable', culturalNote: 'Emergency medical attention needed' }
  ],
  zh: [
    { value: 1, label: '非常轻微', description: '几乎感觉不到', culturalNote: '大多数人不会提及这种程度' },
    { value: 2, label: '轻微', description: '能感觉到但不困扰', culturalNote: '日常生活中常被忽略' },
    { value: 3, label: '轻微+', description: '稍有困扰', culturalNote: '可能轻微影响注意力' },
    { value: 4, label: '中等', description: '困扰但可管理', culturalNote: '这个程度通常会引起注意' },
    { value: 5, label: '中等+', description: '相当困扰', culturalNote: '通常需要关注和照顾' },
    { value: 6, label: '强烈', description: '影响日常活动', culturalNote: '可能需要休息或治疗' },
    { value: 7, label: '强烈+', description: '难以忽视', culturalNote: '通常会导致寻求医疗建议' },
    { value: 8, label: '严重', description: '占据思维', culturalNote: '对生活质量有显著影响' },
    { value: 9, label: '非常严重', description: '无法正常功能', culturalNote: '需要立即关注和照顾' },
    { value: 10, label: '无法忍受', description: '能想象的最严重疼痛', culturalNote: '需要紧急医疗处理' }
  ]
} as const;

// 动画配置
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// 验证规则
export const VALIDATION_RULES = {
  painLevel: { min: 1, max: 10 },
  duration: { min: 0, max: 1440 }, // 24 hours in minutes
  effectiveness: { min: 1, max: 5 },
  notes: { maxLength: 500 },
  date: { 
    minDate: '2020-01-01',
    maxDate: new Date().toISOString().split('T')[0]
  }
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  en: {
    required: 'This field is required',
    invalidDate: 'Please enter a valid date',
    futureDate: 'Date cannot be in the future',
    painLevelRange: 'Pain level must be between 1 and 10',
    durationRange: 'Duration must be between 0 and 1440 minutes',
    effectivenessRange: 'Effectiveness must be between 1 and 5',
    notesLength: 'Notes cannot exceed 500 characters',
    storageError: 'Failed to save data. Please try again.',
    loadError: 'Failed to load data. Please refresh the page.',
    exportError: 'Failed to export data. Please try again.',
    networkError: 'Network error. Please check your connection.'
  },
  zh: {
    required: '此字段为必填项',
    invalidDate: '请输入有效日期',
    futureDate: '日期不能是未来时间',
    painLevelRange: '疼痛等级必须在1-10之间',
    durationRange: '持续时间必须在0-1440分钟之间',
    effectivenessRange: '有效性必须在1-5之间',
    notesLength: '备注不能超过500个字符',
    storageError: '保存数据失败，请重试',
    loadError: '加载数据失败，请刷新页面',
    exportError: '导出数据失败，请重试',
    networkError: '网络错误，请检查连接'
  }
} as const;
