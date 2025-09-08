# PDF资源管理系统 - 部署和使用指南

## 🎯 项目概述

这是一个现代化、可扩展的PDF资源管理系统，专为解决Period Hub的404错误问题而设计。系统提供了完整的PDF资源管理、搜索、预览、下载等功能，支持Legacy ID映射以确保向后兼容。

### ✨ 核心特性

- 🔍 **智能搜索** - 全文搜索、分面搜索、相关性排序
- 🗃️ **资源管理** - 完整的CRUD操作、分类管理、批量处理
- 🔗 **Legacy兼容** - 自动ID映射、向后兼容、平滑迁移
- 📊 **智能缓存** - 多策略缓存、性能优化、命中率监控
- ✅ **资源验证** - 全面验证、质量评估、错误检测
- 🌐 **URL生成** - 多类型URL、签名URL、SEO友好
- 🔧 **错误处理** - 分级日志、异常恢复、监控集成
- 📈 **元数据提取** - 自动分析、内容理解、质量评估

---

## 🚀 快速开始

### 1. 系统要求

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0.0
- **Next.js** >= 14.0.0
- **内存** >= 4GB (推荐 8GB)

### 2. 安装依赖

```bash
# 安装核心依赖
npm install

# 安装开发依赖
npm install --save-dev @types/node typescript jest @playwright/test

# 安装可选依赖（用于PDF处理）
npm install pdf-parse pdf2pic sharp
```

### 3. 环境配置

创建 `.env.local` 文件：

```env
# 环境配置
NODE_ENV=development
PDF_STORAGE_PROVIDER=local
PDF_BASE_PATH=/public/pdfs
PDF_PUBLIC_PATH=/pdfs
PDF_CDN_URL=https://your-cdn.com

# 缓存配置
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_MAX_SIZE=100

# 监控配置
LOG_LEVEL=info
ERROR_TRACKING_ENABLED=true
HEALTH_CHECK_ENABLED=true

# 安全配置
API_RATE_LIMIT=100
CORS_ORIGIN=http://localhost:3000
```

### 4. 目录结构

```
your-project/
├── lib/
│   └── pdf-resources/
│       ├── core/                    # 核心组件
│       │   ├── resource-manager.ts  # 资源管理器
│       │   ├── cache-manager.ts     # 缓存管理
│       │   ├── resource-validator.ts # 验证器
│       │   └── error-handler.ts     # 错误处理
│       ├── utils/                   # 工具模块
│       │   ├── id-mapper.ts         # ID映射
│       │   ├── url-generator.ts     # URL生成
│       │   └── metadata-extractor.ts # 元数据提取
│       └── types/                   # 类型定义
│           ├── resource.types.ts    # 资源类型
│           ├── config.types.ts      # 配置类型
│           └── api.types.ts         # API类型
├── config/
│   └── resources/
│       └── pdf-resources.config.ts # 资源配置
├── app/
│   └── [locale]/
│       └── downloads/
│           └── preview/
│               └── [id]/
│                   └── page.tsx     # 预览页面
├── scripts/
│   └── validate-resources.ts       # 验证脚本
├── __tests__/                      # 测试文件
└── examples/                       # 示例代码
```

---

## 📋 基础使用

### 初始化系统

```typescript
import { PDFResourceManager } from '@/lib/pdf-resources/core/resource-manager';
import { PDF_RESOURCE_CONFIG } from '@/config/resources/pdf-resources.config';

// 初始化资源管理器
const manager = PDFResourceManager.getInstance(PDF_RESOURCE_CONFIG);
```

### 获取资源

```typescript
// 获取单个资源
const resource = await manager.getResource('immediate-pain-relief-guide-v2');

// 按类别获取资源
const resources = await manager.getResourcesByCategory('immediate-relief');

// 获取精选资源
const featured = await manager.getFeaturedResources();

// 获取统计信息
const stats = await manager.getResourceStats();
```

### 搜索功能

```typescript
// 基础搜索
const searchResults = await manager.searchResources('疼痛缓解');

// 高级搜索
const advancedResults = await manager.searchResources('营养', {
  category: 'preparation',
  language: 'zh',
  minQuality: 7,
  limit: 10
});

// 分页搜索
const paginatedResults = await manager.searchResources('指南', {
  offset: 20,
  limit: 10
});
```

### Legacy ID映射

```typescript
import { IDMapper } from '@/lib/pdf-resources/utils/id-mapper';

const idMapper = IDMapper.getInstance();

// Legacy ID到现代ID
const modernId = idMapper.mapId('immediate-pdf-1');
// 返回: 'immediate-pain-relief-guide-v2'

// 反向映射
const legacyIds = idMapper.reverseMapId('immediate-pain-relief-guide-v2');
// 返回: ['immediate-pdf-1']

// 生成新ID
const newId = idMapper.generateId('新的指南', {
  category: 'immediate-relief',
  version: '2.0.0'
});
```

### URL生成

```typescript
import { URLGenerator } from '@/lib/pdf-resources/utils/url-generator';

const urlGenerator = URLGenerator.getInstance(PDF_RESOURCE_CONFIG.storage);

// 生成各种URL
const viewUrl = urlGenerator.generateResourceViewUrl('resource-id', { locale: 'zh' });
const downloadUrl = urlGenerator.generateResourceDownloadUrl(resource, { locale: 'zh' });
const previewUrl = urlGenerator.generateResourcePreviewUrl('resource-id', 1, { locale: 'zh' });
const searchUrl = urlGenerator.generateSearchUrl('搜索词', {}, { locale: 'zh' });
```

---

## 🔧 高级配置

### 缓存配置

```typescript
import { CacheManager } from '@/lib/pdf-resources/core/cache-manager';

const cacheConfig = {
  enabled: true,
  strategy: 'lru' as const, // 'lru' | 'lfu' | 'ttl' | 'adaptive'
  ttl: 3600, // 1小时
  maxSize: 100,
  maxMemory: 100 * 1024 * 1024, // 100MB
  
  resourceTtl: {
    resource: 3600,    // 资源缓存1小时
    search: 1800,      // 搜索结果缓存30分钟
    stats: 300,        // 统计信息缓存5分钟
    validation: 7200   // 验证结果缓存2小时
  },
  
  warmup: {
    enabled: true,
    resources: ['popular-resource-1', 'popular-resource-2'],
    categories: ['immediate-relief'],
    priority: 'high'
  }
};

const cache = new CacheManager(cacheConfig);
```

### 验证配置

```typescript
const validationConfig = {
  enabled: true,
  mode: 'strict' as const, // 'strict' | 'loose' | 'custom'
  
  file: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    minFileSize: 1024, // 1KB
    allowedFormats: ['pdf'],
    requireChecksum: false,
    virusScan: false
  },
  
  content: {
    requireTitle: true,
    requireDescription: true,
    minTitleLength: 5,
    maxTitleLength: 200,
    minDescriptionLength: 20,
    maxDescriptionLength: 1000,
    requireKeywords: true,
    minKeywords: 1,
    maxKeywords: 20,
    bannedWords: []
  },
  
  quality: {
    minOverallScore: 5.0,
    requireAllScores: true,
    autoCalculateOverall: true,
    scoreWeights: {
      content: 0.3,
      design: 0.2,
      accuracy: 0.3,
      usefulness: 0.2
    }
  }
};
```

### 错误处理配置

```typescript
const monitoringConfig = {
  enabled: true,
  
  errorTracking: {
    enabled: true,
    service: 'custom' as const,
    environment: 'production',
    sampleRate: 1.0
  },
  
  logging: {
    enabled: true,
    level: 'info' as const,
    format: 'json' as const,
    destination: 'console' as const
  },
  
  healthCheck: {
    enabled: true,
    endpoint: '/api/health',
    interval: 30,
    timeout: 5000,
    checks: [
      { name: 'storage', type: 'storage', timeout: 3000, retries: 2 },
      { name: 'cache', type: 'cache', timeout: 1000, retries: 1 }
    ]
  }
};
```

---

## 🚀 部署指南

### 1. 开发环境

```bash
# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 验证资源配置
npm run validate:resources

# 检查类型
npm run type-check
```

### 2. 生产环境构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 或使用PM2
pm2 start ecosystem.config.js
```

### 3. Docker部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用
CMD ["npm", "start"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PDF_STORAGE_PROVIDER=local
      - CACHE_ENABLED=true
    volumes:
      - ./public/pdfs:/app/public/pdfs
      - ./logs:/app/logs
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### 4. CDN配置

```typescript
// 配置CDN存储
const cdnConfig = {
  storage: {
    provider: 'cdn',
    cdnUrl: 'https://your-cdn.com',
    cdn: {
      enabled: true,
      baseUrl: 'https://your-cdn.com',
      cacheTtl: 86400 // 24小时
    }
  }
};
```

### 5. 负载均衡

```nginx
# nginx.conf
upstream pdf_app {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://pdf_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /pdfs/ {
        alias /var/www/pdfs/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/health {
        proxy_pass http://pdf_app;
        access_log off;
    }
}
```

---

## 🧪 测试

### 运行测试

```bash
# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# E2E测试
npm run test:e2e

# 覆盖率测试
npm run test:coverage

# 性能测试
npm run test:performance
```

### 测试示例

```typescript
// __tests__/unit/resource-manager.test.ts
import { PDFResourceManager } from '@/lib/pdf-resources/core/resource-manager';

describe('PDFResourceManager', () => {
  let manager: PDFResourceManager;

  beforeEach(() => {
    manager = PDFResourceManager.getInstance(testConfig);
  });

  it('应该获取资源', async () => {
    const resource = await manager.getResource('test-id');
    expect(resource).toBeDefined();
    expect(resource?.id).toBe('test-id');
  });

  it('应该处理Legacy ID映射', async () => {
    const resource = await manager.getResource('immediate-pdf-1');
    expect(resource?.id).toBe('immediate-pain-relief-guide-v2');
  });
});
```

---

## 📊 监控和维护

### 1. 健康检查

```bash
# 检查系统状态
curl http://localhost:3000/api/health

# 检查特定服务
curl http://localhost:3000/api/health/cache
curl http://localhost:3000/api/health/storage
```

### 2. 性能监控

```typescript
// 获取系统指标
const healthStatus = await manager.getHealthStatus();
const cacheStats = cache.getStats();
const errorStats = errorHandler.getErrorStats();

console.log('系统状态:', healthStatus.status);
console.log('缓存命中率:', cacheStats.hitRate);
console.log('错误数量:', errorStats.totalErrors);
```

### 3. 日志监控

```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
tail -f logs/error.log

# 过滤特定日志
grep "ERROR" logs/app.log | tail -20
```

### 4. 性能优化

```typescript
// 预热缓存
await cache.warmup([
  { key: 'popular-1', value: popularResource1 },
  { key: 'popular-2', value: popularResource2 }
]);

// 批量操作
const batchResults = await manager.batchOperation('update', updates);

// 清理过期缓存
cache.cleanup();
```

---

## 🔒 安全考虑

### 1. 文件上传安全

```typescript
const securityConfig = {
  upload: {
    allowedMimeTypes: ['application/pdf'],
    maxFileSize: 50 * 1024 * 1024,
    scanVirus: true,
    quarantineOnThreat: true,
    allowExecutables: false
  }
};
```

### 2. API安全

```typescript
const apiSecurity = {
  requireApiKey: true,
  enableJWT: true,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    maxRequests: 100
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
    credentials: true
  }
};
```

### 3. 数据保护

```typescript
const dataProtection = {
  encryptSensitiveData: true,
  anonymizeIPs: true,
  gdprCompliant: true,
  dataRetention: {
    logs: 90, // 天
    analytics: 365,
    userSessions: 30
  }
};
```

---

## 🐛 故障排除

### 常见问题

**1. 404错误：资源未找到**
```bash
# 验证资源配置
npm run validate:resources

# 检查Legacy映射
node -e "console.log(require('./lib/pdf-resources/utils/id-mapper').IDMapper.getInstance().mapId('immediate-pdf-1'))"
```

**2. 缓存问题**
```typescript
// 清除所有缓存
cache.clear();

// 清除特定模式
cache.deletePattern('resources:*');

// 检查缓存统计
console.log(cache.getStats());
```

**3. 性能问题**
```bash
# 检查系统资源
node -e "console.log(process.memoryUsage())"

# 分析慢查询
npm run analyze:performance
```

**4. 构建错误**
```bash
# 清理构建缓存
rm -rf .next node_modules
npm install
npm run build
```

### 调试模式

```typescript
// 启用详细日志
const debugConfig = {
  logging: {
    level: 'debug',
    format: 'text',
    destination: 'console'
  }
};

// 启用错误跟踪
const errorHandler = new ErrorHandler({
  ...monitoringConfig,
  errorTracking: {
    enabled: true,
    sampleRate: 1.0 // 记录所有错误
  }
});
```

---

## 📚 API参考

### 资源管理API

```typescript
interface PDFResourceManager {
  // 资源获取
  getResource(id: string): Promise<PDFResource | null>;
  getResources(options?: ResourceQueryOptions): Promise<PDFResource[]>;
  getResourcesByCategory(category: ResourceCategory): Promise<PDFResource[]>;
  getFeaturedResources(): Promise<PDFResource[]>;
  
  // 搜索
  searchResources(query: string, options?: SearchOptions): Promise<PaginatedSearchResult>;
  
  // 资源操作
  createResource(resource: PDFResource): Promise<PDFResource>;
  updateResource(id: string, updates: Partial<PDFResource>): Promise<PDFResource>;
  deleteResource(id: string): Promise<boolean>;
  
  // 批量操作
  batchOperation(operation: string, resources: any[]): Promise<BatchOperationResult>;
  
  // 统计和健康
  getResourceStats(): Promise<ResourceStats>;
  getHealthStatus(): Promise<HealthStatus>;
  validateAllMappings(): Promise<ValidationResult>;
}
```

### 缓存API

```typescript
interface CacheManager {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  delete(key: string): boolean;
  clear(): void;
  
  mget<T>(keys: string[]): Record<string, T | null>;
  mset(entries: Array<{key: string; value: any; ttl?: number}>): void;
  deletePattern(pattern: string): number;
  
  getStats(): CacheStats;
  cleanup(): void;
  warmup(entries: Array<{key: string; value: any}>): Promise<void>;
}
```

---

## 🤝 贡献指南

### 开发流程

1. **Fork** 项目
2. **创建** 功能分支: `git checkout -b feature/amazing-feature`
3. **提交** 更改: `git commit -m 'Add amazing feature'`
4. **推送** 分支: `git push origin feature/amazing-feature`
5. **创建** Pull Request

### 代码规范

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 提交前检查
npm run pre-commit
```

### 测试要求

- 单元测试覆盖率 >= 80%
- 集成测试覆盖核心功能
- E2E测试覆盖用户流程
- 性能测试通过基准

---

## 📞 支持

- **文档**: [项目Wiki](https://github.com/your-repo/wiki)
- **问题**: [GitHub Issues](https://github.com/your-repo/issues)
- **讨论**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **邮件**: support@your-domain.com

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

感谢所有为此项目做出贡献的开发者和用户。

特别感谢：
- Next.js 团队提供的优秀框架
- TypeScript 团队提供的类型安全
- 所有测试工具和库的维护者

---

**🎉 现在您已经准备好使用PDF资源管理系统了！**

如有任何问题，请参考故障排除部分或联系支持团队。