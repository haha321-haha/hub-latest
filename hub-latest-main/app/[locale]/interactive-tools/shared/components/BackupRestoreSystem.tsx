'use client';

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Database,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner, ProgressBar } from './LoadingSystem';
import { useLoadingState } from './LoadingSystem';
import DataIntegrityService, { DataIntegrityReport } from '../../../../../lib/pain-tracker/storage/DataIntegrityService';
import { PainTrackerError, StoredData } from '../../../../../types/pain-tracker';

interface BackupRestoreSystemProps {
  onBackupComplete?: (success: boolean) => void;
  onRestoreComplete?: (success: boolean) => void;
  onIntegrityCheck?: (report: DataIntegrityReport) => void;
  className?: string;
}

export function BackupRestoreSystem({
  onBackupComplete,
  onRestoreComplete,
  onIntegrityCheck,
  className = ''
}: BackupRestoreSystemProps) {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'integrity'>('backup');
  const [backupData, setBackupData] = useState<string | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [integrityReport, setIntegrityReport] = useState<DataIntegrityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataIntegrityService = new DataIntegrityService();

  const {
    isLoading: backupLoading,
    progress: backupProgress,
    message: backupMessage,
    startLoading: startBackupLoading,
    updateProgress: updateBackupProgress,
    finishLoading: finishBackupLoading,
    setLoadingError: setBackupError
  } = useLoadingState();

  const {
    isLoading: restoreLoading,
    progress: restoreProgress,
    message: restoreMessage,
    startLoading: startRestoreLoading,
    updateProgress: updateRestoreProgress,
    finishLoading: finishRestoreLoading,
    setLoadingError: setRestoreError
  } = useLoadingState();

  const {
    isLoading: integrityLoading,
    startLoading: startIntegrityLoading,
    finishLoading: finishIntegrityLoading,
    setLoadingError: setIntegrityError
  } = useLoadingState();

  // Create backup
  const handleCreateBackup = async () => {
    setError(null);
    setSuccess(null);
    startBackupLoading('Creating backup...');

    try {
      updateBackupProgress(20, 'Reading pain tracker data...');
      
      // Get all pain tracker data
      const records = JSON.parse(localStorage.getItem('enhanced_pain_tracker_records') || '[]');
      const preferences = JSON.parse(localStorage.getItem('enhanced_pain_tracker_preferences') || '{}');
      const metadata = JSON.parse(localStorage.getItem('enhanced_pain_tracker_metadata') || '{}');

      updateBackupProgress(50, 'Preparing backup data...');

      const backupData: StoredData = {
        records,
        preferences,
        schemaVersion: 1,
        lastBackup: new Date(),
        metadata: {
          ...metadata,
          backupCreated: new Date(),
          recordCount: records.length,
          version: '1.0.0'
        }
      };

      updateBackupProgress(80, 'Generating backup file...');

      const backupJson = JSON.stringify(backupData, null, 2);
      setBackupData(backupJson);

      updateBackupProgress(100, 'Backup created successfully!');
      finishBackupLoading();

      setSuccess('Backup created successfully! You can now download it.');
      onBackupComplete?.(true);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create backup';
      setBackupError(errorMessage);
      setError(errorMessage);
      onBackupComplete?.(false);
    }
  };

  // Download backup file
  const handleDownloadBackup = () => {
    if (!backupData) return;

    try {
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pain-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Backup file downloaded successfully!');
    } catch (error) {
      setError('Failed to download backup file');
    }
  };

  // Handle file selection for restore
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setRestoreFile(file);
        setError(null);
      } else {
        setError('Please select a valid JSON backup file');
        setRestoreFile(null);
      }
    }
  };

  // Restore from backup
  const handleRestore = async () => {
    if (!restoreFile) return;

    setError(null);
    setSuccess(null);
    startRestoreLoading('Restoring from backup...');

    try {
      updateRestoreProgress(20, 'Reading backup file...');

      const fileContent = await restoreFile.text();
      const backupData: StoredData = JSON.parse(fileContent);

      updateRestoreProgress(40, 'Validating backup data...');

      // Validate backup structure
      if (!backupData.records || !Array.isArray(backupData.records)) {
        throw new Error('Invalid backup file: missing or invalid records');
      }

      updateRestoreProgress(60, 'Creating safety backup...');

      // Create safety backup of current data
      const currentRecords = localStorage.getItem('enhanced_pain_tracker_records');
      if (currentRecords) {
        localStorage.setItem('enhanced_pain_tracker_records_safety', currentRecords);
      }

      updateRestoreProgress(80, 'Restoring data...');

      // Restore data
      localStorage.setItem('enhanced_pain_tracker_records', JSON.stringify(backupData.records));
      
      if (backupData.preferences) {
        localStorage.setItem('enhanced_pain_tracker_preferences', JSON.stringify(backupData.preferences));
      }

      if (backupData.metadata) {
        localStorage.setItem('enhanced_pain_tracker_metadata', JSON.stringify({
          ...backupData.metadata,
          restoredAt: new Date(),
          restoredFrom: restoreFile.name
        }));
      }

      updateRestoreProgress(100, 'Restore completed successfully!');
      finishRestoreLoading();

      setSuccess(`Successfully restored ${backupData.records.length} records from backup!`);
      setRestoreFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onRestoreComplete?.(true);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore from backup';
      setRestoreError(errorMessage);
      setError(errorMessage);
      onRestoreComplete?.(false);
    }
  };

  // Check data integrity
  const handleIntegrityCheck = async () => {
    setError(null);
    setSuccess(null);
    startIntegrityLoading('Checking data integrity...');

    try {
      const report = await dataIntegrityService.checkDataIntegrity();
      setIntegrityReport(report);
      finishIntegrityLoading();

      if (report.isValid) {
        setSuccess('Data integrity check passed! Your data is healthy.');
      } else {
        setError(`Data integrity issues detected: ${report.corruptionLevel} corruption level`);
      }

      onIntegrityCheck?.(report);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check data integrity';
      setIntegrityError(errorMessage);
      setError(errorMessage);
    }
  };

  // Execute recovery option
  const handleRecoveryAction = async (action: () => Promise<boolean>, description: string) => {
    setError(null);
    setSuccess(null);
    startIntegrityLoading(`Executing: ${description}...`);

    try {
      const success = await action();
      finishIntegrityLoading();

      if (success) {
        setSuccess(`Recovery action completed: ${description}`);
        // Re-check integrity after recovery
        setTimeout(() => handleIntegrityCheck(), 1000);
      } else {
        setError(`Recovery action failed: ${description}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Recovery action failed';
      setIntegrityError(errorMessage);
      setError(errorMessage);
    }
  };

  const getCorruptionLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-green-600';
      case 'minor': return 'text-yellow-600';
      case 'moderate': return 'text-orange-600';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCorruptionLevelIcon = (level: string) => {
    switch (level) {
      case 'none': return <CheckCircle className="h-5 w-5" />;
      case 'minor': return <Clock className="h-5 w-5" />;
      case 'moderate': return <AlertTriangle className="h-5 w-5" />;
      case 'severe': return <AlertTriangle className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'backup', label: 'Backup', icon: Download },
            { id: 'restore', label: 'Restore', icon: Upload },
            { id: 'integrity', label: 'Data Health', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-green-800 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Data Backup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a backup of all your pain tracking data, including records, preferences, and settings.
              </p>
            </div>

            {backupLoading && (
              <div className="space-y-2">
                <ProgressBar progress={backupProgress} label={backupMessage} />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {backupLoading ? (
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Create Backup
              </button>

              {backupData && (
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </button>
              )}
            </div>

            {backupData && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Backup created successfully! The backup contains {JSON.parse(backupData).records?.length || 0} records.
                  Click "Download Backup" to save the file to your device.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Restore Tab */}
        {activeTab === 'restore' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Restore from Backup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Restore your pain tracking data from a previously created backup file.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="backup-file" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Select backup file
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">
                      Choose a JSON backup file to restore
                    </span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="backup-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>

            {restoreFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  Selected file: {restoreFile.name} ({(restoreFile.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}

            {restoreLoading && (
              <div className="space-y-2">
                <ProgressBar progress={restoreProgress} label={restoreMessage} />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleRestore}
                disabled={!restoreFile || restoreLoading}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {restoreLoading ? (
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Restore Data
              </button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Restoring from backup will replace all current data. 
                  A safety backup of your current data will be created automatically.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Integrity Tab */}
        {activeTab === 'integrity' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Health Check</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check your pain tracking data for corruption, missing fields, or other integrity issues.
              </p>
            </div>

            <button
              onClick={handleIntegrityCheck}
              disabled={integrityLoading}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {integrityLoading ? (
                <LoadingSpinner size="sm" color="white" className="mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Check Data Integrity
            </button>

            {integrityReport && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Integrity Report</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{integrityReport.totalRecords}</div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{integrityReport.validRecords}</div>
                      <div className="text-sm text-gray-600">Valid Records</div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-center p-3 rounded-md ${
                    integrityReport.corruptionLevel === 'none' ? 'bg-green-50' :
                    integrityReport.corruptionLevel === 'minor' ? 'bg-yellow-50' :
                    integrityReport.corruptionLevel === 'moderate' ? 'bg-orange-50' :
                    'bg-red-50'
                  }`}>
                    <div className={getCorruptionLevelColor(integrityReport.corruptionLevel)}>
                      {getCorruptionLevelIcon(integrityReport.corruptionLevel)}
                    </div>
                    <span className={`ml-2 font-medium capitalize ${getCorruptionLevelColor(integrityReport.corruptionLevel)}`}>
                      {integrityReport.corruptionLevel} Corruption Level
                    </span>
                  </div>

                  {integrityReport.corruptedRecords.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-red-800 mb-2">Issues Found:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        {integrityReport.invalidData.slice(0, 5).map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {issue}
                          </li>
                        ))}
                        {integrityReport.invalidData.length > 5 && (
                          <li className="text-red-600">
                            ... and {integrityReport.invalidData.length - 5} more issues
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {integrityReport.recoveryOptions.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Recovery Options</h4>
                    <div className="space-y-3">
                      {integrityReport.recoveryOptions.map((option, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.description}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Risk: <span className={`font-medium ${
                                option.riskLevel === 'low' ? 'text-green-600' :
                                option.riskLevel === 'medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>{option.riskLevel}</span>
                              {' • '}
                              Recovery: {option.estimatedRecovery}%
                              {option.dataLoss && ' • Data loss possible'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRecoveryAction(option.action, option.description)}
                            disabled={integrityLoading}
                            className={`ml-4 px-3 py-1 text-sm rounded transition-colors ${
                              option.riskLevel === 'low' ? 'bg-green-600 hover:bg-green-700 text-white' :
                              option.riskLevel === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                              'bg-red-600 hover:bg-red-700 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {integrityLoading ? (
                              <LoadingSpinner size="sm" color="white" />
                            ) : (
                              'Execute'
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BackupRestoreSystem;