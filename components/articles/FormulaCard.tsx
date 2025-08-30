import { useTranslations } from 'next-intl';

interface FormulaCardProps {
  className?: string;
}

export default function FormulaCard({ className = '' }: FormulaCardProps) {
  const t = useTranslations('articles.insuranceGuide.formula');
  
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500 rounded-lg p-6 my-6 ${className}`}>
      {/* 标题部分 */}
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">💰</span>
        <h4 className="text-lg font-semibold text-blue-900">
          {t('title')}
        </h4>
      </div>
      
      {/* 公式核心显示 */}
      <div 
        className="bg-white rounded-lg p-4 border-2 border-blue-200 mb-4 shadow-sm"
        role="math"
        aria-label={t('ariaLabel')}
      >
        <div className="text-center font-mono text-lg text-blue-800 leading-relaxed break-words">
          {t('mainFormula')}
        </div>
      </div>
      
      {/* 变量说明区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono min-w-fit">
            {t('variables.symbols.outOfPocket')}
          </span>
          <span className="text-gray-700 leading-relaxed">
            {t('variables.descriptions.outOfPocket')}
          </span>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono min-w-fit">
            {t('variables.symbols.deductible')}
          </span>
          <span className="text-gray-700 leading-relaxed">
            {t('variables.descriptions.deductible')}
          </span>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-mono min-w-fit">
            {t('variables.symbols.totalCost')}
          </span>
          <span className="text-gray-700 leading-relaxed">
            {t('variables.descriptions.totalCost')}
          </span>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-mono min-w-fit">
            {t('variables.symbols.coinsuranceRate')}
          </span>
          <span className="text-gray-700 leading-relaxed">
            {t('variables.descriptions.coinsuranceRate')}
          </span>
        </div>
      </div>
      
      {/* 移动端优化提示 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg md:hidden">
        <p className="text-xs text-blue-700 text-center">
          💡 {t('ariaLabel')}
        </p>
      </div>
    </div>
  );
}
