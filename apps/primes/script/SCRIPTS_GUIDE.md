# Scripts 사용 가이드

## 📋 사용 가능한 스크립트들

### 🚀 메인 생성 스크립트

#### `npm run generate:solution`
**가장 권장되는 방법** - 솔루션별 설정 파일을 기반으로 코드 생성

```bash
npm run generate:solution
```

**특징:**
- `configs/` 디렉토리의 각 솔루션별 JSON 파일 사용
- 하이픈(-) 자동 변환 (kebab-case → camelCase/PascalCase)
- Node.js 20 호환성 보장
- 에러 발생 시 해당 솔루션만 스킵하고 계속 진행
- 파일 중복 시 자동 리네이밍 (_1, _2 등)

**생성되는 파일:**
- `src/pages/{solution}/{module}/` - 페이지 컴포넌트들
- `src/tabs/{solution}/` - 탭 네비게이션 컴포넌트들  
- `src/routes/{solution}Route.tsx` - 라우트 설정
- `config.json` - 병합된 설정 (기존 시스템 호환용)

---

#### `npm run generate`
통합 설정 파일 기반 코드 생성

```bash
npm run generate
```

**특징:**
- `config.json` 파일 사용
- 기존 방식과 호환
- 분석 페이지도 함께 생성

---

#### `npm run generate:swagger`
Swagger API 문서 기반 코드 생성

```bash
npm run generate:swagger
```

**특징:**
- API 스키마 자동 분석
- 실시간 API 문서에서 코드 생성
- 인증 정보 필요할 수 있음

---

### 🔧 개별 컴포넌트 생성

#### `npm run page`
단일 페이지 컴포넌트 생성

```bash
npm run page
```

**대화형 프롬프트:**
- 페이지 이름 입력
- 페이지 타입 선택 (Single/MasterDetail)
- 컬럼 정보 입력

---

#### `npm run tab`
탭 네비게이션 컴포넌트 생성

```bash
npm run tab
```

**대화형 프롬프트:**
- 탭 이름 입력
- 탭 아이템들 설정
- 액션 버튼 설정

---

#### `npm run analysis`
분석 페이지 생성

```bash
npm run analysis
```

**특징:**
- 차트 기반 분석 페이지
- 다양한 차트 타입 지원
- 시계열 데이터 처리

---

### 📊 분석 관련 스크립트

#### `npm run generate:analysis`
모든 분석 페이지 일괄 생성

```bash
npm run generate:analysis
```

---

## 🎯 사용 시나리오별 가이드

### 1. 새로운 솔루션 추가

```bash
# 1. configs 디렉토리에 새 솔루션 JSON 파일 생성
# 예: configs/inventory.json

# 2. 솔루션별 생성 실행
npm run generate:solution

# 3. 생성된 파일 확인
ls src/pages/inventory/
ls src/tabs/inventory/
ls src/routes/inventoryRoute.tsx
```

### 2. 기존 솔루션 수정

```bash
# 1. 해당 솔루션의 JSON 파일 수정
# 예: configs/sales.json

# 2. 재생성 (기존 파일은 자동으로 _1, _2 등으로 백업)
npm run generate:solution

# 3. 변경사항 확인 후 기존 파일 정리
```

### 3. 개별 컴포넌트 추가

```bash
# 특정 페이지만 추가하고 싶을 때
npm run page

# 특정 탭만 추가하고 싶을 때  
npm run tab
```

### 4. API 기반 자동 생성

```bash
# Swagger 문서가 있는 경우
npm run generate:swagger

# 환경변수로 API URL 지정 가능
SWAGGER_URL=https://api.example.com/docs npm run generate:swagger
```

---

## 🔍 디버깅 및 문제 해결

### 환경변수 옵션

```bash
# 디버그 모드로 실행 (상세 로그 출력)
DEBUG=true npm run generate:solution

# 특정 솔루션만 처리
SOLUTION=sales npm run generate:solution

# Node.js 버전 확인
node --version  # v20.15.0 이상 필요
```

### 일반적인 문제들

#### 1. Node.js 버전 오류
```bash
# 해결책: .nvmrc 파일 사용
nvm use
npm run generate:solution
```

#### 2. 파일 생성 권한 오류
```bash
# 해결책: 디렉토리 권한 확인
chmod -R 755 src/
npm run generate:solution
```

#### 3. 모듈 import 오류
```bash
# 해결책: Node.js 20 환경 확인 및 ESM 지원 확인
nvm use 20
npm run generate:solution
```

#### 4. 설정 파일 문법 오류
```bash
# JSON 파일 검증
npx jsonlint configs/sales.json

# 또는 온라인 JSON 검증 도구 사용
```

---

## 📈 성능 최적화 팁

### 1. 배치 처리 활용
```bash
# 여러 솔루션을 한 번에 처리 (기본값)
npm run generate:solution

# 단일 솔루션만 처리 (빠름)
SOLUTION=ini npm run generate:solution
```

### 2. 캐시 활용
```bash
# 템플릿 캐시 초기화가 필요한 경우
rm -rf .cache/
npm run generate:solution
```

### 3. 병렬 처리 설정
```bash
# 배치 크기 조정 (기본값: 3)
BATCH_SIZE=5 npm run generate:solution
```

---

## 📋 체크리스트

### 생성 전 확인사항
- [ ] Node.js 20 환경 설정 (`nvm use`)
- [ ] 설정 파일 문법 검증
- [ ] 기존 파일 백업 (필요시)
- [ ] 디스크 공간 확인

### 생성 후 확인사항
- [ ] 생성된 파일들 TypeScript 컴파일 확인
- [ ] ESLint 검사 통과 확인
- [ ] 브라우저에서 정상 렌더링 확인
- [ ] 라우팅 동작 확인

---

## 🔗 관련 문서

- [README.md](./README.md) - 전체 시스템 개요
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 상세 설명
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - 개발자 가이드

---

## 💡 팁과 트릭

### 1. 빠른 프로토타이핑
```bash
# 최소한의 설정으로 빠르게 페이지 생성
echo '{"modules":{"test":{"name":"테스트","tabs":[{"type":"singlePage","pageName":"TestPage"}]}}}' > configs/test.json
npm run generate:solution
```

### 2. 설정 파일 템플릿 활용
```bash
# 기존 솔루션을 템플릿으로 사용
cp configs/ini.json configs/new-solution.json
# new-solution.json 수정 후
npm run generate:solution
```

### 3. 생성된 코드 커스터마이징
```bash
# 생성 후 필요한 부분만 수정
# 재생성 시 기존 파일은 자동으로 백업됨
```