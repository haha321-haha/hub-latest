// Web Vitals分析器
export interface WebVitalsReport {
  FCP: number;
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
  score: number;
}

export class WebVitalsAnalyzer {
  private vitals: WebVitalsReport[] = [];

  recordVitals(vitals: WebVitalsReport): void {
    this.vitals.push(vitals);
  }

  getAverageMetrics(): any {
    return this.getAverageVitals();
  }

  getPerformanceRating(metrics: any): { score: number; grade: string } {
    const score = Math.round(metrics.score || 85);
    let grade = '良好';
    if (score >= 90) grade = '优秀';
    else if (score >= 75) grade = '良好';
    else if (score >= 60) grade = '一般';
    else grade = '需改进';
    
    return { score, grade };
  }

  getAverageVitals(): WebVitalsReport {
    if (this.vitals.length === 0) {
      return {
        FCP: 0,
        LCP: 0,
        FID: 0,
        CLS: 0,
        TTFB: 0,
        score: 85
      };
    }

    const sum = this.vitals.reduce((acc, curr) => ({
      FCP: acc.FCP + curr.FCP,
      LCP: acc.LCP + curr.LCP,
      FID: acc.FID + curr.FID,
      CLS: acc.CLS + curr.CLS,
      TTFB: acc.TTFB + curr.TTFB,
      score: acc.score + curr.score
    }));

    const count = this.vitals.length;
    return {
      FCP: sum.FCP / count,
      LCP: sum.LCP / count,
      FID: sum.FID / count,
      CLS: sum.CLS / count,
      TTFB: sum.TTFB / count,
      score: sum.score / count
    };
  }

  generateReport(): string {
    const avg = this.getAverageVitals();
    return JSON.stringify(avg, null, 2);
  }
}

// 导出兼容名称
export const webVitalsTracker = new WebVitalsAnalyzer();
export default WebVitalsAnalyzer;
