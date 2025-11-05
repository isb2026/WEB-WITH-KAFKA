# 🎯 개발 전략 및 우선순위

## 📊 **현재 상황 정리**

### **✅ 배포된 서버 (즉시 사용 가능)**
- **🟢 Primes**: 기존 배포 서버 활용 가능
- **🟡 ESG**: 기존 배포 서버 활용 가능

### **⏳ 백엔드 준비 중 (프론트엔드 우선 개발)**
- **🟡 AIPS**: 백엔드 미배포 → UI 중심 개발
- **🔴 SCM**: 백엔드 미배포 → 구조 설계부터 시작

---

## 🚀 **단계별 개발 전략**

### **Phase 1: 기존 서버 활용 (즉시 시작 가능)**

#### **1-1. Primes 완성도 향상 (1-2주)**
```bash
# 환경변수 설정 (실제 URL 필요)
export SWAGGER_INI=https://primes-dev-server/v3/api-docs/ini
export SWAGGER_SALES=https://primes-dev-server/v3/api-docs/sales
export SWAGGER_PURCHASE=https://primes-dev-server/v3/api-docs/purchase
export SWAGGER_PRODUCTION=https://primes-dev-server/v3/api-docs/production
export SWAGGER_MACHINE=https://primes-dev-server/v3/api-docs/machine
export SWAGGER_MOLD=https://primes-dev-server/v3/api-docs/mold
export SWAGGER_QUALITY=https://primes-dev-server/v3/api-docs/quality
```

**작업 내용:**
- ✅ MCP 환경변수 시스템 적용
- 🔧 스크립트 템플릿 최신화
- ⚡ 성능 최적화
- 📱 모바일 반응형 개선

#### **1-2. ESG 데이터 연동 완성 (1-2주)**
```bash
# 환경변수 설정 (실제 URL 필요)
export SWAGGER_DEFAULT=https://esg-dev-server/v3/api-docs

# 또는 기능별 분리된 경우
export SWAGGER_ACCOUNT=https://esg-dev-server/v3/api-docs/account
export SWAGGER_METER=https://esg-dev-server/v3/api-docs/meter
export SWAGGER_REPORT=https://esg-dev-server/v3/api-docs/report
```

**작업 내용:**
- ✅ MCP 환경변수 시스템 적용
- 🔗 실제 데이터 소스 연동
- 📊 대시보드 데이터 실시간 연결
- 🤖 MCP 코드 생성 시스템 적용

### **Phase 2: UI 우선 개발 (백엔드 대기 중)**

#### **2-1. AIPS UI 구조 완성 (2-3주)**
**백엔드 없이 할 수 있는 작업:**
- 🎨 UI 컴포넌트 완성 (Radix UI 기반)
- 📄 페이지 구조 구축
- 🧩 컴포넌트 라이브러리 구축
- 📱 반응형 디자인 적용
- 🎭 Mock 데이터로 UI 테스트

**Mock 환경변수 설정:**
```bash
# Mock Swagger URLs (실제 배포 전까지 사용)
export SWAGGER_AI=https://mock-api.aips.com/v3/api-docs/ai
export SWAGGER_DATA=https://mock-api.aips.com/v3/api-docs/data
export SWAGGER_PROCESSING=https://mock-api.aips.com/v3/api-docs/processing
export SWAGGER_ANALYTICS=https://mock-api.aips.com/v3/api-docs/analytics
```

#### **2-2. SCM 기본 구조 구축 (2-3주)**
**백엔드 없이 할 수 있는 작업:**
- 🏗️ 기본 라우팅 시스템 구축
- 🎨 UI 프레임워크 적용 (Radix UI)
- 📄 기본 페이지 템플릿 생성
- 🧩 공통 컴포넌트 개발
- 📊 공급망 시각화 UI 설계

**Mock 환경변수 설정:**
```bash
# Mock Swagger URLs
export SWAGGER_DEFAULT=https://mock-api.scm.com/v3/api-docs

# 또는 기능별 분리
export SWAGGER_SUPPLY=https://mock-api.scm.com/v3/api-docs/supply
export SWAGGER_INVENTORY=https://mock-api.scm.com/v3/api-docs/inventory
export SWAGGER_LOGISTICS=https://mock-api.scm.com/v3/api-docs/logistics
```

### **Phase 3: 백엔드 연동 (서버 배포 후)**

#### **3-1. AIPS 실제 연동**
- 🔗 실제 Swagger URL로 환경변수 교체
- 🤖 AI 모델 API 연동
- 📊 실시간 데이터 처리 연결
- ⚡ 성능 최적화

#### **3-2. SCM 실제 연동**
- 🔗 실제 Swagger URL로 환경변수 교체
- 📦 공급망 데이터 연동
- 📊 실시간 재고 추적
- 🚚 물류 시스템 연결

---

## 🛠️ **즉시 필요한 정보**

### **🔥 1. Primes & ESG 실제 Swagger URL**
현재 사용 중인 실제 서버 URL을 알려주세요:

```bash
# 예시 - 실제 URL로 교체 필요
Primes 개발 서버: https://???
ESG 개발 서버: https://???
```

### **🔥 2. 개발 우선순위 결정**
어떤 순서로 진행하고 싶으신가요?

**Option A: Primes 먼저 완성**
- 장점: 이미 95% 완성, 빠른 성과
- 단점: ESG 대기 시간 발생

**Option B: Primes + ESG 동시 진행**
- 장점: 두 프로젝트 동시 완성
- 단점: 리소스 분산

**Option C: ESG 먼저 완성**
- 장점: 대시보드 완성도 높임
- 단점: Primes 완성 지연

### **🔥 3. AIPS & SCM 백엔드 일정**
대략적인 백엔드 서버 배포 예정일을 알려주세요:
- AIPS 백엔드: 언제쯤 배포 예정?
- SCM 백엔드: 언제쯤 배포 예정?

---

## 💡 **Mock 개발 전략**

### **Mock API 서버 구축 옵션**

#### **Option 1: JSON Server 활용**
```bash
# 간단한 Mock API 서버
npm install -g json-server

# Mock 데이터 파일 생성
echo '{"users": [], "products": []}' > db.json

# Mock 서버 실행
json-server --watch db.json --port 3001
```

#### **Option 2: MSW (Mock Service Worker)**
```bash
# 브라우저에서 Mock API
npm install msw

# Mock 핸들러 설정
# src/mocks/handlers.js
```

#### **Option 3: Swagger Mock 생성**
```bash
# Swagger 스키마에서 Mock 데이터 생성
npm install swagger-mock-api

# Mock Swagger 문서 생성
swagger-mock-api generate
```

---

## 🎯 **다음 단계**

### **즉시 실행 가능한 작업**

1. **Primes & ESG Swagger URL 설정**
   ```bash
   "Primes Swagger URL 알려줘"
   "ESG Swagger URL 알려줘"
   ```

2. **환경변수 설정 및 테스트**
   ```bash
   "Swagger 상태 확인해줘"
   "현재 프로젝트 엔티티 목록 보여줘"
   ```

3. **우선순위 프로젝트 선택**
   ```bash
   "Primes 먼저 완성하자"
   "ESG 먼저 완성하자"
   "둘 다 동시에 진행하자"
   ```

### **Mock 개발 시작**

4. **AIPS Mock 환경 구축**
   ```bash
   "AIPS Mock API 서버 설정해줘"
   "AIPS UI 컴포넌트 생성해줘"
   ```

5. **SCM 기본 구조 구축**
   ```bash
   "SCM 기본 라우팅 설정해줘"
   "SCM 페이지 템플릿 생성해줘"
   ```

---

**어떤 작업부터 시작하고 싶으시고, Primes와 ESG의 실제 Swagger URL은 무엇인가요?** 🤔
