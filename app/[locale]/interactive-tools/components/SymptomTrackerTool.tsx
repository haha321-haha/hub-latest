'use client';

import { useState, useEffect } from 'react';

interface SymptomEntry {
  id: string;
  date: string;
  painLevel: number;
  symptoms: string[];
  mood: string;
  flow: string;
  medications: string[];
  notes: string;
}

interface SymptomTrackerToolProps {
  locale: string;
}

export default function SymptomTrackerTool({ locale }: SymptomTrackerToolProps) {
  const [currentEntry, setCurrentEntry] = useState<Omit<SymptomEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    painLevel: 0,
    symptoms: [],
    mood: '',
    flow: '',
    medications: [],
    notes: ''
  });
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dateError, setDateError] = useState('');

  // Get today's date in YYYY-MM-DD format for date validation
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('symptomEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleSymptomToggle = (symptom: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      medications: prev.medications.includes(medication)
        ? prev.medications.filter(m => m !== medication)
        : [...prev.medications, medication]
    }));
  };

  // Handle date change with validation
  const handleDateChange = (selectedDate: string) => {
    const today = getTodayDate();

    if (selectedDate > today) {
      setDateError(locale === 'zh'
        ? '不能选择未来的日期，症状只能记录已发生的事件'
        : 'Cannot select future dates. Symptoms can only be recorded for events that have occurred');
      return;
    }

    setDateError('');
    setCurrentEntry(prev => ({ ...prev, date: selectedDate }));
  };

  const handleSave = () => {
    // Validate date before saving
    if (currentEntry.date > getTodayDate()) {
      setDateError(locale === 'zh'
        ? '不能选择未来的日期，症状只能记录已发生的事件'
        : 'Cannot select future dates. Symptoms can only be recorded for events that have occurred');
      return;
    }

    const newEntry: SymptomEntry = {
      ...currentEntry,
      id: Date.now().toString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('symptomEntries', JSON.stringify(updatedEntries));

    // Reset form
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      painLevel: 0,
      symptoms: [],
      mood: '',
      flow: '',
      medications: [],
      notes: ''
    });

    setDateError('');
    alert(locale === 'zh' ? '症状记录已保存！' : 'Symptom record saved successfully!');
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 2) return 'text-green-600';
    if (level <= 5) return 'text-yellow-600';
    if (level <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPainLevelText = (level: number) => {
    if (locale === 'zh') {
      if (level === 0) return '无痛';
      if (level <= 2) return '轻微';
      if (level <= 5) return '中度';
      if (level <= 7) return '重度';
      return '极重';
    } else {
      if (level === 0) return 'No pain';
      if (level <= 2) return 'Mild';
      if (level <= 5) return 'Moderate';
      if (level <= 7) return 'Severe';
      return 'Extreme';
    }
  };

  const commonSymptoms = locale === 'zh' 
    ? ['腹痛', '头痛', '乳房胀痛', '情绪波动', '疲劳', '腰痛', '恶心', '失眠', '腹胀', '便秘', '腹泻', '食欲改变']
    : ['Abdominal pain', 'Headache', 'Breast tenderness', 'Mood swings', 'Fatigue', 'Back pain', 'Nausea', 'Insomnia', 'Bloating', 'Constipation', 'Diarrhea', 'Appetite changes'];

  const moodOptions = locale === 'zh'
    ? ['正常', '焦虑', '抑郁', '易怒', '情绪低落', '兴奋', '紧张']
    : ['Normal', 'Anxious', 'Depressed', 'Irritable', 'Low mood', 'Excited', 'Tense'];

  const flowOptions = locale === 'zh'
    ? ['无', '点滴', '轻量', '中量', '大量', '非常大量']
    : ['None', 'Spotting', 'Light', 'Medium', 'Heavy', 'Very heavy'];

  const commonMedications = locale === 'zh'
    ? ['布洛芬', '对乙酰氨基酚', '萘普生', '阿司匹林', '中药', '维生素', '其他']
    : ['Ibuprofen', 'Acetaminophen', 'Naproxen', 'Aspirin', 'Herbal medicine', 'Vitamins', 'Other'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {locale === 'zh' ? '症状记录器' : 'Symptom Tracker'}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {locale === 'zh' 
            ? '详细记录您的经期症状，帮助识别模式并为医疗咨询提供准确信息。'
            : 'Record your menstrual symptoms in detail to help identify patterns and provide accurate information for medical consultations.'
          }
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setShowHistory(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            !showHistory 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {locale === 'zh' ? '记录症状' : 'Record Symptoms'}
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showHistory 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {locale === 'zh' ? '历史记录' : 'History'} ({entries.length})
        </button>
      </div>

      {!showHistory ? (
        /* Recording Form */
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {locale === 'zh' ? '基本信息' : 'Basic Information'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '日期' : 'Date'}
                </label>
                <input
                  type="date"
                  value={currentEntry.date}
                  max={getTodayDate()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    dateError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {dateError && (
                  <div className="mt-2 flex items-start space-x-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-600">{dateError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '疼痛强度 (0-10)' : 'Pain Level (0-10)'}
                </label>
                <div className="relative mb-2">
                  {/* Gradient background track */}
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg"></div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={currentEntry.painLevel}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                    className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 pain-slider"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{locale === 'zh' ? '无痛' : 'No pain'}</span>
                  <span className={`font-semibold ${getPainLevelColor(currentEntry.painLevel)}`}>
                    {currentEntry.painLevel} - {getPainLevelText(currentEntry.painLevel)}
                  </span>
                  <span>{locale === 'zh' ? '极痛' : 'Extreme'}</span>
                </div>

                {/* Custom CSS for slider thumb */}
                <style jsx>{`
                  .pain-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #6b7280;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                  }

                  .pain-slider::-webkit-slider-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #6b7280;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                    -moz-appearance: none;
                  }

                  .pain-slider::-moz-range-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-track {
                    background: transparent;
                    height: 12px;
                  }
                `}</style>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '情绪状态' : 'Mood'}
                </label>
                <select
                  value={currentEntry.mood}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{locale === 'zh' ? '请选择' : 'Please select'}</option>
                  {moodOptions.map((mood, index) => (
                    <option key={index} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '月经流量' : 'Menstrual Flow'}
                </label>
                <select
                  value={currentEntry.flow}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, flow: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{locale === 'zh' ? '请选择' : 'Please select'}</option>
                  {flowOptions.map((flow, index) => (
                    <option key={index} value={flow}>{flow}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Symptoms and Medications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {locale === 'zh' ? '症状与用药' : 'Symptoms & Medications'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '症状' : 'Symptoms'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms.map((symptom, index) => (
                    <label key={index} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={currentEntry.symptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      {symptom}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '使用的药物' : 'Medications Used'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonMedications.map((medication, index) => (
                    <label key={index} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={currentEntry.medications.includes(medication)}
                        onChange={() => handleMedicationToggle(medication)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      {medication}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '备注' : 'Notes'}
                </label>
                <textarea
                  value={currentEntry.notes}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={locale === 'zh' ? '记录任何其他症状、感受或观察...' : 'Record any other symptoms, feelings, or observations...'}
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                {locale === 'zh' ? '保存记录' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            {locale === 'zh' ? '症状历史记录' : 'Symptom History'}
          </h3>
          
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">
                {locale === 'zh' ? '暂无症状记录' : 'No symptom records yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{entry.date}</h4>
                    <span className={`font-semibold ${getPainLevelColor(entry.painLevel)}`}>
                      {locale === 'zh' ? '疼痛' : 'Pain'}: {entry.painLevel}/10
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>{locale === 'zh' ? '情绪' : 'Mood'}:</strong> {entry.mood || (locale === 'zh' ? '未记录' : 'Not recorded')}</p>
                      <p><strong>{locale === 'zh' ? '流量' : 'Flow'}:</strong> {entry.flow || (locale === 'zh' ? '未记录' : 'Not recorded')}</p>
                    </div>
                    <div>
                      {entry.symptoms.length > 0 && (
                        <p><strong>{locale === 'zh' ? '症状' : 'Symptoms'}:</strong> {entry.symptoms.join(', ')}</p>
                      )}
                      {entry.medications.length > 0 && (
                        <p><strong>{locale === 'zh' ? '用药' : 'Medications'}:</strong> {entry.medications.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>{locale === 'zh' ? '备注' : 'Notes'}:</strong> {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h4 className="font-semibold text-green-800 mb-2">
          {locale === 'zh' ? '记录建议' : 'Recording Tips'}
        </h4>
        <ul className="text-green-700 space-y-1 text-sm">
          <li>• {locale === 'zh' ? '建议每天记录，即使没有症状也要记录' : 'Record daily, even when you have no symptoms'}</li>
          <li>• {locale === 'zh' ? '详细记录有助于识别症状模式' : 'Detailed records help identify symptom patterns'}</li>
          <li>• {locale === 'zh' ? '可以将记录分享给医生作为诊断参考' : 'Share records with your doctor for diagnostic reference'}</li>
        </ul>
      </div>
    </div>
  );
}
