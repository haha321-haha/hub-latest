'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, MapPin, Activity, Heart, Star, FileText } from 'lucide-react';
import { PainEntryFormData, ValidationError } from '../../shared/types';
import { 
  PAIN_LOCATIONS, 
  SYMPTOMS, 
  REMEDIES, 
  MENSTRUAL_STATUS, 
  PAIN_LEVELS,
  EFFECTIVENESS_LEVELS,
  ERROR_MESSAGES 
} from '../../shared/constants';
import { formatDateShort, getPainLevelColor } from '../../shared/utils';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

interface PainEntryFormProps {
  initialData?: Partial<PainEntryFormData>;
  onSubmit: (data: PainEntryFormData) => Promise<{ success: boolean; errors?: ValidationError[] }>;
  onCancel?: () => void;
  isLoading?: boolean;
  locale: string;
}

const PainEntryForm: React.FC<PainEntryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  locale
}) => {
  const t = useTranslations('painTracker');
  
  const [formData, setFormData] = useState<PainEntryFormData>({
    date: initialData?.date || formatDateShort(new Date()),
    painLevel: initialData?.painLevel || 1,
    duration: initialData?.duration || undefined,
    location: initialData?.location || [],
    menstrualStatus: initialData?.menstrualStatus || 'other',
    symptoms: initialData?.symptoms || [],
    remedies: initialData?.remedies || [],
    effectiveness: initialData?.effectiveness || undefined,
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get localized options
  const painLocations = PAIN_LOCATIONS[locale as keyof typeof PAIN_LOCATIONS] || PAIN_LOCATIONS.en;
  const symptoms = SYMPTOMS[locale as keyof typeof SYMPTOMS] || SYMPTOMS.en;
  const remedies = REMEDIES[locale as keyof typeof REMEDIES] || REMEDIES.en;
  const menstrualStatus = MENSTRUAL_STATUS[locale as keyof typeof MENSTRUAL_STATUS] || MENSTRUAL_STATUS.en;
  const painLevels = PAIN_LEVELS[locale as keyof typeof PAIN_LEVELS] || PAIN_LEVELS.en;
  const effectivenessLevels = EFFECTIVENESS_LEVELS[locale as keyof typeof EFFECTIVENESS_LEVELS] || EFFECTIVENESS_LEVELS.en;
  const errorMessages = ERROR_MESSAGES[locale as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.en;

  const handleInputChange = (field: keyof PainEntryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMultiSelect = (field: 'location' | 'symptoms' | 'remedies', value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleInputChange(field, newValues);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = errorMessages.required;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      // 设置今天的时间为23:59:59，允许选择今天
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = errorMessages.futureDate;
      }
    }

    // Pain level validation
    if (formData.painLevel < 1 || formData.painLevel > 10) {
      newErrors.painLevel = errorMessages.painLevelRange;
    }

    // Duration validation
    if (formData.duration !== undefined && (formData.duration < 0 || formData.duration > 1440)) {
      newErrors.duration = errorMessages.durationRange;
    }

    // Effectiveness validation
    if (formData.effectiveness !== undefined && (formData.effectiveness < 1 || formData.effectiveness > 5)) {
      newErrors.effectiveness = errorMessages.effectivenessRange;
    }

    // Notes validation
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = errorMessages.notesLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, overwrite = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = overwrite ? { ...formData, overwrite: true } : formData;
      const result = await onSubmit(submitData);

      if (result.success) {
        // Reset form on success
        setFormData({
          date: formatDateShort(new Date()),
          painLevel: 1,
          duration: undefined,
          location: [],
          menstrualStatus: 'other',
          symptoms: [],
          remedies: [],
          effectiveness: undefined,
          notes: ''
        });
        setErrors({});
        setShowOverwriteConfirm(false);
      } else if (result.errors) {
        const errorMap: Record<string, string> = {};
        result.errors.forEach(error => {
          errorMap[error.field] = error.message;
        });
        setErrors(errorMap);

        // 如果是重复日期错误，显示覆盖确认
        if (result.errors[0]?.code === 'DUPLICATE_DATE') {
          setShowOverwriteConfirm(true);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: errorMessages.storageError });
    }
  };

  const handleOverwriteConfirm = (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  const handleOverwriteCancel = () => {
    setShowOverwriteConfirm(false);
    setErrors({});
  };

  const currentPainLevel = painLevels.find(level => level.value === formData.painLevel);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Input */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {t('form.date')}
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
          max={formatDateShort(new Date())}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}

        {/* 覆盖确认对话框 */}
        {showOverwriteConfirm && (
          <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  {locale === 'zh' ? '该日期已有记录' : 'Entry exists for this date'}
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {locale === 'zh'
                    ? '该日期已经有疼痛记录了。您想要覆盖现有记录吗？'
                    : 'There is already a pain entry for this date. Do you want to overwrite the existing entry?'
                  }
                </p>
                <div className="mt-3 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleOverwriteConfirm}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    {locale === 'zh' ? '覆盖' : 'Overwrite'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOverwriteCancel}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    {locale === 'zh' ? '取消' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pain Level Slider */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Activity className="w-4 h-4 mr-2" />
          {t('form.painLevel')} ({formData.painLevel}/10)
        </label>
        <div className="space-y-4 pain-scale-container">
          <input
            type="range"
            min="1"
            max="10"
            value={formData.painLevel}
            onChange={(e) => handleInputChange('painLevel', parseInt(e.target.value))}
            className="w-full pain-scale cursor-pointer"
          />
          <div className="flex justify-between text-sm text-neutral-600 mt-2">
            <span className="text-xs sm:text-sm">1</span>
            <span className="text-xs sm:text-sm">3</span>
            <span className="text-xs sm:text-sm">5</span>
            <span className="text-xs sm:text-sm">7</span>
            <span className="text-xs sm:text-sm">10</span>
          </div>
          {currentPainLevel && (
            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100 via-pink-50 to-purple-100 px-6 py-3 rounded-xl shadow-lg border border-pink-200">
                <span className="text-lg font-bold text-pink-800">
                  疼痛程度：
                  <span className="text-2xl font-extrabold text-pink-600 mx-2">{formData.painLevel}</span>
                  <span className="text-base font-medium text-pink-700">
                    ({currentPainLevel.label})
                  </span>
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{currentPainLevel.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Duration Input */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          {t('form.duration')} ({t('form.optional')})
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            max="1440"
            value={formData.duration || ''}
            onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          <span className="text-sm text-gray-500">{t('form.minutes')}</span>
        </div>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
        )}
      </div>

      {/* Pain Location */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          {t('form.location')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {painLocations.map((location) => (
            <button
              key={location.value}
              type="button"
              onClick={() => handleMultiSelect('location', location.value)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                formData.location.includes(location.value)
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-lg mr-2">{location.icon}</span>
              <span className="text-sm">{location.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menstrual Status */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <Heart className="w-4 h-4 mr-2" />
          {t('form.menstrualStatus')}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {menstrualStatus.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => handleInputChange('menstrualStatus', status.value)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                formData.menstrualStatus === status.value
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-lg mr-2">{status.icon}</span>
              <span className="text-sm">{status.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms - 移动端优化 */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <Activity className="w-4 h-4 mr-2" />
          {t('form.symptoms')} ({t('form.optional')})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {symptoms.map((symptom) => (
            <button
              key={symptom.value}
              type="button"
              onClick={() => handleMultiSelect('symptoms', symptom.value)}
              className={`p-3 sm:p-2 text-left border rounded-lg transition-colors text-sm mobile-touch-target ${
                formData.symptoms.includes(symptom.value)
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'
              }`}
            >
              <span className="text-base mr-2">{symptom.icon}</span>
              <span>{symptom.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Remedies - 移动端优化 */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <Heart className="w-4 h-4 mr-2" />
          {t('form.remedies')} ({t('form.optional')})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {remedies.map((remedy) => (
            <button
              key={remedy.value}
              type="button"
              onClick={() => handleMultiSelect('remedies', remedy.value)}
              className={`p-3 sm:p-2 text-left border rounded-lg transition-colors text-sm mobile-touch-target ${
                formData.remedies.includes(remedy.value)
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'
              }`}
            >
              <span className="text-base mr-2">{remedy.icon}</span>
              <span>{remedy.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Effectiveness Rating */}
      {formData.remedies.length > 0 && (
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Star className="w-4 h-4 mr-2" />
            {t('form.effectiveness')} ({t('form.optional')})
          </label>
          <div className="grid grid-cols-5 gap-2">
            {effectivenessLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange('effectiveness', level.value)}
                className={`p-3 text-center border rounded-lg transition-colors ${
                  formData.effectiveness === level.value
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">{level.icon}</div>
                <div className="text-xs">{level.label}</div>
              </button>
            ))}
          </div>
          {errors.effectiveness && (
            <p className="mt-1 text-sm text-red-600">{errors.effectiveness}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 mr-2" />
          {t('form.notes')} ({t('form.optional')})
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          maxLength={500}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('form.notesPlaceholder')}
        />
        <div className="flex justify-between mt-1">
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes}</p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {formData.notes?.length || 0}/500
          </p>
        </div>
      </div>

      {/* Submit and Cancel Buttons - 移动端优化 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-touch-target order-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              {t('form.saving')}
            </div>
          ) : (
            t('form.save')
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors mobile-touch-target order-2"
          >
            {t('form.cancel')}
          </button>
        )}
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}
    </form>
  );
};

export default PainEntryForm;
