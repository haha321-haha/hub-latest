#!/usr/bin/env node

/**
 * 创建应急包页面翻译键
 * 为 scenario-solutions/emergency-kit 页面生成翻译键
 */

const fs = require('fs');
const path = require('path');

class EmergencyKitTranslationsCreator {
  constructor() {
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.zhPath = path.join(this.messagesDir, 'zh.json');
    this.enPath = path.join(this.messagesDir, 'en.json');
  }

  /**
   * 加载现有翻译文件
   */
  loadTranslations() {
    let zhTranslations = {};
    let enTranslations = {};

    try {
      if (fs.existsSync(this.zhPath)) {
        const zhContent = fs.readFileSync(this.zhPath, 'utf8');
        zhTranslations = JSON.parse(zhContent);
      }
    } catch (error) {
      console.error('❌ 加载 zh.json 失败:', error.message);
    }

    try {
      if (fs.existsSync(this.enPath)) {
        const enContent = fs.readFileSync(this.enPath, 'utf8');
        enTranslations = JSON.parse(enContent);
      }
    } catch (error) {
      console.error('❌ 加载 en.json 失败:', error.message);
    }

    return { zhTranslations, enTranslations };
  }

  /**
   * 创建应急包页面翻译键
   */
  createEmergencyKitTranslations() {
    const { zhTranslations, enTranslations } = this.loadTranslations();

    // 应急包页面翻译键
    const emergencyKitTranslations = {
      zh: {
        scenarios: {
          emergencyKit: {
            title: '多场景经期应急包清单',
            description: '从容应对，自在生活：经期不适，你不是一个人在战斗。这份清单为你提供了在各种场景下的应急准备和物品建议，帮助你随时随地都能从容应对，掌控自己的状态。',
            breadcrumb: '应急包清单',
            teenSection: {
              title: '🌸 青少年专区新增！',
              subtitle: '专为12-18岁女孩设计的校园应急包',
              description: '我们特别为青少年朋友们新增了校园应急包清单！从课堂应急到宿舍管理，从与老师沟通到同学互助，全方位帮助你在校园环境中自信应对经期。',
              exploreButton: '探索青少年专区',
              guideButton: '校园应急指南'
            },
            importantNotice: {
              title: '重要提示',
              content: '本清单提供的建议为辅助缓解措施，如果你的经期疼痛剧烈或伴有其他异常症状，请务必及时就医。止痛药等药物的使用，应在医生或药师指导下进行。'
            },
            scenarios: {
              teen: {
                name: '青少年/校园',
                description: '专为12-18岁青少年设计的校园应急包，帮助在学校、宿舍等环境中从容应对经期不适。',
                items: {
                  miniHeatPatches: {
                    name: '迷你热敷贴/暖宝宝',
                    usage: '贴在小腹或腰部，随时随地提供温暖。体积小巧，可以隐蔽使用，不会引起同学注意。特别适合在课堂上使用。',
                    tip: '选择可长时间发热且恒温的产品。确保隔着衣物使用，避免低温烫伤。可以在上学前贴好。'
                  },
                  painMedication: {
                    name: '止痛药（家长同意下）',
                    usage: '在家长同意和指导下，随身携带适量的安全止痛药。在身体刚感觉不适时服用，有效快速缓解疼痛。',
                    tip: '务必在家长或医生指导下使用。了解药品的剂量、服用时间。不要与同学分享药物。'
                  },
                  hotWaterBottle: {
                    name: '热水杯/保温杯',
                    usage: '和学校沟通，看看能不能允许经期特别不舒服时使用。随时补充温水，有助于缓解腹胀和肌肉紧张。',
                    tip: '选择保温效果好的杯子。可以在课间或午休时使用。如果学校不允许，可以在课间去饮水处喝温水。'
                  },
                  smallSnacks: {
                    name: '小零食（巧克力/糖果）',
                    usage: '一块巧克力或少量糖果，有时候能帮你分散注意力，提供能量。在感觉疲劳或情绪低落时食用。',
                    tip: '选择独立包装，方便携带。注意不要在课堂上食用，可以在课间或午休时享用。'
                  },
                  spareClothing: {
                    name: '舒适的备用衣物',
                    usage: '准备一件宽松的外套或围巾，在感觉寒冷或需要额外保暖时使用。也可以在腹部不适时提供心理安慰。',
                    tip: '选择容易搭配的颜色和款式。可以放在宿舍或储物柜里备用。'
                  },
                  communicationCards: {
                    name: '沟通卡片/便条',
                    usage: '提前准备好简单的便条，如"我身体不太舒服，可以去医务室吗？"方便在不好意思开口时使用。',
                    tip: '可以准备中英文版本。也可以事先和信任的同学或老师沟通，建立理解和支持。'
                  }
                }
              },
              office: {
                name: '办公/职场',
                description: '在办公室面对突然来袭的经期疼痛，需要快速、便捷且不影响工作的方式来缓解。',
                items: {
                  miniHeatPatches: {
                    name: '迷你热敷贴/暖宝宝',
                    usage: '贴在小腹或腰部。提供持续温暖，放松肌肉，缓解痉挛。体积小巧，方便隐蔽使用。',
                    tip: '选择可长时间发热且恒温的产品。确保隔着衣物使用，避免低温烫伤。'
                  },
                  painMedication: {
                    name: '随身止痛药',
                    usage: '在身体刚感觉不适时服用。有效快速缓解疼痛。务必在医生或药师指导下携带和使用。',
                    tip: '了解药品的剂量、服用时间和可能的副作用。不要擅自增加剂量。'
                  },
                  gingerTea: {
                    name: '红糖姜茶包/速溶温饮',
                    usage: '在茶水间用热水冲泡饮用。温热饮品有助于促进血液循环，缓解腹胀和寒凝。',
                    tip: '选择独立包装，方便携带和冲泡。'
                  },
                  massageTools: {
                    name: '小巧的按摩工具',
                    usage: '在办公椅上或休息时，轻柔按摩腰部、手部穴位。分散注意力，缓解局部肌肉紧张。',
                    tip: '无需大幅度动作，可在衣服下进行。'
                  }
                }
              },
              commute: {
                name: '通勤',
                description: '在路上遭遇经期不适，特别是乘坐公共交通时，需要快速、不引人注意的应急方法。',
                items: {
                  miniHandWarmers: {
                    name: '迷你暖宝宝',
                    usage: '上路前贴好。长时间提供温暖，特别适合长时间站立或坐着的通勤。',
                    tip: '确保粘性好不易脱落。'
                  },
                  warmWater: {
                    name: '小瓶温水或保温杯',
                    usage: '随时补充水分，小口饮用温水。温水有助于缓解腹胀和肌肉紧张。',
                    tip: '冬季尤其重要。如果乘坐交通工具不便，可在上车前或下车后及时补充。'
                  },
                  headphones: {
                    name: '耳机',
                    usage: '听舒缓音乐、白噪音或播客。分散注意力，平静情绪。',
                    tip: '可尝试声波疗法中推荐的舒缓音频。'
                  }
                }
              },
              exercise: {
                name: '运动/户外',
                description: '经期适度运动有益健康，但在运动中或户外环境遭遇疼痛，需要特别的准备和应对。',
                items: {
                  windproofJacket: {
                    name: '轻薄防风外套',
                    usage: '运动出汗后及时穿上，避免受凉。特别是在户外环境中。',
                    tip: '受凉可能加重疼痛。选择透气吸湿排汗的专业运动服。'
                  },
                  hygieneProducts: {
                    name: '个人卫生用品（运动专用）',
                    usage: '如运动型卫生巾/棉条/月经杯。确保运动中的防漏和舒适。',
                    tip: '根据运动强度和自身流量选择合适的产品。'
                  },
                  water: {
                    name: '充足的饮用水/电解质饮料',
                    usage: '运动中及时补充水分和电解质。避免脱水，有助于身体维持正常功能，部分缓解疲劳和痉挛。',
                    tip: '温水更佳。避免空腹运动。'
                  }
                }
              },
              sleep: {
                name: '睡眠',
                description: '夜间的经期疼痛会严重影响睡眠，良好的准备有助于安稳入睡。',
                items: {
                  heatingItems: {
                    name: '热水袋/电热毯/暖宝宝',
                    usage: '睡前敷在小腹或腰部。提供持续温暖，放松腹部肌肉，显著缓解痉挛痛感。',
                    tip: '注意温度，避免烫伤。电热毯/热水袋需注意安全使用。暖宝宝适合整夜使用。'
                  },
                  bodyPillow: {
                    name: '抱枕或靠垫',
                    usage: '睡觉时放在膝下或抱在怀里（配合左侧卧）。帮助身体保持舒适姿势，减轻腹部受压。',
                    tip: '可以尝试在双腿中间夹一个抱枕，或将抱枕放在腹部下方支撑。'
                  },
                  sleepAudio: {
                    name: '睡前助眠音频',
                    usage: '睡前播放，调节神经，分散对疼痛的注意力，帮助放松入睡。',
                    tip: '可佩戴舒适的耳机。选择音量适中、内容平静的音频。'
                  }
                }
              },
              social: {
                name: '社交',
                description: '参与社交活动（如约会、聚会、外出用餐）时应对经期不适，需要巧妙应对和提前准备。',
                items: {
                  miniHandWarmers: {
                    name: '迷你暖宝宝',
                    usage: '外出前贴好。提供持续温暖，不易被他人察觉。',
                    tip: '选择体积小巧，贴合性好的产品。'
                  },
                  comfortableClothing: {
                    name: '舒适且便于行动的衣物',
                    usage: '选择不会勒紧腹部，同时也便于进行一些隐蔽的小调整的衣物。',
                    tip: '美观与舒适兼顾。'
                  },
                  scarf: {
                    name: '一条小巧舒适的围巾或披肩',
                    usage: '在空调环境或感到畏寒时使用。保护腹部和腰部。',
                    tip: '既是配饰，也能提供保暖和安全感。'
                  }
                }
              }
            },
            summary: {
              title: '总结与建议',
              content: '这份清单为你提供了一个基础框架，具体的应急包内容和准备方式可以根据你个人的实际情况、疼痛程度、生活习惯以及所处的具体环境进行调整。最重要的是：',
              tips: [
                {
                  title: '了解你的身体：',
                  content: '关注经期疼痛的规律和特点。'
                },
                {
                  title: '提前做好准备：',
                  content: '防患于未然，将应急物品成为你包里的常备项。'
                },
                {
                  title: '倾听身体的声音：',
                  content: '不要硬撑，如果疼痛严重影响正常生活，及时寻求休息或医疗帮助。'
                },
                {
                  title: '勇敢寻求帮助：',
                  content: '在需要时，告诉家人、朋友或信任的人你的不适，获得他们的理解和支持。'
                },
                {
                  title: '青少年特别提醒：',
                  content: '如果你是12-18岁的学生，记得与家长沟通应急包的准备，在学校遇到困难时勇敢向老师或校医求助。'
                }
              ],
              conclusion: '希望这份清单能帮助你在经期也能更加自信、舒适地面对各种生活场景！'
            },
            disclaimer: {
              title: '免责声明',
              content: '本清单提供的建议仅供信息参考，不能替代专业的医疗诊断、治疗或建议。药物使用请务必遵循医生或药师的指导。个体情况差异，请根据自身感受进行调整。如果你的经期疼痛剧烈难忍，或伴随其他异常症状（如发烧、剧烈呕吐、异常出血等），请立即就医。'
            },
            backToOverview: '返回场景解决方案总览'
          }
        }
      },
      en: {
        scenarios: {
          emergencyKit: {
            title: 'Multi-Scenario Period Emergency Kit List',
            description: 'Handle with confidence, live comfortably: You\'re not fighting period discomfort alone. This list provides emergency preparation and item suggestions for various scenarios, helping you handle any situation with confidence and control your state.',
            breadcrumb: 'Emergency Kit List',
            teenSection: {
              title: '🌸 New Teen Section Added!',
              subtitle: 'Campus emergency kit designed for girls aged 12-18',
              description: 'We\'ve specially added a campus emergency kit list for our teen friends! From classroom emergencies to dorm management, from communicating with teachers to peer support, comprehensive help for confidently handling periods in campus environments.',
              exploreButton: 'Explore Teen Zone',
              guideButton: 'Campus Emergency Guide'
            },
            importantNotice: {
              title: 'Important Notice',
              content: 'The suggestions in this list are auxiliary relief measures. If you experience severe period pain or other abnormal symptoms, please seek medical attention promptly. Use of pain medications should be under the guidance of a doctor or pharmacist.'
            },
            scenarios: {
              teen: {
                name: 'Teen/Campus',
                description: 'Campus emergency kit designed specifically for teens aged 12-18, helping handle period discomfort confidently in school, dorm, and other environments.',
                items: {
                  miniHeatPatches: {
                    name: 'Mini Heat Patches/Hand Warmers',
                    usage: 'Apply to abdomen or lower back for warmth anytime, anywhere. Compact size allows discreet use without attracting classmates\' attention. Especially suitable for classroom use.',
                    tip: 'Choose products with long-lasting, constant temperature heat. Use over clothing to avoid burns. Can apply before going to school.'
                  },
                  painMedication: {
                    name: 'Pain Medication (With Parental Consent)',
                    usage: 'Carry safe pain medication with parental consent and guidance. Take when body first feels discomfort for effective, quick pain relief.',
                    tip: 'Must use under parental or medical guidance. Understand dosage and timing. Do not share medication with classmates.'
                  },
                  hotWaterBottle: {
                    name: 'Hot Water Bottle/Thermos',
                    usage: 'Communicate with school about using during particularly difficult periods. Replenish warm water anytime to help relieve bloating and muscle tension.',
                    tip: 'Choose cups with good insulation. Can use during breaks or lunch. If school doesn\'t allow, drink warm water at water stations during breaks.'
                  },
                  smallSnacks: {
                    name: 'Small Snacks (Chocolate/Candy)',
                    usage: 'A piece of chocolate or small candy can help distract attention and provide energy. Eat when feeling tired or down.',
                    tip: 'Choose individually packaged for easy carrying. Don\'t eat during class, enjoy during breaks or lunch.'
                  },
                  spareClothing: {
                    name: 'Comfortable Spare Clothing',
                    usage: 'Prepare a loose jacket or scarf for when feeling cold or needing extra warmth. Can also provide psychological comfort when abdomen feels uncomfortable.',
                    tip: 'Choose colors and styles that are easy to match. Can keep in dorm or locker as backup.'
                  },
                  communicationCards: {
                    name: 'Communication Cards/Notes',
                    usage: 'Prepare simple notes in advance, like "I\'m not feeling well, may I go to the nurse\'s office?" for use when too shy to speak up.',
                    tip: 'Can prepare Chinese and English versions. Also communicate with trusted classmates or teachers in advance to build understanding and support.'
                  }
                }
              },
              office: {
                name: 'Office/Workplace',
                description: 'Facing sudden period pain in the office requires quick, convenient methods that don\'t affect work.',
                items: {
                  miniHeatPatches: {
                    name: 'Mini Heat Patches/Hand Warmers',
                    usage: 'Apply to abdomen or lower back. Provides continuous warmth, relaxes muscles, relieves cramps. Compact size for discreet use.',
                    tip: 'Choose products with long-lasting, constant temperature heat. Use over clothing to avoid low-temperature burns.'
                  },
                  painMedication: {
                    name: 'Portable Pain Medication',
                    usage: 'Take when body first feels discomfort. Effectively relieves pain quickly. Must carry and use under doctor or pharmacist guidance.',
                    tip: 'Understand dosage, timing, and possible side effects. Do not increase dosage without authorization.'
                  },
                  gingerTea: {
                    name: 'Brown Sugar Ginger Tea/Instant Warm Drinks',
                    usage: 'Brew with hot water in tea room. Warm drinks help promote blood circulation, relieve bloating and cold stagnation.',
                    tip: 'Choose individually packaged for easy carrying and brewing.'
                  },
                  massageTools: {
                    name: 'Compact Massage Tools',
                    usage: 'Gently massage waist and hand acupoints while in office chair or resting. Distracts attention, relieves local muscle tension.',
                    tip: 'No large movements needed, can be done under clothing.'
                  }
                }
              },
              commute: {
                name: 'Commute',
                description: 'Encountering period discomfort on the road, especially on public transport, requires quick, discreet emergency methods.',
                items: {
                  miniHandWarmers: {
                    name: 'Mini Hand Warmers',
                    usage: 'Apply before departure. Provides long-term warmth, especially suitable for long periods of standing or sitting during commute.',
                    tip: 'Ensure good adhesion and won\'t fall off easily.'
                  },
                  warmWater: {
                    name: 'Small Bottle of Warm Water or Thermos',
                    usage: 'Replenish fluids anytime, sip warm water. Warm water helps relieve bloating and muscle tension.',
                    tip: 'Especially important in winter. If inconvenient on transport, replenish before boarding or after alighting.'
                  },
                  headphones: {
                    name: 'Headphones',
                    usage: 'Listen to soothing music, white noise, or podcasts. Distracts attention, calms emotions.',
                    tip: 'Try soothing audio recommended in sound therapy.'
                  }
                }
              },
              exercise: {
                name: 'Exercise/Outdoor',
                description: 'Moderate exercise during menstruation is beneficial for health, but encountering pain during exercise or outdoor environments requires special preparation and response.',
                items: {
                  windproofJacket: {
                    name: 'Lightweight Windproof Jacket',
                    usage: 'Put on immediately after sweating from exercise to avoid catching cold. Especially important in outdoor environments.',
                    tip: 'Catching cold may worsen pain. Choose breathable, moisture-wicking professional sportswear.'
                  },
                  hygieneProducts: {
                    name: 'Personal Hygiene Products (Sports-specific)',
                    usage: 'Such as sports sanitary pads/tampons/menstrual cups. Ensure leak protection and comfort during exercise.',
                    tip: 'Choose appropriate products based on exercise intensity and personal flow.'
                  },
                  water: {
                    name: 'Adequate Drinking Water/Electrolyte Drinks',
                    usage: 'Replenish fluids and electrolytes during exercise. Avoid dehydration, helps body maintain normal function, partially relieves fatigue and cramps.',
                    tip: 'Warm water is better. Avoid exercising on an empty stomach.'
                  }
                }
              },
              sleep: {
                name: 'Sleep',
                description: 'Nighttime period pain can seriously affect sleep, good preparation helps ensure restful sleep.',
                items: {
                  heatingItems: {
                    name: 'Hot Water Bottle/Electric Blanket/Hand Warmers',
                    usage: 'Apply to abdomen or lower back before sleep. Provides continuous warmth, relaxes abdominal muscles, significantly relieves cramping pain.',
                    tip: 'Pay attention to temperature to avoid burns. Electric blankets/hot water bottles require safe use. Hand warmers are suitable for all-night use.'
                  },
                  bodyPillow: {
                    name: 'Body Pillow or Cushion',
                    usage: 'Place under knees or hug while sleeping (with left side lying). Helps body maintain comfortable position, reduces abdominal pressure.',
                    tip: 'Try placing a pillow between legs or under abdomen for support.'
                  },
                  sleepAudio: {
                    name: 'Bedtime Sleep Audio',
                    usage: 'Play before sleep to regulate nerves, distract from pain, help relax and fall asleep.',
                    tip: 'Can wear comfortable headphones. Choose moderate volume, calm content audio.'
                  }
                }
              },
              social: {
                name: 'Social',
                description: 'When participating in social activities (such as dates, parties, dining out) while dealing with period discomfort, requires clever handling and advance preparation.',
                items: {
                  miniHandWarmers: {
                    name: 'Mini Hand Warmers',
                    usage: 'Apply before going out. Provides continuous warmth, not easily noticed by others.',
                    tip: 'Choose compact products with good adhesion.'
                  },
                  comfortableClothing: {
                    name: 'Comfortable and Movement-friendly Clothing',
                    usage: 'Choose clothing that doesn\'t constrict the abdomen while allowing for discreet small adjustments.',
                    tip: 'Balance beauty and comfort.'
                  },
                  scarf: {
                    name: 'Small Comfortable Scarf or Shawl',
                    usage: 'Use in air-conditioned environments or when feeling cold. Protects abdomen and waist.',
                    tip: 'Serves as both accessory and provides warmth and security.'
                  }
                }
              }
            },
            summary: {
              title: 'Summary and Recommendations',
              content: 'This list provides a basic framework. The specific emergency kit contents and preparation methods can be adjusted according to your personal situation, pain level, lifestyle habits, and specific environment. Most importantly:',
              tips: [
                {
                  title: 'Know your body: ',
                  content: 'Pay attention to the patterns and characteristics of menstrual pain.'
                },
                {
                  title: 'Prepare in advance: ',
                  content: 'Be prepared, make emergency items a regular part of your bag.'
                },
                {
                  title: 'Listen to your body: ',
                  content: 'Don\'t push through, if pain seriously affects normal life, seek rest or medical help promptly.'
                },
                {
                  title: 'Seek help bravely: ',
                  content: 'When needed, tell family, friends, or trusted people about your discomfort to gain their understanding and support.'
                },
                {
                  title: 'Special reminder for teens: ',
                  content: 'If you\'re a 12-18 year old student, remember to communicate with parents about emergency kit preparation, and bravely seek help from teachers or school nurses when facing difficulties at school.'
                }
              ],
              conclusion: 'Hope this list helps you face various life scenarios with more confidence and comfort during your period!'
            },
            disclaimer: {
              title: 'Disclaimer',
              content: 'The suggestions in this list are for informational reference only and cannot replace professional medical diagnosis, treatment, or advice. Please follow doctor or pharmacist guidance for medication use. Individual situations vary, please adjust according to your own feelings. If your menstrual pain is severe and unbearable, or accompanied by other abnormal symptoms (such as fever, severe vomiting, abnormal bleeding, etc.), please seek medical attention immediately.'
            },
            backToOverview: 'Back to Scenario Solutions Overview'
          }
        }
      }
    };

    // 合并到现有翻译中
    if (!zhTranslations.scenarios) {
      zhTranslations.scenarios = {};
    }
    if (!enTranslations.scenarios) {
      enTranslations.scenarios = {};
    }

    zhTranslations.scenarios.emergencyKit = emergencyKitTranslations.zh.scenarios.emergencyKit;
    enTranslations.scenarios.emergencyKit = emergencyKitTranslations.en.scenarios.emergencyKit;

    return { zhTranslations, enTranslations };
  }

  /**
   * 保存翻译文件
   */
  saveTranslations(zhTranslations, enTranslations) {
    try {
      // 创建备份
      if (fs.existsSync(this.zhPath)) {
        fs.copyFileSync(this.zhPath, this.zhPath + '.backup');
      }
      if (fs.existsSync(this.enPath)) {
        fs.copyFileSync(this.enPath, this.enPath + '.backup');
      }

      // 保存新翻译
      fs.writeFileSync(this.zhPath, JSON.stringify(zhTranslations, null, 2), 'utf8');
      fs.writeFileSync(this.enPath, JSON.stringify(enTranslations, null, 2), 'utf8');

      console.log('✅ 应急包页面翻译键创建成功！');
      console.log(`📁 中文翻译: ${this.zhPath}`);
      console.log(`📁 英文翻译: ${this.enPath}`);
    } catch (error) {
      console.error('❌ 保存翻译文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 运行创建过程
   */
  run() {
    console.log('🚀 开始创建应急包页面翻译键...\n');
    
    try {
      const { zhTranslations, enTranslations } = this.createEmergencyKitTranslations();
      this.saveTranslations(zhTranslations, enTranslations);
      
      console.log('\n📊 创建统计:');
      console.log(`  - 中文键数: ${Object.keys(zhTranslations.scenarios.emergencyKit).length}`);
      console.log(`  - 英文键数: ${Object.keys(enTranslations.scenarios.emergencyKit).length}`);
      console.log('\n✅ 应急包页面翻译键创建完成！');
    } catch (error) {
      console.error('❌ 创建失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行创建器
if (require.main === module) {
  const creator = new EmergencyKitTranslationsCreator();
  creator.run();
}

module.exports = EmergencyKitTranslationsCreator;
