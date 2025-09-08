// 全局动态渲染配置
// 确保所有页面都使用动态渲染，解决next-intl静态预渲染冲突

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
// 移除可能导致Vercel部署错误的runtime配置
// export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 导出配置对象供其他文件使用
export const dynamicConfig = {
  dynamic: 'force-dynamic' as const,
  revalidate: 0,
  fetchCache: 'force-no-store' as const,
  // 移除runtime配置以避免Vercel部署错误
  // runtime: 'nodejs' as const,
  preferredRegion: 'auto' as const,
};
