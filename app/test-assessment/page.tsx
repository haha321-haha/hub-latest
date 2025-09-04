import TestAssessment from '../[locale]/interactive-tools/test-assessment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Assessment - PeriodHub',
  description: 'Test page for assessment functionality',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestAssessmentPage() {
  return <TestAssessment />;
}
