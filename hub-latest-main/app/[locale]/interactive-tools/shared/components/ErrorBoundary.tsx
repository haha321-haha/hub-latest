'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Download, Home } from 'lucide-react';
import { PainTrackerError } from '../../../../../types/pain-tracker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to analytics or monitoring service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Create error report
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.retryCount
      };

      // Store error report locally for debugging
      const existingReports = JSON.parse(
        localStorage.getItem('pain_tracker_error_reports') || '[]'
      );
      existingReports.push(errorReport);
      
      // Keep only last 10 error reports
      if (existingReports.length > 10) {
        existingReports.splice(0, existingReports.length - 10);
      }
      
      localStorage.setItem('pain_tracker_error_reports', JSON.stringify(existingReports));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    }
  };

  private handleReset = () => {
    this.retryCount = 0;
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private downloadErrorReport = () => {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        componentStack: this.state.errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.retryCount
      };

      const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pain-tracker-error-${this.state.errorId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Failed to download error report:', downloadError);
    }
  };

  private getErrorMessage = (error: Error): { title: string; description: string; suggestions: string[] } => {
    if (error instanceof PainTrackerError) {
      switch (error.code) {
        case 'STORAGE_ERROR':
          return {
            title: 'Storage Error',
            description: 'Unable to save or load your pain tracking data.',
            suggestions: [
              'Check if your browser has enough storage space',
              'Try clearing browser cache and cookies',
              'Export your data as a backup before retrying',
              'Use a different browser if the problem persists'
            ]
          };
        case 'VALIDATION_ERROR':
          return {
            title: 'Data Validation Error',
            description: 'The pain tracking data contains invalid information.',
            suggestions: [
              'Check that all required fields are filled correctly',
              'Ensure pain levels are between 0-10',
              'Verify that dates are not in the future',
              'Review medication and symptom selections'
            ]
          };
        case 'EXPORT_ERROR':
          return {
            title: 'Export Error',
            description: 'Unable to export your pain tracking data.',
            suggestions: [
              'Try exporting a smaller date range',
              'Check if your browser supports file downloads',
              'Try a different export format (HTML instead of PDF)',
              'Ensure you have sufficient storage space'
            ]
          };
        case 'CHART_ERROR':
          return {
            title: 'Chart Display Error',
            description: 'Unable to display charts and visualizations.',
            suggestions: [
              'Try refreshing the page',
              'Check if you have sufficient data for charts',
              'View your data in table format instead',
              'Update your browser to the latest version'
            ]
          };
        case 'DATA_CORRUPTION':
          return {
            title: 'Data Corruption Detected',
            description: 'Your pain tracking data may be corrupted.',
            suggestions: [
              'Try restoring from a recent backup',
              'Export any recoverable data immediately',
              'Clear corrupted data and start fresh if necessary',
              'Contact support if you need help recovering data'
            ]
          };
        case 'QUOTA_EXCEEDED':
          return {
            title: 'Storage Quota Exceeded',
            description: 'Your browser storage is full.',
            suggestions: [
              'Export and delete old pain tracking records',
              'Clear browser cache and cookies',
              'Use browser settings to increase storage quota',
              'Consider using a different browser with more storage'
            ]
          };
        default:
          break;
      }
    }

    // Generic error handling
    return {
      title: 'Unexpected Error',
      description: 'An unexpected error occurred in the pain tracker.',
      suggestions: [
        'Try refreshing the page',
        'Check your internet connection',
        'Clear browser cache and cookies',
        'Try using a different browser',
        'Export your data as a backup'
      ]
    };
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, description, suggestions } = this.getErrorMessage(this.state.error!);
      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {title}
            </h2>
            
            <p className="text-red-700 mb-4">
              {description}
            </p>

            <div className="bg-white p-4 rounded-md border border-red-200 mb-4">
              <h3 className="font-medium text-red-800 mb-2">Suggested Solutions:</h3>
              <ul className="text-sm text-red-700 text-left space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry ({this.maxRetries - this.retryCount} left)
                </button>
              )}
              
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Reset
              </button>
              
              {this.props.showDetails && (
                <button
                  onClick={this.downloadErrorReport}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
              )}
            </div>

            {this.props.showDetails && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error ID:</strong> {this.state.errorId}
                  </div>
                  <div className="mb-2">
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;