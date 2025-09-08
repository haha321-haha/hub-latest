import type { Metadata } from 'next';
import FrameworkDemoClient from './framework-demo-client';

export const metadata: Metadata = {
  title: 'Framework Demo - PeriodHub',
  description: 'Demonstration of PeriodHub advanced framework features and capabilities',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FrameworkDemoPage() {
  return <FrameworkDemoClient />;
}