import type { Metadata } from 'next';
import ImageRequirementsClient from './image-requirements-client';

export const metadata: Metadata = {
  title: 'Image Requirements - PeriodHub',
  description: 'Image requirements and specifications for PeriodHub website',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ImageRequirementsPage() {
  return <ImageRequirementsClient />;
}