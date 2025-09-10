import { getTranslations } from 'next-intl/server';
import DataDashboardClient from './data-dashboard-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dataDashboard' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '数据仪表板 - PeriodHub | 平台数据分析中心'
        : 'Data Dashboard - PeriodHub | Platform Analytics Center'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? 'PeriodHub数据仪表板：查看平台使用数据、用户活跃度、参与度等关键指标。为开发团队提供数据洞察和决策支持。'
        : 'PeriodHub Data Dashboard: View platform usage data, user activity, engagement metrics and other key indicators. Provides data insights and decision support for the development team.'
    }),
    keywords: locale === 'zh' ? [
      '数据仪表板', '平台分析', '用户数据', '活跃度统计', '数据分析', '管理后台'
    ] : [
      'data dashboard', 'platform analytics', 'user data', 'activity statistics', 'data analysis', 'admin panel'
    ],
    
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function DataDashboardPage() {
  return <DataDashboardClient />;
}