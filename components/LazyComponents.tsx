'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

// 📱 移动端优化：动态导入重型组件
// 这些组件只在需要时才加载，减少初始包大小

// 性能监控组件 - 只在生产环境加载
export const PerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor'),
  {
    ssr: false,
    loading: () => null, // 静默加载
  }
);

// 交互式工具组件 - 延迟加载
export const NSAIDInteractive = dynamic(
  () => import('./NSAIDInteractive'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    ),
  }
);

// 疼痛追踪器 - 延迟加载 (暂时注释掉，因为组件不存在)
// export const PainTracker = dynamic(
//   () => import('./PainTracker'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="bg-white rounded-lg p-6 shadow-sm">
//         <div className="animate-pulse">
//           <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//         </div>
//       </div>
//     ),
//   }
// );

// 症状评估工具 - 延迟加载 (暂时注释掉，因为组件不存在)
// export const SymptomAssessment = dynamic(
//   () => import('./SymptomAssessment'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="bg-white rounded-lg p-6 shadow-sm">
//         <div className="animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 rounded w-4/6"></div>
//           </div>
//         </div>
//       </div>
//     ),
//   }
// );

// 呼吸练习工具 - 延迟加载
export const BreathingExercise = dynamic(
  () => import('./BreathingExercise'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded-full w-8 mx-auto mb-4"></div>
          <div className="h-4 bg-purple-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    ),
  }
);

// 周期追踪器 - 延迟加载 (暂时注释掉，因为组件不存在)
// export const CycleTracker = dynamic(
//   () => import('./CycleTracker'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="bg-white rounded-lg p-6 shadow-sm">
//         <div className="animate-pulse">
//           <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="grid grid-cols-7 gap-2 mb-4">
//             {Array.from({ length: 7 }).map((_, i) => (
//               <div key={i} className="h-8 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//           <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//         </div>
//       </div>
//     ),
//   }
// );

// 高级组件 - 延迟加载 (暂时注释掉，因为组件有问题)
// export const AdvancedComponents = dynamic(
//   () => import('./advanced/AppProvider'),
//   {
//     ssr: false,
//     loading: () => null,
//   }
// );

// 移动端特定的延迟加载组件
export const MobileOptimizedComponents = {
  // 移动端PDF中心
  PDFCenter: dynamic(
    () => import('./OptimizedMobilePDFCenter'),
    {
      ssr: false,
      loading: () => (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ),
    }
  ),
  
  // 移动端搜索组件 (暂时注释掉，因为组件不存在)
  // SearchComponent: dynamic(
  //   () => import('./MobileSearch'),
  //   {
  //     ssr: false,
  //     loading: () => (
  //       <div className="bg-white rounded-lg p-4 shadow-sm">
  //         <div className="animate-pulse">
  //           <div className="h-10 bg-gray-200 rounded"></div>
  //         </div>
  //       </div>
  //     ),
  //   }
  // ),
};

// 条件加载Hook - 基于设备类型和用户交互
export function useConditionalLoading() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 基于用户交互决定是否加载重型组件
    const handleUserInteraction = () => {
      setShouldLoad(true);
    };
    
    // 监听用户交互
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('scroll', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return { shouldLoad, isMobile };
}

// 预加载关键组件
export function preloadCriticalComponents() {
  if (typeof window !== 'undefined') {
    // 预加载关键组件
    import('./PerformanceMonitor');
    import('./WebVitalsReporter');
    
    // 在空闲时间预加载其他组件 (暂时注释掉不存在的组件)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // import('./PainTracker');
        // import('./SymptomAssessment');
      });
    } else {
      // 降级方案
      setTimeout(() => {
        // import('./PainTracker');
        // import('./SymptomAssessment');
      }, 2000);
    }
  }
}
