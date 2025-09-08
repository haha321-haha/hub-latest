# 性能监控快速启动指南

## 🚀 5分钟快速开始

### 1. 在根布局中添加性能监控

编辑 `app/layout.tsx` 或 `app/[locale]/layout.tsx`：

```tsx
import PerformanceIntegration from '@/components/PerformanceIntegration';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <PerformanceIntegration />
      </body>
    </html>
  );
}
```

### 2. 在特定页面中添加性能监控

编辑任何页面组件：

```tsx
import { usePerformanceMonitoring } from '@/components/PerformanceIntegration';

export default function Page() {
  usePerformanceMonitoring(); // 添加这行
  
  return (
    <div>
      {/* 页面内容 */}
    </div>
  );
}
```

### 3. 查看性能数据

#### 开发环境
- 打开浏览器控制台
- 查看性能指标日志
- 访问 `/admin/performance-dashboard`

#### 生产环境
- 访问 `/admin/performance-dashboard`
- 查看性能趋势和报告

## 📊 监控的指标

| 指标 | 描述 | 优秀 | 需要改进 | 较差 |
|------|------|------|----------|------|
| LCP | 最大内容绘制 | ≤2.5s | ≤4.0s | >4.0s |
| FID | 首次输入延迟 | ≤100ms | ≤300ms | >300ms |
| CLS | 累积布局偏移 | ≤0.1 | ≤0.25 | >0.25 |
| FCP | 首次内容绘制 | ≤1.8s | ≤3.0s | >3.0s |
| TTFB | 首字节时间 | ≤800ms | ≤1.8s | >1.8s |

## 🔧 配置选项

### 环境变量 (.env.local)

```env
# 启用性能监控
NEXT_PUBLIC_PERFORMANCE_MONITORING=true

# 开发环境控制台日志
NEXT_PUBLIC_PERFORMANCE_CONSOLE_LOG=true
```

### 自定义配置

```tsx
<PerformanceMonitorComponent 
  enabled={true}           // 启用监控
  showConsole={false}      // 控制台日志
/>
```

## 📈 性能优化建议

### 立即优化
1. **图片优化**: 使用WebP格式，压缩图片
2. **代码分割**: 使用动态导入
3. **缓存策略**: 设置适当的缓存头
4. **CDN**: 使用内容分发网络

### 中期优化
1. **服务端渲染**: 优化SSR性能
2. **数据库优化**: 优化查询和索引
3. **第三方脚本**: 延迟加载非关键脚本
4. **字体优化**: 预加载关键字体

### 长期优化
1. **架构优化**: 微服务、边缘计算
2. **监控系统**: 完整的APM解决方案
3. **自动化**: 性能回归测试
4. **用户体验**: 基于数据的优化

## 🚨 常见问题

### Q: 性能监控影响网站性能吗？
A: 影响很小，监控代码经过优化，对性能影响<1%。

### Q: 如何禁用性能监控？
A: 设置环境变量 `NEXT_PUBLIC_PERFORMANCE_MONITORING=false` 或移除组件。

### Q: 数据存储在哪里？
A: 默认存储在内存中，生产环境建议使用数据库。

### Q: 如何查看历史数据？
A: 访问 `/admin/performance-dashboard` 查看详细数据和分析。

## 📞 技术支持

如果遇到问题，请：

1. 检查浏览器控制台错误
2. 确认环境变量设置
3. 查看服务器日志
4. 参考完整文档：`docs/performance-monitoring.md`

---

**开始监控您的网站性能，提升用户体验！** 🎯
