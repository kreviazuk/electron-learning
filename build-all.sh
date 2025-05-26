#!/bin/bash

# 每日记事本自动化打包脚本
echo "🚀 开始构建每日记事本..."

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf out/
rm -rf releases/

# 构建生产版本
echo "📦 构建生产版本..."
pnpm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

# 为 macOS 打包
echo "🍎 为 macOS 打包..."
pnpm run make:mac

if [ $? -ne 0 ]; then
    echo "❌ macOS 打包失败！"
    exit 1
fi

# 为 Windows 打包
echo "🪟 为 Windows 打包..."
pnpm run make:win

if [ $? -ne 0 ]; then
    echo "❌ Windows 打包失败！"
    exit 1
fi

# 创建发布目录
echo "📁 整理发布文件..."
mkdir -p releases

# 复制安装包
cp "out/make/每日记事本.dmg" "releases/每日记事本-macOS-v1.0.0.dmg"
cp "out/make/zip/darwin/x64/每日记事本-darwin-x64-1.0.0.zip" "releases/每日记事本-macOS-v1.0.0.zip"
cp "out/make/zip/win32/x64/每日记事本-win32-x64-1.0.0.zip" "releases/每日记事本-Windows-v1.0.0.zip"

# 显示结果
echo "✅ 打包完成！"
echo ""
echo "📦 生成的安装包："
ls -lh releases/
echo ""
echo "🎉 所有平台的安装包已生成在 releases/ 目录中" 