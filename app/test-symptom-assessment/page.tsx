import type { Metadata } from 'next';
import TestSymptomAssessmentClient from './test-symptom-assessment-client';

export const metadata: Metadata = {
  title: 'Test Symptom Assessment - PeriodHub',
  description: 'Test page for symptom assessment functionality',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestSymptomAssessmentPage() {
  return <TestSymptomAssessmentClient />;
}