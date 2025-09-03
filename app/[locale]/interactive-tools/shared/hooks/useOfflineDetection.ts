'use client';

import { useState, useEffect, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
  offlineDuration: number;
  lastOnlineTime: Date | null;
  connectionType: string | null;
}

interface OfflineDetectionOptions {
  checkInterval?: number;
  pingUrl?: string;
  timeout?: number;
  onOnline?: () => void;
  onOffline?: () => void;
  onReconnect?: (offlineDuration: number) => void;
}

export function useOfflineDetection(options: OfflineDetectionOptions = {}) {
  const {
    checkInterval = 30000, // 30 seconds
    pingUrl = '/favicon.ico',
    timeout = 5000,
    onOnline,
    onOffline,
    onReconnect
  } = options;

  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    wasOffline: false,
    offlineDuration: 0,
    lastOnlineTime: null,
    connectionType: null
  });

  const [offlineStartTime, setOfflineStartTime] = useState<Date | null>(null);

  // Get connection information
  const getConnectionInfo = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
        saveData: connection?.saveData || false
      };
    }
    return null;
  }, []);

  // Ping server to verify actual connectivity
  const pingServer = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(pingUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }, [pingUrl, timeout]);

  // Update online status
  const updateOnlineStatus = useCallback(async (isOnline: boolean, skipPing = false) => {
    // If browser says we're online, verify with server ping
    const actuallyOnline = isOnline && !skipPing ? await pingServer() : isOnline;

    setState(prevState => {
      const now = new Date();
      let offlineDuration = 0;

      // Calculate offline duration if coming back online
      if (actuallyOnline && prevState.isOffline && offlineStartTime) {
        offlineDuration = now.getTime() - offlineStartTime.getTime();
      }

      return {
        ...prevState,
        isOnline: actuallyOnline,
        isOffline: !actuallyOnline,
        wasOffline: prevState.isOffline,
        offlineDuration,
        lastOnlineTime: actuallyOnline ? now : prevState.lastOnlineTime,
        connectionType: getConnectionInfo()?.effectiveType || null
      };
    });

    // Handle state transitions
    if (actuallyOnline && state.isOffline) {
      // Coming back online
      const duration = offlineStartTime ? Date.now() - offlineStartTime.getTime() : 0;
      setOfflineStartTime(null);
      onReconnect?.(duration);
      onOnline?.();
    } else if (!actuallyOnline && state.isOnline) {
      // Going offline
      setOfflineStartTime(new Date());
      onOffline?.();
    }
  }, [state.isOnline, state.isOffline, offlineStartTime, pingServer, getConnectionInfo, onOnline, onOffline, onReconnect]);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false, true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateOnlineStatus]);

  // Periodic connectivity check
  useEffect(() => {
    const interval = setInterval(() => {
      updateOnlineStatus(navigator.onLine);
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, updateOnlineStatus]);

  // Initialize connection info
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      connectionType: getConnectionInfo()?.effectiveType || null
    }));
  }, [getConnectionInfo]);

  // Manual connectivity check
  const checkConnectivity = useCallback(async () => {
    await updateOnlineStatus(navigator.onLine);
  }, [updateOnlineStatus]);

  // Get connection quality assessment
  const getConnectionQuality = useCallback(() => {
    const connectionInfo = getConnectionInfo();
    if (!connectionInfo) return 'unknown';

    const { effectiveType, rtt, downlink } = connectionInfo;

    if (effectiveType === '4g' && rtt < 100 && downlink > 10) return 'excellent';
    if (effectiveType === '4g' && rtt < 200 && downlink > 5) return 'good';
    if (effectiveType === '3g' || (rtt < 500 && downlink > 1)) return 'fair';
    return 'poor';
  }, [getConnectionInfo]);

  return {
    ...state,
    checkConnectivity,
    getConnectionQuality,
    connectionInfo: getConnectionInfo()
  };
}

// Offline Storage Hook
export function useOfflineStorage(key: string) {
  const [offlineData, setOfflineData] = useState<any[]>([]);

  // Load offline data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        setOfflineData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }, [key]);

  // Store data for offline use
  const storeOfflineData = useCallback((data: any) => {
    try {
      const newOfflineData = [...offlineData, {
        ...data,
        timestamp: new Date().toISOString(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }];
      
      setOfflineData(newOfflineData);
      localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
      
      return true;
    } catch (error) {
      console.error('Failed to store offline data:', error);
      return false;
    }
  }, [key, offlineData]);

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    setOfflineData([]);
    localStorage.removeItem(`offline_${key}`);
  }, [key]);

  // Get offline data count
  const getOfflineDataCount = useCallback(() => {
    return offlineData.length;
  }, [offlineData]);

  return {
    offlineData,
    storeOfflineData,
    clearOfflineData,
    getOfflineDataCount
  };
}

export default useOfflineDetection;