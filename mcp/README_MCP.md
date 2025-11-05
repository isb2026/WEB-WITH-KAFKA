# 🚀 MCP 설정 가이드

## 📋 **파일 구조**

```
mcp/
├── server_fastmcp.py          # FastMCP 서버 (Python)
├── mcp_setup.js               # MCP 설정 자동 생성 도구 (Node.js)
├── mcp_settings_template.json # Cursor MCP 설정 템플릿
├── start_mcp.sh               # 간단한 시작 스크립트
└── README_MCP.md              # 이 파일
```

## 🎯 **MCP 설정 방법**

### **방법 1: 자동 설정 (권장)**
```bash
# 전체 설정 자동 생성
node mcp_setup.js setup
```

### **방법 2: 수동 설정**
1. **mcp_settings_template.json 내용 복사**
2. **Cursor 설정 열기**: `Cmd + ,` (macOS) 또는 `Ctrl + ,` (Windows/Linux)
3. **MCP 검색**: "MCP" 또는 "Model Context Protocol" 검색
4. **설정 추가**: "Add MCP Server" 클릭
5. **설정 붙여넣기**: 템플릿 내용을 Cursor 설정에 복사

## 📋 **설정 템플릿 내용**

```json
{
  "mcpServers": {
    "unified-project-info": {
      "command": "python",
      "args": ["server_fastmcp.py"],
      "cwd": "/Users/moornmo/Dev/msa-react-monorepo/mcp",
      "env": {
        "VIRTUAL_ENV": "/Users/moornmo/Dev/msa-react-monorepo/mcp/venv",
        "PATH": "/Users/moornmo/Dev/msa-react-monorepo/mcp/venv/bin:/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

## 🚀 **사용법**

### **1. MCP 서버 시작**
```bash
# 간단한 시작
./start_mcp.sh

# 또는 직접 실행
source venv/bin/activate && python server_fastmcp.py
```

### **2. 설정 도구 사용**
```bash
# 상태 확인
node mcp_setup.js status

# 전체 설정 생성
node mcp_setup.js setup

# 개별 설정 생성
node mcp_setup.js generate-settings    # MCP 설정 파일만
node mcp_setup.js generate-script      # 시작 스크립트만
node mcp_setup.js update-cursor        # Cursor 설정만
```

## 🎯 **사용 가능한 MCP 툴들**

### **🎯 Primes 프로젝트**
- `get_primes_overview()` - 프로젝트 개요
- `get_primes_patterns()` - 개발 패턴
- `get_primes_swagger()` - Swagger API 정보

### **🌱 ESG 프로젝트**
- `get_esg_overview()` - 프로젝트 개요
- `get_esg_swagger()` - Swagger API 정보

### **🤖 AIPS 프로젝트**
- `get_aips_overview()` - 프로젝트 개요

### **📦 SCM 프로젝트**
- `get_scm_overview()` - 프로젝트 개요

### **🔄 공통 정보**
- `get_project_comparison()` - 프로젝트 비교
- `get_swagger_urls()` - 모든 Swagger URL
- `ping()` - 서버 헬스 체크

## ⚠️ **주의사항**

1. **Python 가상환경**: `venv/` 디렉토리가 필요합니다
2. **Python 의존성**: `mcp.server.fastmcp` 패키지가 설치되어야 합니다
3. **Cursor 재시작**: 설정 후 Cursor를 완전히 재시작해야 합니다

## 🔍 **문제 해결**

### **서버 시작 실패**
```bash
# 가상환경 확인
ls -la venv/

# Python 의존성 확인
source venv/bin/activate
pip list | grep mcp
```

### **Cursor 연결 실패**
1. Cursor를 완전히 종료하고 재시작
2. MCP 설정이 올바르게 추가되었는지 확인
3. 가상환경 경로가 올바른지 확인

## 📚 **참고 자료**

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [FastMCP](https://github.com/microsoft/mcp-python)
- [Cursor MCP 설정](https://cursor.sh/docs/mcp)
