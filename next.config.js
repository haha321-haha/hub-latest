const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Core Web Vitals 优化配置
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'periodhub.health',
        port: '',
        pathname: '/**',
      },
    ]
  },

  // 🚀 性能优化
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // 🚀 实验性功能 - 整合你的建议
  experimental: {
    // 📦 包导入优化：包含国际化相关包
    optimizePackageImports: ['next-intl', 'lucide-react'],
    // 🎯 其他性能优化
    optimizeCss: true, // CSS优化
    scrollRestoration: true, // 滚动位置恢复
  },

  // 构建优化
  transpilePackages: ['lucide-react', 'next-intl'],
  
  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 构建配置
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
  
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://periodhub.health',
  },

  // SEO优化
  trailingSlash: false,

  // 🚀 SEO优化 - 301重定向配置
  async redirects() {
    return [
      // 🚨 修复IndexNow索引问题 - 添加语言前缀重定向（临时禁用，避免重定向循环）
      // 注意：这些重定向与next-intl中间件冲突，导致重定向循环
      // 解决方案：让next-intl中间件处理语言前缀，不在此处添加重定向
      
      // 处理重复的下载页面 - 支持多语言
      {
        source: '/downloads-new',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/download-center',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/articles-pdf-center',
        destination: '/downloads',
        permanent: true,
      },
      // 多语言版本重定向
      {
        source: '/zh/downloads-new',
        destination: '/zh/downloads',
        permanent: true,
      },
      {
        source: '/zh/download-center',
        destination: '/zh/downloads',
        permanent: true,
      },
      {
        source: '/zh/articles-pdf-center',
        destination: '/zh/downloads',
        permanent: true,
      },
      {
        source: '/en/downloads-new',
        destination: '/en/downloads',
        permanent: true,
      },
      {
        source: '/en/download-center',
        destination: '/en/downloads',
        permanent: true,
      },
      {
        source: '/en/articles-pdf-center',
        destination: '/en/downloads',
        permanent: true,
      },
      // 处理重复的疼痛追踪页面
      {
        source: '/pain-tracker',
        destination: '/interactive-tools/pain-tracker',
        permanent: true,
      },
      // 处理重复内容
      {
        source: '/downloads/download-1',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/downloads/download-2',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/downloads/download-3',
        destination: '/downloads',
        permanent: true,
      },
      // 阻止测试页面索引
      {
        source: '/test',
        destination: '/',
        permanent: true,
      },
      {
        source: '/test/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dev',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dev/:path*',
        destination: '/',
        permanent: true,
      },
      // URL规范化
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  generateEtags: true,

  // 🚀 头部优化 - 增强缓存策略
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 安全头部
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // 性能头部
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // 🎯 缓存控制优化
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate', // 页面内容始终验证
          },
        ],
      },
      // IndexNow密钥文件支持
      {
        source: '/a3f202e9872f45238294db525b233bf5.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      // 静态资源长期缓存
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 🚫 重定向配置已移除 - 完全交给next-intl处理
  // 这确保了单一职责和无冲突的重定向逻辑
};

module.exports = withNextIntl(nextConfig);
