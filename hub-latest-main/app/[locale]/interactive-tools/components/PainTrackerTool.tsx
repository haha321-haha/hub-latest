'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, List, BarChart3, Download, Settings } from 'lucide-react';
import { usePainTracker } from '../shared/hooks/usePainTracker';
import { useNotifications } from '../shared/hooks/useNotifications';
import PainEntryForm from '../pain-tracker/components/PainEntryForm';
import NotificationContainer from '../shared/components/NotificationContainer';
import { LoadingOverlay } from '../shared/components/LoadingSpinner';

interface PainTrackerToolProps {
  locale: string;
}

type ActiveTab = 'overview' | 'add' | 'entries' | 'statistics' | 'export';

interface EditingEntry {
  id: string;
  data: any;
}

export default function PainTrackerTool({ locale }: PainTrackerToolProps) {
  const t = useTranslations('painTracker');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EditingEntry | null>(null);
  
  const {
    entries,
    statistics,
    isLoading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    setError
  } = usePainTracker();

  const {
    notifications,
    removeNotification,
    addSuccessNotification,
    addErrorNotification
  } = useNotifications();

  const handleAddEntry = async (data: any) => {
    setIsFormLoading(true);
    try {
      const result = await addEntry(data);
      if (result.success) {
        addSuccessNotification(
          t('messages.saveSuccess'),
          t('form.save')
        );
        setActiveTab('entries');
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      addErrorNotification(
        t('messages.saveError'),
        t('messages.validationError')
      );
      return { success: false };
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditEntry = async (data: any) => {
    if (!editingEntry) return { success: false };

    setIsFormLoading(true);
    try {
      const result = await updateEntry(editingEntry.id, data);
      if (result.success) {
        addSuccessNotification(
          t('messages.updateSuccess'),
          t('form.save')
        );
        setEditingEntry(null);
        setActiveTab('entries');
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      addErrorNotification(
        t('messages.updateError'),
        t('messages.validationError')
      );
      return { success: false };
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm(t('messages.confirmDelete'))) {
      try {
        const success = await deleteEntry(id);
        if (success) {
          addSuccessNotification(
            t('messages.deleteSuccess'),
            t('entries.delete')
          );
        } else {
          addErrorNotification(
            t('messages.deleteError'),
            t('messages.validationError')
          );
        }
      } catch (error) {
        addErrorNotification(
          t('messages.deleteError'),
          t('messages.validationError')
        );
      }
    }
  };

  const startEditEntry = (entry: any) => {
    setEditingEntry({ id: entry.id, data: entry });
    setActiveTab('add');
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setActiveTab('entries');
  };

  const tabs = [
    { id: 'overview' as ActiveTab, label: t('navigation.overview'), icon: BarChart3 },
    { id: 'add' as ActiveTab, label: t('navigation.addEntry'), icon: Plus },
    { id: 'entries' as ActiveTab, label: t('navigation.viewEntries'), icon: List },
    { id: 'statistics' as ActiveTab, label: t('navigation.statistics'), icon: BarChart3 },
    { id: 'export' as ActiveTab, label: t('navigation.export'), icon: Download }
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-xl p-8">
      <LoadingOverlay isLoading={isLoading} message="Loading...">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('statistics.overview')}
              </h2>
              
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('entries.noEntries')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('entries.noEntriesDescription')}
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors"
                  >
                    {t('entries.addFirst')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      {t('statistics.totalEntries')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {statistics.totalEntries}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      {t('statistics.averagePain')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {statistics.averagePain}/10
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      {t('statistics.trendDirection')}
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {t(`statistics.${statistics.trendDirection}`)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingEntry ? t('form.editTitle') : t('form.title')}
              </h2>
              <PainEntryForm
                onSubmit={editingEntry ? handleEditEntry : handleAddEntry}
                onCancel={editingEntry ? cancelEdit : () => setActiveTab('overview')}
                isLoading={isFormLoading}
                locale={locale}
                initialData={editingEntry?.data}
              />
            </div>
          )}

          {activeTab === 'entries' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('entries.title')}
              </h2>
              
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <List className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('entries.noEntries')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('entries.noEntriesDescription')}
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors"
                  >
                    {t('entries.addFirst')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {new Date(entry.date).toLocaleDateString(locale)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t('entries.painIntensity')}: {entry.painLevel}/10
                          </p>
                          {entry.duration && (
                            <p className="text-sm text-gray-600">
                              {t('entries.duration')}: {entry.duration} {t('entries.minutes')}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditEntry(entry)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            {t('entries.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          >
                            {t('entries.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('statistics.title')}
              </h2>
              <p className="text-gray-600">
                {t('statistics.inDevelopment')}
              </p>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('export.title')}
              </h2>
              <p className="text-gray-600">
                {t('export.inDevelopment')}
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                {t('messages.close')}
              </button>
            </div>
          </div>
        )}
      </LoadingOverlay>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
