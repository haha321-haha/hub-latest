import { useTranslations } from 'next-intl';

interface StepByStepFormulaProps {
  className?: string;
}

export default function StepByStepFormula({ className = '' }: StepByStepFormulaProps) {
  const t = useTranslations('articles.insuranceGuide.formula.steps');
  
  return (
    <div className={`my-6 ${className}`}>
      {/* 标题部分 */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">
          📊 {t('title')}
        </h4>
        <p className="text-gray-600 text-sm">
          {t('subtitle')}
        </p>
      </div>
      
      <div className="space-y-4">
        {/* 步骤1：确定自付额 */}
        <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
            {t('step1.number')}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-blue-900 mb-1">
              {t('step1.title')}
            </h5>
            <p className="text-sm text-blue-700 mb-2">
              {t('step1.description')}
            </p>
            <div className="bg-white px-3 py-2 rounded border border-blue-200 inline-block">
              <span className="text-blue-800 font-mono text-sm">
                {t('step1.example')}
              </span>
            </div>
          </div>
        </div>
        
        {/* 步骤2：计算超出部分 */}
        <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
            {t('step2.number')}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-purple-900 mb-1">
              {t('step2.title')}
            </h5>
            <p className="text-sm text-purple-700 mb-2">
              {t('step2.description')}
            </p>
            <div className="bg-white p-3 rounded border border-purple-200 mb-2">
              <div className="font-mono text-sm text-purple-800 mb-1">
                {t('step2.formula')}
              </div>
              <div className="text-purple-700 text-sm">
                {t('step2.example')}
              </div>
            </div>
          </div>
        </div>
        
        {/* 步骤3：应用共同保险比例 */}
        <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
          <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
            {t('step3.number')}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-orange-900 mb-1">
              {t('step3.title')}
            </h5>
            <p className="text-sm text-orange-700 mb-2">
              {t('step3.description')}
            </p>
            <div className="bg-white p-3 rounded border border-orange-200 mb-2">
              <div className="font-mono text-sm text-orange-800 mb-1">
                {t('step3.formula')}
              </div>
              <div className="text-orange-700 text-sm">
                {t('step3.example')}
              </div>
            </div>
          </div>
        </div>
        
        {/* 最终结果 */}
        <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 border-2 border-green-300">
          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
            ✓
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-green-900 mb-1">
              {t('finalResult.title')}
            </h5>
            <p className="text-sm text-green-700 mb-2">
              {t('finalResult.description')}
            </p>
            <div className="bg-white p-3 rounded border border-green-200 mb-2">
              <div className="font-mono text-sm text-green-800 mb-1">
                {t('finalResult.formula')}
              </div>
              <div className="text-green-700 text-sm mb-2">
                {t('finalResult.example')}
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded border border-green-300">
              <p className="text-sm font-medium text-green-800">
                💡 {t('finalResult.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端优化：简化视图提示 */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg md:hidden">
        <p className="text-xs text-gray-600 text-center">
          💡 {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
