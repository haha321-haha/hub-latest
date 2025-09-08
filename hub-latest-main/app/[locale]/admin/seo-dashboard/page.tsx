import type { Metadata } from 'next';
import SEODashboardClient from './seo-dashboard-client';

export const metadata: Metadata = {
  title: 'SEO Dashboard - PeriodHub Admin',
  description: 'SEO analytics and keyword management dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SEODashboardPage() {
  return <SEODashboardClient />;
}