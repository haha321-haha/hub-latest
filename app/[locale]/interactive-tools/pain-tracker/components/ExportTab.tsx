'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, FileText, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PainRecord } from '../../../../../types/pain-tracker';
import { ExportManager } from '../../../../../lib/pain-tracker/export/ExportManager';
import { AnalyticsEngine } from '../../../../../lib/pain-tracker/analytics/AnalyticsEngine';

type Locale = 'en' | 'zh';

interface LocalExportOptions {
  includeCharts: boolean;
  includeRecommendations: boolean;
  includeAnalytics: boolean;
  includeRawData: boolean;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ExportTabProps {
  locale: Locale;
  records: PainRecord[];
  onExport?: (options: {
    dateRange: DateRange;
    format: 'html' | 'pdf';
    exportOptions: LocalExportOptions;
  }) => Promise<void>;
}

export default function ExportTab({ locale, records, onExport }: ExportTabProps) {
  const t = useTranslations('painTracker.export');
  const exportManager = useRef(new ExportManager());
  const analyticsEngine = useRef(new AnalyticsEngine());
  
  // State management
  const [activeStep, setActiveStep] = useState<'range' | 'format' | 'options' | 'preview' | 'export'>('range');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf'>('pdf');
  const [exportOptions, setExportOptions] = useState<LocalExportOptions>({
    includeCharts: true,
    includeRecommendations: true,
    includeAnalytics: true,
    includeRawData: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'preparing' | 'generating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [filteredRecords, setFilteredRecords] = useState<PainRecord[]>([]);
  const [recordsInRange, setRecordsInRange] = useState(0);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Update filtered records when date range changes
  useEffect(() => {
    const filtered = records.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return recordDate >= startDate && recordDate <= endDate;
    });
    setFilteredRecords(filtered);
    setRecordsInRange(filtered.length);
  }, [records, dateRange]);

  // Quick date range presets
  const datePresets = [
    { label: t('dateRange.presets.last7Days'), days: 7 },
    { label: t('dateRange.presets.last30Days'), days: 30 },
    { label: t('dateRange.presets.last90Days'), days: 90 },
    { label: t('dateRange.presets.last6Months'), days: 180 },
    { label: t('dateRange.presets.lastYear'), days: 365 }
  ];

  const handleDatePreset = (days: number) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  const handleNextStep = () => {
    switch (activeStep) {
      case 'range':
        setActiveStep('format');
        break;
      case 'format':
        setActiveStep('options');
        break;
      case 'options':
        setActiveStep('preview');
        generatePreview();
        break;
      case 'preview':
        setActiveStep('export');
        handleExport();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (activeStep) {
      case 'format':
        setActiveStep('range');
        break;
      case 'options':
        setActiveStep('format');
        break;
      case 'preview':
        setActiveStep('options');
        break;
      case 'export':
        setActiveStep('preview');
        break;
    }
  };

  const generatePreview = async () => {
    setExportStatus('preparing');
    setExportProgress(20);
    
    try {
      if (filteredRecords.length === 0) {
        setPreviewContent(`
          <div class="medical-report-preview p-6 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-gray-400 mb-4">
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                ${locale === 'zh' ? '没有数据' : 'No Data Available'}
              </h3>
              <p class="text-gray-600">
                ${locale === 'zh' 
                  ? '所选日期范围内没有疼痛记录。请调整日期范围或添加更多记录。'
                  : 'No pain records found in the selected date range. Please adjust the date range or add more records.'
                }
              </p>
            </div>
          </div>
        `);
        setExportStatus('idle');
        setExportProgress(0);
        return;
      }

      setExportProgress(50);
      
      // Generate analytics for preview
      const analytics = analyticsEngine.current.calculateAnalytics(filteredRecords);
      
      setExportProgress(80);
      
      // Generate preview content
      const previewHtml = `
        <div class="medical-report-preview p-6 bg-white rounded-lg border">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              ${locale === 'zh' ? '疼痛追踪医疗报告' : 'Pain Tracking Medical Report'}
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">
                  ${locale === 'zh' ? '报告日期：' : 'Report Date: '}
                </span>
                <span class="text-gray-600">${new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">
                  ${locale === 'zh' ? '数据范围：' : 'Data Range: '}
                </span>
                <span class="text-gray-600">${dateRange.startDate} - ${dateRange.endDate}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">
                  ${locale === 'zh' ? '记录数量：' : 'Total Records: '}
                </span>
                <span class="text-gray-600">${filteredRecords.length}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">
                  ${locale === 'zh' ? '导出格式：' : 'Export Format: '}
                </span>
                <span class="text-gray-600">${exportFormat.toUpperCase()}</span>
              </div>
            </div>
          </div>

          ${exportOptions.includeAnalytics ? `
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                ${locale === 'zh' ? '数据摘要' : 'Data Summary'}
              </h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-blue-50 p-3 rounded">
                  <div class="font-medium text-blue-900">
                    ${locale === 'zh' ? '平均疼痛等级' : 'Average Pain Level'}
                  </div>
                  <div class="text-2xl font-bold text-blue-600">
                    ${analytics.averagePainLevel.toFixed(1)}/10
                  </div>
                </div>
                <div class="bg-purple-50 p-3 rounded">
                  <div class="font-medium text-purple-900">
                    ${locale === 'zh' ? '最常见疼痛类型' : 'Most Common Pain Type'}
                  </div>
                  <div class="text-sm font-medium text-purple-600">
                    ${analytics.commonPainTypes.length > 0 ? 
                      analytics.commonPainTypes[0].type.replace('_', ' ') : 
                      (locale === 'zh' ? '无数据' : 'No data')
                    }
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          ${exportOptions.includeCharts ? `
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                ${locale === 'zh' ? '图表和可视化' : 'Charts and Visualizations'}
              </h3>
              <div class="bg-gray-100 p-4 rounded text-center text-gray-600">
                <div class="text-4xl mb-2">📊</div>
                <p>${locale === 'zh' ? '图表将在最终报告中显示' : 'Charts will be displayed in the final report'}</p>
              </div>
            </div>
          ` : ''}

          ${exportOptions.includeRecommendations ? `
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                ${locale === 'zh' ? '治疗建议' : 'Treatment Recommendations'}
              </h3>
              <div class="bg-green-50 p-4 rounded">
                <p class="text-green-800 text-sm">
                  ${locale === 'zh' 
                    ? '基于您的疼痛数据，系统将生成个性化的治疗建议和模式分析。'
                    : 'Based on your pain data, the system will generate personalized treatment recommendations and pattern analysis.'
                  }
                </p>
              </div>
            </div>
          ` : ''}

          ${exportOptions.includeRawData ? `
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                ${locale === 'zh' ? '详细记录' : 'Detailed Records'}
              </h3>
              <div class="bg-gray-50 p-4 rounded">
                <p class="text-gray-600 text-sm mb-2">
                  ${locale === 'zh' ? '最近的记录预览：' : 'Recent records preview:'}
                </p>
                ${filteredRecords.slice(0, 3).map(record => `
                  <div class="border-l-4 border-blue-500 pl-3 mb-2">
                    <div class="text-sm font-medium">${record.date} - ${locale === 'zh' ? '疼痛等级' : 'Pain Level'}: ${record.painLevel}/10</div>
                    <div class="text-xs text-gray-600">${record.painTypes?.join(', ') || ''}</div>
                  </div>
                `).join('')}
                ${filteredRecords.length > 3 ? `
                  <p class="text-xs text-gray-500 mt-2">
                    ${locale === 'zh' ? `还有 ${filteredRecords.length - 3} 条记录...` : `And ${filteredRecords.length - 3} more records...`}
                  </p>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <div class="border-t pt-4">
            <p class="text-xs text-gray-500">
              ${locale === 'zh' 
                ? '此预览仅显示报告的部分内容。完整报告将包含所有选定的数据和分析。'
                : 'This preview shows only a portion of the report content. The complete report will include all selected data and analysis.'
              }
            </p>
          </div>
        </div>
      `;
      
      setPreviewContent(previewHtml);
      setExportProgress(100);
      setExportStatus('idle');
      
    } catch (error) {
      setExportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Preview generation failed');
    }
  };

  const handleExport = async () => {
    if (filteredRecords.length === 0) {
      setExportStatus('error');
      setErrorMessage(locale === 'zh' ? '没有数据可导出' : 'No data to export');
      return;
    }
    
    setIsExporting(true);
    setExportStatus('generating');
    setExportProgress(0);
    setErrorMessage('');

    try {
      // Generate analytics
      setExportProgress(20);
      const analytics = analyticsEngine.current.calculateAnalytics(filteredRecords);
      
      // Prepare export options
      setExportProgress(40);
      const exportOptionsWithDateRange = {
        format: exportFormat as 'html' | 'pdf',
        dateRange: {
          start: new Date(dateRange.startDate),
          end: new Date(dateRange.endDate)
        },
        includeCharts: exportOptions.includeCharts,
        includeSummary: exportOptions.includeRecommendations, // Map to includeSummary
        includeInsights: exportOptions.includeAnalytics, // Map to includeInsights
        includeRawData: exportOptions.includeRawData
      };

      setExportProgress(60);
      
      if (exportFormat === 'html') {
        // Generate HTML export
        const htmlContent = await exportManager.current.exportToHTML(
          filteredRecords,
          analytics,
          exportOptionsWithDateRange
        );
        
        setExportProgress(80);
        
        // Create and download HTML file
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pain-report-${dateRange.startDate}-to-${dateRange.endDate}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
      } else {
        // Generate PDF export
        const pdfBlob = await exportManager.current.exportToPDF(
          filteredRecords,
          analytics,
          exportOptionsWithDateRange
        );
        
        setExportProgress(80);
        
        // Create and download PDF file
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pain-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setExportProgress(100);
      setExportStatus('success');
      
      // Call the onExport callback if provided
      if (onExport) {
        await onExport({
          dateRange,
          format: exportFormat,
          exportOptions
        });
      }
      
      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('idle');
        setExportProgress(0);
      }, 3000);

    } catch (error) {
      setExportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Export failed');
      setIsExporting(false);
      console.error('Export error:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[
          { key: 'range', label: t('steps.dateRange') },
          { key: 'format', label: t('steps.format') },
          { key: 'options', label: t('steps.options') },
          { key: 'preview', label: t('steps.preview') },
          { key: 'export', label: t('steps.export') }
        ].map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              activeStep === step.key 
                ? 'bg-primary-600 text-white' 
                : ['range', 'format', 'options', 'preview', 'export'].indexOf(activeStep) > index
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm ${
              activeStep === step.key ? 'text-primary-600 font-medium' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
            {index < 4 && (
              <div className={`w-8 h-0.5 mx-4 ${
                ['range', 'format', 'options', 'preview', 'export'].indexOf(activeStep) > index
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateRangeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('dateRange.title')}
        </h3>
        <p className="text-gray-600">
          {t('dateRange.description')}
        </p>
      </div>

      {/* Quick presets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {datePresets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => handleDatePreset(preset.days)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('dateRange.startDate')}
          </label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('dateRange.endDate')}
          </label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Date range validation and info */}
      {new Date(dateRange.startDate) > new Date(dateRange.endDate) ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">
              {locale === 'zh' ? '开始日期不能晚于结束日期' : 'Start date cannot be later than end date'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-blue-600">
              {locale === 'zh' 
                ? `找到 ${recordsInRange} 条记录在所选日期范围内`
                : `Found ${recordsInRange} records in the selected date range`
              }
            </p>
          </div>
          {recordsInRange === 0 && (
            <p className="text-xs text-blue-500 mt-1">
              {locale === 'zh' 
                ? '请调整日期范围以包含更多记录，或先添加一些疼痛记录。'
                : 'Please adjust the date range to include more records, or add some pain records first.'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderFormatStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '选择导出格式' : 'Select Export Format'}
        </h3>
        <p className="text-gray-600">
          {locale === 'zh' ? '选择报告的导出格式' : 'Choose the format for your report'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Option */}
        <div
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            exportFormat === 'pdf'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setExportFormat('pdf')}
        >
          <div className="flex items-center mb-4">
            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
              exportFormat === 'pdf' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
            }`}>
              {exportFormat === 'pdf' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <h4 className="text-lg font-semibold text-gray-900">PDF</h4>
          </div>
          <p className="text-gray-600 mb-4">
            {locale === 'zh' 
              ? '生成专业的PDF医疗报告，适合打印和分享给医生'
              : 'Generate professional PDF medical reports, suitable for printing and sharing with doctors'
            }
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• {locale === 'zh' ? '高质量打印格式' : 'High-quality print format'}</li>
            <li>• {locale === 'zh' ? '适合医疗档案' : 'Suitable for medical records'}</li>
            <li>• {locale === 'zh' ? '包含图表和数据分析' : 'Includes charts and data analysis'}</li>
          </ul>
        </div>

        {/* HTML Option */}
        <div
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            exportFormat === 'html'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setExportFormat('html')}
        >
          <div className="flex items-center mb-4">
            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
              exportFormat === 'html' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
            }`}>
              {exportFormat === 'html' && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <h4 className="text-lg font-semibold text-gray-900">HTML</h4>
          </div>
          <p className="text-gray-600 mb-4">
            {locale === 'zh' 
              ? '生成交互式HTML报告，可以在浏览器中查看和分享'
              : 'Generate interactive HTML reports that can be viewed and shared in browsers'
            }
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• {locale === 'zh' ? '交互式图表' : 'Interactive charts'}</li>
            <li>• {locale === 'zh' ? '在线查看和分享' : 'Online viewing and sharing'}</li>
            <li>• {locale === 'zh' ? '响应式设计' : 'Responsive design'}</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderOptionsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '配置导出选项' : 'Configure Export Options'}
        </h3>
        <p className="text-gray-600">
          {locale === 'zh' ? '选择要包含在报告中的内容' : 'Choose what content to include in your report'}
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'includeCharts' as keyof LocalExportOptions,
            title: locale === 'zh' ? '包含图表' : 'Include Charts',
            description: locale === 'zh' ? '疼痛趋势图表和分布图' : 'Pain trend charts and distribution graphs',
            recommended: true
          },
          {
            key: 'includeRecommendations' as keyof LocalExportOptions,
            title: locale === 'zh' ? '包含治疗建议' : 'Include Treatment Recommendations',
            description: locale === 'zh' ? '基于数据的个性化建议' : 'Personalized recommendations based on data',
            recommended: true
          },
          {
            key: 'includeAnalytics' as keyof LocalExportOptions,
            title: locale === 'zh' ? '包含数据分析' : 'Include Data Analytics',
            description: locale === 'zh' ? '统计分析和模式识别' : 'Statistical analysis and pattern recognition',
            recommended: true
          },
          {
            key: 'includeRawData' as keyof LocalExportOptions,
            title: locale === 'zh' ? '包含原始数据' : 'Include Raw Data',
            description: locale === 'zh' ? '详细的疼痛记录数据' : 'Detailed pain record data',
            recommended: false
          }
        ].map((option) => (
          <div key={option.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id={option.key}
              checked={exportOptions[option.key]}
              onChange={(e) => setExportOptions(prev => ({
                ...prev,
                [option.key]: e.target.checked
              }))}
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <label htmlFor={option.key} className="text-sm font-medium text-gray-900 cursor-pointer">
                  {option.title}
                </label>
                {option.recommended && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {locale === 'zh' ? '推荐' : 'Recommended'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy warning */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              {locale === 'zh' ? '隐私和数据安全提醒' : 'Privacy and Data Security Notice'}
            </h4>
            <div className="text-sm text-yellow-700 mt-2 space-y-2">
              <p>
                {locale === 'zh' 
                  ? '您的疼痛数据包含敏感医疗信息。请注意以下事项：'
                  : 'Your pain data contains sensitive medical information. Please note the following:'
                }
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  {locale === 'zh' 
                    ? '导出的报告包含个人健康数据，请妥善保管'
                    : 'Exported reports contain personal health data, please store securely'
                  }
                </li>
                <li>
                  {locale === 'zh' 
                    ? '与医生分享时，建议使用安全的传输方式'
                    : 'When sharing with doctors, use secure transmission methods'
                  }
                </li>
                <li>
                  {locale === 'zh' 
                    ? '不建议通过电子邮件或社交媒体分享报告'
                    : 'Avoid sharing reports via email or social media'
                  }
                </li>
                <li>
                  {locale === 'zh' 
                    ? '所有数据处理均在本地进行，不会上传到服务器'
                    : 'All data processing is done locally, no data is uploaded to servers'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data sensitivity notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              {locale === 'zh' ? '医疗报告用途' : 'Medical Report Usage'}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {locale === 'zh' 
                ? '此报告专为医疗咨询设计，包含专业的数据分析和建议。建议在就医时携带此报告，以便医生更好地了解您的疼痛模式。'
                : 'This report is designed for medical consultations and includes professional data analysis and recommendations. We recommend bringing this report to medical appointments to help doctors better understand your pain patterns.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '报告预览' : 'Report Preview'}
        </h3>
        <p className="text-gray-600">
          {locale === 'zh' ? '预览您的报告内容，确认无误后继续导出' : 'Preview your report content before proceeding with export'}
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            {locale === 'zh' ? '报告配置摘要' : 'Report Configuration Summary'}
          </h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                {locale === 'zh' ? '日期范围：' : 'Date Range: '}
              </span>
              <span className="text-gray-600">{dateRange.startDate} - {dateRange.endDate}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                {locale === 'zh' ? '导出格式：' : 'Export Format: '}
              </span>
              <span className="text-gray-600">{exportFormat.toUpperCase()}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">
                {locale === 'zh' ? '包含内容：' : 'Includes: '}
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {exportOptions.includeCharts && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {locale === 'zh' ? '图表' : 'Charts'}
                  </span>
                )}
                {exportOptions.includeRecommendations && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {locale === 'zh' ? '建议' : 'Recommendations'}
                  </span>
                )}
                {exportOptions.includeAnalytics && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {locale === 'zh' ? '分析' : 'Analytics'}
                  </span>
                )}
                {exportOptions.includeRawData && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {locale === 'zh' ? '原始数据' : 'Raw Data'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview content */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            {locale === 'zh' ? '内容预览' : 'Content Preview'}
          </h4>
        </div>
        <div 
          ref={previewRef}
          className="p-4 bg-white min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    </div>
  );

  const renderExportStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '正在导出报告' : 'Exporting Report'}
        </h3>
        <p className="text-gray-600">
          {locale === 'zh' ? '请稍候，正在生成您的报告...' : 'Please wait while we generate your report...'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${exportProgress}%` }}
        />
      </div>

      {/* Status messages */}
      <div className="text-center">
        {exportStatus === 'preparing' && (
          <p className="text-sm text-gray-600">
            {locale === 'zh' ? '准备数据...' : 'Preparing data...'}
          </p>
        )}
        {exportStatus === 'generating' && (
          <p className="text-sm text-gray-600">
            {locale === 'zh' ? '生成报告...' : 'Generating report...'}
          </p>
        )}
        {exportStatus === 'success' && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">
              {locale === 'zh' ? '导出成功！' : 'Export successful!'}
            </p>
          </div>
        )}
        {exportStatus === 'error' && (
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">
              {locale === 'zh' ? '导出失败' : 'Export failed'}
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Success message */}
      {exportStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                {locale === 'zh' ? '导出成功！' : 'Export Successful!'}
              </h4>
              <p className="text-sm text-green-600 mt-1">
                {locale === 'zh' 
                  ? `您的${exportFormat.toUpperCase()}报告已成功生成并下载。文件名：pain-report-${dateRange.startDate}-to-${dateRange.endDate}.${exportFormat}`
                  : `Your ${exportFormat.toUpperCase()} report has been successfully generated and downloaded. Filename: pain-report-${dateRange.startDate}-to-${dateRange.endDate}.${exportFormat}`
                }
              </p>
              <div className="mt-2 text-xs text-green-600">
                <p>
                  {locale === 'zh' 
                    ? '• 请检查您的下载文件夹'
                    : '• Please check your downloads folder'
                  }
                </p>
                <p>
                  {locale === 'zh' 
                    ? '• 报告包含您选择的所有数据和分析'
                    : '• Report includes all selected data and analysis'
                  }
                </p>
                <p>
                  {locale === 'zh' 
                    ? '• 可以安全地与医疗专业人员分享'
                    : '• Safe to share with healthcare professionals'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional export options after success */}
      {exportStatus === 'success' && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => {
              setActiveStep('range');
              setExportStatus('idle');
              setExportProgress(0);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {locale === 'zh' ? '导出其他报告' : 'Export Another Report'}
          </button>
          <button
            onClick={() => {
              setActiveStep('preview');
              setExportStatus('idle');
              setExportProgress(0);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {locale === 'zh' ? '重新预览' : 'Preview Again'}
          </button>
        </div>
      )}
    </div>
  );

  const canProceed = () => {
    switch (activeStep) {
      case 'range':
        return new Date(dateRange.startDate) <= new Date(dateRange.endDate) && recordsInRange > 0;
      case 'format':
        return true;
      case 'options':
        return Object.values(exportOptions).some(Boolean);
      case 'preview':
        return previewContent.length > 0 && filteredRecords.length > 0;
      case 'export':
        return !isExporting && filteredRecords.length > 0;
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    switch (activeStep) {
      case 'range':
        return locale === 'zh' ? '选择格式' : 'Select Format';
      case 'format':
        return locale === 'zh' ? '配置选项' : 'Configure Options';
      case 'options':
        return locale === 'zh' ? '预览报告' : 'Preview Report';
      case 'preview':
        return locale === 'zh' ? '开始导出' : 'Start Export';
      case 'export':
        return locale === 'zh' ? '完成' : 'Complete';
      default:
        return locale === 'zh' ? '下一步' : 'Next';
    }
  };

  // Show empty state if no records exist at all
  if (records.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-6">
            <FileText className="w-24 h-24 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {locale === 'zh' ? '没有可导出的数据' : 'No Data to Export'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {locale === 'zh' 
              ? '您还没有任何疼痛记录。请先添加一些疼痛记录，然后再返回此处导出报告。'
              : 'You don\'t have any pain records yet. Please add some pain records first, then return here to export reports.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {locale === 'zh' ? '刷新页面' : 'Refresh Page'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        {activeStep === 'range' && renderDateRangeStep()}
        {activeStep === 'format' && renderFormatStep()}
        {activeStep === 'options' && renderOptionsStep()}
        {activeStep === 'preview' && renderPreviewStep()}
        {activeStep === 'export' && renderExportStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePreviousStep}
          disabled={activeStep === 'range'}
          className={`px-6 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${
            activeStep === 'range'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {locale === 'zh' ? '上一步' : 'Previous'}
        </button>

        <button
          onClick={handleNextStep}
          disabled={!canProceed() || isExporting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            !canProceed() || isExporting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isExporting && <Clock className="w-4 h-4 animate-spin" />}
          <span>{getNextButtonText()}</span>
          {activeStep === 'preview' && !isExporting && <Download className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}