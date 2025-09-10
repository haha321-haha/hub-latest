/**
 * 热点地图数据管理器
 * 解决重复页面的热点数据合并问题
 */

export interface ClickData {
  x: number;
  y: number;
  timestamp: number;
  element: string;
  pageUrl: string;
  userId?: string;
}

export class HeatmapDataManager {
  private static instance: HeatmapDataManager;
  private clickData: Map<string, ClickData[]> = new Map();

  private constructor() {
    this.initializeFromStorage();
  }

  public static getInstance(): HeatmapDataManager {
    if (!HeatmapDataManager.instance) {
      HeatmapDataManager.instance = new HeatmapDataManager();
    }
    return HeatmapDataManager.instance;
  }

  private initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('heatmap-data');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.clickData = new Map(Object.entries(data));
        } catch (error) {
          console.error('Failed to load heatmap data:', error);
        }
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      const data = Object.fromEntries(this.clickData);
      localStorage.setItem('heatmap-data', JSON.stringify(data));
    }
  }

  /**
   * 记录点击数据
   */
  public recordClick(pageUrl: string, clickData: Omit<ClickData, 'pageUrl'>): void {
    const existingData = this.clickData.get(pageUrl) || [];
    this.clickData.set(pageUrl, [...existingData, { ...clickData, pageUrl }]);
    this.saveToStorage();
  }

  /**
   * 修复重复页面的热点数据合并
   */
  public consolidateHeatmapData(): void {
    const consolidationRules = {
      '/downloads': ['/download-center', '/downloads-new', '/articles-pdf-center'],
      '/analytics': ['/analytics-old'],
      '/interactive-tools': ['/tools', '/interactive']
    };

    Object.entries(consolidationRules).forEach(([target, sources]) => {
      const consolidatedData: ClickData[] = [];
      
      // 收集所有源页面的数据
      sources.forEach(source => {
        const sourceData = this.clickData.get(source) || [];
        // 更新页面URL为目标页面
        const updatedData = sourceData.map(data => ({
          ...data,
          pageUrl: target
        }));
        consolidatedData.push(...updatedData);
      });

      // 合并到目标页面
      const existingData = this.clickData.get(target) || [];
      this.clickData.set(target, [...existingData, ...consolidatedData]);
      
      // 清理源页面数据
      sources.forEach(source => this.clickData.delete(source));
    });

    this.saveToStorage();
    console.log('✅ 热点地图数据合并完成');
  }

  /**
   * 获取去重后的热点数据
   */
  public getConsolidatedHeatmapData(pageId: string): ClickData[] {
    return this.clickData.get(pageId) || [];
  }

  /**
   * 获取所有页面的热点数据
   */
  public getAllHeatmapData(): Map<string, ClickData[]> {
    return new Map(this.clickData);
  }

  /**
   * 清理过期数据（超过30天）
   */
  public cleanExpiredData(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    this.clickData.forEach((data, pageUrl) => {
      const filteredData = data.filter(click => click.timestamp > thirtyDaysAgo);
      this.clickData.set(pageUrl, filteredData);
    });

    this.saveToStorage();
    console.log('✅ 过期热点数据清理完成');
  }

  /**
   * 获取页面热度统计
   */
  public getPageHeatStats(pageId: string): {
    totalClicks: number;
    uniqueUsers: number;
    avgClicksPerUser: number;
    topElements: Array<{ element: string; count: number }>;
  } {
    const data = this.getConsolidatedHeatmapData(pageId);
    const uniqueUsers = new Set(data.map(d => d.userId).filter(Boolean)).size;
    
    // 统计元素点击次数
    const elementCounts = new Map<string, number>();
    data.forEach(click => {
      const count = elementCounts.get(click.element) || 0;
      elementCounts.set(click.element, count + 1);
    });

    const topElements = Array.from(elementCounts.entries())
      .map(([element, count]) => ({ element, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalClicks: data.length,
      uniqueUsers,
      avgClicksPerUser: uniqueUsers > 0 ? data.length / uniqueUsers : 0,
      topElements
    };
  }

  /**
   * 导出数据用于分析
   */
  public exportData(): string {
    const data = Object.fromEntries(this.clickData);
    return JSON.stringify(data, null, 2);
  }
}

// 导出单例实例
export const heatmapManager = HeatmapDataManager.getInstance();
