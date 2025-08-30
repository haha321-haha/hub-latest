#!/usr/bin/env python3

import os
import shutil
import glob
import datetime
import re

def main():
    print("🔧 Period Hub PDF响应式设计修复")
    print("=================================")
    
    # 检查目录
    if not os.path.exists("public/pdf-files"):
        print("❌ 错误：请在项目根目录运行此脚本")
        return
    
    # 创建备份
    backup_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = f"public/pdf-files-backup-{backup_time}"
    os.makedirs(backup_dir, exist_ok=True)
    
    # 获取HTML文件
    html_files = glob.glob("public/pdf-files/*.html")
    
    # 备份文件
    for file in html_files:
        shutil.copy2(file, backup_dir)
    print(f"💾 备份完成: {len(html_files)} 个文件")
    
    # 移动端CSS
    mobile_css = '''
        /* 📱 移动端响应式优化 */
        @media (max-width: 768px) {
            body { padding: 8px !important; font-size: 14px; }
            .container { padding: 12px !important; margin: 0 !important; }
            .header h1 { font-size: 24px !important; }
            .section { margin-bottom: 20px !important; }
            table, .table-container { overflow-x: auto; display: block; }
            .grid, .content-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
        }
        @media (max-width: 480px) {
            body { padding: 4px !important; font-size: 13px; }
            .header h1 { font-size: 20px !important; }
            .header p { font-size: 12px !important; }
        }'''
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    # 处理文件
    for file_path in html_files:
        filename = os.path.basename(file_path)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 检查是否已有响应式
            if re.search(r'@media.*max-width', content):
                print(f"⏭️  跳过 {filename}")
                skip_count += 1
                continue
            
            # 插入CSS
            new_content = content.replace('</style>', mobile_css + '\n    </style>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ {filename}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ {filename}: {str(e)}")
            error_count += 1
    
    print(f"\n📊 修复完成: ✅{success_count} ⏭️{skip_count} ❌{error_count}")
    print(f"💾 备份: {backup_dir}")
    
    if error_count == 0 and success_count > 0:
        print("🎉 修复成功！请测试移动端效果")

if __name__ == "__main__":
    main() 