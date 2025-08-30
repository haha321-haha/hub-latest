'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 数据类型定义
export interface PainEntry {
  id: string;
  date: string;
  painLevel: number;
  duration?: number;
  location: string[];
  symptoms: string[];
  remedies: string[];
  notes?: string;
  timestamp: string;
}

export interface ConstitutionResult {
  id: string;
  primaryType: string;
  confidence: number;
  answers: any[];
  recommendations: {
    acupoints: any;
    diet: any;
    lifestyle: any;
  };
  timestamp: string;
}

export interface UserPreferences {
  language: 'zh' | 'en';
  theme: 'light' | 'dark';
  notifications: {
    painReminders: boolean;
    assessmentReminders: boolean;
    tipOfTheDay: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

export interface HealthDataState {
  // 疼痛追踪数据
  painEntries: PainEntry[];
  
  // 体质测试结果
  constitutionResults: ConstitutionResult[];
  
  // 用户偏好
  preferences: UserPreferences;
  
  // 数据状态
  isLoading: boolean;
  lastSyncTime: string | null;
  
  // Actions
  addPainEntry: (entry: Omit<PainEntry, 'id' | 'timestamp'>) => void;
  updatePainEntry: (id: string, updates: Partial<PainEntry>) => void;
  deletePainEntry: (id: string) => void;
  
  addConstitutionResult: (result: Omit<ConstitutionResult, 'id' | 'timestamp'>) => void;
  
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // 数据分析方法
  getPainTrends: () => any;
  getAveragePainLevel: () => number;
  getMostCommonSymptoms: () => string[];
  
  // 数据管理
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAllData: () => void;
}

// 默认用户偏好
const defaultPreferences: UserPreferences = {
  language: 'zh',
  theme: 'light',
  notifications: {
    painReminders: true,
    assessmentReminders: true,
    tipOfTheDay: true,
  },
  privacy: {
    dataSharing: false,
    analytics: true,
  },
};

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 创建Zustand Store
export const useHealthDataStore = create<HealthDataState>()(
  persist(
    (set, get) => ({
      // 初始状态
      painEntries: [],
      constitutionResults: [],
      preferences: defaultPreferences,
      isLoading: false,
      lastSyncTime: null,

      // 疼痛数据管理
      addPainEntry: (entry) => {
        const newEntry: PainEntry = {
          ...entry,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          painEntries: [...state.painEntries, newEntry],
          lastSyncTime: new Date().toISOString(),
        }));
      },

      updatePainEntry: (id, updates) => {
        set((state) => ({
          painEntries: state.painEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
          lastSyncTime: new Date().toISOString(),
        }));
      },

      deletePainEntry: (id) => {
        set((state) => ({
          painEntries: state.painEntries.filter((entry) => entry.id !== id),
          lastSyncTime: new Date().toISOString(),
        }));
      },

      // 体质测试结果管理
      addConstitutionResult: (result) => {
        const newResult: ConstitutionResult = {
          ...result,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          constitutionResults: [...state.constitutionResults, newResult],
          lastSyncTime: new Date().toISOString(),
        }));
      },

      // 用户偏好管理
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
          lastSyncTime: new Date().toISOString(),
        }));
      },

      // 数据分析方法
      getPainTrends: () => {
        const { painEntries } = get();
        // 实现疼痛趋势分析逻辑
        return painEntries.reduce((trends, entry) => {
          const date = entry.date;
          if (!trends[date]) {
            trends[date] = [];
          }
          trends[date].push(entry.painLevel);
          return trends;
        }, {} as Record<string, number[]>);
      },

      getAveragePainLevel: () => {
        const { painEntries } = get();
        if (painEntries.length === 0) return 0;
        
        const total = painEntries.reduce((sum, entry) => sum + entry.painLevel, 0);
        return Math.round((total / painEntries.length) * 10) / 10;
      },

      getMostCommonSymptoms: () => {
        const { painEntries } = get();
        const symptomCounts: Record<string, number> = {};
        
        painEntries.forEach((entry) => {
          entry.symptoms.forEach((symptom) => {
            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
          });
        });
        
        return Object.entries(symptomCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([symptom]) => symptom);
      },

      // 数据导入导出
      exportData: () => {
        const state = get();
        return JSON.stringify({
          painEntries: state.painEntries,
          constitutionResults: state.constitutionResults,
          preferences: state.preferences,
          exportTime: new Date().toISOString(),
        });
      },

      importData: (data) => {
        try {
          const parsedData = JSON.parse(data);
          set({
            painEntries: parsedData.painEntries || [],
            constitutionResults: parsedData.constitutionResults || [],
            preferences: { ...defaultPreferences, ...parsedData.preferences },
            lastSyncTime: new Date().toISOString(),
          });
          return true;
        } catch (error) {
          console.error('Failed to import data:', error);
          return false;
        }
      },

      clearAllData: () => {
        set({
          painEntries: [],
          constitutionResults: [],
          preferences: defaultPreferences,
          lastSyncTime: new Date().toISOString(),
        });
      },
    }),
    {
      name: 'periodhub-health-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        painEntries: state.painEntries,
        constitutionResults: state.constitutionResults,
        preferences: state.preferences,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
