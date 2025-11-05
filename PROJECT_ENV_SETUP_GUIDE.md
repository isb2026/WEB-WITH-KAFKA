# 🌐 프로젝트별 환경 설정 가이드

각 프로젝트별로 `.env` 파일을 생성하여 Swagger URL을 설정하는 가이드입니다.

## 🎯 **Primes 프로젝트 (Multi-Swagger)**

`apps/primes/.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Primes Project Environment Variables

# App Configuration
VITE_APP_NAME=Primes
VITE_API_BASE_URL=http://localhost:8080/api

# Swagger Configuration
SWAGGER_STRUCTURE=multi

# Solution-based Swagger URLs
SWAGGER_URL_INI=http://localhost:8080/v3/api-docs/ini
SWAGGER_URL_SALES=http://localhost:8080/v3/api-docs/sales
SWAGGER_URL_PURCHASE=http://localhost:8080/v3/api-docs/purchase
SWAGGER_URL_PRODUCTION=http://localhost:8080/v3/api-docs/production
SWAGGER_URL_MACHINE=http://localhost:8080/v3/api-docs/machine
SWAGGER_URL_MOLD=http://localhost:8080/v3/api-docs/mold
SWAGGER_URL_QUALITY=http://localhost:8080/v3/api-docs/quality

# Default Domain (fallback)
SWAGGER_DEFAULT_DOMAIN=ini

# UI Framework Configuration
UI_FRAMEWORK=radix
COMPONENT_PREFIX=@primes

# Development Settings
NODE_ENV=development
VITE_ENABLE_DEBUG=true
```

## 🌱 **ESG 프로젝트 (Single-Swagger)**

`apps/esg/.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# ESG Project Environment Variables

# App Configuration
VITE_APP_NAME=ESG
VITE_API_BASE_URL=http://localhost:8081/api

# Swagger Configuration
SWAGGER_STRUCTURE=single

# Single Swagger URL
SWAGGER_URL=http://localhost:8081/v3/api-docs

# UI Framework Configuration
UI_FRAMEWORK=falcon
COMPONENT_PREFIX=@repo/falcon-ui

# Development Settings
NODE_ENV=development
VITE_ENABLE_DEBUG=true
```

## 📦 **SCM 프로젝트 (Single-Swagger)**

`apps/scm/.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# SCM Project Environment Variables

# App Configuration
VITE_APP_NAME=SCM
VITE_API_BASE_URL=http://localhost:8083/api

# Swagger Configuration
SWAGGER_STRUCTURE=single

# Single Swagger URL
SWAGGER_URL=http://localhost:8083/v3/api-docs

# UI Framework Configuration
UI_FRAMEWORK=radix
COMPONENT_PREFIX=@scm

# Development Settings
NODE_ENV=development
VITE_ENABLE_DEBUG=true
```

## 🤖 **AIPS 프로젝트 (Flexible)**

`apps/aips/.env` 파일을 생성하고 다음 내용을 추가하세요:

### Option 1: Multi-Swagger (AI 모듈별 분리)

```bash
# AIPS Project Environment Variables

# App Configuration
VITE_APP_NAME=AIPS
VITE_API_BASE_URL=http://localhost:8082/api

# Swagger Configuration
SWAGGER_STRUCTURE=multi

# AI Module-based Swagger URLs
SWAGGER_URL_AI=http://localhost:8082/v3/api-docs/ai
SWAGGER_URL_DATA=http://localhost:8082/v3/api-docs/data
SWAGGER_URL_PROCESSING=http://localhost:8082/v3/api-docs/processing
SWAGGER_URL_ANALYTICS=http://localhost:8082/v3/api-docs/analytics

# Default Domain
SWAGGER_DEFAULT_DOMAIN=ai

# UI Framework Configuration
UI_FRAMEWORK=radix
COMPONENT_PREFIX=@aips

# AI-specific Settings
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true

# Development Settings
NODE_ENV=development
VITE_ENABLE_DEBUG=true
```

### Option 2: Single-Swagger (통합 관리)

```bash
# AIPS Project Environment Variables (Single Structure)

# App Configuration
VITE_APP_NAME=AIPS
VITE_API_BASE_URL=http://localhost:8082/api

# Swagger Configuration
SWAGGER_STRUCTURE=single

# Single Swagger URL
SWAGGER_URL=http://localhost:8082/v3/api-docs

# UI Framework Configuration
UI_FRAMEWORK=radix
COMPONENT_PREFIX=@aips

# AI-specific Settings
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true

# Development Settings
NODE_ENV=development
VITE_ENABLE_DEBUG=true
```

## 🔧 **MCP 환경 변수 활용**

MCP에서 이 환경 변수들을 활용하는 방법:

### 1. 프로젝트 자동 감지

```python
# mcp/core/project_detector.py
def detect_current_project():
    """현재 작업 디렉토리에서 프로젝트 감지"""
    cwd = os.getcwd()
    if 'apps/primes' in cwd:
        return load_project_config('apps/primes/.env')
    elif 'apps/esg' in cwd:
        return load_project_config('apps/esg/.env')
    # ...
```

### 2. Swagger URL 동적 로드

```python
# mcp/core/swagger_loader.py
def get_swagger_urls(project_config):
    """프로젝트 설정에서 Swagger URL 추출"""
    if project_config.get('SWAGGER_STRUCTURE') == 'single':
        return {'default': project_config.get('SWAGGER_URL')}
    else:
        urls = {}
        for key, value in project_config.items():
            if key.startswith('SWAGGER_URL_'):
                domain = key.replace('SWAGGER_URL_', '').lower()
                urls[domain] = value
        return urls
```

### 3. AI Chat 명령어 예시

```bash
# 현재 프로젝트의 Swagger 구조 확인
"현재 프로젝트 swagger 구조 알려줘"

# 특정 도메인 분석 (Multi-Swagger)
"machine 도메인의 Machine 엔티티 분석해줘"

# 전체 엔티티 분석 (Single-Swagger)
"Account 엔티티 분석해줘"
```

## 🚀 **다음 단계**

1. **환경 파일 생성**: 각 프로젝트에 맞는 `.env` 파일 생성
2. **MCP 업데이트**: 환경 변수 기반 Swagger 로더 구현
3. **AI Chat 테스트**: 프로젝트별 자동 감지 및 Swagger 분석 테스트

## 💡 **주의사항**

- `.env` 파일은 `.gitignore`에 포함되어 있으므로 각 개발자가 로컬에서 생성해야 합니다
- Swagger URL은 실제 백엔드 서버 주소에 맞게 수정하세요
- 프로젝트별 포트 번호를 확인하고 설정하세요
