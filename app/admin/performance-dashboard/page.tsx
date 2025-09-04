import { Suspense } from 'react';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Dashboard - PeriodHub Admin',
  description: 'Website performance analytics dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerformanceDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="mt-2 text-gray-600">
            监控网站性能指标和Core Web Vitals
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <PerformanceDashboard />
        </Suspense>
      </div>
    </div>
  );
}
