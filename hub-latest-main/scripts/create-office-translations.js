#!/usr/bin/env node

/**
 * 创建办公场景页面翻译键
 * 为 scenario-solutions/office 页面生成翻译键
 */

const fs = require('fs');
const path = require('path');

class OfficeTranslationsCreator {
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
   * 创建办公页面翻译键
   */
  createOfficeTranslations() {
    const { zhTranslations, enTranslations } = this.loadTranslations();

    // 办公页面翻译键
    const officeTranslations = {
      zh: {
        scenarios: {
          office: {
            title: '办公场景解决方案',
            description: '在办公室面对突然来袭的经期疼痛，需要快速、便捷且不影响工作的方式来缓解。',
            emergencyKit: {
              title: '会议应急包',
              categories: {
                coreEquipment: {
                  name: '核心装备',
                  items: [
                    '可粘贴暖宝宝（ThermaCare隐形贴片）',
                    '迷你电热护腰（USB充电款）',
                    '姜茶冲剂条（无糖配方）',
                    '应急能量胶（含镁+维生素B6）'
                  ]
                },
                painRelief: {
                  name: '疼痛缓解',
                  items: [
                    '布洛芬/对乙酰氨基酚',
                    '薄荷膏（太阳穴按摩用）',
                    '简易按摩工具'
                  ]
                },
                imageManagement: {
                  name: '形象管理',
                  items: [
                    '镜子、唇膏、吸油纸',
                    '干发喷雾、除臭剂',
                    '应急化妆品'
                  ]
                }
              },
              discreetGuide: {
                title: '隐蔽使用指南',
                tips: [
                  '热敷贴启动借口："正在用暖宝宝缓解肩颈酸痛"',
                  '突发疼痛离场话术："需要紧急处理客户邮件"'
                ]
              }
            },
            stretching: {
              title: '办公椅拉伸系统',
              exercises: {
                pelvicClock: {
                  name: '座椅骨盆时钟运动',
                  description: '缓解骶髂关节压力，改善下背部血液循环',
                  duration: '每次30秒，重复3-5次',
                  steps: [
                    '坐在椅子边缘，双脚平放地面',
                    '想象骨盆是时钟，缓慢画圆',
                    '顺时针和逆时针各做一组'
                  ]
                },
                footMassage: {
                  name: '隐藏式足底按摩',
                  description: '利用桌下筋膜球，促进下肢血液回流',
                  duration: '随时进行，每次2-3分钟',
                  steps: [
                    '在桌下放置小型按摩球',
                    '脱掉鞋子，用脚底滚动按摩球',
                    '重点按压足弓和脚跟部位'
                  ]
                },
                sideStretch: {
                  name: '饮水机旁侧腰拉伸',
                  description: '自然站立姿势，缓解腰部紧张',
                  duration: '每侧保持15-30秒',
                  steps: [
                    '站在饮水机旁，双脚与肩同宽',
                    '一手扶腰，另一手向上伸展',
                    '身体向一侧弯曲，感受侧腰拉伸'
                  ]
                }
              }
            },
            nutrition: {
              title: '职场饮食管理',
              meals: {
                breakfast: {
                  time: '早餐 (7:00-8:00)',
                  foods: '燕麦粥+坚果+香蕉',
                  benefits: '提供持续能量，稳定血糖'
                },
                morningTea: {
                  time: '上午茶 (10:00)',
                  foods: '红枣茶或玫瑰花茶',
                  benefits: '温暖子宫，缓解痉挛'
                },
                lunch: {
                  time: '午餐 (12:00-13:00)',
                  foods: '瘦肉+深绿色蔬菜+糙米',
                  benefits: '补铁补纤维，预防贫血'
                },
                afternoonTea: {
                  time: '下午茶 (15:00)',
                  foods: '黑巧克力+温牛奶',
                  benefits: '缓解情绪波动，补充镁元素'
                }
              },
              avoidFoods: {
                title: '避免食物清单',
                categories: {
                  coldDrinks: {
                    name: '冰饮类：',
                    items: '冰咖啡、冷饮、冰水'
                  },
                  highSalt: {
                    name: '高盐零食：',
                    items: '薯片、腌制食品'
                  },
                  excessiveCaffeine: {
                    name: '过量咖啡因：',
                    items: '浓咖啡、能量饮料'
                  }
                }
              }
            },
            communication: {
              title: '沟通模板助手',
              description: '经期不适时，与身边的人进行有效沟通。这些模板可以帮助你更好地表达需求和寻求理解。',
              templates: {
                partner: {
                  name: '与伴侣沟通',
                  icon: '💕',
                  scenarios: {
                    notification: {
                      situation: '通知告知',
                      tone: '亲密',
                      template: '"亲爱的，我今天身体不太舒服，可能需要多休息一下。如果我看起来有点不舒服，请不要担心。"',
                      copyText: '复制文本'
                    },
                    seekingUnderstanding: {
                      situation: '寻求理解',
                      tone: '亲密',
                      template: '"我现在有些疼痛，可能情绪会有些波动。你能理解并给我一些时间和空间吗？我会尽快恢复的。"',
                      copyText: '复制文本'
                    }
                  }
                },
                friends: {
                  name: '与朋友沟通',
                  icon: '👭',
                  scenarios: {
                    rescheduling: {
                      situation: '约会改期',
                      tone: '随意',
                      template: '"不好意思，我今天身体有点不太舒服，可能没法保持最佳状态。我们能改到下次吗？我会补偿你的！"',
                      copyText: '复制文本'
                    },
                    partyParticipation: {
                      situation: '聚会参与',
                      tone: '随意',
                      template: '"我可能会来聚会，但可能需要早点离开。如果我看起来有点累，你们理解就好。"',
                      copyText: '复制文本'
                    }
                  }
                },
                colleagues: {
                  name: '与同事沟通',
                  icon: '👔',
                  scenarios: {
                    leaveRequest: {
                      situation: '请假申请',
                      tone: '正式',
                      template: '"您好，我今天身体不太舒服，可能需要请半天假去处理身体问题。我会尽快处理完其他事务的。"',
                      copyText: '复制文本'
                    },
                    workAdjustment: {
                      situation: '工作调整',
                      tone: '正式',
                      template: '"不好意思，我今天身体有些不适，可能工作效率会有所影响。如果有急事请优先安排，其他事务我会尽快完成。"',
                      copyText: '复制文本'
                    }
                  }
                }
              }
            },
            acupressure: {
              title: '办公室穴位按压',
              description: '简单易学的穴位按压技巧，可以在办公室隐蔽进行，快速缓解疼痛不适。',
              points: {
                hegu: {
                  name: '合谷穴',
                  location: '虎口处，拇指和食指之间',
                  benefits: '疏肝理气、活血化瘀，缓解全身疼痛',
                  technique: '用拇指指腹按压，力度适中，每次30秒',
                  officeUse: '可在开会时隐蔽进行，不引人注意'
                },
                sanyinjiao: {
                  name: '三阴交穴',
                  location: '小腿内侧，踝关节上三寸',
                  benefits: '调理气血，专门缓解妇科疼痛',
                  technique: '用拇指按压，配合深呼吸，每次1-2分钟',
                  officeUse: '可在桌下进行，脱掉鞋子按压效果更好'
                }
              },
              scientificBasis: {
                title: '科学依据',
                content: '穴位按压通过刺激特定神经点，促进内啡肽释放，这是人体天然的止痛物质。现代研究表明，适当的穴位刺激可以调节神经传导，缓解疼痛感知。'
              }
            },
            backToOverview: '返回场景解决方案总览'
          }
        }
      },
      en: {
        scenarios: {
          office: {
            title: 'Office Scenario Solutions',
            description: 'Facing sudden period pain in the office requires quick, convenient methods that don\'t affect work.',
            emergencyKit: {
              title: 'Meeting Emergency Kit',
              categories: {
                coreEquipment: {
                  name: 'Core Equipment',
                  items: [
                    'Adhesive heat patches (ThermaCare invisible patches)',
                    'Mini electric heating pad (USB rechargeable)',
                    'Ginger tea sachets (sugar-free formula)',
                    'Emergency energy gel (with magnesium + vitamin B6)'
                  ]
                },
                painRelief: {
                  name: 'Pain Relief',
                  items: [
                    'Ibuprofen/Acetaminophen',
                    'Peppermint balm (for temple massage)',
                    'Simple massage tools'
                  ]
                },
                imageManagement: {
                  name: 'Image Management',
                  items: [
                    'Mirror, lipstick, oil blotting paper',
                    'Dry shampoo, deodorant',
                    'Emergency makeup'
                  ]
                }
              },
              discreetGuide: {
                title: 'Discreet Usage Guide',
                tips: [
                  'Heat patch excuse: "Using heat pad for neck and shoulder pain"',
                  'Emergency exit phrase: "Need to handle urgent client email"'
                ]
              }
            },
            stretching: {
              title: 'Office Chair Stretching System',
              exercises: {
                pelvicClock: {
                  name: 'Chair Pelvic Clock Movement',
                  description: 'Relieves sacroiliac joint pressure, improves lower back circulation',
                  duration: '30 seconds each, repeat 3-5 times',
                  steps: [
                    'Sit on edge of chair, feet flat on floor',
                    'Imagine pelvis as clock, slowly draw circles',
                    'Do one set clockwise and counterclockwise'
                  ]
                },
                footMassage: {
                  name: 'Hidden Foot Massage',
                  description: 'Use under-desk fascia ball to promote lower limb blood return',
                  duration: 'Anytime, 2-3 minutes each',
                  steps: [
                    'Place small massage ball under desk',
                    'Remove shoes, roll ball with sole of foot',
                    'Focus on arch and heel areas'
                  ]
                },
                sideStretch: {
                  name: 'Side Waist Stretch by Water Cooler',
                  description: 'Natural standing position, relieves waist tension',
                  duration: 'Hold 15-30 seconds each side',
                  steps: [
                    'Stand by water cooler, feet shoulder-width apart',
                    'One hand on waist, other arm stretch up',
                    'Bend body to one side, feel side waist stretch'
                  ]
                }
              }
            },
            nutrition: {
              title: 'Workplace Nutrition Management',
              meals: {
                breakfast: {
                  time: 'Breakfast (7:00-8:00)',
                  foods: 'Oatmeal + nuts + banana',
                  benefits: 'Provides sustained energy, stabilizes blood sugar'
                },
                morningTea: {
                  time: 'Morning Tea (10:00)',
                  foods: 'Red date tea or rose tea',
                  benefits: 'Warms uterus, relieves cramps'
                },
                lunch: {
                  time: 'Lunch (12:00-13:00)',
                  foods: 'Lean meat + dark green vegetables + brown rice',
                  benefits: 'Iron and fiber supplement, prevents anemia'
                },
                afternoonTea: {
                  time: 'Afternoon Tea (15:00)',
                  foods: 'Dark chocolate + warm milk',
                  benefits: 'Relieves mood swings, supplements magnesium'
                }
              },
              avoidFoods: {
                title: 'Foods to Avoid',
                categories: {
                  coldDrinks: {
                    name: 'Cold drinks:',
                    items: 'Iced coffee, cold drinks, ice water'
                  },
                  highSalt: {
                    name: 'High-salt snacks:',
                    items: 'Chips, pickled foods'
                  },
                  excessiveCaffeine: {
                    name: 'Excessive caffeine:',
                    items: 'Strong coffee, energy drinks'
                  }
                }
              }
            },
            communication: {
              title: 'Communication Template Assistant',
              description: 'Effective communication with people around you during menstrual discomfort. These templates help you better express needs and seek understanding.',
              templates: {
                partner: {
                  name: 'Communicating with Partner',
                  icon: '💕',
                  scenarios: {
                    notification: {
                      situation: 'Notification',
                      tone: 'Intimate',
                      template: '"Honey, I\'m not feeling well today and might need more rest. If I seem uncomfortable, please don\'t worry."',
                      copyText: 'Copy Text'
                    },
                    seekingUnderstanding: {
                      situation: 'Seeking Understanding',
                      tone: 'Intimate',
                      template: '"I\'m experiencing some pain and my emotions might fluctuate. Can you understand and give me some time and space? I\'ll recover soon."',
                      copyText: 'Copy Text'
                    }
                  }
                },
                friends: {
                  name: 'Communicating with Friends',
                  icon: '👭',
                  scenarios: {
                    rescheduling: {
                      situation: 'Rescheduling Date',
                      tone: 'Casual',
                      template: '"Sorry, I\'m not feeling well today and might not be at my best. Can we reschedule? I\'ll make it up to you!"',
                      copyText: 'Copy Text'
                    },
                    partyParticipation: {
                      situation: 'Party Participation',
                      tone: 'Casual',
                      template: '"I might come to the party but may need to leave early. If I look tired, please understand."',
                      copyText: 'Copy Text'
                    }
                  }
                },
                colleagues: {
                  name: 'Communicating with Colleagues',
                  icon: '👔',
                  scenarios: {
                    leaveRequest: {
                      situation: 'Leave Request',
                      tone: 'Formal',
                      template: '"Hello, I\'m not feeling well today and may need to take half a day off to address health issues. I\'ll handle other matters as soon as possible."',
                      copyText: 'Copy Text'
                    },
                    workAdjustment: {
                      situation: 'Work Adjustment',
                      tone: 'Formal',
                      template: '"Sorry, I\'m feeling unwell today and my work efficiency might be affected. Please prioritize urgent matters, and I\'ll complete other tasks as soon as possible."',
                      copyText: 'Copy Text'
                    }
                  }
                }
              }
            },
            acupressure: {
              title: 'Office Acupressure Points',
              description: 'Simple acupressure techniques that can be done discreetly in the office to quickly relieve pain and discomfort.',
              points: {
                hegu: {
                  name: 'Hegu Point',
                  location: 'Tiger mouth area, between thumb and index finger',
                  benefits: 'Soothes liver qi, promotes blood circulation, relieves general pain',
                  technique: 'Press with thumb pad, moderate pressure, 30 seconds each time',
                  officeUse: 'Can be done discreetly during meetings without drawing attention'
                },
                sanyinjiao: {
                  name: 'Sanyinjiao Point',
                  location: 'Inner side of lower leg, three fingers above ankle',
                  benefits: 'Regulates qi and blood, specifically relieves gynecological pain',
                  technique: 'Press with thumb, coordinate with deep breathing, 1-2 minutes each time',
                  officeUse: 'Can be done under desk, better effect when shoes are removed'
                }
              },
              scientificBasis: {
                title: 'Scientific Basis',
                content: 'Acupressure works by stimulating specific nerve points, promoting endorphin release, which are the body\'s natural painkillers. Modern research shows that appropriate acupoint stimulation can regulate nerve conduction and relieve pain perception.'
              }
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

    zhTranslations.scenarios.office = officeTranslations.zh.scenarios.office;
    enTranslations.scenarios.office = officeTranslations.en.scenarios.office;

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

      console.log('✅ 办公页面翻译键创建成功！');
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
    console.log('🚀 开始创建办公页面翻译键...\n');
    
    try {
      const { zhTranslations, enTranslations } = this.createOfficeTranslations();
      this.saveTranslations(zhTranslations, enTranslations);
      
      console.log('\n📊 创建统计:');
      console.log(`  - 中文键数: ${Object.keys(zhTranslations.scenarios.office).length}`);
      console.log(`  - 英文键数: ${Object.keys(enTranslations.scenarios.office).length}`);
      console.log('\n✅ 办公页面翻译键创建完成！');
    } catch (error) {
      console.error('❌ 创建失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行创建器
if (require.main === module) {
  const creator = new OfficeTranslationsCreator();
  creator.run();
}

module.exports = OfficeTranslationsCreator;
