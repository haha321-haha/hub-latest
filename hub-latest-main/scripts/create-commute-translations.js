#!/usr/bin/env node

/**
 * 创建通勤场景页面翻译键
 * 为 scenario-solutions/commute 页面生成翻译键
 */

const fs = require('fs');
const path = require('path');

class CommuteTranslationsCreator {
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
   * 创建通勤页面翻译键
   */
  createCommuteTranslations() {
    const { zhTranslations, enTranslations } = this.loadTranslations();

    // 通勤页面翻译键
    const commuteTranslations = {
      zh: {
        scenarios: {
          commute: {
            title: '通勤场景解决方案',
            description: '在通勤路上遭遇经期不适？这里有最实用的应急策略和隐蔽缓解技巧，让你在拥挤的地铁、公交、网约车中也能从容应对。',
            emergencyKit: {
              title: '通勤应急工具包',
              items: {
                invisibleHeatSystem: {
                  name: '隐形热敷系统',
                  description: '可粘贴暖宝宝（ThermaCare隐形贴片）',
                  usage: '贴在腹部或腰部，持续发热6小时'
                },
                miniElectricHeatingPad: {
                  name: '迷你电热护腰',
                  description: 'USB充电款，会议中可穿戴',
                  usage: '隐蔽穿戴，温度可调节'
                },
                gingerTeaSachets: {
                  name: '姜茶冲剂条',
                  description: '无糖配方，30秒速溶',
                  usage: '用温水冲泡，缓解痉挛'
                },
                acupressureTools: {
                  name: '穴位按摩工具',
                  description: '内关穴按摩戒指（隐形设计）',
                  usage: '单手操作，隐蔽按压'
                }
              }
            },
            transportStrategies: {
              title: '交通方式适配策略',
              subwayBus: {
                type: '地铁/公交',
                strategies: [
                  '选择中间车厢（减少加减速惯性冲击）',
                  '优先座智能申请（经期电子凭证）',
                  '靠墙骨盆支撑法：微屈膝顶住车厢壁',
                  '佩戴降噪耳机播放432Hz镇痛音频'
                ]
              },
              selfDriving: {
                type: '自驾出行',
                strategies: [
                  '座椅加热+腰椎气垫（每30分钟自动充放气）',
                  '方向盘生命体征监测',
                  '车载迷你微波炉（加热暖宫贴）',
                  '避免疼痛时强行驾驶（反应速度下降30%）'
                ]
              },
              bikeSharing: {
                type: '共享单车',
                strategies: [
                  '硅胶坐垫套（减震+恒温）',
                  '束腹带稳定核心（防骑行晃动）',
                  '单次不超过20分钟，中途休息',
                  '调整座椅高度减少会阴压迫'
                ]
              },
              rideHailing: {
                type: '网约车/出租车',
                strategies: [
                  '座椅加热等级设定（通过APP提前发送指令）',
                  '空气净化模式（过滤PM2.5与挥发性物质）',
                  '选择"舒适型"车型（空间宽敞）',
                  '使用"医疗紧急模式"（部分APP支持）'
                ]
              }
            },
            timeManagement: {
              title: '通勤时段管理指南',
              beforeDeparture: {
                phase: '出发前20分钟',
                actions: [
                  '饮用300ml生姜肉桂饮',
                  '贴敷远红外暖宫贴（持续发热6小时）',
                  '服用止痛药（提前服用更有效）'
                ]
              },
              duringCommute: {
                phase: '通勤途中',
                actions: [
                  '单脚踩台阶形成骨盆倾斜（缓解腰痛）',
                  '手拉吊环时轻微拉伸侧腰肌群',
                  '4-7-8呼吸法：吸气4秒→屏息7秒→呼气8秒'
                ]
              },
              afterArrival: {
                phase: '到达后10分钟',
                actions: [
                  '进行3分钟骨盆复位操',
                  '靠墙深蹲（激活臀肌）',
                  '脊柱逐节伸展（改善循环）'
                ]
              }
            },
            emergencyPlans: {
              title: '极端情况应急预案',
              painEscalation: {
                situation: '突发疼痛升级',
                solutions: [
                  '地铁/公交：启动"假装低血糖"预案',
                  '含服葡萄糖片+请求让座',
                  '网约车：使用"医疗紧急模式"'
                ]
              },
              productShortage: {
                situation: '卫生用品短缺',
                solutions: [
                  '便利店速购：向店员出示"Code Red"手势',
                  '共享卫生巾机：地图导航至最近网点',
                  '参与商家提供免费应急包'
                ]
              },
              clothingContamination: {
                situation: '衣物污染处理',
                solutions: [
                  '喷洒含酶预处理剂（分解血渍蛋白）',
                  '用冷水轻拍（禁用热水！）',
                  '外套反系腰间（时尚伪装法）'
                ]
              }
            },
            acupressure: {
              title: '地铁/公交穴位按压技巧',
              description: '在拥挤的空间里，这些简单易学、随时随地可行的穴位按压技巧，能快速缓解通勤中的疼痛。',
              hegu: {
                name: '合谷穴',
                location: '虎口处，拇指和食指之间',
                benefits: '疏肝理气、活血化瘀，通用性强',
                technique: '拇指或食指指腹点按、揉按，力度适中',
                commuteUse: '在包包下、衣物遮挡下隐蔽进行，利用扶手或靠背协助',
                userQuote: '"挤地铁已经够累了，痛经一来真是雪上加霜，只想快点到家躺平。"',
                userQuoteSource: '—— 来自用户语录'
              },
              neiguan: {
                name: '内关穴',
                location: '手腕内侧，距离腕横纹约三指宽',
                benefits: '缓解恶心、心烦等伴随症状，调节情绪',
                technique: '用拇指按压，可采用断续或持续按压',
                commuteUse: '可在握扶手时同时进行，非常隐蔽',
                userQuote: '"开车时肚子痛，会影响注意力，感觉很危险。但又不能随便停下来。"',
                userQuoteSource: '—— 来自用户语录'
              },
              taichong: {
                name: '太冲穴',
                location: '足背，大脚趾和二脚趾之间向上约一指宽',
                benefits: '疏肝理气、行气止痛，专门针对情绪波动',
                technique: '脱掉鞋子，用拇指按压，配合深呼吸',
                commuteUse: '适合坐着时进行，可在座位上悄悄脱鞋按压',
                userQuote: '"在地铁里按了太冲穴，感觉情绪平静了很多，疼痛也减轻了。"',
                userQuoteSource: '—— 来自用户语录'
              }
            },
            breathingTechniques: {
              title: '驾车场景呼吸放松方法',
              description: '开车需要高度专注，经期疼痛可能让你分心。学会这些简单的呼吸技巧，帮助你在驾驶时缓解不适，保障安全。',
              boxBreathing: {
                name: '方框呼吸法',
                description: '4-4-4-4节奏，帮助调节自主神经系统',
                steps: [
                  '吸气4秒（肚子鼓起）',
                  '屏气4秒',
                  '呼气4秒（肚子收回）',
                  '屏气4秒，重复循环'
                ],
                benefits: '降低心率和压力，缓解肌肉紧张',
                safetyTip: '只在等红灯或安全停车时进行完整练习'
              },
              diaphragmaticBreathing: {
                name: '腹式呼吸',
                description: '专注于腹部起伏，促进血液循环',
                steps: [
                  '一手放胸部，一手放腹部',
                  '吸气时腹部手上升，胸部手保持不动',
                  '呼气时腹部手下降',
                  '保持缓慢深长的呼吸节奏'
                ],
                benefits: '增加氧气供应，缓解腹部痉挛',
                safetyTip: '可在驾驶中进行，但注意力仍需集中在路况'
              },
              scientificBasis: {
                title: '科学依据',
                content: '深呼吸练习通过调节自主神经系统，降低心率和压力反应，缓解肌肉紧张。研究表明，规律的呼吸练习可以促进内啡肽释放，这是人体天然的止痛物质。'
              }
            },
            safetyTips: {
              title: '安全提示',
              tips: [
                '药物携带：布洛芬需原包装携带，避免散装药品引发安检疑问',
                '隐私保护：使用分装盒存放卫生用品，避免外露',
                '数据记录：通勤疼痛发作时，用APP记录"疼痛开始时间+交通方式"',
                '严重疼痛时禁止驾驶：疼痛剧烈影响驾驶安全时，必须立即靠边停车休息或寻求帮助'
              ]
            },
            backToOverview: '返回场景解决方案总览'
          }
        }
      },
      en: {
        scenarios: {
          commute: {
            title: 'Commute Scenario Solutions',
            description: 'Encountering period discomfort during your commute? Here are the most practical emergency strategies and discreet relief techniques to help you handle it confidently on crowded subways, buses, and ride-hailing services.',
            emergencyKit: {
              title: 'Commute Emergency Kit',
              items: {
                invisibleHeatSystem: {
                  name: 'Invisible Heat System',
                  description: 'Adhesive heat patches (ThermaCare invisible patches)',
                  usage: 'Apply to abdomen or lower back, continuous heat for 6 hours'
                },
                miniElectricHeatingPad: {
                  name: 'Mini Electric Heating Pad',
                  description: 'USB rechargeable, wearable during meetings',
                  usage: 'Discreet wear, adjustable temperature'
                },
                gingerTeaSachets: {
                  name: 'Ginger Tea Sachets',
                  description: 'Sugar-free formula, dissolves in 30 seconds',
                  usage: 'Mix with warm water, relieves cramps'
                },
                acupressureTools: {
                  name: 'Acupressure Tools',
                  description: 'Neiguan point massage ring (invisible design)',
                  usage: 'One-handed operation, discreet pressure'
                }
              }
            },
            transportStrategies: {
              title: 'Transport Mode Adaptation Strategies',
              subwayBus: {
                type: 'Subway/Bus',
                strategies: [
                  'Choose middle cars (reduce acceleration/deceleration impact)',
                  'Priority seat smart application (period electronic certificate)',
                  'Wall pelvic support method: slightly bend knees against carriage wall',
                  'Wear noise-canceling headphones with 432Hz pain relief audio'
                ]
              },
              selfDriving: {
                type: 'Self-Driving',
                strategies: [
                  'Seat heating + lumbar air cushion (auto inflate/deflate every 30 min)',
                  'Steering wheel vital signs monitoring',
                  'Car mini microwave (heat warming patches)',
                  'Avoid forced driving during pain (reaction speed decreases 30%)'
                ]
              },
              bikeSharing: {
                type: 'Bike Sharing',
                strategies: [
                  'Silicone seat cover (shock absorption + constant temperature)',
                  'Abdominal belt for core stability (prevent riding sway)',
                  'No more than 20 minutes per session, rest in between',
                  'Adjust seat height to reduce perineal pressure'
                ]
              },
              rideHailing: {
                type: 'Ride-hailing/Taxi',
                strategies: [
                  'Seat heating level setting (send instructions via app in advance)',
                  'Air purification mode (filter PM2.5 and volatile substances)',
                  'Choose "comfort" vehicle type (spacious)',
                  'Use "medical emergency mode" (supported by some apps)'
                ]
              }
            },
            timeManagement: {
              title: 'Commute Time Management Guide',
              beforeDeparture: {
                phase: '20 Minutes Before Departure',
                actions: [
                  'Drink 300ml ginger cinnamon beverage',
                  'Apply far-infrared warming patches (6-hour continuous heat)',
                  'Take pain medication (more effective when taken in advance)'
                ]
              },
              duringCommute: {
                phase: 'During Commute',
                actions: [
                  'Step on platform with one foot to create pelvic tilt (relieves back pain)',
                  'Gently stretch side waist muscles when holding handrails',
                  '4-7-8 breathing: inhale 4 sec → hold 7 sec → exhale 8 sec'
                ]
              },
              afterArrival: {
                phase: '10 Minutes After Arrival',
                actions: [
                  'Perform 3-minute pelvic reset exercises',
                  'Wall squats (activate glutes)',
                  'Spinal segmental stretching (improve circulation)'
                ]
              }
            },
            emergencyPlans: {
              title: 'Emergency Response Plans',
              painEscalation: {
                situation: 'Sudden Pain Escalation',
                solutions: [
                  'Subway/Bus: Activate "fake hypoglycemia" plan',
                  'Take glucose tablets + request seat',
                  'Ride-hailing: Use "medical emergency mode"'
                ]
              },
              productShortage: {
                situation: 'Sanitary Product Shortage',
                solutions: [
                  'Convenience store quick purchase: Show "Code Red" gesture to clerk',
                  'Shared sanitary pad machine: Navigate to nearest location',
                  'Participating merchants provide free emergency kits'
                ]
              },
              clothingContamination: {
                situation: 'Clothing Contamination',
                solutions: [
                  'Spray enzyme pre-treatment agent (breaks down blood protein)',
                  'Gently pat with cold water (no hot water!)',
                  'Tie jacket around waist backwards (fashionable camouflage)'
                ]
              }
            },
            acupressure: {
              title: 'Subway/Bus Acupressure Techniques',
              description: 'In crowded spaces, these simple and easy-to-learn acupressure techniques can quickly relieve pain during commuting.',
              hegu: {
                name: 'Hegu Point',
                location: 'Tiger mouth area, between thumb and index finger',
                benefits: 'Soothes liver qi, promotes blood circulation, highly versatile',
                technique: 'Press and rub with thumb or index finger pad, moderate pressure',
                commuteUse: 'Perform discreetly under bag or clothing, use handrails or backrests for assistance',
                userQuote: '"The subway is already exhausting, and when period pain hits, it\'s just adding insult to injury. I just want to get home and lie down."',
                userQuoteSource: '—— From user testimonials'
              },
              neiguan: {
                name: 'Neiguan Point',
                location: 'Inner side of wrist, about three fingers width from wrist crease',
                benefits: 'Relieves nausea, irritability and other accompanying symptoms, regulates emotions',
                technique: 'Press with thumb, can use intermittent or continuous pressure',
                commuteUse: 'Can be done while holding handrails, very discreet',
                userQuote: '"Stomach pain while driving affects concentration and feels dangerous. But I can\'t just stop anywhere."',
                userQuoteSource: '—— From user testimonials'
              },
              taichong: {
                name: 'Taichong Point',
                location: 'Top of foot, about one finger width up between big toe and second toe',
                benefits: 'Soothes liver qi, promotes qi circulation and pain relief, specifically for mood swings',
                technique: 'Remove shoes, press with thumb, coordinate with deep breathing',
                commuteUse: 'Suitable when sitting, can quietly remove shoes and press while seated',
                userQuote: '"Pressing Taichong point on the subway made me feel much calmer emotionally, and the pain was also reduced."',
                userQuoteSource: '—— From user testimonials'
              }
            },
            breathingTechniques: {
              title: 'Driving Breathing Relaxation Methods',
              description: 'Driving requires high concentration, and period pain can be distracting. Learn these simple breathing techniques to help relieve discomfort while driving and ensure safety.',
              boxBreathing: {
                name: 'Box Breathing',
                description: '4-4-4-4 rhythm, helps regulate autonomic nervous system',
                steps: [
                  'Inhale 4 seconds (belly rises)',
                  'Hold breath 4 seconds',
                  'Exhale 4 seconds (belly falls)',
                  'Hold breath 4 seconds, repeat cycle'
                ],
                benefits: 'Reduces heart rate and stress, relieves muscle tension',
                safetyTip: 'Only practice fully when stopped at red lights or safely parked'
              },
              diaphragmaticBreathing: {
                name: 'Diaphragmatic Breathing',
                description: 'Focus on abdominal movement, promotes blood circulation',
                steps: [
                  'One hand on chest, one hand on abdomen',
                  'When inhaling, abdominal hand rises, chest hand stays still',
                  'When exhaling, abdominal hand falls',
                  'Maintain slow, deep breathing rhythm'
                ],
                benefits: 'Increases oxygen supply, relieves abdominal cramps',
                safetyTip: 'Can be done while driving, but attention must remain on road conditions'
              },
              scientificBasis: {
                title: 'Scientific Basis',
                content: 'Deep breathing exercises regulate the autonomic nervous system, reducing heart rate and stress response, relieving muscle tension. Research shows that regular breathing exercises can promote endorphin release, the body\'s natural painkillers.'
              }
            },
            safetyTips: {
              title: 'Safety Tips',
              tips: [
                'Medication carrying: Ibuprofen should be carried in original packaging to avoid security questions',
                'Privacy protection: Use compartment boxes to store sanitary products, avoid exposure',
                'Data recording: When commute pain occurs, use app to record "pain start time + transport mode"',
                'No driving during severe pain: When severe pain affects driving safety, must immediately pull over to rest or seek help'
              ]
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

    zhTranslations.scenarios.commute = commuteTranslations.zh.scenarios.commute;
    enTranslations.scenarios.commute = commuteTranslations.en.scenarios.commute;

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

      console.log('✅ 通勤页面翻译键创建成功！');
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
    console.log('🚀 开始创建通勤页面翻译键...\n');
    
    try {
      const { zhTranslations, enTranslations } = this.createCommuteTranslations();
      this.saveTranslations(zhTranslations, enTranslations);
      
      console.log('\n📊 创建统计:');
      console.log(`  - 中文键数: ${Object.keys(zhTranslations.scenarios.commute).length}`);
      console.log(`  - 英文键数: ${Object.keys(enTranslations.scenarios.commute).length}`);
      console.log('\n✅ 通勤页面翻译键创建完成！');
    } catch (error) {
      console.error('❌ 创建失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行创建器
if (require.main === module) {
  const creator = new CommuteTranslationsCreator();
  creator.run();
}

module.exports = CommuteTranslationsCreator;
