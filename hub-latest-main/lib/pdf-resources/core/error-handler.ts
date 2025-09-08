// lib/pdf-resources/core/error-handler.ts

import { ErrorContext, SystemEvent } from '../types/resource-types';
import { MonitoringConfig, LogLevel } from '../types/config-types';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  FILE_ACCESS_ERROR = 'FILE_ACCESS_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  USER_ERROR = 'USER_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR'
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * 错误详情接口
 */
export interface ErrorDetails {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: string;
  cause?: Error;
  context?: ErrorContext;
  timestamp: Date;
  stackTrace?: string;
  suggestion?: string;
  documentation?: string;
  retryable?: boolean;
  metadata?: Record<string, any>;
}

/**
 * 错误处理策略接口
 */
interface IErrorStrategy {
  canHandle(error: ErrorDetails): boolean;
  handle(error: ErrorDetails): Promise<void>;
}

/**
 * 日志错误处理策略
 */
class LoggingErrorStrategy implements IErrorStrategy {
  constructor(private config: MonitoringConfig) {}

  canHandle(error: ErrorDetails): boolean {
    return this.config.logging.enabled;
  }

  async handle(error: ErrorDetails): Promise<void> {
    const logLevel = this.getLogLevel(error.severity);
    const logEntry = this.formatLogEntry(error);

    switch (this.config.logging.destination) {
      case 'console':
        this.logToConsole(logLevel, logEntry);
        break;
      case 'file':
        await this.logToFile(logLevel, logEntry);
        break;
      case 'remote':
        await this.logToRemote(logLevel, logEntry);
        break;
      case 'multiple':
        this.logToConsole(logLevel, logEntry);
        if (this.config.logging.file) {
          await this.logToFile(logLevel, logEntry);
        }
        if (this.config.logging.remote) {
          await this.logToRemote(logLevel, logEntry);
        }
        break;
    }
  }

  private getLogLevel(severity: ErrorSeverity): LogLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  private formatLogEntry(error: ErrorDetails): any {
    const entry = {
      timestamp: error.timestamp.toISOString(),
      level: this.getLogLevel(error.severity),
      type: error.type,
      severity: error.severity,
      message: error.message,
      code: error.code,
      details: error.details,
      context: error.context,
      metadata: error.metadata
    };

    if (this.config.logging.format === 'json') {
      return JSON.stringify(entry);
    } else {
      return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message} (${entry.type}${entry.code ? `:${entry.code}` : ''})`;
    }
  }

  private logToConsole(level: LogLevel, entry: any): void {
    switch (level) {
      case 'debug':
        console.debug(entry);
        break;
      case 'info':
        console.info(entry);
        break;
      case 'warn':
        console.warn(entry);
        break;
      case 'error':
      case 'fatal':
        console.error(entry);
        break;
    }
  }

  private async logToFile(level: LogLevel, entry: any): Promise<void> {
    if (!this.config.logging.file) return;

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const logDir = path.dirname(this.config.logging.file.path);
      await fs.mkdir(logDir, { recursive: true });
      
      const logLine = typeof entry === 'string' ? entry : JSON.stringify(entry);
      await fs.appendFile(this.config.logging.file.path, logLine + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private async logToRemote(level: LogLevel, entry: any): Promise<void> {
    if (!this.config.logging.remote) return;

    try {
      const response = await fetch(this.config.logging.remote.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.logging.remote.apiKey && {
            'Authorization': `Bearer ${this.config.logging.remote.apiKey}`
          })
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          level,
          entry: typeof entry === 'string' ? { message: entry } : entry
        })
      });

      if (!response.ok) {
        console.error('Failed to send log to remote endpoint:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error);
    }
  }
}

/**
 * 监控错误处理策略
 */
class MonitoringErrorStrategy implements IErrorStrategy {
  constructor(private config: MonitoringConfig) {}

  canHandle(error: ErrorDetails): boolean {
    return this.config.errorTracking.enabled;
  }

  async handle(error: ErrorDetails): Promise<void> {
    if (this.shouldSample(error)) {
      await this.sendToMonitoring(error);
    }
  }

  private shouldSample(error: ErrorDetails): boolean {
    return Math.random() < this.config.errorTracking.sampleRate;
  }

  private async sendToMonitoring(error: ErrorDetails): Promise<void> {
    try {
      const payload = {
        timestamp: error.timestamp.toISOString(),
        environment: this.config.errorTracking.environment,
        release: this.config.errorTracking.release,
        error: {
          type: error.type,
          message: error.message,
          code: error.code,
          severity: error.severity,
          stackTrace: error.stackTrace,
          context: error.context,
          metadata: error.metadata
        }
      };

      switch (this.config.errorTracking.service) {
        case 'sentry':
          await this.sendToSentry(payload);
          break;
        case 'bugsnag':
          await this.sendToBugsnag(payload);
          break;
        case 'rollbar':
          await this.sendToRollbar(payload);
          break;
        case 'custom':
          await this.sendToCustomEndpoint(payload);
          break;
      }
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring service:', monitoringError);
    }
  }

  private async sendToSentry(payload: any): Promise<void> {
    if (!this.config.errorTracking.dsn) return;

    // 简化的Sentry集成
    const response = await fetch(this.config.errorTracking.dsn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.statusText}`);
    }
  }

  private async sendToBugsnag(payload: any): Promise<void> {
    // Bugsnag集成实现
    console.log('Sending to Bugsnag:', payload);
  }

  private async sendToRollbar(payload: any): Promise<void> {
    // Rollbar集成实现
    console.log('Sending to Rollbar:', payload);
  }

  private async sendToCustomEndpoint(payload: any): Promise<void> {
    // 自定义监控端点
    console.log('Sending to custom monitoring:', payload);
  }
}

/**
 * 重试错误处理策略
 */
class RetryErrorStrategy implements IErrorStrategy {
  private retryCount = new Map<string, number>();
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1秒

  canHandle(error: ErrorDetails): boolean {
    return error.retryable === true && this.getRetryCount(error) < this.maxRetries;
  }

  async handle(error: ErrorDetails): Promise<void> {
    const retryKey = this.getRetryKey(error);
    const currentRetries = this.getRetryCount(error);
    
    this.retryCount.set(retryKey, currentRetries + 1);

    // 指数退避
    const delay = this.retryDelay * Math.pow(2, currentRetries);
    
    setTimeout(() => {
      // 这里应该重新执行失败的操作
      console.log(`Retrying operation after ${delay}ms (attempt ${currentRetries + 1}/${this.maxRetries})`);
    }, delay);
  }

  private getRetryKey(error: ErrorDetails): string {
    return `${error.type}:${error.context?.operation || 'unknown'}:${error.context?.resourceId || 'unknown'}`;
  }

  private getRetryCount(error: ErrorDetails): number {
    const key = this.getRetryKey(error);
    return this.retryCount.get(key) || 0;
  }
}

/**
 * 用户通知错误处理策略
 */
class NotificationErrorStrategy implements IErrorStrategy {
  canHandle(error: ErrorDetails): boolean {
    return error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL;
  }

  async handle(error: ErrorDetails): Promise<void> {
    // 这里可以集成各种通知服务
    await this.sendNotification(error);
  }

  private async sendNotification(error: ErrorDetails): Promise<void> {
    const message = this.formatNotificationMessage(error);
    
    // 示例：发送到Slack、邮件、短信等
    console.log('CRITICAL ERROR NOTIFICATION:', message);
    
    // 实际实现中可以集成:
    // - Slack Webhook
    // - SendGrid邮件
    // - Twilio短信
    // - 企业微信
    // - 钉钉等
  }

  private formatNotificationMessage(error: ErrorDetails): string {
    return `
🚨 PDF资源系统严重错误

类型: ${error.type}
严重级别: ${error.severity}
消息: ${error.message}
时间: ${error.timestamp.toISOString()}
${error.context?.operation ? `操作: ${error.context.operation}` : ''}
${error.context?.resourceId ? `资源ID: ${error.context.resourceId}` : ''}
${error.suggestion ? `建议: ${error.suggestion}` : ''}
    `.trim();
  }
}

/**
 * 错误恢复策略
 */
class RecoveryErrorStrategy implements IErrorStrategy {
  canHandle(error: ErrorDetails): boolean {
    return [
      ErrorType.CACHE_ERROR,
      ErrorType.STORAGE_ERROR,
      ErrorType.NETWORK_ERROR
    ].includes(error.type);
  }

  async handle(error: ErrorDetails): Promise<void> {
    try {
      switch (error.type) {
        case ErrorType.CACHE_ERROR:
          await this.recoverFromCacheError(error);
          break;
        case ErrorType.STORAGE_ERROR:
          await this.recoverFromStorageError(error);
          break;
        case ErrorType.NETWORK_ERROR:
          await this.recoverFromNetworkError(error);
          break;
      }
    } catch (recoveryError) {
      console.error('Error recovery failed:', recoveryError);
    }
  }

  private async recoverFromCacheError(error: ErrorDetails): Promise<void> {
    console.log('Attempting cache error recovery...');
    // 实现缓存恢复逻辑：
    // - 清除损坏的缓存
    // - 切换到备用缓存
    // - 临时禁用缓存
  }

  private async recoverFromStorageError(error: ErrorDetails): Promise<void> {
    console.log('Attempting storage error recovery...');
    // 实现存储恢复逻辑：
    // - 检查磁盘空间
    // - 切换到备用存储
    // - 清理临时文件
  }

  private async recoverFromNetworkError(error: ErrorDetails): Promise<void> {
    console.log('Attempting network error recovery...');
    // 实现网络恢复逻辑：
    // - 切换到备用端点
    // - 启用离线模式
    // - 重新建立连接
  }
}

/**
 * 主错误处理器
 */
export class ErrorHandler {
  private strategies: IErrorStrategy[] = [];
  private config: MonitoringConfig;
  private eventListeners: Map<ErrorType, Array<(error: ErrorDetails) => void>> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.initializeStrategies();
  }

  /**
   * 处理错误
   */
  async handleError(
    error: Error | ErrorDetails,
    context?: Partial<ErrorContext>
  ): Promise<void> {
    const errorDetails = this.normalizeError(error, context);
    
    // 触发事件监听器
    this.triggerEventListeners(errorDetails);

    // 执行所有适用的错误处理策略
    const applicableStrategies = this.strategies.filter(strategy => 
      strategy.canHandle(errorDetails)
    );

    await Promise.allSettled(
      applicableStrategies.map(strategy => strategy.handle(errorDetails))
    );
  }

  /**
   * 记录错误日志
   */
  logError(
    message: string,
    context?: Partial<ErrorContext>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void {
    const errorDetails: ErrorDetails = {
      type: ErrorType.SYSTEM_ERROR,
      severity,
      message,
      context: this.buildContext(context),
      timestamp: new Date(),
      retryable: false
    };

    this.handleError(errorDetails);
  }

  /**
   * 记录警告
   */
  logWarning(
    message: string,
    context?: Partial<ErrorContext>
  ): void {
    this.logError(message, context, ErrorSeverity.LOW);
  }

  /**
   * 记录信息
   */
  logInfo(
    message: string,
    context?: Partial<ErrorContext>
  ): void {
    const errorDetails: ErrorDetails = {
      type: ErrorType.SYSTEM_ERROR,
      severity: ErrorSeverity.LOW,
      message,
      context: this.buildContext(context),
      timestamp: new Date(),
      retryable: false
    };

    // 只使用日志策略
    const loggingStrategy = this.strategies.find(s => s instanceof LoggingErrorStrategy);
    if (loggingStrategy) {
      loggingStrategy.handle(errorDetails);
    }
  }

  /**
   * 创建业务异常
   */
  createBusinessError(
    message: string,
    code?: string,
    context?: Partial<ErrorContext>
  ): ErrorDetails {
    return {
      type: ErrorType.BUSINESS_LOGIC_ERROR,
      severity: ErrorSeverity.MEDIUM,
      message,
      code,
      context: this.buildContext(context),
      timestamp: new Date(),
      retryable: false
    };
  }

  /**
   * 创建验证异常
   */
  createValidationError(
    message: string,
    field?: string,
    context?: Partial<ErrorContext>
  ): ErrorDetails {
    return {
      type: ErrorType.VALIDATION_ERROR,
      severity: ErrorSeverity.LOW,
      message,
      details: field ? `验证失败字段: ${field}` : undefined,
      context: this.buildContext(context),
      timestamp: new Date(),
      retryable: false
    };
  }

  /**
   * 添加错误事件监听器
   */
  addEventListener(
    errorType: ErrorType,
    listener: (error: ErrorDetails) => void
  ): void {
    if (!this.eventListeners.has(errorType)) {
      this.eventListeners.set(errorType, []);
    }
    this.eventListeners.get(errorType)!.push(listener);
  }

  /**
   * 移除错误事件监听器
   */
  removeEventListener(
    errorType: ErrorType,
    listener: (error: ErrorDetails) => void
  ): void {
    const listeners = this.eventListeners.get(errorType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 添加自定义错误处理策略
   */
  addStrategy(strategy: IErrorStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * 移除错误处理策略
   */
  removeStrategy(strategy: IErrorStrategy): void {
    const index = this.strategies.indexOf(strategy);
    if (index > -1) {
      this.strategies.splice(index, 1);
    }
  }

  /**
   * 获取错误统计信息
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: ErrorDetails[];
  } {
    // 这里应该从持久化存储中获取统计信息
    // 为简化示例，返回模拟数据
    return {
      totalErrors: 0,
      errorsByType: {} as Record<ErrorType, number>,
      errorsBySeverity: {} as Record<ErrorSeverity, number>,
      recentErrors: []
    };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.reinitializeStrategies();
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.strategies = [];
    this.eventListeners.clear();
  }

  private initializeStrategies(): void {
    this.strategies = [
      new LoggingErrorStrategy(this.config),
      new MonitoringErrorStrategy(this.config),
      new RetryErrorStrategy(),
      new NotificationErrorStrategy(),
      new RecoveryErrorStrategy()
    ];
  }

  private reinitializeStrategies(): void {
    this.strategies = [];
    this.initializeStrategies();
  }

  private normalizeError(
    error: Error | ErrorDetails,
    context?: Partial<ErrorContext>
  ): ErrorDetails {
    if (this.isErrorDetails(error)) {
      // 合并现有ErrorDetails的上下文和新上下文
      const mergedContext = this.buildContext({
        ...error.context,
        ...context
      });
      
      return {
        ...error,
        context: mergedContext
      };
    }

    // 将标准Error转换为ErrorDetails
    return {
      type: this.inferErrorType(error),
      severity: this.inferErrorSeverity(error),
      message: error.message,
      cause: error,
      context: this.buildContext(context),
      timestamp: new Date(),
      stackTrace: error.stack,
      retryable: this.isRetryableError(error)
    };
  }

  private isErrorDetails(obj: any): obj is ErrorDetails {
    return obj && typeof obj === 'object' && 'type' in obj && 'severity' in obj;
  }

  private inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('not found')) {
      return ErrorType.RESOURCE_NOT_FOUND;
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorType.PERMISSION_ERROR;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK_ERROR;
    }
    if (message.includes('cache')) {
      return ErrorType.CACHE_ERROR;
    }
    if (message.includes('storage') || message.includes('file')) {
      return ErrorType.STORAGE_ERROR;
    }
    if (message.includes('validation')) {
      return ErrorType.VALIDATION_ERROR;
    }
    
    return ErrorType.SYSTEM_ERROR;
  }

  private inferErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return ErrorSeverity.LOW;
    }
    
    return ErrorSeverity.MEDIUM;
  }

  private isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /connection/i,
      /temporary/i,
      /rate.?limit/i
    ];
    
    return retryablePatterns.some(pattern => pattern.test(error.message));
  }

  private buildContext(context?: Partial<ErrorContext>): ErrorContext {
    return {
      operation: 'unknown',
      timestamp: new Date(),
      ...context
    };
  }

  private triggerEventListeners(error: ErrorDetails): void {
    const listeners = this.eventListeners.get(error.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(error);
        } catch (listenerError) {
          console.error('Error in event listener:', listenerError);
        }
      });
    }
  }
}

/**
 * 错误处理器工厂
 */
export class ErrorHandlerFactory {
  private static instance: ErrorHandler | null = null;

  /**
   * 获取单例实例
   */
  static getInstance(config: MonitoringConfig): ErrorHandler {
    if (!this.instance) {
      this.instance = new ErrorHandler(config);
    }
    return this.instance;
  }

  /**
   * 创建新实例
   */
  static createInstance(config: MonitoringConfig): ErrorHandler {
    return new ErrorHandler(config);
  }

  /**
   * 销毁单例实例
   */
  static destroyInstance(): void {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
}

/**
 * 全局错误处理装饰器
 */
export function handleErrors(
  errorHandler: ErrorHandler,
  context?: Partial<ErrorContext>
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        await errorHandler.handleError(error as Error, {
          ...context,
          operation: `${target.constructor.name}.${propertyName}`
        });
        throw error;
      }
    };
  };
}