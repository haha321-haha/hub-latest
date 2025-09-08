'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Loading"
    />
  );
}

// Loading Overlay Component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  onCancel?: () => void;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...', 
  progress,
  onCancel,
  className = '' 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-700 text-center">{message}</p>
          
          {progress !== undefined && (
            <div className="w-full mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Loading State Component
interface InlineLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function InlineLoading({ 
  isLoading, 
  children, 
  loadingText = 'Loading...', 
  className = '' 
}: InlineLoadingProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <LoadingSpinner size="sm" className="mr-2" />
        <span className="text-gray-600">{loadingText}</span>
      </div>
    );
  }

  return <>{children}</>;
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true, 
  color = 'blue',
  size = 'md',
  className = '' 
}: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Step Progress Component
interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface StepProgressProps {
  steps: Step[];
  className?: string;
}

export function StepProgress({ steps, className = '' }: StepProgressProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-full mr-3 flex-shrink-0">
            {step.status === 'completed' && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {step.status === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            {step.status === 'active' && (
              <LoadingSpinner size="sm" />
            )}
            {step.status === 'pending' && (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className={`text-sm ${
            step.status === 'completed' ? 'text-green-700' :
            step.status === 'error' ? 'text-red-700' :
            step.status === 'active' ? 'text-blue-700' :
            'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Skeleton Loading Component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  variant = 'rectangular' 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Loading State Hook
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startLoading = (loadingMessage = 'Loading...') => {
    setIsLoading(true);
    setProgress(0);
    setMessage(loadingMessage);
    setError(null);
  };

  const updateProgress = (newProgress: number, newMessage?: string) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
    if (newMessage) {
      setMessage(newMessage);
    }
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setMessage('');
    }, 500);
  };

  const setLoadingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const reset = () => {
    setIsLoading(false);
    setProgress(0);
    setMessage('');
    setError(null);
  };

  return {
    isLoading,
    progress,
    message,
    error,
    startLoading,
    updateProgress,
    finishLoading,
    setLoadingError,
    reset
  };
}

// Async Operation Wrapper Component
interface AsyncOperationProps {
  operation: () => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  children: (state: {
    execute: () => void;
    isLoading: boolean;
    error: string | null;
    result: any;
  }) => React.ReactNode;
}

export function AsyncOperation({ 
  operation, 
  onSuccess, 
  onError, 
  loadingMessage = 'Processing...', 
  children 
}: AsyncOperationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const operationResult = await operation();
      setResult(operationResult);
      if (onSuccess) {
        onSuccess(operationResult);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children({ execute, isLoading, error, result })}
      <LoadingOverlay 
        isVisible={isLoading} 
        message={loadingMessage}
      />
    </>
  );
}

export default {
  LoadingSpinner,
  LoadingOverlay,
  InlineLoading,
  ProgressBar,
  StepProgress,
  Skeleton,
  useLoadingState,
  AsyncOperation
};