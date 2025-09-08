import type { Metadata } from 'next';
import SEODashboardSimplifiedClient from './seo-dashboard-simplified-client';

export const metadata: Metadata = {
  title: 'SEO Dashboard Simplified - PeriodHub Admin',
  description: 'Simplified SEO analytics dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SEODashboardSimplifiedPage() {
  return <SEODashboardSimplifiedClient />;
}