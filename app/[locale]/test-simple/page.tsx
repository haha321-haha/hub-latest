import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Simple - PeriodHub',
  description: 'Simple test page',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestSimplePage() {
  return (
    <div>
      <h1>Test Simple Page Works!</h1>
    </div>
  );
}
