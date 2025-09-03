'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Wifi,
  WifiOff,
  Shield,
  Database,
  RefreshCw
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'offline' | 'online' | 'data_issue';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 for persistent
  actions?: NotificationAction[];
  timestamp: Date;
  persistent?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addSuccessNotification: (title: string, message: string, actions?: NotificationAction[]) => string;
  addErrorNotification: (title: string, message: string, actions?: NotificationAction[]) => string;
  addWarningNotification: (title: string, message: string, actions?: NotificationAction[]) => string;
  addInfoNotification: (title: string, message: string, actions?: NotificationAction[]) => string;
  addOfflineNotification: (message?: string) => string;
  addOnlineNotification: (message?: string) => string;
  addDataIssueNotification: (title: string, message: string, actions?: NotificationAction[]) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export function NotificationProvider({ 
  children, 
  maxNotifications = 5,
  defaultDuration = 5000 
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? defaultDuration
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Remove oldest notifications if exceeding max
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      return updated;
    });

    // Auto-remove notification after duration (if not persistent)
    if (newNotification.duration && newNotification.duration > 0 && !newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addSuccessNotification = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'success',
      title,
      message,
      actions,
      priority: 'medium'
    });
  }, [addNotification]);

  const addErrorNotification = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'error',
      title,
      message,
      actions,
      persistent: true,
      priority: 'high'
    });
  }, [addNotification]);

  const addWarningNotification = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      actions,
      duration: 8000,
      priority: 'medium'
    });
  }, [addNotification]);

  const addInfoNotification = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'info',
      title,
      message,
      actions,
      priority: 'low'
    });
  }, [addNotification]);

  const addOfflineNotification = useCallback((message = 'You are currently offline. Data will be saved locally.') => {
    return addNotification({
      type: 'offline',
      title: 'Offline Mode',
      message,
      persistent: true,
      priority: 'high'
    });
  }, [addNotification]);

  const addOnlineNotification = useCallback((message = 'Connection restored. Your data will be synced.') => {
    return addNotification({
      type: 'online',
      title: 'Back Online',
      message,
      duration: 3000,
      priority: 'medium'
    });
  }, [addNotification]);

  const addDataIssueNotification = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'data_issue',
      title,
      message,
      actions,
      persistent: true,
      priority: 'high'
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    addOfflineNotification,
    addOnlineNotification,
    addDataIssueNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Individual Notification Component
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Info,
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      case 'offline':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: WifiOff,
          iconColor: 'text-gray-500',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700'
        };
      case 'online':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: Wifi,
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'data_issue':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: Shield,
          iconColor: 'text-purple-500',
          titleColor: 'text-purple-800',
          messageColor: 'text-purple-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Info,
          iconColor: 'text-gray-500',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700'
        };
    }
  };

  const styles = getNotificationStyles(notification.type);
  const Icon = styles.icon;

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 mb-3 max-w-sm`}>
        <div className="flex items-start">
          <Icon className={`h-5 w-5 ${styles.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.titleColor}`}>
              {notification.title}
            </h4>
            <p className={`text-sm ${styles.messageColor} mt-1`}>
              {notification.message}
            </p>
            
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`text-xs px-3 py-1 rounded transition-colors ${
                      action.style === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : action.style === 'danger'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
          
          <button
            onClick={handleRemove}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Notification Container Component
interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export function NotificationContainer({ 
  position = 'top-right', 
  className = '' 
}: NotificationContainerProps) {
  const { notifications, removeNotification } = useNotifications();

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50';
      case 'top-left':
        return 'fixed top-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50';
      default:
        return 'fixed top-4 right-4 z-50';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`${getPositionClasses(position)} ${className}`}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}

// Toast Hook for quick notifications
export function useToast() {
  const { 
    addSuccessNotification, 
    addErrorNotification, 
    addWarningNotification, 
    addInfoNotification 
  } = useNotifications();

  const toast = {
    success: (message: string, title = 'Success') => addSuccessNotification(title, message),
    error: (message: string, title = 'Error') => addErrorNotification(title, message),
    warning: (message: string, title = 'Warning') => addWarningNotification(title, message),
    info: (message: string, title = 'Info') => addInfoNotification(title, message)
  };

  return toast;
}

// Recovery Notification Hook
export function useRecoveryNotifications() {
  const { addDataIssueNotification, addWarningNotification, addErrorNotification } = useNotifications();

  const notifyDataCorruption = (corruptionLevel: string, recoveryOptions: any[]) => {
    const actions = recoveryOptions.slice(0, 2).map(option => ({
      label: option.type === 'repair' ? 'Repair' : option.type === 'restore' ? 'Restore' : 'Fix',
      action: option.action,
      style: option.riskLevel === 'low' ? 'primary' : 'secondary'
    })) as NotificationAction[];

    return addDataIssueNotification(
      'Data Integrity Issue',
      `${corruptionLevel} corruption detected in your pain tracking data.`,
      actions
    );
  };

  const notifyStorageQuotaExceeded = (onExport: () => void, onCleanup: () => void) => {
    return addWarningNotification(
      'Storage Almost Full',
      'Your browser storage is nearly full. Consider exporting old data.',
      [
        { label: 'Export Data', action: onExport, style: 'primary' },
        { label: 'Cleanup', action: onCleanup, style: 'secondary' }
      ]
    );
  };

  const notifyBackupRecommended = (onBackup: () => void) => {
    return addWarningNotification(
      'Backup Recommended',
      'It\'s been a while since your last backup. Consider creating one now.',
      [
        { label: 'Create Backup', action: onBackup, style: 'primary' }
      ]
    );
  };

  const notifyRecoverySuccess = (recoveredCount: number) => {
    return addDataIssueNotification(
      'Recovery Complete',
      `Successfully recovered ${recoveredCount} records from corrupted data.`,
      []
    );
  };

  const notifyRecoveryFailed = (onRetry: () => void, onSupport: () => void) => {
    return addErrorNotification(
      'Recovery Failed',
      'Unable to recover your data automatically. Manual intervention may be required.',
      [
        { label: 'Retry', action: onRetry, style: 'primary' },
        { label: 'Get Help', action: onSupport, style: 'secondary' }
      ]
    );
  };

  return {
    notifyDataCorruption,
    notifyStorageQuotaExceeded,
    notifyBackupRecommended,
    notifyRecoverySuccess,
    notifyRecoveryFailed
  };
}

export default NotificationContainer;