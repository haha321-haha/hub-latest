#!/usr/bin/env node

/**
 * Phase 1 SEO Fixes - Technical SEO Implementation
 * Handles 301 redirects for duplicate pages and noindex for test pages
 */

const fs = require('fs');
const path = require('path');

class SEOFixer {
    constructor() {
        this.workspaceDir = process.cwd();
        this.nextConfigPath = path.join(this.workspaceDir, 'next.config.js');
        this.robotsPath = path.join(this.workspaceDir, 'public', 'robots.txt');
        this.changes = [];
    }

    async execute() {
        console.log('🚀 Starting Phase 1 SEO Fixes...\n');
        
        try {
            // 1. 创建robots.txt文件
            await this.createRobotsTxt();
            
            // 2. 更新next.config.js添加重定向
            await this.addRedirects();
            
            // 3. 为测试页面添加meta标签
            await this.addMetaTags();
            
            // 4. 生成修复报告
            await this.generateReport();
            
            console.log('✅ Phase 1 SEO fixes completed successfully!');
            this.printSummary();
            
        } catch (error) {
            console.error('❌ Error during SEO fixes:', error.message);
            process.exit(1);
        }
    }

    async createRobotsTxt() {
        console.log('📄 Creating robots.txt...');
        
        const robotsContent = `# SEO优化 - 阻止搜索引擎索引测试和开发页面
User-agent: *
Allow: /

# 阻止测试页面
Disallow: /test*
Disallow: /*/test*
Disallow: /dev*
Disallow: /*/dev*
Disallow: /staging*
Disallow: /*/staging*

# 阻止重复内容
Disallow: /*?*download=*
Disallow: /*?*test=*
Disallow: /*?*debug=*

# 允许重要页面
Allow: /$
Allow: /zh$
Allow: /en$
Allow: /zh/health-guide$
Allow: /en/health-guide$
Allow: /zh/articles$
Allow: /en/articles$
Allow: /zh/downloads$
Allow: /en/downloads$
Allow: /zh/interactive-tools$
Allow: /en/interactive-tools$

# Sitemap
Sitemap: https://periodhub.health/sitemap.xml
`;

        const publicDir = path.join(this.workspaceDir, 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        fs.writeFileSync(this.robotsPath, robotsContent);
        this.changes.push({
            type: 'robots.txt',
            action: 'created',
            file: this.robotsPath,
            content: '阻止测试和重复页面被索引'
        });
        console.log('✅ robots.txt created');
    }

    async addRedirects() {
        console.log('🔄 Adding 301 redirects...');
        
        // 定义重定向规则
        const redirects = [
            // 处理重复下载页面
            {
                source: '/downloads/download-1',
                destination: '/downloads',
                permanent: true
            },
            {
                source: '/downloads/download-2',
                destination: '/downloads',
                permanent: true
            },
            {
                source: '/downloads/download-3',
                destination: '/downloads',
                permanent: true
            },
            // 重定向测试页面
            {
                source: '/test',
                destination: '/',
                permanent: true
            },
            {
                source: '/test/:path*',
                destination: '/',
                permanent: true
            },
            {
                source: '/dev',
                destination: '/',
                permanent: true
            },
            {
                source: '/dev/:path*',
                destination: '/',
                permanent: true
            },
            // 规范化URL
            {
                source: '/index.html',
                destination: '/',
                permanent: true
            },
            {
                source: '/home',
                destination: '/',
                permanent: true
            }
        ];

        // 读取现有的next.config.js
        let nextConfigContent = fs.readFileSync(this.nextConfigPath, 'utf8');
        
        // 添加重定向配置
        const redirectsConfig = `
  // 🚀 SEO优化 - 301重定向配置
  async redirects() {
    return [
      // 处理重复内容
      {
        source: '/downloads/download-1',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/downloads/download-2',
        destination: '/downloads',
        permanent: true,
      },
      {
        source: '/downloads/download-3',
        destination: '/downloads',
        permanent: true,
      },
      // 阻止测试页面索引
      {
        source: '/test',
        destination: '/',
        permanent: true,
      },
      {
        source: '/test/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dev',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dev/:path*',
        destination: '/',
        permanent: true,
      },
      // URL规范化
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
`;

        // 在nextConfig对象中添加重定向
        const insertAfter = 'trailingSlash: false,';
        const insertIndex = nextConfigContent.indexOf(insertAfter) + insertAfter.length;
        
        const newConfigContent = 
            nextConfigContent.slice(0, insertIndex) + 
            '\n' + redirectsConfig + 
            nextConfigContent.slice(insertIndex);

        fs.writeFileSync(this.nextConfigPath, newConfigContent);
        
        this.changes.push({
            type: 'next.config.js',
            action: 'updated',
            file: this.nextConfigPath,
            content: '添加301重定向配置'
        });
        console.log('✅ Redirects added to next.config.js');
    }

    async addMetaTags() {
        console.log('🏷️ Adding meta tags for test pages...');
        
        // 为测试页面添加noindex标签
        const testPages = [
            'app/test/page.tsx',
            'app/dev/page.tsx',
            'app/staging/page.tsx'
        ];

        testPages.forEach(pagePath => {
            const fullPath = path.join(this.workspaceDir, pagePath);
            if (fs.existsSync(fullPath)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                
                // 添加noindex meta标签
                if (!content.includes('noindex')) {
                    const metaTag = `
  // SEO优化 - 阻止搜索引擎索引
  export const metadata = {
    robots: {
      index: false,
      follow: false,
    },
  };
`;
                    
                    // 在文件顶部添加
                    const newContent = content.replace(
                        /export default/,
                        metaTag + '\nexport default'
                    );
                    
                    fs.writeFileSync(fullPath, newContent);
                    
                    this.changes.push({
                        type: 'meta tags',
                        action: 'added',
                        file: fullPath,
                        content: '添加noindex标签'
                    });
                }
            }
        });
        
        console.log('✅ Meta tags added to test pages');
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            phase: 'Phase 1 - Technical SEO Fixes',
            changes: this.changes,
            summary: {
                totalChanges: this.changes.length,
                robotsCreated: this.changes.filter(c => c.type === 'robots.txt').length,
                redirectsAdded: this.changes.filter(c => c.type === 'next.config.js').length,
                metaTagsAdded: this.changes.filter(c => c.type === 'meta tags').length
            }
        };

        const reportPath = path.join(this.workspaceDir, 'seo-phase1-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📊 Report generated: ${reportPath}`);
    }

    printSummary() {
        console.log('\n📋 Phase 1 SEO Fixes Summary:');
        console.log('================================');
        this.changes.forEach(change => {
            console.log(`✅ ${change.type}: ${change.action} - ${change.content}`);
        });
        console.log(`\nTotal changes: ${this.changes.length}`);
    }
}

// 执行SEO修复
if (require.main === module) {
    const fixer = new SEOFixer();
    fixer.execute().catch(console.error);
}

module.exports = SEOFixer;