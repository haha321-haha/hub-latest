// 全局动态渲染配置（迁移自 app/ 目录，避免被 Next 作为路由段配置解析）

export const dynamic = 'force-dynamic';
export const revalidate = false as const;
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';

export const dynamicConfig = {
	dynamic: 'force-dynamic' as const,
	revalidate: false as const,
	fetchCache: 'force-no-store' as const,
	preferredRegion: 'auto' as const,
};



