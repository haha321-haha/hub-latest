import { ConstitutionQuestion } from '../types/constitution';

export const constitutionQuestions: Record<string, ConstitutionQuestion[]> = {
  zh: [
    {
      id: 'energy_level',
      type: 'single',
      category: 'basic',
      weight: 2,
      title: '您平时的精力状态如何？',
      description: '选择最符合您日常状态的选项',
      validation: { required: true },
      options: [
        { 
          value: 'energetic', 
          label: '精力充沛，很少感到疲劳', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'moderate', 
          label: '精力一般，偶尔感到疲劳', 
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        { 
          value: 'tired', 
          label: '经常感到疲劳，精力不足', 
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        { 
          value: 'exhausted', 
          label: '总是感到疲惫不堪', 
          weight: 4,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'cold_tolerance',
      type: 'single',
      category: 'temperature',
      weight: 2,
      title: '您对寒冷的耐受性如何？',
      description: '比较您与同龄人的耐寒能力',
      validation: { required: true },
      options: [
        { 
          value: 'very_tolerant', 
          label: '很耐寒，手脚总是温暖', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'normal', 
          label: '一般，与大多数人差不多', 
          weight: 2,
          constitutionType: 'balanced'
        },
        { 
          value: 'sensitive', 
          label: '比较怕冷，手脚容易凉', 
          weight: 3,
          constitutionType: 'yang_deficiency'
        },
        { 
          value: 'very_sensitive', 
          label: '非常怕冷，即使夏天也手脚冰凉', 
          weight: 4,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'digestive_health',
      type: 'single',
      category: 'digestion',
      weight: 2,
      title: '您的消化功能如何？',
      description: '选择最符合您消化状况的描述',
      validation: { required: true },
      options: [
        { 
          value: 'excellent', 
          label: '消化很好，食欲正常，很少腹胀', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'good', 
          label: '消化一般，偶尔腹胀或消化不良', 
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        { 
          value: 'poor', 
          label: '经常腹胀、消化不良，食欲不振', 
          weight: 3,
          constitutionType: 'phlegm_dampness'
        },
        { 
          value: 'very_poor', 
          label: '消化很差，经常腹泻或便秘', 
          weight: 4,
          constitutionType: 'phlegm_dampness'
        }
      ]
    },
    {
      id: 'sleep_quality',
      type: 'single',
      category: 'sleep',
      weight: 2,
      title: '您的睡眠质量如何？',
      description: '评估您的整体睡眠状况',
      validation: { required: true },
      options: [
        { 
          value: 'excellent', 
          label: '睡眠很好，容易入睡，睡得深沉', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'light_sleep', 
          label: '睡眠较浅，容易醒，多梦', 
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        { 
          value: 'insomnia', 
          label: '经常失眠，难以入睡', 
          weight: 4,
          constitutionType: 'qi_stagnation'
        },
        { 
          value: 'drowsy', 
          label: '总是感到困倦，睡不够', 
          weight: 3,
          constitutionType: 'phlegm_dampness'
        }
      ]
    },
    {
      id: 'emotional_state',
      type: 'single',
      category: 'emotion',
      weight: 2,
      title: '您的情绪状态通常如何？',
      description: '选择最符合您情绪特点的描述',
      validation: { required: true },
      options: [
        { 
          value: 'stable', 
          label: '情绪稳定，心情愉快', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'anxious', 
          label: '容易焦虑，心情烦躁', 
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        { 
          value: 'depressed', 
          label: '经常感到抑郁，情绪低落', 
          weight: 4,
          constitutionType: 'qi_stagnation'
        },
        { 
          value: 'irritable', 
          label: '容易发脾气，情绪波动大', 
          weight: 3,
          constitutionType: 'damp_heat'
        }
      ]
    },
    {
      id: 'menstrual_pattern',
      type: 'single',
      category: 'menstruation',
      weight: 3,
      title: '您的月经特点是？',
      description: '选择最符合您月经情况的描述',
      validation: { required: true },
      options: [
        { 
          value: 'regular_normal', 
          label: '周期规律，量适中，颜色正常', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'light_delayed', 
          label: '量少，周期延后，颜色淡', 
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        { 
          value: 'heavy_early', 
          label: '量多，周期提前，颜色深红', 
          weight: 3,
          constitutionType: 'damp_heat'
        },
        { 
          value: 'clots_dark', 
          label: '有血块，颜色暗红或紫黑', 
          weight: 4,
          constitutionType: 'blood_stasis'
        },
        { 
          value: 'irregular', 
          label: '周期不规律，时多时少', 
          weight: 3,
          constitutionType: 'qi_stagnation'
        }
      ]
    },
    {
      id: 'body_type',
      type: 'single',
      category: 'physical',
      weight: 2,
      title: '您的体型特点是？',
      description: '选择最符合您体型的描述',
      validation: { required: true },
      options: [
        { 
          value: 'normal', 
          label: '体型匀称，不胖不瘦', 
          weight: 3,
          constitutionType: 'balanced'
        },
        { 
          value: 'thin', 
          label: '偏瘦，不容易长胖', 
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        { 
          value: 'overweight', 
          label: '偏胖，容易水肿', 
          weight: 3,
          constitutionType: 'phlegm_dampness'
        },
        { 
          value: 'muscular', 
          label: '体格健壮，肌肉结实', 
          weight: 2,
          constitutionType: 'balanced'
        }
      ]
    },
    {
      id: 'skin_condition',
      type: 'single',
      category: 'appearance',
      weight: 1,
      title: '您的皮肤状态如何？',
      description: '选择最符合您皮肤特点的描述',
      validation: { required: true },
      options: [
        {
          value: 'healthy',
          label: '皮肤润泽，有光泽，很少长痘',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'dry',
          label: '皮肤干燥，缺乏光泽',
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        {
          value: 'oily_acne',
          label: '皮肤油腻，容易长痘',
          weight: 3,
          constitutionType: 'damp_heat'
        },
        {
          value: 'dull',
          label: '皮肤暗沉，色斑较多',
          weight: 3,
          constitutionType: 'blood_stasis'
        }
      ]
    },
    // 新增痛经相关问题
    {
      id: 'menstrual_pain_severity',
      type: 'scale',
      category: 'menstrual',
      weight: 3,
      title: '您经期疼痛的程度如何？',
      description: '请在滑块上选择您的疼痛程度（0=无痛，10=剧烈疼痛）',
      validation: { required: true, min: 0, max: 10 },
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? '无痛' : i <= 3 ? '轻微' : i <= 6 ? '中等' : i <= 8 ? '严重' : '剧烈',
        weight: i <= 2 ? 3 : i <= 4 ? 2 : i <= 7 ? 3 : 4,
        constitutionType: i <= 2 ? 'balanced' : i <= 4 ? 'qi_deficiency' : i <= 7 ? 'blood_stasis' : 'qi_stagnation'
      }))
    },
    {
      id: 'pain_nature',
      type: 'single',
      category: 'menstrual',
      weight: 2,
      title: '您的经期疼痛性质主要是？',
      description: '选择最符合您疼痛感受的描述',
      validation: { required: true },
      options: [
        {
          value: 'cramping',
          label: '绞痛，一阵一阵的收缩感',
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'dull_ache',
          label: '钝痛，持续的隐隐作痛',
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'sharp_pain',
          label: '刺痛，像针扎一样',
          weight: 4,
          constitutionType: 'blood_stasis'
        },
        {
          value: 'cold_pain',
          label: '冷痛，遇冷加重，喜温喜按',
          weight: 3,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'menstrual_symptoms',
      type: 'multiple',
      category: 'menstrual',
      weight: 2,
      title: '您在经期还有哪些伴随症状？',
      description: '可以选择多个症状',
      validation: { required: false },
      options: [
        {
          value: 'bloating',
          label: '腹胀',
          weight: 2,
          constitutionType: 'phlegm_dampness'
        },
        {
          value: 'nausea',
          label: '恶心呕吐',
          weight: 3,
          constitutionType: 'damp_heat'
        },
        {
          value: 'headache',
          label: '头痛',
          weight: 2,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'mood_swings',
          label: '情绪波动大',
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'fatigue',
          label: '极度疲劳',
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'back_pain',
          label: '腰痛',
          weight: 2,
          constitutionType: 'yang_deficiency'
        },
        {
          value: 'breast_tenderness',
          label: '乳房胀痛',
          weight: 2,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'none',
          label: '以上都没有',
          weight: 1,
          constitutionType: 'balanced'
        }
      ]
    }
  ],
  en: [
    {
      id: 'energy_level',
      type: 'single',
      category: 'basic',
      weight: 2,
      title: 'How is your usual energy level?',
      description: 'Choose the option that best describes your daily state',
      validation: { required: true },
      options: [
        {
          value: 'energetic',
          label: 'Energetic, rarely feel tired',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'moderate',
          label: 'Moderate energy, occasionally feel tired',
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'tired',
          label: 'Often feel tired, lack of energy',
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'exhausted',
          label: 'Always feel exhausted',
          weight: 4,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'cold_tolerance',
      type: 'single',
      category: 'temperature',
      weight: 2,
      title: 'How is your tolerance to cold?',
      description: 'Compare your cold tolerance with people of your age',
      validation: { required: true },
      options: [
        {
          value: 'very_tolerant',
          label: 'Very cold-tolerant, hands and feet always warm',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'normal',
          label: 'Normal, similar to most people',
          weight: 2,
          constitutionType: 'balanced'
        },
        {
          value: 'sensitive',
          label: 'Quite sensitive to cold, hands and feet easily get cold',
          weight: 3,
          constitutionType: 'yang_deficiency'
        },
        {
          value: 'very_sensitive',
          label: 'Very sensitive to cold, hands and feet cold even in summer',
          weight: 4,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'digestive_health',
      type: 'single',
      category: 'digestion',
      weight: 2,
      title: 'How is your digestive function?',
      description: 'Choose the description that best fits your digestive condition',
      validation: { required: true },
      options: [
        {
          value: 'excellent',
          label: 'Excellent digestion, normal appetite, rarely bloated',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'good',
          label: 'Fair digestion, occasional bloating or indigestion',
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'poor',
          label: 'Often bloated, indigestion, poor appetite',
          weight: 3,
          constitutionType: 'phlegm_dampness'
        },
        {
          value: 'very_poor',
          label: 'Very poor digestion, often diarrhea or constipation',
          weight: 4,
          constitutionType: 'phlegm_dampness'
        }
      ]
    },
    {
      id: 'sleep_quality',
      type: 'single',
      category: 'sleep',
      weight: 2,
      title: 'How is your sleep quality?',
      description: 'Assess your overall sleep condition',
      validation: { required: true },
      options: [
        {
          value: 'excellent',
          label: 'Excellent sleep, fall asleep easily, sleep deeply',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'light_sleep',
          label: 'Light sleep, wake up easily, many dreams',
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        {
          value: 'insomnia',
          label: 'Often insomnia, difficult to fall asleep',
          weight: 4,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'drowsy',
          label: 'Always feel drowsy, never get enough sleep',
          weight: 3,
          constitutionType: 'phlegm_dampness'
        }
      ]
    },
    {
      id: 'emotional_state',
      type: 'single',
      category: 'emotion',
      weight: 2,
      title: 'How is your emotional state usually?',
      description: 'Choose the description that best fits your emotional characteristics',
      validation: { required: true },
      options: [
        {
          value: 'stable',
          label: 'Emotionally stable, happy mood',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'anxious',
          label: 'Easily anxious, irritable mood',
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'depressed',
          label: 'Often feel depressed, low mood',
          weight: 4,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'irritable',
          label: 'Easily lose temper, large mood swings',
          weight: 3,
          constitutionType: 'damp_heat'
        }
      ]
    },
    {
      id: 'menstrual_pattern',
      type: 'single',
      category: 'menstruation',
      weight: 3,
      title: 'What are your menstrual characteristics?',
      description: 'Choose the description that best fits your menstrual condition',
      validation: { required: true },
      options: [
        {
          value: 'regular_normal',
          label: 'Regular cycle, moderate flow, normal color',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'light_delayed',
          label: 'Light flow, delayed cycle, pale color',
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'heavy_early',
          label: 'Heavy flow, early cycle, dark red color',
          weight: 3,
          constitutionType: 'damp_heat'
        },
        {
          value: 'clots_dark',
          label: 'Blood clots, dark red or purple-black color',
          weight: 4,
          constitutionType: 'blood_stasis'
        },
        {
          value: 'irregular',
          label: 'Irregular cycle, variable flow',
          weight: 3,
          constitutionType: 'qi_stagnation'
        }
      ]
    },
    {
      id: 'body_type',
      type: 'single',
      category: 'physical',
      weight: 2,
      title: 'What are your body type characteristics?',
      description: 'Choose the description that best fits your body type',
      validation: { required: true },
      options: [
        {
          value: 'normal',
          label: 'Well-proportioned, neither fat nor thin',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'thin',
          label: 'Lean, not easy to gain weight',
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        {
          value: 'overweight',
          label: 'Overweight, prone to edema',
          weight: 3,
          constitutionType: 'phlegm_dampness'
        },
        {
          value: 'muscular',
          label: 'Strong build, firm muscles',
          weight: 2,
          constitutionType: 'balanced'
        }
      ]
    },
    {
      id: 'skin_condition',
      type: 'single',
      category: 'appearance',
      weight: 1,
      title: 'How is your skin condition?',
      description: 'Choose the description that best fits your skin characteristics',
      validation: { required: true },
      options: [
        {
          value: 'healthy',
          label: 'Moist skin, glossy, rarely get acne',
          weight: 3,
          constitutionType: 'balanced'
        },
        {
          value: 'dry',
          label: 'Dry skin, lack of luster',
          weight: 3,
          constitutionType: 'yin_deficiency'
        },
        {
          value: 'oily_acne',
          label: 'Oily skin, prone to acne',
          weight: 3,
          constitutionType: 'damp_heat'
        },
        {
          value: 'dull',
          label: 'Dull skin, many dark spots',
          weight: 3,
          constitutionType: 'blood_stasis'
        }
      ]
    },
    // New menstrual pain related questions
    {
      id: 'menstrual_pain_severity',
      type: 'scale',
      category: 'menstrual',
      weight: 3,
      title: 'How severe is your menstrual pain?',
      description: 'Please select your pain level on the slider (0=No pain, 10=Severe pain)',
      validation: { required: true, min: 0, max: 10 },
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i === 0 ? 'No pain' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : i <= 8 ? 'Severe' : 'Extreme',
        weight: i <= 2 ? 3 : i <= 4 ? 2 : i <= 7 ? 3 : 4,
        constitutionType: i <= 2 ? 'balanced' : i <= 4 ? 'qi_deficiency' : i <= 7 ? 'blood_stasis' : 'qi_stagnation'
      }))
    },
    {
      id: 'pain_nature',
      type: 'single',
      category: 'menstrual',
      weight: 2,
      title: 'What is the nature of your menstrual pain?',
      description: 'Choose the description that best matches your pain sensation',
      validation: { required: true },
      options: [
        {
          value: 'cramping',
          label: 'Cramping, wave-like contractions',
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'dull_ache',
          label: 'Dull ache, continuous mild pain',
          weight: 3,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'sharp_pain',
          label: 'Sharp pain, like needle pricks',
          weight: 4,
          constitutionType: 'blood_stasis'
        },
        {
          value: 'cold_pain',
          label: 'Cold pain, worsens with cold, improves with warmth',
          weight: 3,
          constitutionType: 'yang_deficiency'
        }
      ]
    },
    {
      id: 'menstrual_symptoms',
      type: 'multiple',
      category: 'menstrual',
      weight: 2,
      title: 'What other symptoms do you experience during menstruation?',
      description: 'You can select multiple symptoms',
      validation: { required: false },
      options: [
        {
          value: 'bloating',
          label: 'Bloating',
          weight: 2,
          constitutionType: 'phlegm_dampness'
        },
        {
          value: 'nausea',
          label: 'Nausea and vomiting',
          weight: 3,
          constitutionType: 'damp_heat'
        },
        {
          value: 'headache',
          label: 'Headache',
          weight: 2,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'mood_swings',
          label: 'Severe mood swings',
          weight: 3,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'fatigue',
          label: 'Extreme fatigue',
          weight: 2,
          constitutionType: 'qi_deficiency'
        },
        {
          value: 'back_pain',
          label: 'Back pain',
          weight: 2,
          constitutionType: 'yang_deficiency'
        },
        {
          value: 'breast_tenderness',
          label: 'Breast tenderness',
          weight: 2,
          constitutionType: 'qi_stagnation'
        },
        {
          value: 'none',
          label: 'None of the above',
          weight: 1,
          constitutionType: 'balanced'
        }
      ]
    }
  ]
};
