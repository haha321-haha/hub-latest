import React from 'react';

interface ImagePlaceholderProps {
  filename: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  description?: string;
}

export default function ImagePlaceholder({
  filename,
  alt,
  width = 400,
  height = 300,
  className = '',
  description
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}
      style={{ width: width, height: height, minHeight: height }}
    >
      <div className="text-gray-400 text-2xl mb-2">📷</div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-1">
          {filename}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {width}x{height}px
        </p>
        {description && (
          <p className="text-xs text-gray-400 max-w-xs">
            {description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2 italic">
          Alt: {alt}
        </p>
      </div>
    </div>
  );
}
