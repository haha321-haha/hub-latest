'use client';

import React from 'react';

interface NotificationButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function NotificationButton({ children, className = '' }: NotificationButtonProps) {
  const handleClick = () => {
    // 这里可以添加通知逻辑
    alert('功能开发中，敬请期待！');
  };

  return (
    <button 
      onClick={handleClick}
      className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
