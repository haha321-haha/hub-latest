
// 点击事件优化
function optimizeClickEvents() {
  // 添加点击反馈
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.clickable, .btn, a');
    if (target) {
      // 添加点击动画
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
      
      // 记录有效点击
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: target.textContent || target.className
        });
      }
    }
  });
  
  // 防止重复点击
  const clickableElements = document.querySelectorAll('.clickable, .btn, a');
  clickableElements.forEach(element => {
    let isProcessing = false;
    
    element.addEventListener('click', function(e) {
      if (isProcessing) {
        e.preventDefault();
        return;
      }
      
      isProcessing = true;
      setTimeout(() => {
        isProcessing = false;
      }, 1000);
    });
  });
}

// 加载状态管理
function showLoadingState(element) {
  element.disabled = true;
  element.innerHTML = '<span class="spinner"></span> 加载中...';
}

function hideLoadingState(element, originalText) {
  element.disabled = false;
  element.innerHTML = originalText;
}

// 错误处理
function handleClickError(element, error) {
  console.error('点击事件错误:', error);
  
  // 显示错误提示
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = '操作失败，请重试';
  
  element.parentNode.insertBefore(errorDiv, element.nextSibling);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  optimizeClickEvents();
});
      