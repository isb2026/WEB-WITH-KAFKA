#!/bin/bash
# Python 캐시 파일 Git에서 제거 스크립트

echo "🧹 Python 캐시 파일 정리 중..."

# 현재 디렉토리에서 Python 캐시 파일들 찾기
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -type f -delete 2>/dev/null
find . -name "*.pyo" -type f -delete 2>/dev/null
find . -name "*.pyd" -type f -delete 2>/dev/null

# 가상환경 디렉토리들 찾기 (venv, env, .venv)
find . -name "venv" -type d -exec rm -rf {} + 2>/dev/null
find . -name "env" -type d -exec rm -rf {} + 2>/dev/null
find . -name ".venv" -type d -exec rm -rf {} + 2>/dev/null

# Python 빌드 파일들
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null
find . -name "*.egg-info" -type d -exec rm -rf {} + 2>/dev/null

# 로그 파일들
find . -name "*.log" -type f -delete 2>/dev/null

# PID 파일들
find . -name "*.pid" -type f -delete 2>/dev/null

echo "✅ Python 캐시 파일 정리 완료!"

# Git 상태 확인
echo ""
echo "🔍 Git 상태 확인:"
git status --porcelain | grep -E "\.(pyc|pyo|pyd|log|pid)$" || echo "추적 중인 Python 캐시 파일이 없습니다."

echo ""
echo "💡 다음 명령어로 변경사항을 확인하세요:"
echo "   git status"
echo "   git add ."
echo "   git commit -m 'Python 캐시 파일 제거'"
