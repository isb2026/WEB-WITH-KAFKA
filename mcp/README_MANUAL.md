# 🚀 MCP 서버 수동 관리 가이드

## 📋 **사용법**

### **1. 서버 시작**
```bash
./mcp_start.sh
```

### **2. 서버 중지**
```bash
./mcp_stop.sh
```

### **3. 상태 확인**
```bash
./mcp_status.sh
```

### **4. 로그 모니터링**
```bash
tail -f mcp_server.log
```

## 🔧 **스크립트 설명**

### **mcp_start.sh**
- 기존 프로세스 자동 종료
- 환경변수 자동 설정
- 백그라운드에서 서버 실행
- PID 파일 생성

### **mcp_stop.sh**
- PID 파일 기반 프로세스 종료
- 강제 종료 (kill -9) 지원
- PID 파일 정리

### **mcp_status.sh**
- 서버 실행 상태 확인
- 프로세스 상세 정보 표시
- 최근 로그 확인
- 전체 Python 프로세스 확인

## ⚠️ **주의사항**

1. **스크립트는 mcp 디렉토리에서 실행**해야 합니다
2. **가상환경이 venv 디렉토리에 있어야** 합니다
3. **server_fastmcp.py 파일이 있어야** 합니다
4. **로그 파일은 mcp_server.log**에 저장됩니다

## 🎯 **일반적인 워크플로우**

```bash
# 1. 서버 시작
./mcp_start.sh

# 2. 상태 확인
./mcp_status.sh

# 3. Cursor에서 MCP 도구 테스트
# - ping
# - get_esg_swagger
# - get_primes_overview

# 4. 작업 완료 후 서버 중지
./mcp_stop.sh
```

## 🚨 **문제 해결**

### **서버가 시작되지 않는 경우**
```bash
# 로그 확인
cat mcp_server.log

# 가상환경 확인
ls -la venv/

# Python 파일 확인
ls -la server_fastmcp.py
```

### **서버가 중지되지 않는 경우**
```bash
# 강제 종료
pkill -f "server_fastmcp.py"

# PID 파일 정리
rm -f mcp_server.pid
```

## 💡 **팁**

- **로그 모니터링**: `tail -f mcp_server.log`로 실시간 로그 확인
- **상태 확인**: `./mcp_status.sh`로 간편하게 상태 확인
- **자동 정리**: 시작 시 기존 프로세스 자동 종료
