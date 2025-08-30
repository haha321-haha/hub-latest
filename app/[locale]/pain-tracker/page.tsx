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

export default function PainTrackerPage() {
  const locale = useLocale();
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<PainEntry>>({
    date: new Date().toISOString().split('T')[0],
    intensity: 5,
    menstrualStatus: '',
    symptoms: [],
    treatments: [],
    effectiveness: 5,
    notes: ''
  });

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('painEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    const newEntry: PainEntry = {
      ...currentEntry,
      id: Date.now().toString(),
    } as PainEntry;

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('painEntries', JSON.stringify(updatedEntries));
    
    setShowForm(false);
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      intensity: 5,
      menstrualStatus: '',
      symptoms: [],
      treatments: [],
      effectiveness: 5,
      notes: ''
    });
  };

  const updateEntry = (field: keyof PainEntry, value: any) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSymptom = (symptom: string) => {
    const symptoms = currentEntry.symptoms || [];
    const updated = symptoms.includes(symptom)
      ? symptoms.filter(s => s !== symptom)
      : [...symptoms, symptom];
    updateEntry('symptoms', updated);
  };

  const toggleTreatment = (treatment: string) => {
    const treatments = currentEntry.treatments || [];
    const updated = treatments.includes(treatment)
      ? treatments.filter(t => t !== treatment)
      : [...treatments, treatment];
    updateEntry('treatments', updated);
  };

  const getAverageIntensity = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.intensity, 0);
    return (sum / entries.length).toFixed(1);
  };

  const getRecentTrend = () => {
    if (entries.length < 2) return 'stable';
    const recent = entries.slice(-3);
    const older = entries.slice(-6, -3);
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.intensity, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((acc, entry) => acc + entry.intensity, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 0.5) return 'increasing';
    if (recentAvg < olderAvg - 0.5) return 'decreasing';
    return 'stable';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            {locale === 'zh' ? '疼痛追踪器' : 'Pain Tracker'}
          </h1>
          <p className="text-neutral-600 mb-8">
            {locale === 'zh' 
              ? '记录您的疼痛模式，帮助识别触发因素和有效的治疗方法'
              : 'Track your pain patterns to help identify triggers and effective treatments'
            }
          </p>
        </div>
      </header>

      {/* Statistics Dashboard */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {entries.length}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '总记录数' : 'Total Entries'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {getAverageIntensity()}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '平均疼痛强度' : 'Average Pain Intensity'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${
                getRecentTrend() === 'increasing' ? 'text-red-600' :
                getRecentTrend() === 'decreasing' ? 'text-green-600' :
                'text-yellow-600'
              }`}>
                {getRecentTrend() === 'increasing' ? '↗' :
                 getRecentTrend() === 'decreasing' ? '↘' : '→'}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '最近趋势' : 'Recent Trend'}
              </p>
            </div>
          </div>

          {/* Add Entry Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              {locale === 'zh' ? '添加新记录' : 'Add New Entry'}
            </button>
          </div>
        </div>
      </section>

      {/* Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {locale === 'zh' ? '添加疼痛记录' : 'Add Pain Entry'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '日期' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => updateEntry('date', e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Pain Intensity */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '疼痛强度' : 'Pain Intensity'} ({currentEntry.intensity}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={currentEntry.intensity}
                    onChange={(e) => updateEntry('intensity', parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Menstrual Status */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '月经状态' : 'Menstrual Status'}
                  </label>
                  <select
                    value={currentEntry.menstrualStatus}
                    onChange={(e) => updateEntry('menstrualStatus', e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">{locale === 'zh' ? '请选择' : 'Please select'}</option>
                    <option value="before">{locale === 'zh' ? '月经前' : 'Before period'}</option>
                    <option value="during">{locale === 'zh' ? '月经期间' : 'During period'}</option>
                    <option value="after">{locale === 'zh' ? '月经后' : 'After period'}</option>
                    <option value="none">{locale === 'zh' ? '非月经期' : 'Not related to period'}</option>
                  </select>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '伴随症状' : 'Associated Symptoms'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'nausea', label: locale === 'zh' ? '恶心' : 'Nausea' },
                      { value: 'headache', label: locale === 'zh' ? '头痛' : 'Headache' },
                      { value: 'fatigue', label: locale === 'zh' ? '疲劳' : 'Fatigue' },
                      { value: 'bloating', label: locale === 'zh' ? '腹胀' : 'Bloating' },
                      { value: 'mood_changes', label: locale === 'zh' ? '情绪变化' : 'Mood changes' },
                      { value: 'back_pain', label: locale === 'zh' ? '背痛' : 'Back pain' }
                    ].map((symptom) => (
                      <label key={symptom.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={currentEntry.symptoms?.includes(symptom.value) || false}
                          onChange={() => toggleSymptom(symptom.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-neutral-700">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '备注' : 'Notes'}
                  </label>
                  <textarea
                    value={currentEntry.notes}
                    onChange={(e) => updateEntry('notes', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder={locale === 'zh' ? '记录任何额外信息...' : 'Record any additional information...'}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50"
                  >
                    {locale === 'zh' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    onClick={saveEntry}
                    className="btn-primary"
                  >
                    {locale === 'zh' ? '保存' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            {locale === 'zh' ? '最近记录' : 'Recent Entries'}
          </h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                {locale === 'zh' ? '还没有记录，开始添加您的第一条记录吧！' : 'No entries yet. Start by adding your first entry!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-neutral-800">{entry.date}</h3>
                      <p className="text-sm text-neutral-600">{entry.menstrualStatus}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{entry.intensity}/10</div>
                      <p className="text-sm text-neutral-600">
                        {locale === 'zh' ? '疼痛强度' : 'Pain Intensity'}
                      </p>
                    </div>
                  </div>
                  
                  {entry.symptoms.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        {locale === 'zh' ? '症状：' : 'Symptoms: '}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {entry.symptoms.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {entry.notes && (
                    <p className="text-sm text-neutral-600 italic">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
