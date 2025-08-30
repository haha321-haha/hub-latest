'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 应用主题类型
export type Theme = 'light' | 'dark' | 'system';

// 用户偏好设置
export interface UserPreferences {
  theme: Theme;
  language: 'zh' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  notifications: {
    browser: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
    dataSharing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

// 应用状态
export interface AppState {
  // 用户偏好
  preferences: UserPreferences;
  
  // UI状态
  ui: {
    sidebarOpen: boolean;
    loading: boolean;
    error: string | null;
    modal: {
      isOpen: boolean;
      type: string | null;
      data: any;
    };
    toast: {
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      duration?: number;
    }[];
  };
  
  // 应用数据
  data: {
    lastSync: string | null;
    version: string;
    buildTime: string;
  };
  
  // 性能监控
  performance: {
    pageLoadTime: number;
    apiResponseTimes: Record<string, number>;
    errorCount: number;
  };
}

// Actions接口
export interface AppActions {
  // 偏好设置
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // UI控制
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 模态框控制
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  
  // Toast通知
  addToast: (toast: Omit<AppState['ui']['toast'][0], 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // 数据同步
  updateLastSync: () => void;
  
  // 性能监控
  recordPageLoadTime: (time: number) => void;
  recordApiResponseTime: (endpoint: string, time: number) => void;
  incrementErrorCount: () => void;
  resetPerformanceMetrics: () => void;
  
  // 错误记录
  recordError: (error: {
    message: string;
    stack?: string | null;
    componentStack?: string | null;
    level?: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }) => void;
  
  // 模态框操作记录
  recordModalAction: (action: {
    action: 'open' | 'close';
    modalId?: string;
    modalType?: string;
    timestamp: string;
  }) => void;
  
  // Toast操作记录
  recordToastAction: (action: {
    action: 'add' | 'remove' | 'clear';
    toastId?: string;
    toastType?: string;
    timestamp: string;
  }) => void;
}

// 默认偏好设置
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'zh',
  fontSize: 'medium',
  animations: true,
  notifications: {
    browser: true,
    email: false,
    sms: false,
  },
  privacy: {
    analytics: true,
    cookies: true,
    dataSharing: false,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
  },
};

// 默认应用状态
const defaultState: AppState = {
  preferences: defaultPreferences,
  ui: {
    sidebarOpen: false,
    loading: false,
    error: null,
    modal: {
      isOpen: false,
      type: null,
      data: null,
    },
    toast: [],
  },
  data: {
    lastSync: null,
    version: '1.0.0',
    buildTime: new Date().toISOString(),
  },
  performance: {
    pageLoadTime: 0,
    apiResponseTimes: {},
    errorCount: 0,
  },
};

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 创建应用Store
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...defaultState,
        
        // 偏好设置Actions
        updatePreferences: (newPreferences) => {
          set((state) => {
            Object.assign(state.preferences, newPreferences);
          });
        },
        
        resetPreferences: () => {
          set((state) => {
            state.preferences = defaultPreferences;
          });
        },
        
        // UI控制Actions
        setSidebarOpen: (open) => {
          set((state) => {
            state.ui.sidebarOpen = open;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
          });
        },
        
        setLoading: (loading) => {
          set((state) => {
            state.ui.loading = loading;
          });
        },
        
        setError: (error) => {
          set((state) => {
            state.ui.error = error;
          });
        },
        
        // 模态框控制Actions
        openModal: (type, data = null) => {
          set((state) => {
            state.ui.modal = {
              isOpen: true,
              type,
              data,
            };
          });
        },
        
        closeModal: () => {
          set((state) => {
            state.ui.modal = {
              isOpen: false,
              type: null,
              data: null,
            };
          });
        },
        
        // Toast通知Actions
        addToast: (toast) => {
          const id = generateId();
          set((state) => {
            state.ui.toast.push({ ...toast, id });
          });
          
          // 自动移除Toast
          if (toast.duration !== 0) {
            setTimeout(() => {
              get().removeToast(id);
            }, toast.duration || 5000);
          }
          
          return id;
        },
        
        removeToast: (id) => {
          set((state) => {
            state.ui.toast = state.ui.toast.filter(t => t.id !== id);
          });
        },
        
        clearToasts: () => {
          set((state) => {
            state.ui.toast = [];
          });
        },
        
        // 数据同步Actions
        updateLastSync: () => {
          set((state) => {
            state.data.lastSync = new Date().toISOString();
          });
        },
        
        // 性能监控Actions
        recordPageLoadTime: (time) => {
          set((state) => {
            state.performance.pageLoadTime = time;
          });
        },
        
        recordApiResponseTime: (endpoint, time) => {
          set((state) => {
            state.performance.apiResponseTimes[endpoint] = time;
          });
        },
        
        incrementErrorCount: () => {
          set((state) => {
            state.performance.errorCount += 1;
          });
        },
        
        resetPerformanceMetrics: () => {
          set((state) => {
            state.performance = {
              pageLoadTime: 0,
              apiResponseTimes: {},
              errorCount: 0,
            };
          });
        },
        
        // 错误记录
        recordError: (error) => {
          set((state) => {
            // 增加错误计数
            state.performance.errorCount += 1;
            
            // 记录错误到UI状态
            state.ui.error = error.message;
            
            // 可以在这里添加更详细的错误日志记录
            console.error('App Error Recorded:', error);
          });
        },
        
        // 模态框操作记录
        recordModalAction: (action) => {
          set((state) => {
            // 记录模态框操作到性能监控
            console.log('Modal Action Recorded:', action);
          });
        },
        
        // Toast操作记录
        recordToastAction: (action) => {
          set((state) => {
            // 记录Toast操作到性能监控
            console.log('Toast Action Recorded:', action);
          });
        },
      })),
      {
        name: 'periodhub-app-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          preferences: state.preferences,
          data: {
            lastSync: state.data.lastSync,
            version: state.data.version,
          },
        }),
      }
    ),
    {
      name: 'PeriodHub App Store',
    }
  )
);

// 选择器Hooks
export const useAppPreferences = () => useAppStore((state) => state.preferences);
export const useAppUI = () => useAppStore((state) => state.ui);
export const useAppData = () => useAppStore((state) => state.data);
export const useAppPerformance = () => useAppStore((state) => state.performance);

// 便捷Hooks
export const useTheme = () => useAppStore((state) => state.preferences.theme);
export const useLanguage = () => useAppStore((state) => state.preferences.language);
export const useLoading = () => useAppStore((state) => state.ui.loading);
export const useError = () => useAppStore((state) => state.ui.error);
export const useToasts = () => useAppStore((state) => state.ui.toast);
