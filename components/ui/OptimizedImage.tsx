'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  quality = 95
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (imageError) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center`}
        style={{ width: '100%', aspectRatio: `${width}/${height}` }}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-neutral-600">图片加载中...</p>
          <p className="text-xs text-neutral-500 mt-1">Image loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 ${className} bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center animate-pulse`}
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-xs text-neutral-500">Loading...</p>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        quality={quality}
        style={{
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
        unoptimized={false}
        onError={() => {
          console.error(`Failed to load image: ${src}`);
          setImageError(true);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </div>
  );
}
