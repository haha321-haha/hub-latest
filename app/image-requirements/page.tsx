'use client';

import React from 'react';
import ImagePlaceholder from '@/components/ImagePlaceholder';

export default function ImageRequirementsPage() {
  const imageRequirements = [
    // Hero Section Images
    {
      category: "Hero Section",
      images: [
        {
          filename: "hero-main-banner.jpg",
          alt: "Professional healthcare illustration showing diverse women in comfortable poses",
          width: 800,
          height: 450,
          path: "/public/images/hero/",
          description: "Warm and professional healthcare illustration, young diverse women in comfortable poses, soft pink and blue gradient background, modern minimalist style, conveying comfort and medical trust"
        }
      ]
    },
    
    // Feature Icons
    {
      category: "Feature Icons",
      images: [
        {
          filename: "feature-assessment.svg",
          alt: "Symptom assessment icon",
          width: 64,
          height: 64,
          path: "/public/images/icons/features/",
          description: "Medical assessment icon, clean line art style, pink and blue color scheme, professional healthcare symbol"
        },
        {
          filename: "feature-tracker.svg",
          alt: "Pain tracking icon",
          width: 64,
          height: 64,
          path: "/public/images/icons/features/",
          description: "Pain tracking icon, modern flat design, warm colors, user-friendly medical symbol"
        },
        {
          filename: "feature-visualization.svg",
          alt: "Data visualization icon",
          width: 64,
          height: 64,
          path: "/public/images/icons/features/",
          description: "Data visualization icon, clean modern design, pink and blue gradients, professional healthcare analytics"
        }
      ]
    },
    
    // Interactive Tools
    {
      category: "Interactive Tools",
      images: [
        {
          filename: "assessment-illustration.jpg",
          alt: "Woman using digital health assessment tool on tablet",
          width: 600,
          height: 400,
          path: "/public/images/tools/",
          description: "Woman using digital health assessment tool, modern tablet interface, comfortable home setting, soft lighting, professional medical app design"
        },
        {
          filename: "pain-tracker-dashboard.jpg",
          alt: "Digital health tracking dashboard interface",
          width: 800,
          height: 500,
          path: "/public/images/tools/",
          description: "Digital health tracking dashboard, clean UI design, data charts and calendars, pink and blue color scheme, modern healthcare technology"
        }
      ]
    },
    
    // Article Category Covers
    {
      category: "Article Category Covers",
      images: [
        {
          filename: "category-medical-guide-cover.jpg",
          alt: "Medical textbook and stethoscope on clean desk",
          width: 800,
          height: 450,
          path: "/public/images/articles/categories/",
          description: "Medical textbook and stethoscope on clean desk, professional healthcare setting, soft natural lighting, pink and blue accents"
        },
        {
          filename: "category-natural-therapy-cover.jpg",
          alt: "Natural healing elements in spa-like setting",
          width: 800,
          height: 450,
          path: "/public/images/articles/categories/",
          description: "Natural healing elements, herbal tea, essential oils, yoga mat, serene spa-like setting, warm natural lighting"
        },
        {
          filename: "category-lifestyle-cover.jpg",
          alt: "Healthy lifestyle elements in modern kitchen",
          width: 800,
          height: 450,
          path: "/public/images/articles/categories/",
          description: "Healthy lifestyle elements, fresh fruits, exercise equipment, journal, bright modern kitchen setting"
        }
      ]
    },
    
    // Scenario Solutions
    {
      category: "Scenario Solutions",
      images: [
        {
          filename: "scenario-office.jpg",
          alt: "Professional woman managing menstrual discomfort at office",
          width: 600,
          height: 400,
          path: "/public/images/scenarios/",
          description: "Professional woman managing menstrual discomfort at office, discrete pain relief methods, modern workplace setting"
        },
        {
          filename: "scenario-exercise.jpg",
          alt: "Woman adapting exercise routine during menstruation",
          width: 600,
          height: 400,
          path: "/public/images/scenarios/",
          description: "Woman adapting exercise routine during menstruation, gym setting, showing modified workout techniques"
        },
        {
          filename: "scenario-social.jpg",
          alt: "Woman confidently participating in social activities",
          width: 600,
          height: 400,
          path: "/public/images/scenarios/",
          description: "Woman confidently participating in social activities, restaurant or cafe setting, showing comfort and confidence"
        }
      ]
    },
    
    // Treatment Methods
    {
      category: "Treatment Methods",
      images: [
        {
          filename: "treatment-heat-therapy.jpg",
          alt: "Woman applying heating pad to lower abdomen",
          width: 600,
          height: 400,
          path: "/public/images/treatments/",
          description: "Woman applying heating pad to lower abdomen, comfortable home setting, soft warm lighting, relaxed expression"
        },
        {
          filename: "treatment-yoga-poses.jpg",
          alt: "Woman in yoga pose for menstrual pain relief",
          width: 600,
          height: 400,
          path: "/public/images/treatments/",
          description: "Woman in yoga pose for menstrual pain relief, peaceful studio setting, natural lighting, demonstrating proper form"
        }
      ]
    },
    
    // TCM Therapies
    {
      category: "Traditional Chinese Medicine",
      images: [
        {
          filename: "tcm-acupuncture.jpg",
          alt: "Professional acupuncture treatment session",
          width: 600,
          height: 400,
          path: "/public/images/tcm/",
          description: "Professional acupuncture treatment, clean clinical setting, traditional Chinese medicine elements, professional and trustworthy"
        },
        {
          filename: "tcm-herbal-medicine.jpg",
          alt: "Traditional Chinese herbs and medicine preparation",
          width: 600,
          height: 400,
          path: "/public/images/tcm/",
          description: "Traditional Chinese herbs and medicine preparation, wooden bowls, natural ingredients, warm traditional setting"
        }
      ]
    },
    
    // Data Visualization
    {
      category: "Data & Charts",
      images: [
        {
          filename: "stats-infographic.svg",
          alt: "Medical statistics infographic with clean data visualization",
          width: 800,
          height: 400,
          path: "/public/images/infographics/",
          description: "Medical statistics infographic, clean data visualization, pink and blue color scheme, professional charts and graphs showing women's health data"
        },
        {
          filename: "chart-pain-statistics.svg",
          alt: "Menstrual pain prevalence statistics chart",
          width: 600,
          height: 400,
          path: "/public/images/charts/",
          description: "Medical statistics chart, menstrual pain prevalence data, clean infographic style, pink and blue color scheme"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 PeriodHub Health 图片需求清单
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            以下是网站所需的所有图片资源，包含详细的规格要求、提示词和存放路径。
            每个占位符展示了图片的具体要求和设计指导。
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>总计需求:</strong> 约80-100张图片 |
              <strong>预估制作时间:</strong> 2-4周 |
              <strong>优先级:</strong> 高优先级图片已标注
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {imageRequirements.map((category, categoryIndex) => (
            <section key={categoryIndex} className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                📁 {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="bg-gray-50 rounded-lg p-4">
                    <ImagePlaceholder
                      filename={image.filename}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="w-full mb-4"
                      description={image.description}
                    />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">路径:</span>
                        <span className="text-gray-600 font-mono text-xs">{image.path}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">尺寸:</span>
                        <span className="text-gray-600">{image.width}x{image.height}px</span>
                      </div>
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">提示词:</span>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📋 下一步行动
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-pink-600 mb-2">高优先级 (立即需要)</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Hero主视觉图片</li>
                  <li>• 核心功能图标</li>
                  <li>• 文章分类封面</li>
                  <li>• 基础治疗方法图解</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">中优先级 (1-2周内)</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 情景解决方案图片</li>
                  <li>• 中医疗法图解</li>
                  <li>• 解剖结构图</li>
                  <li>• 生活方式图片</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">低优先级 (1个月内)</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 装饰性图片</li>
                  <li>• 背景纹理</li>
                  <li>• 移动端优化图片</li>
                  <li>• 高级数据可视化</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
