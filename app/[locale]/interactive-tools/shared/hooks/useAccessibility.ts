import { useEffect, useRef, useCallback } from 'react';

interface UseAccessibilityOptions {
  announcePageChanges?: boolean;
  manageFocus?: boolean;
  trapFocus?: boolean;
  skipLinks?: boolean;
}

interface AccessibilityAnnouncement {
  message: string;
  priority?: 'polite' | 'assertive';
  delay?: number;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    announcePageChanges = true,
    manageFocus = true,
    trapFocus = false,
    skipLinks = true
  } = options;

  const announcementRef = useRef<HTMLDivElement | null>(null);
  const focusTrapRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Create announcement region for screen readers
  useEffect(() => {
    if (!announcePageChanges) return;

    const announcementRegion = document.createElement('div');
    announcementRegion.setAttribute('aria-live', 'polite');
    announcementRegion.setAttribute('aria-atomic', 'true');
    announcementRegion.className = 'sr-only';
    announcementRegion.id = 'accessibility-announcements';
    
    document.body.appendChild(announcementRegion);
    announcementRef.current = announcementRegion;

    return () => {
      if (announcementRegion.parentNode) {
        announcementRegion.parentNode.removeChild(announcementRegion);
      }
    };
  }, [announcePageChanges]);

  // Announce messages to screen readers
  const announce = useCallback((announcement: AccessibilityAnnouncement) => {
    if (!announcementRef.current) return;

    const { message, priority = 'polite', delay = 100 } = announcement;
    
    // Clear previous announcement
    announcementRef.current.textContent = '';
    announcementRef.current.setAttribute('aria-live', priority);
    
    // Add new announcement with slight delay to ensure it's read
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, delay);
  }, []);

  // Focus management utilities
  const focusElement = useCallback((selector: string | HTMLElement) => {
    if (!manageFocus) return;

    let element: HTMLElement | null = null;
    
    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    if (element) {
      // Store previous focus for restoration
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the element
      element.focus();
      
      // Scroll into view if needed
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [manageFocus]);

  // Restore previous focus
  const restoreFocus = useCallback(() => {
    if (!manageFocus || !previousFocusRef.current) return;

    try {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    } catch (error) {
      // Element might no longer exist, focus body as fallback
      document.body.focus();
    }
  }, [manageFocus]);

  // Focus trap for modals and dialogs
  const trapFocusInElement = useCallback((element: HTMLElement) => {
    if (!trapFocus) return () => {};

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [trapFocus]);

  // Keyboard navigation helpers
  const handleArrowNavigation = useCallback((
    e: KeyboardEvent,
    items: NodeListOf<Element> | Element[],
    currentIndex: number,
    options: {
      horizontal?: boolean;
      vertical?: boolean;
      wrap?: boolean;
      onNavigate?: (newIndex: number) => void;
    } = {}
  ) => {
    const { horizontal = true, vertical = true, wrap = true, onNavigate } = options;
    const itemsArray = Array.from(items);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        if (horizontal) {
          e.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= itemsArray.length) {
            newIndex = wrap ? 0 : itemsArray.length - 1;
          }
        }
        break;
      case 'ArrowLeft':
        if (horizontal) {
          e.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = wrap ? itemsArray.length - 1 : 0;
          }
        }
        break;
      case 'ArrowDown':
        if (vertical) {
          e.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= itemsArray.length) {
            newIndex = wrap ? 0 : itemsArray.length - 1;
          }
        }
        break;
      case 'ArrowUp':
        if (vertical) {
          e.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = wrap ? itemsArray.length - 1 : 0;
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemsArray.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      const newElement = itemsArray[newIndex] as HTMLElement;
      if (newElement) {
        newElement.focus();
        if (onNavigate) {
          onNavigate(newIndex);
        }
      }
    }
  }, []);

  // Skip link functionality
  useEffect(() => {
    if (!skipLinks) return;

    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, [skipLinks]);

  // Detect user preferences
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const prefersHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);

  const prefersDarkMode = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Generate unique IDs for accessibility
  const generateId = useCallback((prefix: string = 'accessibility') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validate ARIA attributes
  const validateAriaAttributes = useCallback((element: HTMLElement) => {
    const warnings: string[] = [];

    // Check for required ARIA attributes
    if (element.getAttribute('role') === 'button' && !element.hasAttribute('aria-label') && !element.textContent?.trim()) {
      warnings.push('Button elements should have accessible text or aria-label');
    }

    if (element.getAttribute('role') === 'tab' && !element.hasAttribute('aria-controls')) {
      warnings.push('Tab elements should have aria-controls attribute');
    }

    if (element.getAttribute('role') === 'tabpanel' && !element.hasAttribute('aria-labelledby')) {
      warnings.push('Tabpanel elements should have aria-labelledby attribute');
    }

    // Check for proper heading hierarchy
    if (element.tagName.match(/^H[1-6]$/)) {
      const level = parseInt(element.tagName.charAt(1));
      const previousHeading = element.previousElementSibling?.closest('h1, h2, h3, h4, h5, h6');
      if (previousHeading) {
        const previousLevel = parseInt(previousHeading.tagName.charAt(1));
        if (level > previousLevel + 1) {
          warnings.push(`Heading level ${level} follows heading level ${previousLevel}, consider using h${previousLevel + 1}`);
        }
      }
    }

    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Accessibility warnings for element:', element, warnings);
    }

    return warnings;
  }, []);

  return {
    announce,
    focusElement,
    restoreFocus,
    trapFocusInElement,
    handleArrowNavigation,
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    generateId,
    validateAriaAttributes
  };
}

// Hook for managing live regions
export function useLiveRegion() {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    regionRef.current = region;

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!regionRef.current) return;

    regionRef.current.setAttribute('aria-live', priority);
    regionRef.current.textContent = '';
    
    setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
      }
    }, 100);
  }, []);

  return { announce };
}

// Hook for managing focus within a component
export function useFocusManagement() {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const setContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;

    const focusable = containerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (focusable) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      focusable.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (lastFocusable) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      lastFocusable.focus();
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      try {
        previousFocusRef.current.focus();
      } catch (error) {
        // Element might no longer exist
        document.body.focus();
      }
      previousFocusRef.current = null;
    }
  }, []);

  return {
    setContainer,
    focusFirst,
    focusLast,
    restoreFocus
  };
}