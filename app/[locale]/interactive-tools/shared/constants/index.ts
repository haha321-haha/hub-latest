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
    { value: 'lower-abdomen', label: 'Lower Abdomen', icon: '🤰' },
    { value: 'lower-back', label: 'Lower Back', icon: '🔙' },
    { value: 'upper-back', label: 'Upper Back', icon: '⬆️' },
    { value: 'thighs', label: 'Inner Thighs', icon: '🦵' },
    { value: 'head', label: 'Head', icon: '🧠' },
    { value: 'chest', label: 'Chest/Breasts', icon: '💗' },
    { value: 'pelvis', label: 'Pelvic Area', icon: '🔻' },
    { value: 'joints', label: 'Joints', icon: '🦴' }
  ],
  zh: [
    { value: 'lower-abdomen', label: '下腹部', icon: '🤰' },
    { value: 'lower-back', label: '下背部', icon: '🔙' },
    { value: 'upper-back', label: '上背部', icon: '⬆️' },
    { value: 'thighs', label: '大腿内侧', icon: '🦵' },
    { value: 'head', label: '头部', icon: '🧠' },
    { value: 'chest', label: '胸部/乳房', icon: '💗' },
    { value: 'pelvis', label: '盆腔区域', icon: '🔻' },
    { value: 'joints', label: '关节', icon: '🦴' }
  ]
} as const;

// 症状选项
export const SYMPTOMS = {
  en: [
    { value: 'cramps', label: 'Abdominal Cramps', icon: '😣' },
    { value: 'headache', label: 'Headache', icon: '🤕' },
    { value: 'bloating', label: 'Bloating', icon: '🎈' },
    { value: 'backache', label: 'Back Pain', icon: '🔙' },
    { value: 'fatigue', label: 'Fatigue', icon: '😴' },
    { value: 'nausea', label: 'Nausea', icon: '🤢' },
    { value: 'mood-swings', label: 'Mood Swings', icon: '😤' },
    { value: 'breast-tenderness', label: 'Breast Tenderness', icon: '💗' },
    { value: 'diarrhea', label: 'Diarrhea', icon: '💩' },
    { value: 'constipation', label: 'Constipation', icon: '🚫' },
    { value: 'dizziness', label: 'Dizziness', icon: '💫' },
    { value: 'hot-flashes', label: 'Hot Flashes', icon: '🔥' },
    { value: 'cold-sweats', label: 'Cold Sweats', icon: '🥶' },
    { value: 'insomnia', label: 'Sleep Problems', icon: '🌙' },
    { value: 'anxiety', label: 'Anxiety', icon: '😰' },
    { value: 'depression', label: 'Low Mood', icon: '😢' }
  ],
  zh: [
    { value: 'cramps', label: '腹部痉挛', icon: '😣' },
    { value: 'headache', label: '头痛', icon: '🤕' },
    { value: 'bloating', label: '腹胀', icon: '🎈' },
    { value: 'backache', label: '背痛', icon: '🔙' },
    { value: 'fatigue', label: '疲劳', icon: '😴' },
    { value: 'nausea', label: '恶心', icon: '🤢' },
    { value: 'mood-swings', label: '情绪波动', icon: '😤' },
    { value: 'breast-tenderness', label: '乳房胀痛', icon: '💗' },
    { value: 'diarrhea', label: '腹泻', icon: '💩' },
    { value: 'constipation', label: '便秘', icon: '🚫' },
    { value: 'dizziness', label: '头晕', icon: '💫' },
    { value: 'hot-flashes', label: '潮热', icon: '🔥' },
    { value: 'cold-sweats', label: '冷汗', icon: '🥶' },
    { value: 'insomnia', label: '睡眠问题', icon: '🌙' },
    { value: 'anxiety', label: '焦虑', icon: '😰' },
    { value: 'depression', label: '情绪低落', icon: '😢' }
  ]
} as const;

// 缓解方法选项
export const REMEDIES = {
  en: [
    { value: 'heat-therapy', label: 'Heat Therapy', icon: '🔥' },
    { value: 'cold-therapy', label: 'Cold Therapy', icon: '🧊' },
    { value: 'massage', label: 'Massage', icon: '💆' },
    { value: 'exercise', label: 'Light Exercise', icon: '🚶' },
    { value: 'yoga', label: 'Yoga/Stretching', icon: '🧘' },
    { value: 'meditation', label: 'Meditation', icon: '🕯️' },
    { value: 'breathing', label: 'Breathing Exercises', icon: '💨' },
    { value: 'bath', label: 'Warm Bath', icon: '🛁' },
    { value: 'rest', label: 'Rest/Sleep', icon: '😴' },
    { value: 'hydration', label: 'Increased Hydration', icon: '💧' },
    { value: 'diet-change', label: 'Dietary Changes', icon: '🥗' },
    { value: 'herbal-tea', label: 'Herbal Tea', icon: '🍵' },
    { value: 'supplements', label: 'Supplements', icon: '💊' },
    { value: 'medication', label: 'Pain Medication', icon: '💉' },
    { value: 'acupuncture', label: 'Acupuncture', icon: '📍' },
    { value: 'aromatherapy', label: 'Aromatherapy', icon: '🌸' }
  ],
  zh: [
    { value: 'heat-therapy', label: '热敷疗法', icon: '🔥' },
    { value: 'cold-therapy', label: '冷敷疗法', icon: '🧊' },
    { value: 'massage', label: '按摩', icon: '💆' },
    { value: 'exercise', label: '轻度运动', icon: '🚶' },
    { value: 'yoga', label: '瑜伽/拉伸', icon: '🧘' },
    { value: 'meditation', label: '冥想', icon: '🕯️' },
    { value: 'breathing', label: '呼吸练习', icon: '💨' },
    { value: 'bath', label: '温水浴', icon: '🛁' },
    { value: 'rest', label: '休息/睡眠', icon: '😴' },
    { value: 'hydration', label: '增加水分摄入', icon: '💧' },
    { value: 'diet-change', label: '饮食调整', icon: '🥗' },
    { value: 'herbal-tea', label: '草药茶', icon: '🍵' },
    { value: 'supplements', label: '营养补充剂', icon: '💊' },
    { value: 'medication', label: '止痛药物', icon: '💉' },
    { value: 'acupuncture', label: '针灸', icon: '📍' },
    { value: 'aromatherapy', label: '芳香疗法', icon: '🌸' }
  ]
} as const;

// 月经状态选项
export const MENSTRUAL_STATUS = {
  en: [
    { value: 'period', label: 'During Period', icon: '🔴' },
    { value: 'pre', label: 'Pre-menstrual (1-7 days before)', icon: '🟡' },
    { value: 'post', label: 'Post-menstrual (1-7 days after)', icon: '🟢' },
    { value: 'ovulation', label: 'Around Ovulation', icon: '🥚' },
    { value: 'other', label: 'Other Time', icon: '⚪' }
  ],
  zh: [
    { value: 'period', label: '月经期', icon: '🔴' },
    { value: 'pre', label: '经前期（前1-7天）', icon: '🟡' },
    { value: 'post', label: '经后期（后1-7天）', icon: '🟢' },
    { value: 'ovulation', label: '排卵期', icon: '🥚' },
    { value: 'other', label: '其他时期', icon: '⚪' }
  ]
} as const;

// 疼痛强度描述
export const PAIN_LEVELS = {
  en: [
    { value: 1, label: 'Very Mild', description: 'Barely noticeable' },
    { value: 2, label: 'Mild', description: 'Noticeable but not bothersome' },
    { value: 3, label: 'Mild+', description: 'Slightly bothersome' },
    { value: 4, label: 'Moderate', description: 'Bothersome but manageable' },
    { value: 5, label: 'Moderate+', description: 'Quite bothersome' },
    { value: 6, label: 'Strong', description: 'Interferes with activities' },
    { value: 7, label: 'Strong+', description: 'Difficult to ignore' },
    { value: 8, label: 'Severe', description: 'Dominates thoughts' },
    { value: 9, label: 'Very Severe', description: 'Unable to function' },
    { value: 10, label: 'Unbearable', description: 'Worst pain imaginable' }
  ],
  zh: [
    { value: 1, label: '非常轻微', description: '几乎感觉不到' },
    { value: 2, label: '轻微', description: '能感觉到但不困扰' },
    { value: 3, label: '轻微+', description: '稍有困扰' },
    { value: 4, label: '中等', description: '困扰但可管理' },
    { value: 5, label: '中等+', description: '相当困扰' },
    { value: 6, label: '强烈', description: '影响日常活动' },
    { value: 7, label: '强烈+', description: '难以忽视' },
    { value: 8, label: '严重', description: '占据思维' },
    { value: 9, label: '非常严重', description: '无法正常功能' },
    { value: 10, label: '无法忍受', description: '能想象的最严重疼痛' }
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
