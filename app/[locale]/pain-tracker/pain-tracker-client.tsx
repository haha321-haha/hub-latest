'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface PainEntry {
  id: string;
  date: string;
  intensity: number;
  menstrualStatus: string;
  symptoms: string[];
  treatments: string[];
  effectiveness: number;
  notes: string;
}

export default function PainTrackerClient() {
  const locale = useLocale();
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<PainEntry>>({
    intensity: 5,
    effectiveness: 5
  });

  useEffect(() => {
    // 从localStorage加载数据
    const savedEntries = localStorage.getItem('painEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntries = (newEntries: PainEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('painEntries', JSON.stringify(newEntries));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PainEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      intensity: currentEntry.intensity || 5,
      menstrualStatus: currentEntry.menstrualStatus || '',
      symptoms: currentEntry.symptoms || [],
      treatments: currentEntry.treatments || [],
      effectiveness: currentEntry.effectiveness || 5,
      notes: currentEntry.notes || ''
    };
    
    saveEntries([...entries, newEntry]);
    setCurrentEntry({ intensity: 5, effectiveness: 5 });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛追踪器' : 'Pain Tracker'}
            </h1>
            <p className="text-gray-600">
              {locale === 'zh' 
                ? '记录您的疼痛情况，追踪模式和效果'
                : 'Record your pain levels and track patterns and effectiveness'
              }
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showForm 
                ? (locale === 'zh' ? '取消' : 'Cancel')
                : (locale === 'zh' ? '添加记录' : 'Add Entry')
              }
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {locale === 'zh' ? '疼痛记录' : 'Pain Entry'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'zh' ? '疼痛强度 (1-10)' : 'Pain Intensity (1-10)'}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.intensity || 5}
                    onChange={(e) => setCurrentEntry({...currentEntry, intensity: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-bold text-purple-600">{currentEntry.intensity || 5}</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'zh' ? '月经状态' : 'Menstrual Status'}
                  </label>
                  <select
                    value={currentEntry.menstrualStatus || ''}
                    onChange={(e) => setCurrentEntry({...currentEntry, menstrualStatus: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">
                      {locale === 'zh' ? '选择状态' : 'Select status'}
                    </option>
                    <option value="menstruating">
                      {locale === 'zh' ? '月经期' : 'Menstruating'}
                    </option>
                    <option value="pre-menstrual">
                      {locale === 'zh' ? '经前期' : 'Pre-menstrual'}
                    </option>
                    <option value="ovulation">
                      {locale === 'zh' ? '排卵期' : 'Ovulation'}
                    </option>
                    <option value="other">
                      {locale === 'zh' ? '其他' : 'Other'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '备注' : 'Notes'}
                </label>
                <textarea
                  value={currentEntry.notes || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder={locale === 'zh' ? '记录任何相关症状或观察...' : 'Record any related symptoms or observations...'}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {locale === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {locale === 'zh' ? '保存' : 'Save'}
                </button>
              </div>
            </form>
          )}

          {entries.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {locale === 'zh' ? '历史记录' : 'History'}
              </h2>
              <div className="space-y-4">
                {entries.slice().reverse().map((entry) => (
                  <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <span className="text-lg font-bold text-purple-600">
                        {entry.intensity}/10
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{locale === 'zh' ? '状态' : 'Status'}: {entry.menstrualStatus}</p>
                      {entry.notes && (
                        <p className="mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
