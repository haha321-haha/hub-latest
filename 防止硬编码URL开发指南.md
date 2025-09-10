# 🛡️ 防止硬编码URL开发指南

## 📋 **核心原则**

**永远不要硬编码URL！** 使用配置中心和环境变量管理所有URL。

## 🔧 **正确的URL使用方式**

### **1. 使用URL配置中心**

```typescript
// ✅ 正确 - 使用配置中心
import { URL_CONFIG } from '@/lib/url-config';

// 获取基础URL
const baseUrl = URL_CONFIG.baseUrl;

// 获取页面URL
const homeUrl = URL_CONFIG.pages.home;
const articlesUrl = URL_CONFIG.pages.articles;

// 动态生成URL
const customUrl = URL_CONFIG.getUrl('/custom-path');
const canonicalUrl = URL_CONFIG.getCanonicalUrl('/page');
const pageUrl = URL_CONFIG.getPageUrl('zh', '/articles');
```

### **2. 使用环境变量**

```typescript
// ✅ 正确 - 使用环境变量
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
const apiUrl = `${baseUrl}/api`;
```

### **3. 页面元数据示例**

```typescript
// ✅ 正确 - 页面元数据
export const metadata: Metadata = {
  url: URL_CONFIG.getUrl(`/${locale}/page`),
  canonical: URL_CONFIG.getCanonicalUrl(`/${locale}/page`),
  openGraph: {
    url: URL_CONFIG.getUrl(`/${locale}/page`),
  },
  alternates: {
    canonical: URL_CONFIG.getCanonicalUrl(`/${locale}/page`),
    languages: {
      'zh-CN': URL_CONFIG.getPageUrl('zh', '/page'),
      'en-US': URL_CONFIG.getPageUrl('en', '/page'),
    },
  },
};
```

## ❌ **禁止的做法**

```typescript
// ❌ 错误 - 硬编码URL
const url = 'https://periodhub.health/page';
const canonical = `https://www.periodhub.health/${locale}/page`;

// ❌ 错误 - 在模板字符串中硬编码
const url = `https://periodhub.health/${locale}/page`;

// ❌ 错误 - 在配置对象中硬编码
const config = {
  url: 'https://periodhub.health',
  api: 'https://periodhub.health/api',
};
```

## 🔍 **检测工具**

### **1. 自动检测脚本**

```bash
# 检测硬编码URL
node scripts/detect-hardcoded-urls.js

# 安全修复硬编码URL
node scripts/safe-fix-hardcoded-urls.js
```

### **2. Git钩子**

每次提交前自动检测，防止硬编码URL进入代码库。

### **3. ESLint规则**

在开发过程中实时检测硬编码URL。

## 🚀 **修复流程**

### **发现硬编码URL时**

1. **立即停止** - 不要继续开发
2. **运行检测** - `node scripts/detect-hardcoded-urls.js`
3. **安全修复** - `node scripts/safe-fix-hardcoded-urls.js`
4. **验证结果** - 确保没有新的硬编码
5. **继续开发** - 使用正确的URL配置

### **添加新功能时**

1. **检查URL配置** - 确保 `lib/url-config.ts` 包含所需URL
2. **使用配置函数** - 使用 `URL_CONFIG.getUrl()` 等函数
3. **测试验证** - 运行检测脚本确保没有硬编码
4. **提交代码** - Git钩子会自动验证

## 📝 **最佳实践**

### **1. 统一URL管理**

- 所有URL都通过 `lib/url-config.ts` 管理
- 使用环境变量 `NEXT_PUBLIC_BASE_URL`
- 避免在代码中直接写URL

### **2. 代码审查**

- 每次代码审查都要检查URL使用
- 确保新代码使用正确的URL配置
- 拒绝包含硬编码URL的代码

### **3. 持续监控**

- 定期运行检测脚本
- 监控Git提交中的硬编码URL
- 及时修复发现的问题

## ⚠️ **注意事项**

1. **环境变量优先级** - 环境变量会覆盖默认配置
2. **路径处理** - 使用 `URL_CONFIG.getUrl()` 自动处理路径
3. **多语言支持** - 使用 `URL_CONFIG.getPageUrl()` 处理多语言URL
4. **测试环境** - 确保测试环境使用正确的URL配置

## 🎯 **目标**

通过这套机制，确保：
- ✅ 没有硬编码URL
- ✅ 所有URL统一管理
- ✅ 环境配置灵活
- ✅ 开发过程可控
- ✅ 代码质量保证

**记住：硬编码URL是技术债务，预防胜于治疗！**
