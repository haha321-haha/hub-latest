'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationAction } from '../types';

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addSuccessNotification: (title: string, message: string, duration?: number) => string;
  addErrorNotification: (title: string, message: string, duration?: number) => string;
  addWarningNotification: (title: string, message: string, duration?: number) => string;
  addInfoNotification: (title: string, message: string, duration?: number) => string;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // Default 5 seconds
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addSuccessNotification = useCallback((title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }, [addNotification]);

  const addErrorNotification = useCallback((title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration ?? 8000 // Errors stay longer
    });
  }, [addNotification]);

  const addWarningNotification = useCallback((title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }, [addNotification]);

  const addInfoNotification = useCallback((title: string, message: string, duration?: number): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification
  };
};
