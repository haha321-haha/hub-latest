import { ConstitutionTypeInfo, ConstitutionRecommendations, ConstitutionType } from '../types/constitution';

export const constitutionTypeInfo: Record<string, Record<ConstitutionType, ConstitutionTypeInfo>> = {
  zh: {
    balanced: {
      name: '平和质',
      description: '体质平和，身心健康，是最理想的体质状态。',
      characteristics: [
        '精力充沛，不易疲劳',
        '睡眠良好，情绪稳定',
        '消化功能正常',
        '对环境适应能力强'
      ],
      commonSymptoms: [
        '很少生病',
        '恢复能力强',
        '抵抗力好'
      ],
      menstrualFeatures: [
        '月经周期规律（28-30天）',
        '经量适中',
        '颜色正常红色',
        '痛经轻微或无痛经'
      ]
    },
    qi_deficiency: {
      name: '气虚质',
      description: '元气不足，以疲乏、气短、自汗等气虚表现为主要特征。',
      characteristics: [
        '容易疲劳，精神不振',
        '说话声音低，不爱说话',
        '容易出汗，活动后更明显',
        '抵抗力差，容易感冒'
      ],
      commonSymptoms: [
        '气短懒言',
        '容易疲劳',
        '自汗',
        '食欲不振'
      ],
      menstrualFeatures: [
        '月经量少，颜色淡',
        '周期可能延后',
        '经期疲劳加重',
        '可能有轻度痛经'
      ]
    },
    yang_deficiency: {
      name: '阳虚质',
      description: '阳气不足，以畏寒怕冷、手足不温等虚寒表现为主要特征。',
      characteristics: [
        '畏寒怕冷，手足不温',
        '喜热饮食，不耐寒邪',
        '精神不振，睡眠偏多',
        '大便溏薄，小便清长'
      ],
      commonSymptoms: [
        '畏寒肢冷',
        '精神萎靡',
        '腰膝酸软',
        '性功能减退'
      ],
      menstrualFeatures: [
        '月经量少，颜色淡',
        '周期延后',
        '经期腹痛喜温喜按',
        '经前或经期腰酸明显'
      ]
    },
    yin_deficiency: {
      name: '阴虚质',
      description: '阴液亏少，以口燥咽干、手足心热等虚热表现为主要特征。',
      characteristics: [
        '手足心热，口咽干燥',
        '喜冷饮，不耐暑热',
        '大便干燥，小便短赤',
        '睡眠差，性情急躁'
      ],
      commonSymptoms: [
        '五心烦热',
        '口干咽燥',
        '盗汗',
        '失眠多梦'
      ],
      menstrualFeatures: [
        '月经量少或正常',
        '周期可能提前',
        '经色鲜红',
        '经前烦躁，失眠'
      ]
    },
    phlegm_dampness: {
      name: '痰湿质',
      description: '痰湿凝聚，以形体肥胖、腹部肥满、口黏苔腻等痰湿表现为主要特征。',
      characteristics: [
        '形体肥胖，腹部肥满松软',
        '面部皮肤油脂较多',
        '容易困倦，身重不爽',
        '口黏腻或甜，喜食肥甘甜腻'
      ],
      commonSymptoms: [
        '身重困倦',
        '胸闷痰多',
        '口黏腻',
        '大便正常或不实'
      ],
      menstrualFeatures: [
        '月经量多或正常',
        '经色淡红',
        '质地粘稠',
        '经前胸闷、水肿'
      ]
    },
    damp_heat: {
      name: '湿热质',
      description: '湿热内蕴，以面垢油腻、口苦、苔黄腻等湿热表现为主要特征。',
      characteristics: [
        '面垢油腻，易生痤疮',
        '口苦口干，身重困倦',
        '大便黏滞不畅或燥结',
        '小便短黄，男易阴囊潮湿'
      ],
      commonSymptoms: [
        '面部油腻',
        '口苦口干',
        '身重困倦',
        '大便黏滞'
      ],
      menstrualFeatures: [
        '月经量多，颜色深红',
        '周期可能提前',
        '经前烦躁易怒',
        '痛经较重，喜冷恶热'
      ]
    },
    blood_stasis: {
      name: '血瘀质',
      description: '血行不畅，以肤色晦黯、舌质紫黯等血瘀表现为主要特征。',
      characteristics: [
        '肤色晦黯，色素沉着',
        '容易出现瘀斑',
        '口唇黯淡，舌下络脉紫黯',
        '性情急躁，健忘'
      ],
      commonSymptoms: [
        '肤色晦黯',
        '易生色斑',
        '疼痛如针刺',
        '健忘'
      ],
      menstrualFeatures: [
        '月经有血块',
        '经色暗红或紫黑',
        '痛经明显，拒按',
        '经前乳房胀痛'
      ]
    },
    qi_stagnation: {
      name: '气郁质',
      description: '气机郁滞，以神情抑郁、忧虑脆弱等气郁表现为主要特征。',
      characteristics: [
        '神情抑郁，情感脆弱',
        '烦闷不乐，容易紧张',
        '多愁善感，忧虑不安',
        '对精神刺激适应能力较差'
      ],
      commonSymptoms: [
        '情绪抑郁',
        '胸胁胀满',
        '善太息',
        '咽中如有异物'
      ],
      menstrualFeatures: [
        '月经不规律',
        '经前情绪波动大',
        '乳房胀痛明显',
        '痛经程度与情绪相关'
      ]
    },
    special_diathesis: {
      name: '特禀质',
      description: '先天失常，以生理缺陷、过敏反应等为主要特征。',
      characteristics: [
        '先天禀赋不足',
        '容易过敏',
        '适应能力差',
        '遗传性疾病家族史'
      ],
      commonSymptoms: [
        '过敏性疾病',
        '遗传性疾病',
        '胎传性疾病'
      ],
      menstrualFeatures: [
        '月经异常多样',
        '可能伴随过敏症状',
        '对环境变化敏感'
      ]
    }
  },
  en: {
    balanced: {
      name: 'Balanced Constitution',
      description: 'A harmonious constitution with balanced body and mind, representing the ideal health state.',
      characteristics: [
        'Energetic and not easily fatigued',
        'Good sleep and stable emotions',
        'Normal digestive function',
        'Strong adaptability to environment'
      ],
      commonSymptoms: [
        'Rarely gets sick',
        'Strong recovery ability',
        'Good resistance'
      ],
      menstrualFeatures: [
        'Regular menstrual cycle (28-30 days)',
        'Moderate flow',
        'Normal red color',
        'Mild or no menstrual pain'
      ]
    },
    qi_deficiency: {
      name: 'Qi Deficiency Constitution',
      description: 'Insufficient vital energy, characterized by fatigue, shortness of breath, and spontaneous sweating.',
      characteristics: [
        'Easily fatigued and low spirits',
        'Low voice, reluctant to speak',
        'Prone to sweating, especially after activity',
        'Poor resistance, easily catches cold'
      ],
      commonSymptoms: [
        'Shortness of breath and reluctance to speak',
        'Easy fatigue',
        'Spontaneous sweating',
        'Poor appetite'
      ],
      menstrualFeatures: [
        'Scanty menstruation with pale color',
        'Cycle may be delayed',
        'Increased fatigue during menstruation',
        'May have mild menstrual pain'
      ]
    },
    yang_deficiency: {
      name: 'Yang Deficiency Constitution',
      description: 'Insufficient yang qi, characterized by aversion to cold, cold limbs, and other cold manifestations.',
      characteristics: [
        'Aversion to cold, cold hands and feet',
        'Prefers warm food and drinks, intolerant to cold',
        'Low spirits, tends to sleep more',
        'Loose stools, clear and long urine'
      ],
      commonSymptoms: [
        'Aversion to cold and cold limbs',
        'Mental fatigue',
        'Sore and weak lower back and knees',
        'Decreased sexual function'
      ],
      menstrualFeatures: [
        'Scanty menstruation with pale color',
        'Delayed cycle',
        'Abdominal pain during menstruation, relieved by warmth and pressure',
        'Obvious lower back pain before or during menstruation'
      ]
    },
    yin_deficiency: {
      name: 'Yin Deficiency Constitution',
      description: 'Insufficient yin fluid, characterized by dry mouth and throat, hot palms and soles.',
      characteristics: [
        'Hot palms and soles, dry mouth and throat',
        'Prefers cold drinks, intolerant to heat',
        'Dry stools, short and yellow urine',
        'Poor sleep, irritable temperament'
      ],
      commonSymptoms: [
        'Five-center heat (palms, soles, chest)',
        'Dry mouth and throat',
        'Night sweats',
        'Insomnia and vivid dreams'
      ],
      menstrualFeatures: [
        'Scanty or normal menstruation',
        'Cycle may be advanced',
        'Bright red menstrual color',
        'Irritability and insomnia before menstruation'
      ]
    },
    phlegm_dampness: {
      name: 'Phlegm-Dampness Constitution',
      description: 'Accumulation of phlegm and dampness, characterized by obesity, abdominal fullness, and sticky mouth.',
      characteristics: [
        'Obese body with soft and full abdomen',
        'Oily facial skin',
        'Easily drowsy, heavy body feeling',
        'Sticky or sweet mouth, prefers fatty and sweet foods'
      ],
      commonSymptoms: [
        'Heavy body and drowsiness',
        'Chest tightness and phlegm',
        'Sticky mouth',
        'Normal or loose stools'
      ],
      menstrualFeatures: [
        'Heavy or normal menstruation',
        'Light red color',
        'Thick consistency',
        'Chest tightness and edema before menstruation'
      ]
    },
    damp_heat: {
      name: 'Damp-Heat Constitution',
      description: 'Internal accumulation of damp-heat, characterized by oily face, bitter mouth, and yellow greasy tongue coating.',
      characteristics: [
        'Oily face, prone to acne',
        'Bitter and dry mouth, heavy body feeling',
        'Sticky or dry stools',
        'Short and yellow urine, men prone to scrotal dampness'
      ],
      commonSymptoms: [
        'Oily face',
        'Bitter and dry mouth',
        'Heavy body and drowsiness',
        'Sticky stools'
      ],
      menstrualFeatures: [
        'Heavy menstruation with dark red color',
        'Cycle may be advanced',
        'Irritability before menstruation',
        'Severe menstrual pain, prefers cold and dislikes heat'
      ]
    },
    blood_stasis: {
      name: 'Blood Stasis Constitution',
      description: 'Poor blood circulation, characterized by dull complexion and purple tongue.',
      characteristics: [
        'Dull complexion with pigmentation',
        'Prone to bruising',
        'Dark lips, purple sublingual vessels',
        'Irritable temperament, forgetful'
      ],
      commonSymptoms: [
        'Dull complexion',
        'Prone to dark spots',
        'Needle-like pain',
        'Forgetfulness'
      ],
      menstrualFeatures: [
        'Menstruation with blood clots',
        'Dark red or purple-black color',
        'Obvious menstrual pain, refuses pressure',
        'Breast distension before menstruation'
      ]
    },
    qi_stagnation: {
      name: 'Qi Stagnation Constitution',
      description: 'Stagnant qi movement, characterized by depression, anxiety, and emotional fragility.',
      characteristics: [
        'Depressed mood, emotionally fragile',
        'Restless and easily tense',
        'Sentimental and anxious',
        'Poor adaptability to mental stimulation'
      ],
      commonSymptoms: [
        'Emotional depression',
        'Chest and hypochondriac distension',
        'Frequent sighing',
        'Feeling of foreign body in throat'
      ],
      menstrualFeatures: [
        'Irregular menstruation',
        'Large emotional fluctuations before menstruation',
        'Obvious breast distension',
        'Menstrual pain related to emotions'
      ]
    },
    special_diathesis: {
      name: 'Special Constitution',
      description: 'Congenital abnormalities, characterized by physiological defects and allergic reactions.',
      characteristics: [
        'Congenital insufficiency',
        'Prone to allergies',
        'Poor adaptability',
        'Family history of hereditary diseases'
      ],
      commonSymptoms: [
        'Allergic diseases',
        'Hereditary diseases',
        'Congenital diseases'
      ],
      menstrualFeatures: [
        'Various menstrual abnormalities',
        'May be accompanied by allergic symptoms',
        'Sensitive to environmental changes'
      ]
    }
  }
};
