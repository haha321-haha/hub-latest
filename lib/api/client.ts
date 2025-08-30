'use client';

import { performanceMonitor } from '../performance/monitor';
import { useAppStore } from '../stores/appStore';

// API响应类型
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  requestId: string;
}

// API错误类型
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
    public requestId?: string
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

// 请求配置
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  signal?: AbortSignal;
}

// 缓存配置
interface CacheConfig {
  ttl: number; // 生存时间（毫秒）
  key: string;
}

// 缓存项
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// API客户端类
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private cache: Map<string, CacheItem<any>> = new Map();
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: any) => any> = [];

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // 添加请求拦截器
  public addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  public addResponseInterceptor(interceptor: (response: any) => any) {
    this.responseInterceptors.push(interceptor);
  }

  // 设置默认头部
  public setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  // 生成请求ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 缓存管理
  private getCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}_${url}_${JSON.stringify(config.body || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // 清理过期缓存
  private cleanExpiredCache() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 重试逻辑
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(delay);
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // 判断是否应该重试
  private shouldRetry(error: any): boolean {
    if (error instanceof ApiError) {
      // 5xx错误或网络错误重试
      return error.status >= 500 || error.status === 0;
    }
    return false;
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 主要请求方法
  public async request<T = any>(
    url: string,
    config: RequestConfig = {},
    cacheConfig?: CacheConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = performance.now();

    try {
      // 应用请求拦截器
      let finalConfig = { ...config };
      for (const interceptor of this.requestInterceptors) {
        finalConfig = interceptor(finalConfig);
      }

      // 检查缓存
      if (cacheConfig && (finalConfig.method === 'GET' || !finalConfig.method)) {
        const cacheKey = this.getCacheKey(url, finalConfig);
        const cachedData = this.getFromCache<ApiResponse<T>>(cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }

      // 构建请求
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
      const headers = { ...this.defaultHeaders, ...finalConfig.headers };
      
      const fetchConfig: RequestInit = {
        method: finalConfig.method || 'GET',
        headers,
        cache: finalConfig.cache,
        signal: finalConfig.signal,
      };

      if (finalConfig.body && finalConfig.method !== 'GET') {
        fetchConfig.body = typeof finalConfig.body === 'string' 
          ? finalConfig.body 
          : JSON.stringify(finalConfig.body);
      }

      // 设置超时
      const timeoutSignal = finalConfig.timeout 
        ? AbortSignal.timeout(finalConfig.timeout)
        : undefined;

      if (timeoutSignal) {
        fetchConfig.signal = timeoutSignal;
      }

      // 执行请求（带重试）
      const response = await this.withRetry(
        () => fetch(fullUrl, fetchConfig),
        finalConfig.retries || 3,
        finalConfig.retryDelay || 1000
      );

      const endTime = performance.now();

      // 记录性能
      performanceMonitor.recordApiCall(
        fullUrl,
        finalConfig.method || 'GET',
        startTime,
        endTime,
        response.status,
        parseInt(response.headers.get('content-length') || '0')
      );

      // 处理响应
      if (!response.ok) {
        const errorData = await response.text();
        throw new ApiError(
          response.status,
          response.statusText,
          errorData,
          requestId
        );
      }

      const responseData = await response.json();
      
      // 构建标准响应
      const apiResponse: ApiResponse<T> = {
        data: responseData,
        success: true,
        timestamp: new Date().toISOString(),
        requestId,
      };

      // 应用响应拦截器
      let finalResponse = apiResponse;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = interceptor(finalResponse);
      }

      // 缓存响应
      if (cacheConfig && (finalConfig.method === 'GET' || !finalConfig.method)) {
        const cacheKey = this.getCacheKey(url, finalConfig);
        this.setCache(cacheKey, finalResponse, cacheConfig.ttl);
      }

      return finalResponse;

    } catch (error) {
      const endTime = performance.now();
      
      // 记录错误性能
      performanceMonitor.recordApiCall(
        url,
        config.method || 'GET',
        startTime,
        endTime,
        error instanceof ApiError ? error.status : 0
      );

      // 更新应用状态
      useAppStore.getState().incrementErrorCount();

      throw error;
    }
  }

  // 便捷方法
  public async get<T = any>(
    url: string,
    config?: Omit<RequestConfig, 'method'>,
    cacheConfig?: CacheConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' }, cacheConfig);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body: data });
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body: data });
  }

  public async delete<T = any>(
    url: string,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body: data });
  }

  // 清理缓存
  public clearCache() {
    this.cache.clear();
  }

  // 获取缓存统计
  public getCacheStats() {
    this.cleanExpiredCache();
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// 创建默认客户端实例
export const apiClient = new ApiClient();

// 设置默认拦截器
apiClient.addRequestInterceptor((config) => {
  // 添加认证头部（如果需要）
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // 可以在这里处理全局响应逻辑
  return response;
});

// React Hook
export const useApiClient = () => {
  return {
    client: apiClient,
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    delete: apiClient.delete.bind(apiClient),
    patch: apiClient.patch.bind(apiClient),
  };
};
