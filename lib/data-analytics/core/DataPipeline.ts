import { EventCollector } from './EventCollector';
import { MetricsEngine } from './MetricsEngine';
import { 
  EnhancedUserEvent, 
  DataPipelineStatus, 
  DashboardData,
  CoreMetrics,
  MetricsResult
} from '../types/analytics.types';

/**
 * 数据处理管道
 * 负责协调事件收集、数据处理和指标计算
 */
export class DataPipeline {
  private eventCollector: EventCollector;
  private metricsEngine: MetricsEngine;
  private pipelineStatus: DataPipelineStatus;
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  constructor() {
    this.eventCollector = new EventCollector();
    this.metricsEngine = new MetricsEngine();
    
    this.pipelineStatus = {
      name: 'Period Hub Analytics Pipeline',
      status: 'idle',
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后
      processedRecords: 0,
      failedRecords: 0,
      processingDuration: 0,
      error: undefined
    };
  }

  /**
   * 启动数据处理管道
   */
  async start(): Promise<void> {
    if (this.processingInterval) {
      throw new Error('数据处理管道已经在运行中');
    }

    console.log('🚀 启动 Period Hub 数据分析管道');
    
    // 立即执行一次处理
    await this.processPipeline();
    
    // 设置定时处理（每24小时一次）
    this.processingInterval = setInterval(async () => {
      await this.processPipeline();
    }, 24 * 60 * 60 * 1000);

    console.log('✅ 数据处理管道启动成功');
  }

  /**
   * 停止数据处理管道
   */
  async stop(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    if (this.isProcessing) {
      console.log('⏳ 等待当前处理完成...');
      // 等待当前处理完成
      while (this.isProcessing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.pipelineStatus.status = 'idle';
    console.log('🛑 数据处理管道已停止');
  }

  /**
   * 手动触发数据处理
   */
  async processPipeline(): Promise<void> {
    if (this.isProcessing) {
      console.log('⚠️ 管道正在处理中，跳过此次执行');
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();
    
    try {
      console.log('📊 开始数据处理...');
      this.pipelineStatus.status = 'processing';
      this.pipelineStatus.lastRun = new Date();

      // 步骤1: 收集和处理事件数据
      await this.collectAndProcessEvents();

      // 步骤2: 计算核心指标
      await this.calculateMetrics();

      // 步骤3: 生成仪表板数据
      await this.generateDashboardData();

      // 步骤4: 数据质量检查
      await this.performDataQualityChecks();

      // 更新状态
      this.pipelineStatus.status = 'completed';
      this.pipelineStatus.processingDuration = Date.now() - startTime;
      this.pipelineStatus.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
      this.pipelineStatus.error = undefined;

      console.log(`✅ 数据处理完成，耗时: ${this.pipelineStatus.processingDuration}ms`);
      
    } catch (error) {
      this.pipelineStatus.status = 'failed';
      this.pipelineStatus.error = error instanceof Error ? error.message : '未知错误';
      this.pipelineStatus.processingDuration = Date.now() - startTime;
      
      console.error('❌ 数据处理失败:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 收集和处理事件数据
   */
  private async collectAndProcessEvents(): Promise<void> {
    try {
      console.log('📥 收集事件数据...');
      
      // 获取待处理的事件
      const events = await this.eventCollector.getCollectedEvents();
      
      if (events.length === 0) {
        console.log('ℹ️ 没有新的事件需要处理');
        return;
      }

      console.log(`📋 收集到 ${events.length} 个事件`);
      
      // 处理每个事件
      const processedEvents: EnhancedUserEvent[] = [];
      const failedEvents: any[] = [];

      for (const event of events) {
        try {
          const enhancedEvent = await this.enhanceEvent(event);
          processedEvents.push(enhancedEvent);
          
          // 添加到指标引擎
          this.metricsEngine.addEvent(enhancedEvent);
          
        } catch (error) {
          console.error('处理事件失败:', (event as any).id || 'unknown_event', error);
          failedEvents.push({ event, error });
        }
      }

      // 更新统计
      this.pipelineStatus.processedRecords += processedEvents.length;
      this.pipelineStatus.failedRecords += failedEvents.length;

      console.log(`✅ 成功处理 ${processedEvents.length} 个事件，失败 ${failedEvents.length} 个`);
      
    } catch (error) {
      console.error('❌ 事件收集失败:', error);
      throw error;
    }
  }

  /**
   * 增强事件数据
   */
  private async enhanceEvent(event: any): Promise<EnhancedUserEvent> {
    // 基础事件转换
    const enhancedEvent: EnhancedUserEvent = {
      id: event.id || this.generateEventId(),
      type: event.type || 'user_action',
      timestamp: event.timestamp || new Date(),
      data: event.data || {},
      severity: event.severity || 'low',
      source: event.source || 'web_app',
      correlationId: event.correlationId,
      userId: event.userId || 'anonymous',
      sessionId: event.sessionId || this.generateSessionId(),
      userAgent: event.userAgent,
      referrer: event.referrer,
      location: event.location,
      device: event.device
    };

    // 地理位置增强（基于IP地址）
    if (!enhancedEvent.location && event.ip) {
      enhancedEvent.location = await this.getLocationFromIP(event.ip);
    }

    // 设备信息增强
    if (!enhancedEvent.device && enhancedEvent.userAgent) {
      enhancedEvent.device = this.parseDeviceInfo(enhancedEvent.userAgent);
    }

    // 数据验证
    this.validateEvent(enhancedEvent);

    return enhancedEvent;
  }

  /**
   * 计算核心指标
   */
  private async calculateMetrics(): Promise<void> {
    try {
      console.log('📈 计算核心指标...');
      
      const metrics = await this.metricsEngine.calculateAllMetrics();
      
      console.log('📊 核心指标计算完成:');
      console.log(`  - 日活跃用户数: ${metrics.dailyActiveUsers}`);
      console.log(`  - 用户留存率: ${metrics.userRetentionRate.toFixed(2)}%`);
      console.log(`  - 平台使用深度: ${metrics.platformEngagementDepth.toFixed(2)} 分钟`);
      console.log(`  - 新用户获取成本: ¥${metrics.newUserAcquisitionCost.toFixed(2)}`);
      console.log(`  - 用户生命周期价值: ¥${metrics.userLifetimeValue.toFixed(2)}`);
      
    } catch (error) {
      console.error('❌ 指标计算失败:', error);
      throw error;
    }
  }

  /**
   * 生成仪表板数据
   */
  private async generateDashboardData(): Promise<void> {
    try {
      console.log('📊 生成仪表板数据...');
      
      const dashboardData = await this.metricsEngine.getDashboardData();
      
      // 在实际应用中，这里会将数据保存到数据库或缓存
      console.log('✅ 仪表板数据生成完成');
      console.log(`  - 总用户数: ${dashboardData.userActivity.totalUsers}`);
      console.log(`  - 活跃用户: ${dashboardData.userActivity.activeUsers}`);
      console.log(`  - 总下载量: ${dashboardData.resourceUsage.totalDownloads}`);
      console.log(`  - 总浏览量: ${dashboardData.resourceUsage.totalViews}`);
      
    } catch (error) {
      console.error('❌ 仪表板数据生成失败:', error);
      throw error;
    }
  }

  /**
   * 数据质量检查
   */
  private async performDataQualityChecks(): Promise<void> {
    try {
      console.log('🔍 执行数据质量检查...');
      
      const eventHistory = this.metricsEngine.getEventHistory();
      const checks = [];

      // 检查1: 数据完整性
      const incompleteEvents = eventHistory.filter(event => 
        !event.userId || !event.timestamp || !event.type
      );
      if (incompleteEvents.length > 0) {
        checks.push(`发现 ${incompleteEvents.length} 个不完整的事件`);
      }

      // 检查2: 数据时效性
      const outdatedEvents = eventHistory.filter(event => {
        const daysDiff = (Date.now() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000);
        return daysDiff > 90; // 超过90天的数据
      });
      if (outdatedEvents.length > 0) {
        checks.push(`发现 ${outdatedEvents.length} 个过期事件`);
      }

      // 检查3: 异常值检测
      const userEventCounts = new Map<string, number>();
      eventHistory.forEach(event => {
        userEventCounts.set(event.userId, (userEventCounts.get(event.userId) || 0) + 1);
      });
      
      const avgEventsPerUser = Array.from(userEventCounts.values())
        .reduce((sum, count) => sum + count, 0) / userEventCounts.size;
      
      const anomalousUsers = Array.from(userEventCounts.entries())
        .filter(([_, count]) => count > avgEventsPerUser * 10);
      
      if (anomalousUsers.length > 0) {
        checks.push(`发现 ${anomalousUsers.length} 个异常活跃用户`);
      }

      if (checks.length === 0) {
        console.log('✅ 数据质量检查通过');
      } else {
        console.log('⚠️ 数据质量检查发现问题:');
        checks.forEach(check => console.log(`  - ${check}`));
      }
      
    } catch (error) {
      console.error('❌ 数据质量检查失败:', error);
      // 质量检查失败不应该阻止管道继续运行
    }
  }

  /**
   * 获取管道状态
   */
  getStatus(): DataPipelineStatus {
    return { ...this.pipelineStatus };
  }

  /**
   * 获取实时指标
   */
  async getRealTimeMetrics(): Promise<CoreMetrics> {
    return await this.metricsEngine.calculateAllMetrics();
  }

  /**
   * 获取仪表板数据
   */
  async getDashboardData(): Promise<DashboardData> {
    return await this.metricsEngine.getDashboardData();
  }

  /**
   * 获取指标趋势
   */
  async getMetricsTrend(metricName: keyof CoreMetrics, days: number = 7): Promise<MetricsResult[]> {
    return await this.metricsEngine.getMetricsTrend(metricName, days);
  }

  /**
   * 手动添加事件
   */
  async addEvent(event: Partial<EnhancedUserEvent>): Promise<void> {
    try {
      const enhancedEvent = await this.enhanceEvent(event);
      this.metricsEngine.addEvent(enhancedEvent);
      console.log(`✅ 事件添加成功: ${enhancedEvent.id}`);
    } catch (error) {
      console.error('❌ 事件添加失败:', error);
      throw error;
    }
  }

  // 私有辅助方法
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getLocationFromIP(ip: string): Promise<any> {
    // 简化的地理位置解析
    // 实际应用中可以使用 GeoIP 数据库或 API
    return {
      country: 'CN',
      city: 'Unknown',
      timezone: 'Asia/Shanghai'
    };
  }

  private parseDeviceInfo(userAgent: string): any {
    // 简化的设备信息解析
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    
    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      os: this.extractOS(userAgent),
      browser: this.extractBrowser(userAgent)
    };
  }

  private extractOS(userAgent: string): string {
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac OS/i.test(userAgent)) return 'macOS';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad/i.test(userAgent)) return 'iOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  private extractBrowser(userAgent: string): string {
    if (/Chrome/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent)) return 'Safari';
    if (/Edge/i.test(userAgent)) return 'Edge';
    return 'Unknown';
  }

  private validateEvent(event: EnhancedUserEvent): void {
    if (!event.id) throw new Error('事件ID不能为空');
    if (!event.userId) throw new Error('用户ID不能为空');
    if (!event.timestamp) throw new Error('时间戳不能为空');
    if (!event.type) throw new Error('事件类型不能为空');
  }
}

// 导出单例实例
export const dataPipeline = new DataPipeline(); 