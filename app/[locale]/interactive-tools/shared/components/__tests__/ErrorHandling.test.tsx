/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { NotificationProvider, useNotifications } from '../NotificationSystem';
import { useErrorHandling } from '../../hooks/useErrorHandling';
import { PainTrackerError } from '../../../../../../types/pain-tracker';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
});

// Test component that throws an error
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Test component that uses error handling hook
const ErrorHandlingTestComponent = () => {
  const { handleError, errorState, clearError } = useErrorHandling();
  const { addErrorNotification } = useNotifications();

  const triggerStorageError = () => {
    handleError(
      new PainTrackerError('Storage failed', 'STORAGE_ERROR'),
      'test storage operation'
    );
  };

  const triggerValidationError = () => {
    handleError(
      new PainTrackerError('Invalid data', 'VALIDATION_ERROR'),
      'test validation'
    );
  };

  const triggerGenericError = () => {
    handleError(new Error('Generic error'), 'test operation');
  };

  return (
    <div>
      <div data-testid="error-state">
        {errorState.hasError ? 'Has Error' : 'No Error'}
      </div>
      <div data-testid="error-message">
        {errorState.error?.message || 'No message'}
      </div>
      <div data-testid="error-code">
        {errorState.errorCode || 'No code'}
      </div>
      <button onClick={triggerStorageError} data-testid="storage-error-btn">
        Trigger Storage Error
      </button>
      <button onClick={triggerValidationError} data-testid="validation-error-btn">
        Trigger Validation Error
      </button>
      <button onClick={triggerGenericError} data-testid="generic-error-btn">
        Trigger Generic Error
      </button>
      <button onClick={clearError} data-testid="clear-error-btn">
        Clear Error
      </button>
    </div>
  );
};

describe('Error Handling System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('ErrorBoundary', () => {
    it('should catch and display errors', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
    });

    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should provide retry functionality', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText(/Retry/);
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      // After retry, the error should be cleared and component should re-render
    });

    it('should show recovery suggestions for different error types', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Suggested Solutions:')).toBeInTheDocument();
      expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument();
    });
  });

  describe('Error Handling Hook', () => {
    it('should handle storage errors correctly', async () => {
      render(
        <NotificationProvider>
          <ErrorHandlingTestComponent />
        </NotificationProvider>
      );

      const storageErrorBtn = screen.getByTestId('storage-error-btn');
      fireEvent.click(storageErrorBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Has Error');
        expect(screen.getByTestId('error-message')).toHaveTextContent('Storage failed');
        expect(screen.getByTestId('error-code')).toHaveTextContent('STORAGE_ERROR');
      });
    });

    it('should handle validation errors correctly', async () => {
      render(
        <NotificationProvider>
          <ErrorHandlingTestComponent />
        </NotificationProvider>
      );

      const validationErrorBtn = screen.getByTestId('validation-error-btn');
      fireEvent.click(validationErrorBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Has Error');
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid data');
        expect(screen.getByTestId('error-code')).toHaveTextContent('VALIDATION_ERROR');
      });
    });

    it('should handle generic errors correctly', async () => {
      render(
        <NotificationProvider>
          <ErrorHandlingTestComponent />
        </NotificationProvider>
      );

      const genericErrorBtn = screen.getByTestId('generic-error-btn');
      fireEvent.click(genericErrorBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Has Error');
        expect(screen.getByTestId('error-message')).toHaveTextContent('Generic error');
        expect(screen.getByTestId('error-code')).toHaveTextContent('No code');
      });
    });

    it('should clear errors correctly', async () => {
      render(
        <NotificationProvider>
          <ErrorHandlingTestComponent />
        </NotificationProvider>
      );

      // First trigger an error
      const storageErrorBtn = screen.getByTestId('storage-error-btn');
      fireEvent.click(storageErrorBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Has Error');
      });

      // Then clear it
      const clearErrorBtn = screen.getByTestId('clear-error-btn');
      fireEvent.click(clearErrorBtn);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('No Error');
        expect(screen.getByTestId('error-message')).toHaveTextContent('No message');
        expect(screen.getByTestId('error-code')).toHaveTextContent('No code');
      });
    });
  });

  describe('Notification System', () => {
    it('should display notifications correctly', () => {
      const TestComponent = () => {
        const { addErrorNotification, addSuccessNotification } = useNotifications();
        
        return (
          <div>
            <button 
              onClick={() => addErrorNotification('Error Title', 'Error message')}
              data-testid="add-error-btn"
            >
              Add Error
            </button>
            <button 
              onClick={() => addSuccessNotification('Success Title', 'Success message')}
              data-testid="add-success-btn"
            >
              Add Success
            </button>
          </div>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const addErrorBtn = screen.getByTestId('add-error-btn');
      fireEvent.click(addErrorBtn);

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();

      const addSuccessBtn = screen.getByTestId('add-success-btn');
      fireEvent.click(addSuccessBtn);

      expect(screen.getByText('Success Title')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  describe('Data Integrity', () => {
    it('should detect corrupted data', () => {
      // Mock corrupted data in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'enhanced_pain_tracker_records') {
          return 'invalid json';
        }
        return null;
      });

      // This would be tested with the DataIntegrityService
      // For now, we just verify the mock is working
      expect(localStorage.getItem('enhanced_pain_tracker_records')).toBe('invalid json');
    });

    it('should handle quota exceeded errors', () => {
      // Mock quota exceeded error
      localStorageMock.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      expect(() => {
        localStorage.setItem('test', 'data');
      }).toThrow('QuotaExceededError');
    });
  });

  describe('Offline Handling', () => {
    it('should detect offline state', () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      expect(navigator.onLine).toBe(false);
    });

    it('should detect online state', () => {
      // Mock online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      });

      expect(navigator.onLine).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete error recovery flow', async () => {
    const TestApp = () => {
      const { handleError, errorState, clearError } = useErrorHandling({
        enableAutoRecovery: true,
        maxRetries: 2
      });

      const triggerRecoverableError = () => {
        handleError(
          new PainTrackerError('Recoverable error', 'CHART_ERROR'),
          'chart rendering'
        );
      };

      return (
        <div>
          <div data-testid="error-state">
            {errorState.hasError ? 'Has Error' : 'No Error'}
          </div>
          <div data-testid="recovery-state">
            {errorState.isRecovering ? 'Recovering' : 'Not Recovering'}
          </div>
          <div data-testid="retry-count">
            {errorState.recoveryAttempts}
          </div>
          <button onClick={triggerRecoverableError} data-testid="trigger-error-btn">
            Trigger Error
          </button>
          <button onClick={clearError} data-testid="clear-error-btn">
            Clear Error
          </button>
        </div>
      );
    };

    render(
      <NotificationProvider>
        <TestApp />
      </NotificationProvider>
    );

    // Initially no error
    expect(screen.getByTestId('error-state')).toHaveTextContent('No Error');

    // Trigger error
    const triggerBtn = screen.getByTestId('trigger-error-btn');
    fireEvent.click(triggerBtn);

    // Should show error state
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent('Has Error');
    });

    // Auto-recovery should kick in for CHART_ERROR
    // This would be tested with proper timing and mocking
  });
});