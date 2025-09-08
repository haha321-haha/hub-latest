import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PeriodHub - 专业女性健康管理平台',
    short_name: 'PeriodHub',
    description: '专业的女性月经健康管理平台，提供中西医结合的痛经解决方案，科学指导，贴心陪伴。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#9333ea',
    orientation: 'portrait',
    categories: ['health', 'medical', 'lifestyle'],
    lang: 'zh-CN',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}