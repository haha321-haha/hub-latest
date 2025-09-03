'use client';

import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { NotificationProvider, NotificationContainer } from './NotificationSystem';
import { OfflineNotification, ConnectionStatus } from './OfflineNotification';
import { BackupRestoreSystem } from './BackupRestoreSystem';
import { LoadingOverlay } from './LoadingSystem';
import { useErrorHandling } from '../hooks/useErrorHandling';
import { useOfflineDetection } from '../hooks/useOfflineDetection';
import DataIntegrityService from '../../../../../lib/pain-tracker/storage/DataIntegrityService';
import { Shield, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface ErrorHandlingWrapperProps {
  children: React.ReactNode;
  showConnectionStatus?: boolean;
  showOfflineNotifications?: boolean;
  enableAutoBackup?: boolean;
  enableHealthChecks?: boolean;
  className?: string;
}

export function ErrorHandlingWrapper({
  children,
  showConnectionStatus = true,
  showOfflineNotifications = true,
  enableAutoBackup = true,
  enableHealthChecks = true,
  className = ''
}: ErrorHandlingWrapperProps) {
  const [showBackupSystem, setShowBackupSystem] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'error' | 'checking'>('healthy');
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  const { errorState, handleError, clearError } = useErrorHandling({
    enableAutoRecovery: true,
    enableOfflineMode: true,
    onError: (error) => {
      console.error('Error handled by wrapper:', error);
    },
    onRecovery: (success) => {
      if (success) {
        setHealthStatus('healthy');
      }
    }
  });

  const { isOnline, isOffline } = useOfflineDetection({
    onOffline: () => {
      if (showOfflineNotifications) {
        // Offline notification will be handled by OfflineNotification component
      }
    },
    onOnline: () => {
      // Trigger health check when coming back online
      if (enableHealthChecks) {
        performHealthCheck();
      }
    }
  });

  const dataIntegrityService = new DataIntegrityService();

  // Perform health check
  const performHealthCheck = async () => {
    if (!enableHealthChecks) return;

    setHealthStatus('checking');
    try {
      const report = await dataIntegrityService.checkDataIntegrity();
      
      if (report.isValid) {
        setHealthStatus('healthy');
      } else if (report.corruptionLevel === 'minor') {
        setHealthStatus('warning');
      } else {
        setHealthStatus('error');
      }
      
      setLastHealthCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('error');
      handleError(error as Error, 'health check');
    }
  };

  // Auto backup functionality
  const performAutoBackup = async () => {
    if (!enableAutoBackup) return;

    try {
      const records = JSON.parse(localStorage.getItem('enhanced_pain_tracker_records') || '[]');
      if (records.length === 0) return;

      const lastBackup = localStorage.getItem('enhanced_pain_tracker_last_backup');
      const lastBackupDate = lastBackup ? new Date(lastBackup) : null;
      const now = new Date();
      
      // Auto backup every 7 days
      if (!lastBackupDate || (now.getTime() - lastBackupDate.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        const backupData = {
          records,
          preferences: JSON.parse(localStorage.getItem('enhanced_pain_tracker_preferences') || '{}'),
          metadata: JSON.parse(localStorage.getItem('enhanced_pain_tracker_metadata') || '{}'),
          schemaVersion: 1,
          lastBackup: now
        };

        localStorage.setItem('enhanced_pain_tracker_records_backup', JSON.stringify(backupData));
        localStorage.setItem('enhanced_pain_tracker_last_backup', now.toISOString());
      }
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  };

  // Initialize health checks and auto backup
  useEffect(() => {
    // Initial health check
    performHealthCheck();
    
    // Initial auto backup
    performAutoBackup();

    // Set up periodic health checks (every 10 minutes)
    const healthCheckInterval = setInterval(performHealthCheck, 10 * 60 * 1000);
    
    // Set up periodic auto backup (every hour)
    const backupInterval = setInterval(performAutoBackup, 60 * 60 * 1000);

    return () => {
      clearInterval(healthCheckInterval);
      clearInterval(backupInterval);
    };
  }, []);

  // Listen for custom events
  useEffect(() => {
    const handleExportRequest = () => setShowBackupSystem(true);
    const handleBackupRequest = () => setShowBackupSystem(true);
    const handleCleanupRequest = () => {
      // Implement cleanup logic
      const records = JSON.parse(localStorage.getItem('enhanced_pain_tracker_records') || '[]');
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); // Keep only last year
      
      const filteredRecords = records.filter((record: any) => 
        new Date(record.date) > cutoffDate
      );
      
      localStorage.setItem('enhanced_pain_tracker_records', JSON.stringify(filteredRecords));
      performHealthCheck();
    };

    window.addEventListener('pain-tracker-export-request', handleExportRequest);
    window.addEventListener('pain-tracker-backup-request', handleBackupRequest);
    window.addEventListener('pain-tracker-cleanup-request', handleCleanupRequest);

    return () => {
      window.removeEventListener('pain-tracker-export-request', handleExportRequest);
      window.removeEventListener('pain-tracker-backup-request', handleBackupRequest);
      window.removeEventListener('pain-tracker-cleanup-request', handleCleanupRequest);
    };
  }, []);

  const getHealthStatusIcon = () => {
    switch (healthStatus) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <Shield className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatusText = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'Data Healthy';
      case 'warning':
        return 'Minor Issues';
      case 'error':
        return 'Data Issues';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
    <NotificationProvider>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          handleError(error, 'component error');
        }}
        showDetails={process.env.NODE_ENV === 'development'}
      >
        <div className={`relative ${className}`}>
          {/* Status Bar */}
          {(showConnectionStatus || enableHealthChecks) && (
            <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 text-sm">
              <div className="flex items-center space-x-4">
                {showConnectionStatus && (
                  <ConnectionStatus showDetails={true} />
                )}
                
                {enableHealthChecks && (
                  <div className="flex items-center">
                    {getHealthStatusIcon()}
                    <span className="ml-1">{getHealthStatusText()}</span>
                    {lastHealthCheck && (
                      <span className="ml-2 text-xs text-gray-500">
                        Last check: {lastHealthCheck.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={performHealthCheck}
                  disabled={healthStatus === 'checking'}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                >
                  Check Health
                </button>
                
                <button
                  onClick={() => setShowBackupSystem(true)}
                  className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Settings className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {children}

          {/* Loading Overlay for Recovery Operations */}
          <LoadingOverlay
            isVisible={errorState.isRecovering}
            message="Attempting to recover from error..."
            progress={errorState.recoveryAttempts * 33.33}
          />

          {/* Offline Notifications */}
          {showOfflineNotifications && (
            <OfflineNotification
              storageKey="pain_tracker"
              showConnectionQuality={true}
              autoHide={true}
            />
          )}

          {/* Backup/Restore System Modal */}
          {showBackupSystem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Data Management
                  </h2>
                  <button
                    onClick={() => setShowBackupSystem(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <BackupRestoreSystem
                  onBackupComplete={(success) => {
                    if (success) {
                      performHealthCheck();
                    }
                  }}
                  onRestoreComplete={(success) => {
                    if (success) {
                      performHealthCheck();
                      // Refresh the page to reload with restored data
                      setTimeout(() => window.location.reload(), 1000);
                    }
                  }}
                  onIntegrityCheck={(report) => {
                    if (report.isValid) {
                      setHealthStatus('healthy');
                    } else if (report.corruptionLevel === 'minor') {
                      setHealthStatus('warning');
                    } else {
                      setHealthStatus('error');
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Notification Container */}
          <NotificationContainer position="top-right" />
        </div>
      </ErrorBoundary>
    </NotificationProvider>
  );
}

export default ErrorHandlingWrapper;