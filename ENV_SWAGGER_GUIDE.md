# 🌐 프로젝트별 .env 기반 Swagger 시스템 가이드

## 🎯 **개요**

각 프로젝트별로 `.env` 파일에 **API 통신용**과 **Swagger 문서용** URL을 분리하여 설정하는 시스템입니다.

### **🚀 주요 장점**

1. **🔧 명확한 분리**: API 통신과 Swagger 문서 URL을 명확히 구분
2. **🔄 프로젝트별 독립성**: 각 프로젝트가 독립적인 API 서버와 Swagger 사용
3. **🌐 환경별 설정**: 개발/스테이징/프로덕션 환경별로 쉽게 전환
4. **⚡ 즉시 반영**: .env 파일 변경 시 개발 서버 재시작으로 반영

## 🔧 **설정 방법**

### **1. Primes 프로젝트 (ERP 시스템)**

```bash
# apps/primes/.env
# API 통신용
VITE_API_BASE_URL=https://api.primes.company.com/api

# Swagger 문서용 (도메인별 분리)
SWAGGER_URL_INI=https://api.primes.company.com/api-docs/ini
SWAGGER_URL_SALES=https://api.primes.company.com/api-docs/sales
SWAGGER_URL_PURCHASE=https://api.primes.company.com/api-docs/purchase
SWAGGER_URL_PRODUCTION=https://api.primes.company.com/api-docs/production
SWAGGER_URL_MACHINE=https://api.primes.company.com/api-docs/machine
SWAGGER_URL_MOLD=https://api.primes.company.com/api-docs/mold
SWAGGER_URL_QUALITY=https://api.primes.company.com/api-docs/quality
```

### **2. ESG 프로젝트 (지속가능성 관리)**

```bash
# apps/esg/.env
# API 통신용
VITE_API_BASE_URL=https://api.esg.primes-cloud.co.kr/api

# Swagger 문서용
VITE_SWAGGER_URL=https://api.esg.primes-cloud.co.kr/api-docs/esg
```

### **3. AIPS 프로젝트 (AI 생산성 시스템)**

```bash
# apps/aips/.env
# API 통신용
VITE_API_BASE_URL=https://api.aips.company.com/api

# Swagger 문서용
VITE_SWAGGER_URL=https://api.aips.company.com/api-docs/aips
```

### **4. SCM 프로젝트 (공급망 관리)**

```bash
# apps/scm/.env
# API 통신용
VITE_API_BASE_URL=https://api.scm.company.com/api

# Swagger 문서용
VITE_SWAGGER_URL=https://api.scm.company.com/api-docs/scm
```

## 🌍 **프로젝트별 .env 파일 구조**

### **프로젝트 루트 구조**

```
msa-react-monorepo/
├── apps/
│   ├── primes/
│   │   ├── .env                    # Primes API + Swagger 설정
│   │   └── src/
│   ├── esg/
│   │   ├── .env                    # ESG API + Swagger 설정
│   │   └── src/
│   ├── aips/
│   │   ├── .env                    # AIPS API + Swagger 설정
│   │   └── src/
│   └── scm/
│       ├── .env                    # SCM API + Swagger 설정
│       └── src/
└── packages/
```

### **각 프로젝트 .env 파일 예시**

#### **apps/primes/.env**

```bash
# Primes ERP API 통신
VITE_API_BASE_URL=https://api.primes.company.com/api

# Primes Swagger 문서 (도메인별)
SWAGGER_URL_INI=https://api.primes.company.com/api-docs/ini
SWAGGER_URL_SALES=https://api.primes.company.com/api-docs/sales
SWAGGER_URL_PURCHASE=https://api.primes.company.com/api-docs/purchase
SWAGGER_URL_PRODUCTION=https://api.primes.company.com/api-docs/production
SWAGGER_URL_MACHINE=https://api.primes.company.com/api-docs/machine
SWAGGER_URL_MOLD=https://api.primes.company.com/api-docs/mold
SWAGGER_URL_QUALITY=https://api.primes.company.com/api-docs/quality

# 개발 환경
# VITE_API_BASE_URL=https://dev-api.primes.company.com/api
# SWAGGER_URL_INI=https://dev-api.primes.company.com/api-docs/ini
# ... 기타 도메인들

# 스테이징 환경
# VITE_API_BASE_URL=https://staging-api.primes.company.com/api
# SWAGGER_URL_INI=https://staging-api.primes.company.com/api-docs/ini
# ... 기타 도메인들

# 프로덕션 환경
# VITE_API_BASE_URL=https://api.primes.company.com/api
# SWAGGER_URL_INI=https://api.primes.company.com/api-docs/ini
# ... 기타 도메인들
```

#### **apps/esg/.env**

```bash
# ESG 지속가능성 API 통신
VITE_API_BASE_URL=https://api.esg.primes-cloud.co.kr/api

# ESG Swagger 문서
VITE_SWAGGER_URL=https://api.esg.primes-cloud.co.kr/api-docs/esg

# 개발 환경
# VITE_API_BASE_URL=https://dev-api.esg.primes-cloud.co.kr/api
# VITE_SWAGGER_URL=https://dev-api.esg.primes-cloud.co.kr/api-docs/esg

# 스테이징 환경
# VITE_API_BASE_URL=https://staging-api.esg.primes-cloud.co.kr/api
# VITE_SWAGGER_URL=https://staging-api.esg.primes-cloud.co.kr/api-docs/esg

# 프로덕션 환경
# VITE_API_BASE_URL=https://api.esg.primes-cloud.co.kr/api
# VITE_SWAGGER_URL=https://api.esg.primes-cloud.co.kr/api-docs/esg
```

#### **apps/aips/.env**

```bash
# AIPS AI 생산성 API 통신
VITE_API_BASE_URL=https://api.aips.company.com/api

# AIPS Swagger 문서
VITE_SWAGGER_URL=https://api.aips.company.com/api-docs/aips

# 개발 환경
# VITE_API_BASE_URL=https://dev-api.aips.company.com/api
# VITE_SWAGGER_URL=https://dev-api.aips.company.com/api-docs/aips

# 스테이징 환경
# VITE_API_BASE_URL=https://staging-api.aips.company.com/api
# VITE_SWAGGER_URL=https://staging-api.aips.company.com/api-docs/aips

# 프로덕션 환경
# VITE_API_BASE_URL=https://api.aips.company.com/api
# VITE_SWAGGER_URL=https://api.aips.company.com/api-docs/aips
```

#### **apps/scm/.env**

```bash
# SCM 공급망 관리 API 통신
VITE_API_BASE_URL=https://api.scm.company.com/api

# SCM Swagger 문서
VITE_SWAGGER_URL=https://api.scm.company.com/api-docs/scm

# 개발 환경
# VITE_API_BASE_URL=https://dev-api.scm.company.com/api
# VITE_SWAGGER_URL=https://dev-api.scm.company.com/api-docs/scm

# 스테이징 환경
# VITE_API_BASE_URL=https://staging-api.scm.company.com/api
# VITE_SWAGGER_URL=https://staging-api.scm.company.com/api-docs/scm

# 프로덕션 환경
# VITE_API_BASE_URL=https://api.scm.company.com/api
# VITE_SWAGGER_URL=https://api.scm.company.com/api-docs/scm
```

## 🎯 **AI Chat 사용법**

### **기본 명령어**

```bash
# 1. 프로젝트별 Swagger 상태 확인
"Primes 프로젝트 Swagger 상태 확인해줘"
"ESG 프로젝트 Swagger 상태 알려줘"
"AIPS 프로젝트 Swagger 상태 확인해줘"
"SCM 프로젝트 Swagger 상태 확인해줘"

# 2. 프로젝트별 엔티티 목록 조회
"Primes 프로젝트 엔티티 목록 보여줘"
"ESG 프로젝트 엔티티 목록 보여줘"
"AIPS 프로젝트 엔티티 목록 보여줘"
"SCM 프로젝트 엔티티 목록 보여줘"

# 3. 프로젝트별 페이지 생성
"Primes에서 Vendor 리스트 페이지 만들어줘"
"ESG에서 CarbonEmission 대시보드 만들어줘"
"AIPS에서 AI 분석 페이지 만들어줘"
"SCM에서 공급업체 관리 페이지 만들어줘"
```

### **고급 사용법**

```bash
# 프로젝트 간 참조
"ESG의 MeterPage 같은 구조로 Primes에 만들어줘"
"다른 프로젝트 패턴 참고해서 만들어줘"

# 특정 도메인 분석 (Multi-Swagger)
"machine 도메인 엔티티 보여줘"
"sales 도메인 분석해줘"
```

## 🔧 **개발 환경 설정**

### **1. 로컬 개발 환경**

```bash
# 각 프로젝트 디렉토리에서
cd apps/primes
pnpm dev

cd apps/esg
pnpm dev

cd apps/aips
pnpm dev

cd apps/scm
pnpm dev
```

### **2. 환경 변수 설정**

```bash
# 각 프로젝트의 .env 파일 생성
touch apps/primes/.env
touch apps/esg/.env
touch apps/aips/.env
touch apps/scm/.env

# .env 파일에 API URL과 Swagger URL 설정
# Primes (도메인별 Swagger)
echo "VITE_API_BASE_URL=https://api.primes.company.com/api" > apps/primes/.env
echo "SWAGGER_URL_INI=https://api.primes.company.com/api-docs/ini" >> apps/primes/.env
echo "SWAGGER_URL_SALES=https://api.primes.company.com/api-docs/sales" >> apps/primes/.env
# ... 기타 도메인들

# ESG (통합 Swagger)
echo "VITE_API_BASE_URL=https://api.esg.primes-cloud.co.kr/api" > apps/esg/.env
echo "VITE_SWAGGER_URL=https://api.esg.primes-cloud.co.kr/api-docs/esg" >> apps/esg/.env

# AIPS
echo "VITE_API_BASE_URL=https://api.aips.company.com/api" > apps/aips/.env
echo "VITE_SWAGGER_URL=https://api.aips.company.com/api-docs/aips" >> apps/aips/.env

# SCM
echo "VITE_API_BASE_URL=https://api.scm.company.com/api" > apps/scm/.env
echo "VITE_SWAGGER_URL=https://api.scm.company.com/api-docs/scm" >> apps/scm/.env
```

### **3. .gitignore 설정**

```bash
# 각 프로젝트의 .gitignore에 .env 추가
echo ".env" >> apps/primes/.gitignore
echo ".env" >> apps/esg/.gitignore
echo ".env" >> apps/aips/.gitignore
echo ".env" >> apps/scm/.gitignore
```

## 📋 **프로젝트별 Swagger URL 구조**

### **Primes 프로젝트**

- **API 통신**: `https://api.primes.company.com/api`
- **Swagger 문서**:
    - `https://api.primes.company.com/api-docs/ini` (초기화)
    - `https://api.primes.company.com/api-docs/sales` (영업)
    - `https://api.primes.company.com/api-docs/purchase` (구매)
    - `https://api.primes.company.com/api-docs/production` (생산)
    - `https://api.primes.company.com/api-docs/machine` (설비)
    - `https://api.primes.company.com/api-docs/mold` (금형)
    - `https://api.primes.company.com/api-docs/quality` (품질)

### **ESG 프로젝트**

- **API 통신**: `https://api.esg.primes-cloud.co.kr/api`
- **Swagger 문서**: `https://api.esg.primes-cloud.co.kr/api-docs/esg`

### **AIPS 프로젝트**

- **API 통신**: `https://api.aips.company.com/api`
- **Swagger 문서**: `https://api.aips.company.com/api-docs/aips`

### **SCM 프로젝트**

- **API 통신**: `https://api.scm.company.com/api`
- **Swagger 문서**: `https://api.scm.company.com/api-docs/scm`

## 🚀 **빠른 시작 체크리스트**

### **새 프로젝트 설정**

```
□ 1. 프로젝트 디렉토리 생성 (apps/{project})
□ 2. .env 파일 생성
□ 3. VITE_API_BASE_URL 설정 (API 통신용)
□ 4. VITE_SWAGGER_URL 또는 SWAGGER_URL_* 설정 (Swagger 문서용)
□ 5. .gitignore에 .env 추가
□ 6. 개발 서버 시작 (pnpm dev)
□ 7. Swagger URL 확인
□ 8. MCP 시스템에서 프로젝트 등록
```

### **기존 프로젝트 수정**

```
□ 1. .env 파일 확인
□ 2. VITE_API_BASE_URL 업데이트
□ 3. VITE_SWAGGER_URL 또는 SWAGGER_URL_* 업데이트
□ 4. 개발 서버 재시작
□ 5. Swagger 연결 확인
□ 6. API 테스트
```

## 🔮 **확장 방법**

### **1. 새로운 프로젝트 추가**

```bash
# 1. 프로젝트 디렉토리 생성
mkdir -p apps/new-project

# 2. .env 파일 생성
echo "VITE_API_BASE_URL=https://api.new-project.company.com/api" > apps/new-project/.env
echo "VITE_SWAGGER_URL=https://api.new-project.company.com/api-docs/new-project" >> apps/new-project/.env

# 3. MCP 시스템에 등록
# mcp/config/environments.json에 추가
```

### **2. 환경별 설정 분리**

```bash
# 개발 환경
VITE_API_BASE_URL=https://dev-api.new-project.company.com/api
VITE_SWAGGER_URL=https://dev-api.new-project.company.com/api-docs/new-project

# 스테이징 환경
VITE_API_BASE_URL=https://staging-api.new-project.company.com/api
VITE_SWAGGER_URL=https://staging-api.new-project.company.com/api-docs/new-project

# 프로덕션 환경
VITE_API_BASE_URL=https://api.new-project.company.com/api
VITE_SWAGGER_URL=https://api.new-project.company.com/api-docs/new-project
```

### **3. 다중 API 서버 지원**

```bash
# 메인 API
VITE_API_BASE_URL=https://api.new-project.company.com/api
VITE_SWAGGER_URL=https://api.new-project.company.com/api-docs/new-project

# 보조 API (필요시)
VITE_SECONDARY_API_URL=https://api2.new-project.company.com/api
VITE_ANALYTICS_API_URL=https://analytics.new-project.company.com/api
```

## 📞 **지원 및 문제 해결**

### **일반적인 문제**

1. **API 연결 실패**
    - .env 파일의 VITE_API_BASE_URL 확인
    - 백엔드 서버 실행 상태 확인
    - 네트워크 연결 상태 확인

2. **Swagger 문서 로드 실패**
    - .env 파일의 VITE*SWAGGER_URL 또는 SWAGGER_URL*\* 확인
    - Swagger 엔드포인트 존재 여부 확인
    - CORS 설정 확인
    - 인증 필요 여부 확인

3. **환경 변수 인식 안됨**
    - 개발 서버 재시작
    - .env 파일 위치 확인
    - VITE\_ 접두사 확인

### **지원 채널**

- **개발팀**: dev-team@company.com
- **API 팀**: api-team@company.com
- **문서**: [GitHub Wiki](https://github.com/your-org/msa-react-monorepo/wiki)
- **이슈**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues)

---

**📝 Last Updated**: 2025-01-08  
**🔄 Version**: v2.1 (API 통신용 + Swagger 문서용 분리)  
**👥 Team**: MSA React Monorepo Development Team

**이제 각 프로젝트의 .env 파일에서 API 통신용과 Swagger 문서용 URL을 명확히 구분하여 설정할 수 있습니다!** 🚀
