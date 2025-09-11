import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/search?*',
          // 禁止索引 PDF 文件，解决重复页面问题
          '/pdf-files/',
          // 禁止索引测试和开发页面
          '/test*',
          '/dev*',
          '/staging*',
          // 禁止索引备份文件
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/pdf-files/',
          '/test*',
          '/dev*',
          '/staging*',
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/pdf-files/',
          '/test*',
          '/dev*',
          '/staging*',
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      }
    ],
    sitemap: 'https://www.periodhub.health/sitemap.xml',
    host: 'https://www.periodhub.health'
  };
}