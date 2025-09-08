# 性能监控实现指南

## 概述

本指南详细说明如何在PeriodHub项目中实现性能监控，特别是Core Web Vitals的监控。

## 核心功能

### 1. Core Web Vitals监控
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间
- **FID (First Input Delay)**: 首次输入延迟
- **CLS (Cumulative Layout Shift)**: 累积布局偏移
- **FCP (First Contentful Paint)**: 首次内容绘制时间
- **TTFB (Time to First Byte)**: 首字节时间

### 2. 性能等级评估
- **Good**: 性能优秀
- **Needs Improvement**: 需要改进
- **Poor**: 性能较差

## 使用方法

### 1. 在页面中添加性能监控

```tsx
// 在根布局或特定页面中添加
import PerformanceMonitorComponent from '@/components/PerformanceMonitor';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <PerformanceMonitorComponent enabled={true} showConsole={true} />
      </body>
    </html>
  );
}
```

### 2. 在开发环境中查看性能指标

```tsx
// 添加性能指标显示组件
import { PerformanceMetricsDisplay } from '@/components/PerformanceMonitor';

export default function Page() {
  return (
    <div>
      {/* 页面内容 */}
      <PerformanceMetricsDisplay />
    </div>
  );
}
```

### 3. 访问性能仪表板

访问 `/admin/performance-dashboard` 查看详细的性能数据和分析。

## 配置选项

### 环境变量

在 `.env.local` 中添加：

```env
# 性能监控配置
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_PERFORMANCE_CONSOLE_LOG=true
```

### 性能阈值配置

在 `lib/performance-monitor.ts` 中修改阈值：

```typescript
const thresholds = {
  LCP: { good: 2500, poor: 4000 },    // 毫秒
  FID: { good: 100, poor: 300 },      // 毫秒
  CLS: { good: 0.1, poor: 0.25 },     // 无单位
  FCP: { good: 1800, poor: 3000 },    // 毫秒
  TTFB: { good: 800, poor: 1800 },    // 毫秒
};
```

## 监控数据存储

### 本地存储
- 性能数据存储在内存中（重启后丢失）
- 适合开发和测试环境

### 生产环境建议
1. **数据库存储**: 使用PostgreSQL或MongoDB
2. **分析服务**: 集成Google Analytics或Mixpanel
3. **监控服务**: 使用Vercel Analytics、New Relic等

## API端点

### 获取性能数据
```bash
GET /api/performance?limit=50&url=/specific-page
```

### 发送性能数据
```bash
POST /api/performance
Content-Type: application/json

{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "url": "https://periodhub.health/zh",
  "metrics": {
    "LCP": 1200,
    "FID": 50,
    "CLS": 0.05,
    "FCP": 800,
    "TTFB": 200
  }
}
```

## 性能优化建议

### 1. LCP优化
- 压缩图片
- 使用CDN
- 优化关键渲染路径
- 预加载重要资源

### 2. FID优化
- 减少JavaScript执行时间
- 使用代码分割
- 延迟非关键JavaScript
- 优化第三方脚本

### 3. CLS优化
- 为图片和广告设置尺寸
- 避免动态插入内容
- 使用CSS transform代替改变布局的属性
- 预加载字体

### 4. FCP优化
- 减少阻塞资源
- 优化CSS和JavaScript
- 使用关键CSS内联
- 优化服务器响应

### 5. TTFB优化
- 使用CDN
- 优化数据库查询
- 启用缓存
- 优化服务器配置

## 监控最佳实践

### 1. 定期检查
- 每周检查性能仪表板
- 关注性能趋势变化
- 及时处理性能问题

### 2. 性能预算
- 设定性能目标
- 监控关键指标
- 在CI/CD中集成性能检查

### 3. 用户反馈
- 收集用户性能反馈
- 监控真实用户性能数据
- 分析性能与用户体验的关系

## 故障排除

### 常见问题

1. **性能监控不工作**
   - 检查浏览器是否支持PerformanceObserver
   - 确认组件正确导入和初始化

2. **数据不准确**
   - 检查网络条件
   - 确认设备性能
   - 验证测试环境

3. **仪表板无法访问**
   - 检查API端点是否正常
   - 确认数据存储配置
   - 查看服务器日志

### 调试技巧

1. **控制台日志**
   ```javascript
   // 启用详细日志
   const monitor = PerformanceMonitor.getInstance();
   console.log('Current metrics:', monitor.getMetrics());
   ```

2. **性能报告**
   ```javascript
   // 生成详细报告
   const report = monitor.generateReport();
   console.log('Performance report:', report);
   ```

## 扩展功能

### 1. 自定义指标
- 添加业务相关指标
- 监控特定功能性能
- 集成第三方监控服务

### 2. 告警系统
- 设置性能阈值告警
- 邮件或Slack通知
- 自动性能报告

### 3. 性能分析
- 趋势分析
- 对比分析
- 用户行为关联分析

## 总结

通过实施这套性能监控系统，您可以：

1. **实时监控**网站性能指标
2. **及时发现问题**并优化
3. **持续改进**用户体验
4. **数据驱动**的优化决策

定期检查性能数据，根据监控结果进行优化，确保网站始终保持最佳性能状态。
