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
  // SEO和可访问性增强
  title?: string;
  caption?: string;
  isDecorative?: boolean; // 是否为装饰性图片
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
  quality = 95,
  title,
  caption,
  isDecorative = false
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 智能alt文本处理
  const getOptimizedAlt = () => {
    // 如果是装饰性图片，使用空alt
    if (isDecorative) {
      return '';
    }
    
    // 如果alt为空或太短，生成基于文件名的alt
    if (!alt || alt.trim().length < 3) {
      const fileName = src.split('/').pop()?.split('.')[0] || 'image';
      return `Image: ${fileName.replace(/[-_]/g, ' ')}`;
    }
    
    return alt;
  };

  const optimizedAlt = getOptimizedAlt();

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
        alt={optimizedAlt}
        title={title || optimizedAlt}
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
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </div>
  );
}
