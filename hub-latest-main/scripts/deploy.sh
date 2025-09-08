#!/bin/bash

# Period Hub 部署脚本
# 使用方法: ./scripts/deploy.sh [vercel|github|static]

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

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    npm ci
    log_success "依赖安装完成"
}

# 构建项目
build_project() {
    local config_file=$1
    
    if [ -n "$config_file" ]; then
        log_info "使用配置文件: $config_file"
        cp "$config_file" next.config.js
    fi
    
    log_info "构建项目..."
    npm run build
    log_success "项目构建完成"
}

# Vercel 部署
deploy_vercel() {
    log_info "开始 Vercel 部署..."
    
    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI 未安装，正在安装..."
        npm install -g vercel
    fi
    
    # 使用标准配置
    build_project
    
    # 部署到 Vercel
    log_info "部署到 Vercel..."
    vercel --prod
    
    log_success "Vercel 部署完成！"
    log_info "访问: https://periodhub.health"
}

# GitHub Pages 部署
deploy_github() {
    log_info "开始 GitHub Pages 部署..."
    
    # 使用静态导出配置
    build_project "next.config.static.js"
    
    # 提交并推送代码
    log_info "提交代码到 GitHub..."
    git add .
    git commit -m "🚀 GitHub Pages 部署 - $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main
    
    log_success "代码已推送到 GitHub"
    log_info "GitHub Actions 将自动部署到 GitHub Pages"
    log_info "访问: https://github.com/haha321-haha/Period-Hub-Platform/actions"
}

# 静态导出
export_static() {
    log_info "开始静态导出..."
    
    # 使用静态导出配置
    build_project "next.config.static.js"
    
    # 检查输出目录
    if [ -d "out" ]; then
        log_success "静态文件已导出到 ./out 目录"
        log_info "文件列表:"
        ls -la out/
        
        # 可选：创建压缩包
        log_info "创建部署包..."
        tar -czf "period-hub-static-$(date '+%Y%m%d-%H%M%S').tar.gz" -C out .
        log_success "部署包已创建"
    else
        log_error "静态导出失败，未找到 out 目录"
        exit 1
    fi
}

# 清理函数
cleanup() {
    log_info "清理临时文件..."
    # 恢复原始配置
    if [ -f "next.config.js.backup" ]; then
        mv next.config.js.backup next.config.js
    fi
}

# 主函数
main() {
    local deployment_type=${1:-"vercel"}
    
    log_info "Period Hub 部署脚本"
    log_info "部署类型: $deployment_type"
    
    # 备份原始配置
    if [ -f "next.config.js" ]; then
        cp next.config.js next.config.js.backup
    fi
    
    # 设置清理陷阱
    trap cleanup EXIT
    
    # 检查依赖
    check_dependencies
    
    # 安装依赖
    install_dependencies
    
    # 根据类型部署
    case $deployment_type in
        "vercel")
            deploy_vercel
            ;;
        "github")
            deploy_github
            ;;
        "static")
            export_static
            ;;
        *)
            log_error "未知的部署类型: $deployment_type"
            log_info "支持的类型: vercel, github, static"
            exit 1
            ;;
    esac
    
    log_success "部署完成！"
}

# 显示帮助
show_help() {
    echo "Period Hub 部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./scripts/deploy.sh [类型]"
    echo ""
    echo "部署类型:"
    echo "  vercel  - 部署到 Vercel (默认)"
    echo "  github  - 部署到 GitHub Pages"
    echo "  static  - 静态导出到本地"
    echo ""
    echo "示例:"
    echo "  ./scripts/deploy.sh vercel"
    echo "  ./scripts/deploy.sh github"
    echo "  ./scripts/deploy.sh static"
}

# 检查参数
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# 运行主函数
main "$@"
