'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
}

interface BreakpointInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
  height: number;
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'full',
  padding = 'md',
  centerContent = false,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  id
}: ResponsiveContainerProps) {
  const [breakpoint, setBreakpoint] = useState<BreakpointInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setBreakpoint({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1280,
        isLargeDesktop: width >= 1280,
        width,
        height
      });
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-full';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-2 sm:p-3';
      case 'md': return 'p-4 sm:p-6';
      case 'lg': return 'p-6 sm:p-8';
      case 'xl': return 'p-8 sm:p-12';
      default: return 'p-4 sm:p-6';
    }
  };

  const containerClasses = [
    'w-full',
    getMaxWidthClass(),
    getPaddingClass(),
    centerContent ? 'mx-auto' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
      data-breakpoint={breakpoint.isMobile ? 'mobile' : breakpoint.isTablet ? 'tablet' : breakpoint.isDesktop ? 'desktop' : 'large-desktop'}
    >
      {typeof children === 'function' ? (children as any)(breakpoint) : children}
    </div>
  );
}

// Hook for responsive behavior
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<BreakpointInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setBreakpoint({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1280,
        isLargeDesktop: width >= 1280,
        width,
        height
      });
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    largeDesktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  role?: string;
  'aria-label'?: string;
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, largeDesktop: 4 },
  gap = 'md',
  className = '',
  role,
  'aria-label': ariaLabel
}: ResponsiveGridProps) {
  const getGridClasses = () => {
    const { mobile = 1, tablet = 2, desktop = 3, largeDesktop = 4 } = columns;
    
    const gridCols = [
      `grid-cols-${mobile}`,
      `sm:grid-cols-${tablet}`,
      `md:grid-cols-${desktop}`,
      `lg:grid-cols-${largeDesktop}`
    ].join(' ');

    const gapClass = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }[gap];

    return `grid ${gridCols} ${gapClass}`;
  };

  return (
    <div
      className={`${getGridClasses()} ${className}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: {
    mobile?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    tablet?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    desktop?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  };
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  className?: string;
  id?: string;
  role?: string;
  'aria-level'?: number;
}

export function ResponsiveText({
  children,
  as: Component = 'p',
  size = { mobile: 'base', tablet: 'base', desktop: 'base' },
  weight = 'normal',
  color = 'text-gray-900',
  className = '',
  id,
  role,
  'aria-level': ariaLevel
}: ResponsiveTextProps) {
  const getSizeClasses = () => {
    const { mobile = 'base', tablet = 'base', desktop = 'base' } = size;
    
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl'
    };

    return [
      sizeMap[mobile],
      `sm:${sizeMap[tablet]}`,
      `md:${sizeMap[desktop]}`
    ].join(' ');
  };

  const getWeightClass = () => {
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };
    return weightMap[weight];
  };

  const textClasses = [
    getSizeClasses(),
    getWeightClass(),
    color,
    'leading-relaxed',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={textClasses}
      id={id}
      role={role}
      aria-level={ariaLevel}
    >
      {children}
    </Component>
  );
}

// Responsive Button Component
interface ResponsiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: {
    mobile?: 'sm' | 'md' | 'lg';
    desktop?: 'sm' | 'md' | 'lg';
  };
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
}

export function ResponsiveButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = { mobile: 'md', desktop: 'md' },
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id
}: ResponsiveButtonProps) {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 focus:ring-pink-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50 focus:ring-pink-500',
      ghost: 'text-pink-600 hover:bg-pink-50 focus:ring-pink-500'
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const { mobile = 'md', desktop = 'md' } = size;
    
    const sizeMap = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    };

    return [
      sizeMap[mobile],
      `sm:${sizeMap[desktop]}`
    ].join(' ');
  };

  const buttonClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-[44px] min-w-[44px]', // Accessibility: minimum touch target
    getVariantClasses(),
    getSizeClasses(),
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      id={id}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}