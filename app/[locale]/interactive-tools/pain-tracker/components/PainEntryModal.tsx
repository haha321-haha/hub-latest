'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Edit, Calendar, Clock, MapPin, Activity, Heart, Star, FileText } from 'lucide-react';
import { PainEntry } from '../../shared/types';
import { PAIN_LOCATIONS, SYMPTOMS, REMEDIES, MENSTRUAL_STATUS, PAIN_LEVELS, EFFECTIVENESS_LEVELS } from '../../shared/constants';

interface PainEntryModalProps {
  entry: PainEntry;
  onClose: () => void;
  onEdit: (entry: PainEntry) => void;
  locale: string;
}

const PainEntryModal: React.FC<PainEntryModalProps> = ({
  entry,
  onClose,
  onEdit,
  locale
}) => {
  const t = useTranslations('painTracker');
  const [isEditing, setIsEditing] = useState(false);

  // Get localized options
  const painLocations = PAIN_LOCATIONS[locale as keyof typeof PAIN_LOCATIONS] || PAIN_LOCATIONS.en;
  const symptoms = SYMPTOMS[locale as keyof typeof SYMPTOMS] || SYMPTOMS.en;
  const remedies = REMEDIES[locale as keyof typeof REMEDIES] || REMEDIES.en;
  const menstrualStatus = MENSTRUAL_STATUS[locale as keyof typeof MENSTRUAL_STATUS] || MENSTRUAL_STATUS.en;
  const painLevels = PAIN_LEVELS[locale as keyof typeof PAIN_LEVELS] || PAIN_LEVELS.en;
  const effectivenessLevels = EFFECTIVENESS_LEVELS[locale as keyof typeof EFFECTIVENESS_LEVELS] || EFFECTIVENESS_LEVELS.en;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPainLevelInfo = (level: number) => {
    return painLevels.find(p => p.value === level);
  };

  const getMenstrualStatusInfo = (status: string) => {
    return menstrualStatus.find(s => s.value === status);
  };

  const getLocationLabels = (locations: string[]) => {
    return locations.map(loc => {
      const location = painLocations.find(l => l.value === loc);
      return location ? `${location.icon} ${location.label}` : loc;
    });
  };

  const getSymptomLabels = (symptomValues: string[]) => {
    return symptomValues.map(sym => {
      const symptom = symptoms.find(s => s.value === sym);
      return symptom ? `${symptom.icon} ${symptom.label}` : sym;
    });
  };

  const getRemedyLabels = (remedyValues: string[]) => {
    return remedyValues.map(rem => {
      const remedy = remedies.find(r => r.value === rem);
      return remedy ? `${remedy.icon} ${remedy.label}` : rem;
    });
  };

  const getEffectivenessInfo = (rating: number) => {
    return effectivenessLevels.find(e => e.value === rating);
  };

  const handleEdit = () => {
    onEdit(entry);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const painLevelInfo = getPainLevelInfo(entry.painLevel);
  const menstrualStatusInfo = getMenstrualStatusInfo(entry.menstrualStatus);
  const effectivenessInfo = entry.effectiveness ? getEffectivenessInfo(entry.effectiveness) : null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('entries.entryDetails')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(entry.date)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('entries.edit')}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('form.date')}</h3>
                  <p className="text-gray-600">{formatDate(entry.date)}</p>
                </div>
              </div>

              {entry.createdAt && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('entries.recordedAt')}</h3>
                    <p className="text-gray-600">{formatTime(entry.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pain Level */}
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.painLevel')}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-pink-600 mr-2">
                    {entry.painLevel}/10
                  </span>
                  {painLevelInfo && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {painLevelInfo.label}
                      </span>
                      <p className="text-xs text-gray-500">
                        {painLevelInfo.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          {entry.duration && (
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.duration')}</h3>
                <p className="text-gray-600">
                  {entry.duration} {t('form.minutes')}
                  {entry.duration >= 60 && (
                    <span className="text-gray-500 ml-2">
                      (~{Math.round(entry.duration / 60 * 10) / 10} {t('entries.hours')})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Menstrual Status */}
          <div className="flex items-start">
            <Heart className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{t('form.menstrualStatus')}</h3>
              {menstrualStatusInfo && (
                <div className="flex items-center mt-1">
                  <span className="text-lg mr-2">{menstrualStatusInfo.icon}</span>
                  <span className="text-gray-600">{menstrualStatusInfo.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pain Locations */}
          {entry.location.length > 0 && (
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.location')}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getLocationLabels(entry.location).map((location, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Symptoms */}
          {entry.symptoms.length > 0 && (
            <div className="flex items-start">
              <Activity className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.symptoms')}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSymptomLabels(entry.symptoms).map((symptom, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Remedies */}
          {entry.remedies.length > 0 && (
            <div className="flex items-start">
              <Heart className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.remedies')}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getRemedyLabels(entry.remedies).map((remedy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {remedy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Effectiveness */}
          {entry.effectiveness && effectivenessInfo && (
            <div className="flex items-center">
              <Star className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.effectiveness')}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-lg mr-2">{effectivenessInfo.icon}</span>
                  <span className="text-gray-600">
                    {effectivenessInfo.label} ({entry.effectiveness}/5)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('form.notes')}</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">{t('entries.createdAt')}:</span>
                <br />
                {new Date(entry.createdAt).toLocaleString(locale)}
              </div>
              {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                <div>
                  <span className="font-medium">{t('entries.updatedAt')}:</span>
                  <br />
                  {new Date(entry.updatedAt).toLocaleString(locale)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('form.close')}
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            {t('entries.edit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainEntryModal;