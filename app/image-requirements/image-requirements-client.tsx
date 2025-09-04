'use client';

import React from 'react';
import ImagePlaceholder from '@/components/ImagePlaceholder';

export default function ImageRequirementsClient() {
  const imageRequirements = [
    // Hero Section Images
    {
      category: "Hero Section",
      images: [
        {
          filename: "hero-main-banner.jpg",
          alt: "Professional healthcare illustration showing diverse women in comfortable poses",
          width: 800,
          height: 450,
          path: "/public/images/hero/",
          description: "Warm and professional healthcare illustration, young diverse women in comfortable poses, soft pink and blue gradient background, modern minimalist style, conveying comfort and medical trust"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Image Requirements
          </h1>
          
          <div className="space-y-8">
            {imageRequirements.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {category.category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <ImagePlaceholder
                          filename={image.filename}
                          width={image.width}
                          height={image.height}
                          alt={image.alt}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-800">
                          {image.filename}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {image.width} × {image.height}px
                        </p>
                        <p className="text-sm text-gray-500">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
