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
          '/staging*'
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
          '/staging*'
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
          '/staging*'
        ],
      }
    ],
    sitemap: 'https://www.periodhub.health/sitemap.xml',
    host: 'https://www.periodhub.health'
  };
}