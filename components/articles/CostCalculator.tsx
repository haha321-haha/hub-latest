'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ValidationErrors {
  deductible?: string;
  totalCost?: string;
  coinsuranceRate?: string;
}

export default function CostCalculator() {
  const t = useTranslations('articles.insuranceGuide.formula.calculator');
  const [deductible, setDeductible] = useState<string>('1000');
  const [totalCost, setTotalCost] = useState<string>('5000');
  const [coinsuranceRate, setCoinsuranceRate] = useState<string>('20');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 验证输入
  const validateInputs = useCallback(() => {
    const newErrors: ValidationErrors = {};
    
    const deductibleNum = parseFloat(deductible);
    const totalCostNum = parseFloat(totalCost);
    const coinsuranceNum = parseFloat(coinsuranceRate);
    
    if (!deductible || isNaN(deductibleNum) || deductibleNum < 0) {
      newErrors.deductible = t('validation.deductibleRequired');
    }
    
    if (!totalCost || isNaN(totalCostNum) || totalCostNum < 0) {
      newErrors.totalCost = t('validation.totalCostRequired');
    }
    
    if (!coinsuranceRate || isNaN(coinsuranceNum) || coinsuranceNum < 0 || coinsuranceNum > 100) {
      newErrors.coinsuranceRate = t('validation.validPercentageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [deductible, totalCost, coinsuranceRate, t]);

  // 计算自付费用
  const calculateOutOfPocket = useCallback(() => {
    if (!validateInputs()) return 0;
    
    const deductibleAmount = parseFloat(deductible);
    const totalAmount = parseFloat(totalCost);
    const coinsurancePercent = parseFloat(coinsuranceRate) / 100;
    
    if (totalAmount <= deductibleAmount) {
      return totalAmount;
    }
    
    const excessAmount = totalAmount - deductibleAmount;
    const coinsuranceAmount = excessAmount * coinsurancePercent;
    
    return deductibleAmount + coinsuranceAmount;
  }, [deductible, totalCost, coinsuranceRate, validateInputs]);

  const outOfPocketCost = calculateOutOfPocket();
  const deductiblePortion = Math.min(parseFloat(deductible) || 0, parseFloat(totalCost) || 0);
  const coinsurancePortion = outOfPocketCost - deductiblePortion;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 my-6">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">
          🧮 {t('title')}
        </h4>
        <p className="text-gray-600 text-sm">
          {t('subtitle')}
        </p>
      </div>
      
      {/* 输入区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 自付额输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputs.deductibleLabel')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={deductible}
              onChange={(e) => setDeductible(e.target.value)}
              placeholder={t('inputs.deductiblePlaceholder')}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.deductible ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="100"
            />
          </div>
          {errors.deductible && (
            <p className="mt-1 text-xs text-red-600">{errors.deductible}</p>
          )}
        </div>
        
        {/* 总费用输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputs.totalCostLabel')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder={t('inputs.totalCostPlaceholder')}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.totalCost ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="100"
            />
          </div>
          {errors.totalCost && (
            <p className="mt-1 text-xs text-red-600">{errors.totalCost}</p>
          )}
        </div>
        
        {/* 共同保险比例输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputs.coinsuranceLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={coinsuranceRate}
              onChange={(e) => setCoinsuranceRate(e.target.value)}
              placeholder={t('inputs.coinsurancePlaceholder')}
              className={`w-full pr-8 pl-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.coinsuranceRate ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              max="100"
              step="5"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
          {errors.coinsuranceRate && (
            <p className="mt-1 text-xs text-red-600">{errors.coinsuranceRate}</p>
          )}
        </div>
      </div>
      
      {/* 结果显示 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="text-center mb-4">
          <h5 className="text-lg font-semibold text-green-800 mb-2">
            {t('result.title')}
          </h5>
          <div className="text-3xl font-bold text-green-900">
            {t('result.amount', { amount: outOfPocketCost.toFixed(2) })}
          </div>
        </div>
        
        {/* 费用明细 */}
        <div className="border-t border-green-200 pt-4">
          <h6 className="text-sm font-medium text-green-800 mb-3">
            {t('result.breakdown')}
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">
                {t('result.deductiblePortion', { amount: deductiblePortion.toFixed(2) })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">
                {t('result.coinsurancePortion', { amount: coinsurancePortion.toFixed(2) })}
              </span>
            </div>
            <div className="border-t border-green-300 pt-2 flex justify-between font-semibold">
              <span className="text-green-800">
                {t('result.totalAmount', { amount: outOfPocketCost.toFixed(2) })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
