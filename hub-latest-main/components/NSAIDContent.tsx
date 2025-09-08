'use client';

import { useEffect } from 'react';

interface NSAIDContentProps {
  content: string;
}

// Function to process NSAID content and convert Markdown to HTML while preserving HTML blocks
function processNSAIDContent(content: string): string {
  // First, protect HTML blocks by replacing them with placeholders
  const htmlBlocks: string[] = [];
  let processedContent = content.replace(/<div[\s\S]*?<\/div>/g, (match) => {
    const index = htmlBlocks.length;
    htmlBlocks.push(match);
    return `__HTML_BLOCK_${index}__`;
  });

  // Process Markdown syntax
  processedContent = processedContent
    // Convert headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Convert blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    // Convert code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Convert tables - improved table processing with center alignment for first column
    .replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter(Boolean);
      const headerRow = '<tr>' + headerCells.map((cell: string, index: number) => {
        const alignment = index === 0 ? 'text-center' : 'text-left';
        return `<th class="border border-gray-300 px-4 py-3 bg-primary-100 font-semibold ${alignment} text-primary-800">${cell}</th>`;
      }).join('') + '</tr>';

      const bodyRows = rows.trim().split('\n').map((row: string) => {
        const cells = row.replace(/^\||\|$/g, '').split('|').map((cell: string) => cell.trim());
        return '<tr class="even:bg-gray-50 hover:bg-primary-25">' + cells.map((cell: string, index: number) => {
          const alignment = index === 0 ? 'text-center' : 'text-left';
          return `<td class="border border-gray-300 px-4 py-3 text-neutral-700 ${alignment}">${cell}</td>`;
        }).join('') + '</tr>';
      }).join('');

      return `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm"><thead class="bg-primary-50">${headerRow}</thead><tbody>${bodyRows}</tbody></table></div>`;
    })
    
    // Convert line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraphs (but not HTML blocks)
    .replace(/^(?!<[h1-6]|<div|<blockquote|<pre|<ul|<ol|<li|__HTML_BLOCK)(.+)/gim, '<p>$1</p>');

  // Restore HTML blocks
  htmlBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`__HTML_BLOCK_${index}__`, block);
  });

  // Ensure video element has proper attributes for visibility
  processedContent = processedContent.replace(
    /<video([^>]*id="nsaidAnimationPlayer"[^>]*)>/g,
    '<video$1 style="display: block !important; width: 100% !important; height: auto !important; min-height: 250px !important; background: #000 !important; opacity: 1 !important; visibility: visible !important; position: relative !important; z-index: 100 !important;" controls playsinline>'
  );

  // Debug: Log the processed content to see if video element is present
  if (processedContent.includes('nsaidAnimationPlayer')) {
    console.log('🎬 Video element found in processed content');
  } else {
    console.warn('❌ Video element NOT found in processed content');
  }

  // Remove test message and ensure clean video container
  processedContent = processedContent.replace(
    /<div class="nsaid-animation-player">/g,
    '<div class="nsaid-animation-player">'
  );

  return processedContent;
}

export default function NSAIDContent({ content }: NSAIDContentProps) {
  // Component rendering - reduced logging for production

  useEffect(() => {
    // Initialize component effects

    // Force remove any filters on mount and periodically
    const removeFilters = () => {
      // Target all possible video-related elements
      const selectors = [
        'video',
        '[id*="nsaid"]',
        '[class*="animation"]',
        '[class*="video"]',
        '[class*="player"]',
        '.nsaid-animation-player',
        '#nsaidAnimationPlayer',
        '.video-player-container'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const element = el as HTMLElement;
          // Remove all possible filter properties to eliminate gray overlay
          element.style.setProperty('filter', 'none', 'important');
          element.style.setProperty('-webkit-filter', 'none', 'important');
          element.style.setProperty('-moz-filter', 'none', 'important');
          element.style.setProperty('-ms-filter', 'none', 'important');
          element.style.setProperty('-o-filter', 'none', 'important');
          element.style.setProperty('opacity', '1', 'important');
          // Keep video background black for better contrast
          if (element.tagName.toLowerCase() === 'video') {
            element.style.setProperty('background', '#000000', 'important');
          } else {
            element.style.setProperty('background', 'transparent', 'important');
          }
        });
      });
    };

    // Remove filters immediately and periodically
    removeFilters();
    const filterInterval = setInterval(removeFilters, 500);

    // Add CSS styles to head
    const style = document.createElement('style');
    style.textContent = `
      .nsaid-animation-player {
        margin: 2rem 0;
        padding: 1.5rem;
        background: #f8fafc;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        display: block !important;
        visibility: visible !important;
        position: relative !important;
        z-index: 1 !important;
      }
      .animation-container {
        max-width: 100%;
        display: block !important;
        visibility: visible !important;
        position: relative !important;
      }
      .video-player-container {
        margin-bottom: 1rem;
        display: block !important;
        visibility: visible !important;
        position: relative !important;
        min-height: 300px !important;
        background: #000 !important;
        border-radius: 0.5rem !important;
      }
      .animation-video {
        width: 100% !important;
        height: auto !important;
        min-height: 250px !important;
        border-radius: 0.5rem !important;
        background: #000000 !important;
        filter: none !important;
        opacity: 1 !important;
        -webkit-filter: none !important;
        -moz-filter: none !important;
        -ms-filter: none !important;
        -o-filter: none !important;
        position: relative !important;
        z-index: 10 !important;
        display: block !important;
        visibility: visible !important;
        object-fit: contain !important;
      }

      .animation-video::before,
      .animation-video::after {
        display: none !important;
        content: none !important;
      }

      .video-player-container {
        position: relative !important;
        background: transparent !important;
        filter: none !important;
        opacity: 1 !important;
      }

      .video-player-container::before,
      .video-player-container::after {
        display: none !important;
        content: none !important;
      }

      /* Remove any potential overlay effects */
      .video-player-container > *:not(.animation-video) {
        display: none !important;
      }

      /* Ensure video is always visible and clear */
      video, .animation-video {
        filter: none !important;
        opacity: 1 !important;
        background: #000 !important;
        position: relative !important;
        z-index: 100 !important;
      }
      .animation-video::-webkit-media-controls {
        display: flex !important;
        opacity: 1 !important;
      }
      .animation-video::-webkit-media-controls-panel {
        display: flex !important;
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.8) !important;
      }
      .animation-video::-webkit-media-controls-play-button {
        display: block !important;
        opacity: 1 !important;
        background-color: #3b82f6 !important;
        border-radius: 50% !important;
      }
      .narration-section {
        margin: 1rem 0;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }
      .scene-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }
      .narration-text {
        color: #6b7280;
        line-height: 1.5;
      }
      .navigation-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
      }
      .nav-button {
        padding: 0.5rem 1rem !important;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 0.375rem !important;
        cursor: pointer !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3) !important;
      }
      .nav-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4) !important;
      }
      .nav-button:disabled {
        background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%) !important;
        cursor: not-allowed !important;
        opacity: 0.6 !important;
        transform: none !important;
        box-shadow: 0 1px 2px rgba(156, 163, 175, 0.3) !important;
      }
      .nav-button:not(:disabled) {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
      }
      .scene-indicator {
        color: #6b7280;
        font-size: 0.875rem;
      }
      .nsaid-calculator {
        margin: 2rem auto;
        padding: 1.5rem;
        background: white;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        max-width: 480px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .calculator-container {
        width: 100%;
      }
      .calculator-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        text-align: center;
      }
      .calculator-form {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .form-group {
        margin-bottom: 0.25rem;
      }
      .form-label {
        display: block;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
      }
      .form-select, .form-input {
        width: 100%;
        padding: 0.625rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.9375rem;
        box-sizing: border-box;
      }
      .form-select:focus, .form-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .calculate-button {
        width: 100% !important;
        padding: 0.875rem 1.5rem !important;
        background: #1e40af !important;
        background-color: #1e40af !important;
        background-image: none !important;
        color: #ffffff !important;
        border: 3px solid #1d4ed8 !important;
        border-radius: 0.5rem !important;
        font-weight: 800 !important;
        cursor: pointer !important;
        margin: 0.75rem 0 1rem 0 !important;
        transition: all 0.3s ease !important;
        display: block !important;
        text-align: center !important;
        font-size: 1.125rem !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4) !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
        letter-spacing: 0.05em !important;
        position: relative !important;
        overflow: hidden !important;
        text-transform: uppercase !important;
        z-index: 10 !important;
      }
      .calculate-button:hover {
        background: #1e3a8a !important;
        background-color: #1e3a8a !important;
        background-image: none !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(30, 64, 175, 0.5) !important;
        border-color: #1e3a8a !important;
        color: #ffffff !important;
      }
      .calculate-button:active {
        background: #1e3a8a !important;
        background-color: #1e3a8a !important;
        background-image: none !important;
        transform: translateY(0) !important;
        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.4) !important;
        color: #ffffff !important;
      }
      .dose-result {
        margin-top: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }
      .dose-result.hidden {
        display: none;
      }
      .result-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.75rem;
      }
      .result-content p {
        margin-bottom: 0.5rem;
        color: #374151;
      }
      .result-notes {
        font-size: 0.875rem;
        color: #6b7280;
        font-style: italic;
      }
      .disclaimer {
        margin-top: 0.5rem;
        padding: 1rem;
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        color: #92400e;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }
      .disclaimer i {
        flex-shrink: 0;
        width: 1rem;
        height: 1rem;
        margin-top: 0.125rem;
      }

      /* 机制图表样式 */
      .mechanism-diagram {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin: 1.5rem 0;
        text-align: center;
        font-family: 'Courier New', monospace;
      }
      .mechanism-diagram p {
        margin: 0.25rem 0;
        color: #1f2937;
      }

      /* 治疗步骤样式 */
      .treatment-steps {
        background: #f0f9ff;
        border-left: 4px solid #3b82f6;
        padding: 1.5rem;
        margin: 1rem 0;
        border-radius: 0 0.5rem 0.5rem 0;
      }
      .treatment-steps p {
        margin: 1rem 0;
        color: #1f2937;
        line-height: 1.6;
      }
      .treatment-steps p:first-child {
        margin-top: 0;
      }
      .treatment-steps p:last-child {
        margin-bottom: 0;
      }

      /* 治疗推荐样式 */
      .treatment-recommendation {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.75rem 0;
      }
      .treatment-recommendation p {
        margin: 0;
        color: #166534;
        line-height: 1.6;
      }

      /* 响应式设计 */
      @media (max-width: 768px) {
        .nsaid-calculator {
          margin: 1rem auto;
          padding: 1rem;
          max-width: calc(100% - 2rem);
        }
        .calculator-title {
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
        }
        .calculator-form {
          gap: 0.375rem;
        }
        .form-group {
          margin-bottom: 0;
        }
        .form-label {
          font-size: 0.8125rem;
          margin-bottom: 0.1875rem;
        }
        .form-select, .form-input {
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        .calculate-button {
          padding: 0.75rem 1rem !important;
          font-size: 1rem !important;
          margin: 0.625rem 0 0.75rem 0 !important;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          color: white !important;
          border: 2px solid #2563eb !important;
          box-shadow: 0 3px 10px rgba(59, 130, 246, 0.25) !important;
        }
        .disclaimer {
          padding: 0.75rem;
          font-size: 0.8125rem;
        }
      }

      @media (max-width: 480px) {
        .nsaid-calculator {
          padding: 0.75rem;
          margin: 0.75rem auto;
        }
        .calculator-title {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .form-label {
          font-size: 0.75rem;
          margin-bottom: 0.125rem;
        }
        .form-select, .form-input {
          padding: 0.5rem;
          font-size: 0.8125rem;
        }
        .calculate-button {
          padding: 0.625rem 0.875rem !important;
          font-size: 0.9375rem !important;
          margin: 0.5rem 0 0.625rem 0 !important;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          color: white !important;
          border: 1.5px solid #2563eb !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2) !important;
        }
      }

      /* 强制移除所有可能的灰色滤镜和覆盖层 */
      * {
        filter: none !important;
        -webkit-filter: none !important;
        -moz-filter: none !important;
        -ms-filter: none !important;
        -o-filter: none !important;
      }

      /* 特别针对视频和动画元素 */
      video, .animation-video, #nsaidAnimationPlayer {
        filter: none !important;
        -webkit-filter: none !important;
        -moz-filter: none !important;
        -ms-filter: none !important;
        -o-filter: none !important;
        opacity: 1 !important;
        background: #000 !important;
        position: relative !important;
        z-index: 1000 !important;
      }

      /* 移除任何可能的覆盖层 */
      div[style*="filter"],
      div[style*="opacity"],
      div[class*="overlay"],
      div[class*="backdrop"],
      .video-overlay,
      .video-backdrop {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        filter: none !important;
      }

      /* 确保视频容器清洁 */
      .video-player-container,
      .animation-container {
        filter: none !important;
        opacity: 1 !important;
        background: transparent !important;
        position: relative !important;
      }

      /* 移除任何伪元素覆盖 */
      *::before,
      *::after {
        filter: none !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(filterInterval);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    // Add a small delay to ensure DOM elements are rendered
    console.log('🔧 NSAIDContent component initialized, external script will handle events');

    const timer = setTimeout(() => {
      // NSAID Calculator functionality
      const calculateButton = document.getElementById('calculate-dose-button');

      if (calculateButton) {
        // 强制设置按钮样式
        const btn = calculateButton as HTMLButtonElement;
        btn.style.setProperty('background', '#1e40af', 'important');
        btn.style.setProperty('background-color', '#1e40af', 'important');
        btn.style.setProperty('background-image', 'none', 'important');
        btn.style.setProperty('color', '#ffffff', 'important');
        btn.style.setProperty('border', '2px solid #1d4ed8', 'important');
        btn.style.setProperty('border-radius', '0.5rem', 'important');
        btn.style.setProperty('padding', '0.5rem 1rem', 'important');
        btn.style.setProperty('font-weight', '700', 'important');
        btn.style.setProperty('cursor', 'pointer', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        btn.style.setProperty('z-index', '100', 'important');
        btn.style.setProperty('position', 'relative', 'important');
        btn.style.setProperty('display', 'inline-block', 'important');
        btn.style.setProperty('width', '100%', 'important');

        console.log('✅ Calculate button found and styled, event handling delegated to external script');
      }

      // Simple video player initialization based on original code
      const videoPlayer = document.getElementById('nsaidAnimationPlayer') as HTMLVideoElement;
      const prevButton = document.getElementById('nsaidPrevButton');
      const nextButton = document.getElementById('nsaidNextButton');
      const sceneIndicator = document.getElementById('nsaidSceneIndicator');
      const sceneTitle = document.getElementById('nsaidSceneTitle');
      const narrationText = document.getElementById('nsaidNarrationText');

      console.log('🎬 Animation controls found:', {
        videoPlayer: !!videoPlayer,
        prevButton: !!prevButton,
        nextButton: !!nextButton,
        sceneIndicator: !!sceneIndicator,
        sceneTitle: !!sceneTitle,
        narrationText: !!narrationText
      });

      let currentSceneIndex = 0;

      // Simple scene data structure matching original working code
      const scenes = [
        {
          id: 1,
          title: "场景1：开场 - 表现痛经的不适感",
          videoUrl: "https://v3.fal.media/files/monkey/OMrBMAEeA1my97zJzH64q_output.mp4",
          narration: "很多女性每个月都会经历痛经，那种痉挛、疼痛的感觉让人非常不适。"
        },
        {
          id: 2,
          title: '场景2：解释痛经原因 - 前列腺素',
          text: '月经期间，子宫内膜会释放一种叫做"前列腺素"的物质。前列腺素会引起子宫肌肉剧烈收缩，导致疼痛。',
          videoUrl: 'https://v3.fal.media/files/panda/DJlINSBKErKOTTRW4scwG_output.mp4'
        },
        {
          id: 3,
          title: '场景3：引出NSAIDs',
          text: '而非甾体抗炎药，简称NSAID，是缓解痛经的常用药物。它们能从源头减少前列腺素的产生。',
          videoUrl: 'https://v3.fal.media/files/monkey/sRVoOWjzmaoyzF7cure1m_output.mp4'
        },
        {
          id: 4,
          title: '场景4：药物服用',
          text: '当您服下NSAID药片后，它会进入消化系统。',
          videoUrl: 'https://v3.fal.media/files/lion/O4Ys7oYqfMg3M0jR80mhw_output.mp4'
        },
        {
          id: 5,
          title: '场景5：吸收进入血液',
          text: '然后通过消化道被吸收到血液里，随着血液流向全身。',
          videoUrl: 'https://v3.fal.media/files/elephant/ejMBtuanCnJ9v_RH-3gXc_output.mp4'
        },
        {
          id: 6,
          title: '场景6：分布到作用部位',
          text: '药物分子随着血液循环，最终抵达引起疼痛的部位——比如您的子宫周围。',
          videoUrl: 'https://v3.fal.media/files/lion/_wrFzYC89XCXhT08_ldCQ_output.mp4'
        },
        {
          id: 7,
          title: '场景7：作用机制 - 抑制COX酶',
          text: '在这里，NSAID药物找到了产生前列腺素的关键"工厂"——环氧合酶，并抑制了它的活性。',
          videoUrl: 'https://v3.fal.media/files/zebra/-3fM_hp6Ze7ceOdKospQ-_output.mp4'
        },
        {
          id: 8,
          title: '场景8：减少前列腺素',
          text: '环氧合酶的工作被打断，前列腺素的合成量就大大降低了。',
          videoUrl: 'https://v3.fal.media/files/koala/-0hQKGQ9lIMGoyG_jRw2H_output.mp4'
        },
        {
          id: 9,
          title: '场景9：疼痛缓解',
          text: '随着前列腺素减少，子宫收缩变得温和，疼痛感明显减轻。',
          videoUrl: 'https://v3.fal.media/files/monkey/OMrBMAEeA1my97zJzH64q_output.mp4'
        },
        {
          id: 10,
          title: '场景10：药物代谢',
          text: '完成任务后，NSAID药物会被肝脏代谢，最终通过肾脏排出体外。',
          videoUrl: 'https://v3.fal.media/files/panda/DJlINSBKErKOTTRW4scwG_output.mp4'
        },
        {
          id: 11,
          title: '场景11：总结',
          text: '这就是NSAID缓解痛经的完整过程：从服用到吸收，从作用到代谢，科学而有效。',
          videoUrl: 'https://v3.fal.media/files/monkey/sRVoOWjzmaoyzF7cure1m_output.mp4'
        }
      ];

      // Simple scene loading function based on original working code
      function loadScene(index: number) {
        if (index < 0 || index >= scenes.length) {
          console.error('Scene index out of bounds:', index);
          return;
        }

        currentSceneIndex = index;
        const scene = scenes[currentSceneIndex];

        // Update UI elements
        if (sceneTitle) sceneTitle.textContent = scene.title;
        if (narrationText) narrationText.textContent = scene.text || scene.narration || '';
        if (sceneIndicator) sceneIndicator.textContent = `场景 ${scene.id} / ${scenes.length}`;

        // Load video
        if (videoPlayer && scene.videoUrl) {
          videoPlayer.src = scene.videoUrl;
          videoPlayer.load();

          // 仅在用户交互后尝试播放，避免 AudioContext/Autoplay 警告
          const tryPlay = () => {
            videoPlayer.play().catch(() => {});
            videoPlayer.removeEventListener('pointerdown', tryPlay);
            document.removeEventListener('pointerdown', tryPlay);
          };
          document.addEventListener('pointerdown', tryPlay, { once: true });
        }

        // Update navigation buttons
        if (prevButton) (prevButton as HTMLButtonElement).disabled = currentSceneIndex === 0;
        if (nextButton) (nextButton as HTMLButtonElement).disabled = currentSceneIndex === scenes.length - 1;
      }

      // Simple navigation functions
      function playNextScene() {
        currentSceneIndex++;
        if (currentSceneIndex >= scenes.length) {
          currentSceneIndex = 0; // Loop back to first scene
        }
        loadScene(currentSceneIndex);
      }

      function playPrevScene() {
        currentSceneIndex--;
        if (currentSceneIndex < 0) {
          currentSceneIndex = scenes.length - 1; // Loop back to last scene
        }
        loadScene(currentSceneIndex);
      }

      // Set up event listeners based on original working code
      if (videoPlayer) {
        // Video ended - auto advance to next scene
        videoPlayer.addEventListener('ended', () => {
          playNextScene();
        });

        // Video error handling
        videoPlayer.addEventListener('error', (e) => {
          console.error('Video error:', e);
          if (narrationText) narrationText.textContent = '抱歉，视频加载失败。请检查您的网络连接或稍后再试。';
          if (sceneTitle) sceneTitle.textContent = '视频加载错误';
        });
      }

      // Button event listeners
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          playPrevScene();
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          playNextScene();
        });
      }

      // Initialize with first scene
      if (scenes.length > 0) {
        loadScene(0);
      } else {
        if (sceneTitle) sceneTitle.textContent = "没有可播放的场景";
        if (narrationText) narrationText.textContent = "请检查数据配置。";
        if (prevButton) (prevButton as HTMLButtonElement).disabled = true;
        if (nextButton) (nextButton as HTMLButtonElement).disabled = true;
        if (sceneIndicator) sceneIndicator.textContent = "场景 0 / 0";
      }

      // Enhanced video player setup with debugging
      if (videoPlayer) {
        videoPlayer.controls = true;
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
        videoPlayer.style.minHeight = '250px';
        videoPlayer.style.background = '#000';
        videoPlayer.style.display = 'block';

        console.log('✅ Video player initialized successfully');
        console.log('🎬 Video player details:', {
          element: videoPlayer,
          src: videoPlayer.src,
          currentSrc: videoPlayer.currentSrc,
          controls: videoPlayer.controls,
          style: {
            display: videoPlayer.style.display,
            width: videoPlayer.style.width,
            height: videoPlayer.style.height,
            visibility: videoPlayer.style.visibility
          },
          parentElement: videoPlayer.parentElement,
          offsetWidth: videoPlayer.offsetWidth,
          offsetHeight: videoPlayer.offsetHeight
        });

        // Force video to be visible
        videoPlayer.style.setProperty('display', 'block', 'important');
        videoPlayer.style.setProperty('visibility', 'visible', 'important');
        videoPlayer.style.setProperty('opacity', '1', 'important');

      } else {
        console.error('❌ Video player element not found!');
        // Try to find any video elements on the page
        const allVideos = document.querySelectorAll('video');
        console.log('🔍 All video elements found:', allVideos.length);
        allVideos.forEach((video, index) => {
          console.log(`Video ${index}:`, {
            id: video.id,
            className: video.className,
            src: video.src,
            parentElement: video.parentElement
          });
        });
      }



    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      // styleInterval会在组件卸载时自动清理
    };
  }, []);

  return (
    <>
      <style jsx>{`
        :global(.nsaid-active-button) {
          background: #1e40af !important;
          color: #ffffff !important;
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          border: 2px solid #1d4ed8 !important;
          padding: 0.625rem 1.25rem !important;
          border-radius: 0.5rem !important;
          font-weight: 700 !important;
          transform: none !important;
          transition: all 0.2s !important;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3) !important;
          outline: none !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          letter-spacing: 0.025em !important;
        }

        :global(.nsaid-active-button:hover) {
          background: #1e3a8a !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4) !important;
        }

        :global(.nsaid-disabled-button) {
          background: #374151 !important;
          color: #ffffff !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
          pointer-events: none !important;
          border: 2px solid #4b5563 !important;
          padding: 0.625rem 1.25rem !important;
          border-radius: 0.5rem !important;
          font-weight: 700 !important;
          transform: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
          outline: none !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
          letter-spacing: 0.025em !important;
        }

        :global(#nsaidNextButton) {
          background: #1e40af !important;
          color: #ffffff !important;
          cursor: pointer !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          border: 2px solid #1d4ed8 !important;
          padding: 0.625rem 1.25rem !important;
          border-radius: 0.5rem !important;
          font-weight: 700 !important;
          transform: none !important;
          transition: all 0.2s !important;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3) !important;
          outline: none !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          letter-spacing: 0.025em !important;
        }

        :global(#nsaidNextButton:hover) {
          background: #1e3a8a !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4) !important;
        }

        :global(#nsaidPrevButton) {
          background: #374151 !important;
          color: #ffffff !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
          pointer-events: none !important;
          border: 2px solid #4b5563 !important;
          padding: 0.625rem 1.25rem !important;
          border-radius: 0.5rem !important;
          font-weight: 700 !important;
          transform: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
          outline: none !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
          letter-spacing: 0.025em !important;
        }

        :global(#nsaidAnimationPlayer) {
          display: block !important;
          width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 100 !important;
        }

        /* 基础视频样式 */
        :global(.nsaid-animation-player) {
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }

        /* 强制按钮样式 - 使用更高优先级选择器 */
        :global(.calculate-button),
        :global(button.calculate-button),
        :global(.nsaid-controls button),
        :global(.nsaid-controls .btn),
        :global(button[class*="nsaid"]),
        :global(.btn[class*="nsaid"]),
        :global(#calculate-dose-button),
        :global(button#calculate-dose-button) {
          background: #1e40af !important;
          background-color: #1e40af !important;
          background-image: none !important;
          color: #ffffff !important;
          border: 2px solid #1d4ed8 !important;
          border-radius: 0.5rem !important;
          padding: 0.625rem 1.25rem !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          letter-spacing: 0.025em !important;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3) !important;
          z-index: 10 !important;
          position: relative !important;
          display: inline-block !important;
          text-decoration: none !important;
        }

        /* 特别针对计算按钮的强制样式 */
        :global(#calculate-dose-button) {
          background: #1e40af !important;
          background-color: #1e40af !important;
          background-image: none !important;
          color: #ffffff !important;
          border: 2px solid #1d4ed8 !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          letter-spacing: 0.025em !important;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3) !important;
          z-index: 100 !important;
          position: relative !important;
          display: inline-block !important;
          text-decoration: none !important;
          width: 100% !important;
        }

        /* 按钮悬停效果 */
        :global(.nsaid-controls button:hover),
        :global(.nsaid-controls .btn:hover) {
          background: #1e3a8a !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4) !important;
        }

        /* 禁用状态按钮 */
        :global(.nsaid-controls button:disabled),
        :global(.nsaid-controls .btn:disabled) {
          background: #374151 !important;
          color: #ffffff !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
          pointer-events: none !important;
          border: 2px solid #4b5563 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
        }

        /* 场景描述区域背景修复 */
        :global(.nsaid-scene-description),
        :global([class*="scene"]),
        :global([class*="description"]) {
          background: white !important;
          background-color: white !important;
          color: #374151 !important;
        }
      `}</style>
      <div
        className="nsaid-article-content"
        dangerouslySetInnerHTML={{
          __html: processNSAIDContent(content)
        }}
      />
    </>
  );
}
