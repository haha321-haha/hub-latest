'use client';

import { Download } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface DownloadButtonProps {
  filename: string;
  className?: string;
}

export default function DownloadButton({ filename, className = '' }: DownloadButtonProps) {
  const locale = useLocale();
  const t = useTranslations('downloadButton');

  const handleDownload = () => {
    // Determine the correct filename based on locale
    let actualFilename = filename;

    // If it's English locale and the file doesn't already have -en suffix, add it
    if (locale === 'en' && !filename.includes('-en')) {
      // Handle both .html and .pdf files
      if (filename.includes('.html')) {
        actualFilename = filename.replace('.html', '-en.html');
      } else if (filename.includes('.pdf')) {
        actualFilename = filename.replace('.pdf', '-en.pdf');
      }
    }

    // Open the document in a new tab
    window.open(`/pdf-files/${actualFilename}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center justify-center px-4 py-2 min-w-[120px] bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors duration-200 text-sm whitespace-nowrap ${className}`}
    >
      <Download className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="truncate">{t('viewDocument')}</span>
    </button>
  );
}
