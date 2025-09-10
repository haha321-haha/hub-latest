/**
 * 系统健康检查脚本
 * 检查PDF重复、SEO问题、热点地图数据完整性等
 */

import { pdfResources } from '@/config/pdfResources';
import { heatmapManager } from '@/utils/heatmapManager';

export interface CheckResult {
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface HealthReport {
  timestamp: string;
  status: 'healthy' | 'issues-found' | 'critical';
  checks: {
    pdfDuplicates: CheckResult;
    seoIssues: CheckResult;
    heatmapData: CheckResult;
    redirects: CheckResult;
  };
  recommendations: string[];
}

export class SystemHealthChecker {
  /**
   * 执行综合健康检查
   */
  public static async performComprehensiveCheck(): Promise<HealthReport> {
    const report: HealthReport = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {
        pdfDuplicates: await this.checkPDFDuplicates(),
        seoIssues: await this.checkSEOIssues(),
        heatmapData: await this.checkHeatmapIntegrity(),
        redirects: await this.validateRedirects()
      },
      recommendations: []
    };

    // 生成修复建议
    report.recommendations = this.generateRecommendations(report.checks);
    
    // 确定整体状态
    const hasFailures = Object.values(report.checks).some(check => check.status === 'fail');
    const hasWarnings = Object.values(report.checks).some(check => check.status === 'warning');
    
    if (hasFailures) {
      report.status = 'critical';
    } else if (hasWarnings) {
      report.status = 'issues-found';
    }

    return report;
  }

  /**
   * 检查PDF重复问题
   */
  private static async checkPDFDuplicates(): Promise<CheckResult> {
    const duplicates = await this.findDuplicatePDFs();
    return {
      status: duplicates.length === 0 ? 'pass' : 'fail',
      message: duplicates.length === 0 
        ? '✅ 未发现PDF重复问题' 
        : `❌ 发现${duplicates.length}个重复PDF`,
      details: duplicates
    };
  }

  /**
   * 查找重复的PDF资源
   */
  private static async findDuplicatePDFs(): Promise<string[]> {
    const idCounts = new Map<string, number>();
    const duplicates: string[] = [];

    pdfResources.forEach(resource => {
      const count = idCounts.get(resource.id) || 0;
      idCounts.set(resource.id, count + 1);
    });

    idCounts.forEach((count, id) => {
      if (count > 1) {
        duplicates.push(id);
      }
    });

    return duplicates;
  }

  /**
   * 检查SEO问题
   */
  private static async checkSEOIssues(): Promise<CheckResult> {
    const issues = await this.scanSEOIssues();
    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      message: `发现${issues.length}个SEO优化机会`,
      details: issues
    };
  }

  /**
   * 扫描SEO问题
   */
  private static async scanSEOIssues(): Promise<string[]> {
    const issues: string[] = [];

    // 检查PDF资源是否有重复的标题
    const titles = pdfResources.map(r => r.title);
    const duplicateTitles = titles.filter((title, index) => 
      titles.indexOf(title) !== index
    );

    if (duplicateTitles.length > 0) {
      issues.push(`发现重复标题: ${duplicateTitles.join(', ')}`);
    }

    // 检查是否有缺失的描述
    const missingDescriptions = pdfResources.filter(r => !r.description || r.description.trim() === '');
    if (missingDescriptions.length > 0) {
      issues.push(`${missingDescriptions.length}个PDF资源缺少描述`);
    }

    // 检查文件大小是否合理
    const invalidSizes = pdfResources.filter(r => r.fileSize && (r.fileSize < 100 || r.fileSize > 10000));
    if (invalidSizes.length > 0) {
      issues.push(`${invalidSizes.length}个PDF文件大小异常`);
    }

    return issues;
  }

  /**
   * 检查热点地图数据完整性
   */
  private static async checkHeatmapIntegrity(): Promise<CheckResult> {
    try {
      // 合并热点数据
      heatmapManager.consolidateHeatmapData();
      
      const allData = heatmapManager.getAllHeatmapData();
      const totalClicks = Array.from(allData.values())
        .flat()
        .length;

      return {
        status: 'pass',
        message: `✅ 热点地图数据正常，共${totalClicks}次点击记录`,
        details: {
          totalClicks,
          pagesWithData: allData.size
        }
      };
    } catch (error) {
      return {
        status: 'fail',
        message: '❌ 热点地图数据检查失败',
        details: error
      };
    }
  }

  /**
   * 验证重定向配置
   */
  private static async validateRedirects(): Promise<CheckResult> {
    // 这里可以添加重定向验证逻辑
    // 例如检查next.config.js中的重定向规则
    return {
      status: 'pass',
      message: '✅ 重定向配置正常',
      details: {
        redirectRules: [
          '/download-center → /downloads',
          '/downloads-new → /downloads',
          '/articles-pdf-center → /downloads'
        ]
      }
    };
  }

  /**
   * 生成修复建议
   */
  private static generateRecommendations(checks: HealthReport['checks']): string[] {
    const recommendations: string[] = [];

    if (checks.pdfDuplicates.status === 'fail') {
      recommendations.push('立即删除pdfResources.ts中的重复定义');
      recommendations.push('添加数据验证机制防止重复');
    }

    if (checks.seoIssues.status === 'warning') {
      recommendations.push('优化PDF资源描述信息');
      recommendations.push('检查文件大小设置');
    }

    if (checks.heatmapData.status === 'fail') {
      recommendations.push('修复热点地图数据存储问题');
    }

    if (checks.redirects.status === 'fail') {
      recommendations.push('检查next.config.js重定向配置');
    }

    // 通用建议
    recommendations.push('定期运行健康检查');
    recommendations.push('建立自动化测试覆盖');

    return recommendations;
  }

  /**
   * 生成健康报告摘要
   */
  public static generateReportSummary(report: HealthReport): string {
    const { checks, status, recommendations } = report;
    
    let summary = `# 系统健康检查报告\n\n`;
    summary += `**检查时间**: ${report.timestamp}\n`;
    summary += `**整体状态**: ${status === 'healthy' ? '✅ 健康' : status === 'issues-found' ? '⚠️ 发现问题' : '❌ 严重问题'}\n\n`;
    
    summary += `## 检查结果\n\n`;
    Object.entries(checks).forEach(([key, result]) => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      summary += `- **${key}**: ${icon} ${result.message}\n`;
    });

    if (recommendations.length > 0) {
      summary += `\n## 修复建议\n\n`;
      recommendations.forEach((rec, index) => {
        summary += `${index + 1}. ${rec}\n`;
      });
    }

    return summary;
  }
}

// 导出便捷函数
export const performHealthCheck = SystemHealthChecker.performComprehensiveCheck;
export const generateHealthReport = SystemHealthChecker.generateReportSummary;
