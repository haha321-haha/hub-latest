'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useOfflineDetection, useOfflineStorage } from '../hooks/useOfflineDetection';

interface OfflineNotificationProps {
  storageKey?: string;
  showConnectionQuality?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

export function OfflineNotification({ 
  storageKey = 'pain_tracker',
  showConnectionQuality = true,
  autoHide = true,
  autoHideDelay = 5000,
  className = ''
}: OfflineNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [reconnectDuration, setReconnectDuration] = useState(0);

  const { 
    isOnline, 
    isOffline, 
    wasOffline, 
    checkConnectivity, 
    getConnectionQuality,
    connectionInfo 
  } = useOfflineDetection({
    onOffline: () => {
      setIsVisible(true);
      setShowReconnected(false);
    },
    onReconnect: (duration) => {
      setReconnectDuration(duration);
      setShowReconnected(true);
      setIsVisible(true);
      
      if (autoHide) {
        setTimeout(() => {
          setIsVisible(false);
          setShowReconnected(false);
        }, autoHideDelay);
      }
    }
  });

  const { offlineData, getOfflineDataCount } = useOfflineStorage(storageKey);

  // Hide notification when coming back online (after showing reconnected message)
  useEffect(() => {
    if (isOnline && !showReconnected && wasOffline) {
      if (autoHide) {
        setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
      }
    }
  }, [isOnline, showReconnected, wasOffline, autoHide, autoHideDelay]);

  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getConnectionQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <Wifi className="h-4 w-4" />;
      case 'fair': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <WifiOff className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      {isOffline && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <WifiOff className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                You're offline
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Your data will be saved locally and synced when you reconnect.
              </p>
              
              {getOfflineDataCount() > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  {getOfflineDataCount()} items stored offline
                </p>
              )}
              
              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={checkConnectivity}
                  className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Check connection
                </button>
                
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReconnected && isOnline && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">
                Back online!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Connection restored after {formatDuration(reconnectDuration)}.
              </p>
              
              {getOfflineDataCount() > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  {getOfflineDataCount()} offline items ready to sync
                </p>
              )}
              
              {showConnectionQuality && connectionInfo && (
                <div className="mt-2 flex items-center text-xs">
                  <span className="text-green-700 mr-2">Connection:</span>
                  <div className={`flex items-center ${getConnectionQualityColor(getConnectionQuality())}`}>
                    {getConnectionQualityIcon(getConnectionQuality())}
                    <span className="ml-1 capitalize">{getConnectionQuality()}</span>
                    {connectionInfo.effectiveType && (
                      <span className="ml-1">({connectionInfo.effectiveType})</span>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setIsVisible(false);
                  setShowReconnected(false);
                }}
                className="mt-2 text-xs text-green-600 hover:text-green-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Connection Status Indicator Component
interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({ showDetails = false, className = '' }: ConnectionStatusProps) {
  const { isOnline, getConnectionQuality, connectionInfo } = useOfflineDetection();
  const quality = getConnectionQuality();

  const getConnectionQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="ml-1 text-sm">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {showDetails && isOnline && connectionInfo && (
        <div className={`ml-3 text-xs ${getConnectionQualityColor(quality)}`}>
          <span className="capitalize">{quality}</span>
          {connectionInfo.effectiveType && (
            <span className="ml-1">({connectionInfo.effectiveType})</span>
          )}
        </div>
      )}
    </div>
  );
}

// Offline Data Sync Component
interface OfflineDataSyncProps {
  storageKey: string;
  onSync?: (data: any[]) => Promise<boolean>;
  className?: string;
}

export function OfflineDataSync({ storageKey, onSync, className = '' }: OfflineDataSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const { isOnline } = useOfflineDetection();
  const { offlineData, clearOfflineData, getOfflineDataCount } = useOfflineStorage(storageKey);

  const handleSync = async () => {
    if (!onSync || !isOnline || getOfflineDataCount() === 0) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const success = await onSync(offlineData);
      if (success) {
        clearOfflineData();
        setLastSyncTime(new Date());
      } else {
        setSyncError('Sync failed. Please try again.');
      }
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (getOfflineDataCount() === 0) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-sm text-blue-800">
            {getOfflineDataCount()} items pending sync
          </span>
        </div>
        
        {isOnline && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync now'}
          </button>
        )}
      </div>
      
      {syncError && (
        <p className="text-xs text-red-600 mt-2">{syncError}</p>
      )}
      
      {lastSyncTime && (
        <p className="text-xs text-blue-600 mt-1">
          Last synced: {lastSyncTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default OfflineNotification;