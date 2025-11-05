# AIPS - AI-Powered Information Processing System

AIPS는 AI 기반 정보 처리 시스템으로, 데이터 수집부터 분석까지의 전체 파이프라인을 관리하는 통합 플랫폼입니다.

## 🚀 주요 기능

### 🧠 AI 모듈
- AI 모델 관리 및 배포
- 학습 데이터 관리
- 모델 성능 모니터링

### 📊 데이터 관리
- 다양한 데이터 소스 연동
- 데이터 품질 관리
- 실시간 데이터 처리

### ⚙️ 처리 엔진
- 배치 및 실시간 처리 파이프라인
- 작업 스케줄링 및 모니터링
- 자동 스케일링

### 📈 분석 & 리포트
- 실시간 대시보드
- 커스텀 리포트 생성
- 데이터 시각화

### 🔧 시스템 관리
- 사용자 및 권한 관리
- 시스템 설정 및 모니터링
- 로그 관리

## 🛠️ 기술 스택

- **Frontend**: React 18.3.1 + TypeScript 5.8.3
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.4.3 + Radix UI
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 7.5.0
- **Icons**: Lucide React 0.511.0

## 📁 프로젝트 구조

```
apps/aips/src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── datatable/      # 데이터테이블 컴포넌트
│   ├── form/           # 폼 컴포넌트
│   └── charts/         # 차트 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── ai/             # AI 모듈 페이지
│   ├── data/           # 데이터 관리 페이지
│   ├── processing/     # 처리 엔진 페이지
│   ├── analytics/      # 분석 페이지
│   └── system/         # 시스템 관리 페이지
├── tabs/               # Tab Navigation 컴포넌트
├── hooks/              # 커스텀 React 훅
├── services/           # API 서비스 레이어
├── types/              # TypeScript 타입 정의
├── templates/          # 페이지 템플릿
├── routes/             # 라우팅 설정
├── utils/              # 유틸리티 함수
└── locales/            # 다국어 지원
```

## 🚀 개발 시작하기

### 1. 의존성 설치
```bash
# 루트 디렉토리에서
pnpm install
```

### 2. 개발 서버 실행
```bash
# AIPS 앱만 실행 (포트 3001)
pnpm dev --filter @repo/aips

# 또는 모든 앱 실행
pnpm dev
```

### 3. 빌드
```bash
# AIPS 앱 빌드
pnpm build --filter @repo/aips
```

## 🎯 개발 가이드

### 컴포넌트 개발
- Radix UI 컴포넌트를 우선 사용
- Primes 앱과 동일한 디자인 시스템 적용
- 재사용 가능한 컴포넌트는 `components/` 디렉토리에 배치

### 상태 관리
- 서버 상태: React Query 사용
- 로컬 상태: useState, useReducer 사용
- 전역 상태: Context API (최소한 사용)

### API 통합
- `services/` 디렉토리에 도메인별 API 서비스 구현
- `hooks/` 디렉토리에 React Query 훅 구현
- 원자적 훅 패턴 적용 (단일 책임 원칙)

### 라우팅
- URL 구조: `/{domain}/{module}/{action}`
- 예시: `/ai/models/list`, `/data/sources/register`

### 스타일링
- Tailwind CSS 클래스 사용
- 커스텀 컬러 시스템 활용
- 반응형 디자인 적용

## 🌐 다국어 지원

- 한국어 (ko) - 기본 언어
- 영어 (en) - 보조 언어
- 번역 파일: `src/locales/{lang}/`

## 📝 코드 생성

AIPS 앱도 Primes와 동일한 코드 생성 스크립트를 지원합니다:

```bash
cd apps/aips

# 페이지 생성
npm run page

# 탭 네비게이션 생성
npm run tab

# 설정 기반 생성
npm run generate
```

## 🔧 환경 변수

`.env` 파일에서 다음 환경 변수를 설정할 수 있습니다:

```env
VITE_APP_NAME=AIPS
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true
```

## 🤝 기여하기

1. 기능 브랜치 생성
2. 변경사항 커밋
3. 테스트 실행
4. Pull Request 생성

## 📄 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.