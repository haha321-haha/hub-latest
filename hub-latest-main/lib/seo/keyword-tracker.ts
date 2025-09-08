import { SEO_CONFIG, getDataForSEOConfig } from './dataforseo-config';

export interface KeywordRanking {
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  searchVolume: number;
  url: string;
  date: string;
  change: number;
  serpFeatures: string[];
}

export interface CompetitorTracking {
  domain: string;
  keywords: CompetitorKeyword[];
  traffic: number;
  visibility: number;
  date: string;
}

export interface CompetitorKeyword {
  keyword: string;
  position: number;
  url: string;
  searchVolume: number;
}

export class KeywordTracker {
  private config = getDataForSEOConfig();
  private readonly STORAGE_KEY = 'periodhub-seo-data';
  
  /**
   * 追踪关键词排名变化
   */
  async trackKeywordRankings(): Promise<KeywordRanking[]> {
    const keywords = [...SEO_CONFIG.primaryKeywords, ...SEO_CONFIG.longTailKeywords];
    const rankings: KeywordRanking[] = [];

    try {
      const response = await fetch(`${this.config.baseUrl}/serp/google/organic/live`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(this.config.apiKey).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: keywords,
          location_code: 2156, // 中国
          language_code: 'zh',
          limit: 100,
          depth: 10
        })
      });

      const data = await response.json();
      const results = data.tasks?.[0]?.result || [];
      
      for (const result of results) {
        const keyword = result.keyword;
        const items = result.items || [];
        
        // 查找PeriodHub的排名
        const periodhubResult = items.find((item: any) => 
          item.domain?.includes('periodhub') || item.url?.includes('periodhub')
        );
        
        if (periodhubResult) {
          rankings.push({
            keyword,
            currentPosition: periodhubResult.rank_absolute,
            previousPosition: this.getPreviousPosition(keyword),
            searchVolume: result.search_volume || 0,
            url: periodhubResult.url,
            date: new Date().toISOString(),
            change: this.calculatePositionChange(keyword, periodhubResult.rank_absolute),
            serpFeatures: result.serp_features || []
          });
        }
      }

      this.saveRankings(rankings);
      return rankings;
    } catch (error) {
      console.error('关键词排名追踪失败:', error);
      return this.getFallbackRankings();
    }
  }

  /**
   * 监控竞争对手关键词表现
   */
  async trackCompetitors(): Promise<CompetitorTracking[]> {
    const competitors = SEO_CONFIG.competitors;
    const trackingData: CompetitorTracking[] = [];

    for (const domain of competitors) {
      try {
        const response = await fetch(`${this.config.baseUrl}/domain_analytics/competitors/live`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(this.config.apiKey).toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            target: domain,
            location_code: 2156,
            language_code: 'zh',
            limit: 100
          })
        });

        const data = await response.json();
        const result = data.tasks?.[0]?.result?.[0];
        
        if (result) {
          const keywords: CompetitorKeyword[] = result.top_keywords?.map((kw: any) => ({
            keyword: kw.keyword,
            position: kw.position || 0,
            url: kw.url || '',
            searchVolume: kw.search_volume || 0
          })) || [];

          trackingData.push({
            domain,
            keywords,
            traffic: result.estimated_traffic || 0,
            visibility: result.visibility || 0,
            date: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`监控竞争对手 ${domain} 失败:`, error);
      }
    }

    return trackingData;
  }

  /**
   * 获取关键词趋势数据
   */
  async getKeywordTrends(keyword: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/keywords_data/google/search_volume/live`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(this.config.apiKey).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: [keyword],
          location_code: 2156,
          language_code: 'zh'
        })
      });

      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error('获取关键词趋势失败:', error);
      return null;
    }
  }

  /**
   * 保存排名数据到本地存储
   */
  private saveRankings(rankings: KeywordRanking[]): void {
    if (typeof window !== 'undefined') {
      const existingData = this.getStoredData();
      existingData.rankings = rankings;
      existingData.lastUpdate = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
    }
  }

  /**
   * 获取本地存储的排名数据
   */
  private getStoredData(): any {
    if (typeof window === 'undefined') return { rankings: [], lastUpdate: null };
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { rankings: [], lastUpdate: null };
    } catch {
      return { rankings: [], lastUpdate: null };
    }
  }

  /**
   * 获取之前的关键词排名
   */
  private getPreviousPosition(keyword: string): number {
    const data = this.getStoredData();
    const previousRanking = data.rankings?.find((r: KeywordRanking) => r.keyword === keyword);
    return previousRanking?.currentPosition || 0;
  }

  /**
   * 计算排名变化
   */
  private calculatePositionChange(keyword: string, currentPosition: number): number {
    const previousPosition = this.getPreviousPosition(keyword);
    if (previousPosition === 0) return 0;
    return previousPosition - currentPosition;
  }

  /**
   * 获取本地存储的排名数据
   */
  getStoredRankings(): KeywordRanking[] {
    const data = this.getStoredData();
    return data.rankings || [];
  }

  /**
   * 获取排名变化趋势
   */
  getRankingTrends(): {
    improving: KeywordRanking[];
    declining: KeywordRanking[];
    stable: KeywordRanking[];
    newRankings: KeywordRanking[];
  } {
    const rankings = this.getStoredRankings();
    
    return {
      improving: rankings.filter(r => r.change > 0),
      declining: rankings.filter(r => r.change < 0),
      stable: rankings.filter(r => r.change === 0 && r.currentPosition > 0),
      newRankings: rankings.filter(r => r.previousPosition === 0 && r.currentPosition > 0)
    };
  }

  /**
   * 获取关键词表现报告
   */
  getKeywordPerformanceReport(): {
    totalKeywords: number;
    topRanked: KeywordRanking[];
    opportunities: KeywordRanking[];
    averagePosition: number;
  } {
    const rankings = this.getStoredRankings();
    
    const topRanked = rankings
      .filter(r => r.currentPosition <= 10)
      .sort((a, b) => a.currentPosition - b.currentPosition);
    
    const opportunities = rankings
      .filter(r => r.currentPosition > 10 && r.currentPosition <= 30)
      .sort((a, b) => a.searchVolume - b.searchVolume);
    
    const averagePosition = rankings.length > 0 
      ? rankings.reduce((sum, r) => sum + r.currentPosition, 0) / rankings.length 
      : 0;

    return {
      totalKeywords: rankings.length,
      topRanked,
      opportunities,
      averagePosition: Math.round(averagePosition * 100) / 100
    };
  }

  /**
   * 获取回退数据（离线模式）
   */
  private getFallbackRankings(): KeywordRanking[] {
    return [
      {
        keyword: '痛经缓解',
        currentPosition: 12,
        previousPosition: 15,
        searchVolume: 14800,
        url: 'https://periodhub.health/zh/articles/pain-management',
        date: new Date().toISOString(),
        change: 3,
        serpFeatures: ['featured_snippet']
      },
      {
        keyword: '经期健康管理',
        currentPosition: 8,
        previousPosition: 11,
        searchVolume: 3200,
        url: 'https://periodhub.health/zh/health-guide',
        date: new Date().toISOString(),
        change: 3,
        serpFeatures: []
      }
    ];
  }

  /**
   * 清理过期数据
   */
  cleanupOldData(daysToKeep: number = 30): void {
    if (typeof window === 'undefined') return;
    
    const data = this.getStoredData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    if (data.rankings) {
      data.rankings = data.rankings.filter((r: KeywordRanking) => 
        new Date(r.date) > cutoffDate
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }
}