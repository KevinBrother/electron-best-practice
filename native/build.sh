#!/bin/bash

# 编译 Go 程序到不同平台
# 用法: ./build.sh [platform]
# platform: all | darwin | windows | linux

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/dist"

# 清理输出目录
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

build_and_zip() {
    local GOOS=$1
    local GOARCH=$2
    local PLATFORM=$3
    local BINARY_NAME="native-reader"
    
    if [ "$GOOS" = "windows" ]; then
        BINARY_NAME="native-reader.exe"
    fi
    
    echo "Building for $PLATFORM ($GOOS/$GOARCH)..."
    
    # 创建临时目录
    local TEMP_DIR="$OUTPUT_DIR/$PLATFORM"
    mkdir -p "$TEMP_DIR"
    
    # 编译 Go 程序
    cd "$SCRIPT_DIR"
    GOOS=$GOOS GOARCH=$GOARCH go build -o "$TEMP_DIR/$BINARY_NAME" main.go
    
    # 复制 JSON 文件
    cp "$SCRIPT_DIR/data.json" "$TEMP_DIR/"
    
    # 创建 zip 包
    cd "$OUTPUT_DIR"
    if [ "$GOOS" = "windows" ]; then
        # Windows 使用 zip
        zip -r "$PLATFORM.zip" "$PLATFORM"
    else
        # macOS/Linux
        zip -r "$PLATFORM.zip" "$PLATFORM"
    fi
    
    echo "Created $OUTPUT_DIR/$PLATFORM.zip"
}

case "${1:-all}" in
    darwin|mac)
        build_and_zip darwin arm64 darwin-arm64
        build_and_zip darwin amd64 darwin-x64
        ;;
    windows|win)
        build_and_zip windows amd64 windows-x64
        ;;
    linux)
        build_and_zip linux amd64 linux-x64
        build_and_zip linux arm64 linux-arm64
        ;;
    all)
        build_and_zip darwin arm64 darwin-arm64
        build_and_zip darwin amd64 darwin-x64
        build_and_zip windows amd64 windows-x64
        build_and_zip linux amd64 linux-x64
        build_and_zip linux arm64 linux-arm64
        ;;
    *)
        echo "Unknown platform: $1"
        echo "Usage: $0 [all|darwin|windows|linux]"
        exit 1
        ;;
esac

echo "Build complete!"
ls -la "$OUTPUT_DIR"/*.zip
