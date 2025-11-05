#!/bin/bash
# MCP 서버 간단 시작 스크립트

echo "🚀 MCP 서버 시작 중..."

# 가상환경 활성화
source venv/bin/activate

# MCP 서버 실행
python server_fastmcp.py
