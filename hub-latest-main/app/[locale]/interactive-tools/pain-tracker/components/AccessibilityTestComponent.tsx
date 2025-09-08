'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../shared/hooks/useAccessibility';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  suggestion?: string;
}

interface AccessibilityTestComponentProps {
  enabled?: boolean;
  showResults?: boolean;
}

export default function AccessibilityTestComponent({ 
  enabled = process.env.NODE_ENV === 'development',
  showResults = false 
}: AccessibilityTestComponentProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { validateAriaAttributes } = useAccessibility();

  const runAccessibilityTests = () => {
    if (!enabled) return;
    
    setIsRunning(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Test 1: Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        foundIssues.push({
          type: 'error',
          element: `img[${index}]`,
          message: 'Image missing alt text',
          suggestion: 'Add descriptive alt text or aria-hidden="true" for decorative images'
        });
      }
    });

    // Test 2: Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1 && previousLevel !== 0) {
        foundIssues.push({
          type: 'warning',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          message: `Heading level ${level} follows h${previousLevel}, skipping levels`,
          suggestion: `Consider using h${previousLevel + 1} instead`
        });
      }
      previousLevel = level;
    });

    // Test 3: Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'error',
          element: `button[${index}]`,
          message: 'Button without accessible name',
          suggestion: 'Add text content, aria-label, or aria-labelledby attribute'
        });
      }
    });

    // Test 4: Check for form inputs without labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const id = input.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'error',
          element: `${input.tagName.toLowerCase()}[${index}]`,
          message: 'Form control without label',
          suggestion: 'Add a label element, aria-label, or aria-labelledby attribute'
        });
      }
    });

    // Test 5: Check for proper ARIA attributes
    const elementsWithRole = document.querySelectorAll('[role]');
    elementsWithRole.forEach((element, index) => {
      const warnings = validateAriaAttributes(element as HTMLElement);
      warnings.forEach(warning => {
        foundIssues.push({
          type: 'warning',
          element: `[role="${element.getAttribute('role')}"][${index}]`,
          message: warning,
          suggestion: 'Review ARIA specification for proper usage'
        });
      });
    });

    // Test 6: Check for color contrast (simplified check)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a');
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple check for very light text on light backgrounds
      if (color.includes('rgb(255') && backgroundColor.includes('rgb(255')) {
        foundIssues.push({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          message: 'Potential color contrast issue',
          suggestion: 'Verify color contrast meets WCAG AA standards (4.5:1 for normal text)'
        });
      }
    });

    // Test 7: Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        foundIssues.push({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          message: 'Positive tabindex found',
          suggestion: 'Avoid positive tabindex values, use 0 or -1 instead'
        });
      }
    });

    // Test 8: Check for focus indicators
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
    focusableElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element, ':focus');
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      
      if (outline === 'none' && boxShadow === 'none') {
        foundIssues.push({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          message: 'Element may lack visible focus indicator',
          suggestion: 'Ensure focus indicators are visible for keyboard navigation'
        });
      }
    });

    // Test 9: Check for minimum touch target size on mobile
    if (window.innerWidth <= 768) {
      const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
      touchTargets.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          foundIssues.push({
            type: 'warning',
            element: `${element.tagName.toLowerCase()}[${index}]`,
            message: 'Touch target smaller than 44px',
            suggestion: 'Ensure touch targets are at least 44x44px for mobile accessibility'
          });
        }
      });
    }

    // Test 10: Check for live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    if (liveRegions.length === 0) {
      foundIssues.push({
        type: 'info',
        element: 'document',
        message: 'No live regions found',
        suggestion: 'Consider adding aria-live regions for dynamic content updates'
      });
    }

    setIssues(foundIssues);
    setIsRunning(false);

    // Log results to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Accessibility Test Results');
      console.log(`Found ${foundIssues.length} issues:`);
      foundIssues.forEach(issue => {
        const emoji = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${emoji} ${issue.element}: ${issue.message}`);
        if (issue.suggestion) {
          console.log(`   💡 ${issue.suggestion}`);
        }
      });
      console.groupEnd();
    }
  };

  useEffect(() => {
    if (enabled) {
      // Run tests after component mount and DOM updates
      const timer = setTimeout(runAccessibilityTests, 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  if (!enabled || !showResults) {
    return null;
  }

  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const infoCount = issues.filter(issue => issue.type === 'info').length;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Accessibility Test Results
          </h3>
          <button
            onClick={runAccessibilityTests}
            disabled={isRunning}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Re-run'}
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Errors
            </span>
            <span className="font-medium">{errorCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Warnings
            </span>
            <span className="font-medium">{warningCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Info
            </span>
            <span className="font-medium">{infoCount}</span>
          </div>
        </div>

        {issues.length > 0 && (
          <details className="mt-3">
            <summary className="text-xs cursor-pointer text-gray-600 hover:text-gray-800">
              View Details
            </summary>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {issues.map((issue, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="flex items-start">
                    <span className={`w-1 h-1 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                      issue.type === 'error' ? 'bg-red-500' : 
                      issue.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    <div>
                      <div className="font-medium text-gray-900">{issue.element}</div>
                      <div className="text-gray-600">{issue.message}</div>
                      {issue.suggestion && (
                        <div className="text-gray-500 mt-1">{issue.suggestion}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Development mode only. Tests run automatically.
          </p>
        </div>
      </div>
    </div>
  );
}