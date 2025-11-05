# 🚀 MCP stdio 방식 사용 가이드

## 📋 **개요**

이 문서는 **stdio 방식의 MCP(Model Context Protocol) 서버** 사용법을 설명합니다.

## 🎯 **stdio 방식의 특징**

### **✅ 장점**

- **자동 프로세스 관리**: Cursor IDE가 MCP 서버 자동 시작/종료
- **보안성**: 로컬 프로세스만 실행, 네트워크 포트 불필요
- **안정성**: 프로세스 크래시 시 자동 복구
- **성능**: 로컬 통신으로 빠른 응답

### **❌ 기존 방식의 문제점**

- **백그라운드 실행**: 수동으로 프로세스 관리 필요
- **포트 사용**: 네트워크 포트 필요
- **복잡성**: 시작/중지/상태확인 스크립트 필요

## 🛠️ **설정 방법**

### **1. Cursor IDE 설정**

```json
{
	"mcpServers": {
		"unified-project-info": {
			"command": "python",
			"args": ["server_fastmcp.py"],
			"cwd": "/path/to/msa-react-monorepo/mcp",
			"env": {
				"VIRTUAL_ENV": "/path/to/msa-react-monorepo/mcp/venv",
				"PATH": "/path/to/msa-react-monorepo/mcp/venv/bin:${env:PATH}"
			}
		}
	}
}
```

### **2. 가상환경 설정**

```bash
cd mcp
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🚀 **사용법**

### **1. Cursor IDE 재시작**

- Cursor IDE를 완전히 종료
- 다시 시작하면 MCP 서버 자동 실행

### **2. MCP 서버 상태 확인**

```bash
# 백그라운드 프로세스 확인 (없어야 정상)
ps aux | grep "server.py"
ps aux | grep "server_fastmcp.py"

# Cursor IDE에서 MCP 서버 정상 작동 확인
```

### **3. 리소스 접근**

```
primes://overview      # Primes 프로젝트 개요
esg://overview         # ESG 프로젝트 개요
aips://overview        # AIPS 프로젝트 개요
scm://overview         # SCM 프로젝트 개요
common://swagger       # Swagger 정보
```

## 🔧 **문제 해결**

### **1. MCP 서버가 실행되지 않는 경우**

- Cursor IDE 설정 확인
- 가상환경 경로 확인
- Python 경로 확인

### **2. 백그라운드 프로세스가 남아있는 경우**

```bash
# 실행 중인 MCP 서버 프로세스 종료
pkill -f "server.py"
pkill -f "server_fastmcp.py"
```

### **3. 가상환경 문제**

```bash
# 가상환경 재생성
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📚 **사용 가능한 리소스**

### **🎯 Primes 프로젝트**

- `primes://overview` - 프로젝트 개요
- `primes://patterns` - 개발 패턴
- `primes://templates` - 템플릿 시스템
- `primes://domains` - 솔루션 도메인
- `primes://swagger` - Swagger API 정보

### **🌱 ESG 프로젝트**

- `esg://overview` - 프로젝트 개요
- `esg://features` - 특화 기능
- `esg://frameworks` - ESG 프레임워크
- `esg://swagger` - ESG API 정보

### **🤖 AIPS 프로젝트**

- `aips://overview` - 프로젝트 개요
- `aips://ai-features` - AI 기능

### **📦 SCM 프로젝트**

- `scm://overview` - 프로젝트 개요

### **🔗 공통 정보**

- `common://swagger` - Swagger 정보
- `common://packages` - 공통 패키지
- `common://comparison` - 프로젝트 비교

## 💡 **핵심 포인트**

1. **백그라운드 실행 불필요**: Cursor IDE가 자동 관리
2. **stdio 통신**: 표준 입출력을 통한 안전한 통신
3. **자동화**: 프로세스 생명주기 자동 관리
4. **보안성**: 로컬 프로세스만 실행

## 🎉 **결론**

stdio 방식의 MCP는 **사용자 개입을 최소화**하고 **안전하고 효율적인** 프로젝트 정보 제공을 가능하게 합니다.

백그라운드 실행이나 수동 프로세스 관리 없이, Cursor IDE에서 자연스럽게 MCP 서버를 사용할 수 있습니다!
