#!/bin/bash

# Vercel代码下载脚本
# 用于从Vercel下载已部署但GitHub已被覆盖的代码

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Vercel CLI
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI 未安装"
        log_info "请安装: npm install -g vercel"
        exit 1
    fi
    log_success "Vercel CLI 已安装"
}

# 检查登录状态
check_login() {
    log_info "检查Vercel登录状态..."
    if ! vercel whoami &> /dev/null; then
        log_warning "未登录Vercel，请先登录"
        log_info "运行: vercel login"
        exit 1
    fi
    log_success "已登录Vercel"
}

# 显示部署列表
show_deployments() {
    log_info "获取部署列表..."
    echo ""
    echo "最近的部署:"
    vercel ls --json | jq -r '.[0:10][] | "\(.created | strftime("%Y-%m-%d %H:%M")) - \(.url) - \(.state) - ID: \(.uid)"'
    echo ""
}

# 下载最新部署
download_latest() {
    log_info "下载最新部署..."
    
    # 创建备份目录
    BACKUP_DIR="vercel-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # 获取最新部署ID
    LATEST_DEPLOYMENT=$(vercel ls --json | jq -r '.[0].uid')
    
    if [ "$LATEST_DEPLOYMENT" = "null" ] || [ -z "$LATEST_DEPLOYMENT" ]; then
        log_error "未找到部署"
        exit 1
    fi
    
    log_info "最新部署ID: $LATEST_DEPLOYMENT"
    
    # 下载部署
    cd "$BACKUP_DIR"
    vercel pull "$LATEST_DEPLOYMENT" --yes
    
    log_success "部署已下载到: $BACKUP_DIR"
    log_info "文件列表:"
    ls -la
    
    cd ..
}

# 导出为静态文件
export_static() {
    log_info "导出为静态文件..."
    
    EXPORT_DIR="vercel-static-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$EXPORT_DIR"
    
    # 导出静态文件
    vercel export --output="$EXPORT_DIR"
    
    log_success "静态文件已导出到: $EXPORT_DIR"
    log_info "文件列表:"
    ls -la "$EXPORT_DIR"
}

# 从网站下载source maps
download_sourcemaps() {
    log_info "尝试下载source maps..."
    
    SOURCEMAP_DIR="sourcemaps-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$SOURCEMAP_DIR"
    
    # 常见的source map URL
    SOURCEMAP_URLS=(
        "https://periodhub.health/_next/static/chunks/pages/_app.js.map"
        "https://periodhub.health/_next/static/chunks/pages/index.js.map"
        "https://periodhub.health/_next/static/chunks/pages/zh.js.map"
        "https://periodhub.health/_next/static/chunks/pages/en.js.map"
    )
    
    for url in "${SOURCEMAP_URLS[@]}"; do
        filename=$(basename "$url")
        log_info "下载: $filename"
        curl -s -o "$SOURCEMAP_DIR/$filename" "$url" || log_warning "下载失败: $url"
    done
    
    log_success "Source maps已下载到: $SOURCEMAP_DIR"
}

# 显示帮助
show_help() {
    echo "Vercel代码下载工具"
    echo ""
    echo "使用方法:"
    echo "  $0 [选项]"
    echo ""
    echo "选项:"
    echo "  list        - 显示部署列表"
    echo "  download    - 下载最新部署"
    echo "  export      - 导出为静态文件"
    echo "  sourcemaps  - 下载source maps"
    echo "  all         - 执行所有操作"
    echo "  help        - 显示此帮助"
    echo ""
    echo "示例:"
    echo "  $0 download"
    echo "  $0 list"
    echo "  $0 all"
}

# 主函数
main() {
    local action=${1:-"help"}
    
    log_info "Vercel代码下载工具"
    
    case $action in
        "list")
            check_vercel_cli
            check_login
            show_deployments
            ;;
        "download")
            check_vercel_cli
            check_login
            download_latest
            ;;
        "export")
            check_vercel_cli
            check_login
            export_static
            ;;
        "sourcemaps")
            download_sourcemaps
            ;;
        "all")
            check_vercel_cli
            check_login
            show_deployments
            download_latest
            export_static
            download_sourcemaps
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 运行主函数
main "$@"












