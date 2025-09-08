'use client';

import React from 'react';
import { Clock, CheckCircle, Download, ArrowLeft, Share2, Eye } from 'lucide-react';
import { PreviewContent, PreviewSection } from '@/config/previewContent';
import { Locale } from '@/i18n';

interface PDFPreviewContentProps {
  content: PreviewContent;
  locale: Locale;
  onDownload: () => void;
  onBack: () => void;
}

export default function PDFPreviewContent({ 
  content, 
  locale, 
  onDownload, 
  onBack 
}: PDFPreviewContentProps) {
  const isZh = locale === 'zh';
  
  const title = isZh ? content.title.zh : content.title.en;
  const keyPoints = isZh ? content.keyPoints.zh : content.keyPoints.en;
  const useCase = isZh ? content.useCase.zh : content.useCase.en;
  const estimatedTime = isZh ? content.estimatedTime.zh : content.estimatedTime.en;
  const previewSections = isZh ? content.previewSections.zh : content.previewSections.en;
  const fullVersionIncludes = isZh ? content.fullVersionIncludes.zh : content.fullVersionIncludes.en;

  const handleShare = async () => {
    const shareData = {
      title: `Period Hub - ${title}`,
      text: isZh ? `推荐这个有用的经期健康资源：${title}` : `Recommended period health resource: ${title}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(isZh ? '链接已复制到剪贴板！' : 'Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const renderSection = (section: PreviewSection, index: number) => (
    <div 
      key={index} 
      className={`mb-6 p-4 rounded-xl border-2 ${
        section.isHighlight 
          ? 'border-purple-200 bg-purple-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <h3 className={`text-lg font-semibold mb-3 ${
        section.isHighlight ? 'text-purple-800' : 'text-gray-800'
      }`}>
        {section.isHighlight && <span className="mr-2">⭐</span>}
        {section.title}
      </h3>
      <ul className="space-y-2">
        {section.content.map((item, itemIndex) => (
          <li key={itemIndex} className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                {isZh ? '返回列表' : 'Back to List'}
              </span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                {isZh ? '分享' : 'Share'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Title Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {estimatedTime}
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              🎯 {isZh ? '这个资源能帮你：' : 'This resource helps you:'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Case */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              💡 {isZh ? '适用场景' : 'Use Case'}
            </h3>
            <p className="text-blue-700 text-sm">{useCase}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              {isZh ? '下载完整版 PDF' : 'Download Full PDF'}
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📖 {isZh ? '内容预览' : 'Content Preview'}
          </h2>
          
          {previewSections.map((section, index) => renderSection(section, index))}
          
          {/* Preview Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-800 text-sm">
              ⚡ {isZh ? '这只是预览内容，完整版包含更多详细信息和实用工具。' : 'This is preview content only. The full version contains more detailed information and practical tools.'}
            </p>
          </div>
        </div>

        {/* Full Version Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎁 {isZh ? '完整版还包含：' : 'Full Version Also Includes:'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fullVersionIncludes.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={onDownload}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            {isZh ? '立即下载完整版' : 'Download Full Version Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
