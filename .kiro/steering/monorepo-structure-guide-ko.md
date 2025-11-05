# MSA React Monorepo 구조 가이드 (한글)

## 개요

MSA React Monorepo는 Turborepo를 기반으로 구축된 마이크로서비스 아키텍처 프론트엔드 프로젝트입니다.
패키지 기반 아키텍처로 UI 라이브러리와 애플리케이션을 효율적으로 관리합니다.

## 전체 구조

```
msa-monorepo/
├── apps/                    # 애플리케이션들
│   ├── demo/               # UI 컴포넌트 쇼케이스 (Radix UI 테스트)
│   ├── esg/                # ESG 보고 시스템 (운영 중)
│   ├── primes/             # 메인 애플리케이션 (최우선 개발)
│   └── lts5/               # 레거시 시스템 (곧 제거 예정)
├── packages/               # 공유 패키지들
│   ├── radix-ui/           # Radix 기반 UI 컴포넌트 (최우선)
│   ├── falcon-ui/          # Bootstrap 기반 UI 컴포넌트
│   ├── moornmo-ui/         # Material-UI 기반 컴포넌트
│   ├── bootstrap-ui/       # Bootstrap 컴포넌트
│   ├── echart/             # 차트 컴포넌트
│   ├── editor-js/          # 에디터 기능
│   ├── i18n/               # 다국어 지원
│   ├── toasto/             # 토스트 알림
│   └── utils/              # 공통 유틸리티
├── scripts/                # 빌드 및 릴리스 스크립트
└── turbo.json              # Turborepo 설정
```

## 애플리케이션 현황

### 🚀 **Primes** (최우선 개발)
- **목적**: LTS5를 대체하는 현대적인 메인 애플리케이션
- **기술 스택**: React + TypeScript + Tailwind CSS + Radix UI
- **상태**: 활발한 개발 중
- **특징**: 
  - 현대적인 아키텍처
  - 접근성 우선 설계
  - 스크립트 기반 코드 생성

### 📊 **ESG** (운영 중)
- **목적**: ESG 보고 및 데이터 관리 시스템
- **기술 스택**: React + Falcon UI (Bootstrap)
- **상태**: 프로덕션 운영
- **특징**:
  - 데이터 시각화 중심
  - 차트 및 리포팅 기능

### 🎨 **Demo** (개발 도구)
- **목적**: UI 컴포넌트 쇼케이스 및 테스트
- **기술 스택**: React + Radix UI
- **상태**: 개발 지원 도구
- **특징**:
  - Radix UI 컴포넌트 테스트
  - 접근성 검증
  - 컴포넌트 문서화

### ⚠️ **LTS5** (제거 예정)
- **목적**: 레거시 엔터프라이즈 시스템
- **기술 스택**: React + Falcon UI (Bootstrap)
- **상태**: 곧 제거 예정
- **마이그레이션**: Primes로 기능 이전 중

## 패키지 생태계

### UI 라이브러리 우선순위

1. **🎯 Radix UI** (최우선)
   - 접근성 우선 설계
   - 커스터마이징 용이
   - Primes 앱 주력 사용

2. **🎨 Moornmo UI**
   - Material-UI 기반
   - 모던 디자인 시스템

3. **📋 Falcon UI**
   - Bootstrap 기반
   - 엔터프라이즈 UI 패턴
   - ESG, LTS5에서 사용

4. **🔧 Bootstrap UI**
   - 순수 Bootstrap 컴포넌트
   - 레거시 지원

### 기능별 패키지

#### 📈 **EChart**
- 차트 및 데이터 시각화
- ESG 앱에서 주로 사용
- Chart.js, Recharts, ECharts 통합

#### ✏️ **Editor-JS**
- 리치 텍스트 에디터
- 블록 기반 에디터 기능

#### 🌐 **i18n**
- 다국어 지원 (한글/영어)
- 모든 앱에서 공통 사용

#### 🔔 **Toasto**
- 토스트 알림 시스템
- 사용자 피드백 UI

#### 🛠️ **Utils**
- 공통 유틸리티 함수
- 타입 정의
- 헬퍼 함수들

## Turborepo 설정

### 빌드 파이프라인

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

### 주요 명령어

```bash
# 전체 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm dev --filter @repo/primes
pnpm dev --filter @repo/esg
pnpm dev --filter @repo/demo

# 전체 빌드
pnpm build

# 특정 앱 빌드
pnpm build --filter @repo/primes

# 린팅
pnpm lint

# 패키지 추가 (특정 워크스페이스에)
pnpm add [패키지] --filter @repo/primes
```

## 개발 워크플로우

### 1. 새로운 UI 컴포넌트 개발
```bash
# 1. Demo 앱에서 컴포넌트 테스트
cd apps/demo
pnpm dev

# 2. Radix UI 패키지에 컴포넌트 추가
cd packages/radix-ui
# 컴포넌트 개발

# 3. Primes 앱에서 사용
cd apps/primes
# 컴포넌트 적용
```

### 2. 새로운 기능 개발 (Primes)
```bash
# 1. Primes 앱 개발 서버 실행
pnpm dev --filter @repo/primes

# 2. 스크립트 기반 코드 생성
cd apps/primes
npm run page    # 페이지 생성
npm run tab     # 탭 생성

# 3. 필요시 공통 컴포넌트를 패키지로 추출
```

### 3. ESG 앱 유지보수
```bash
# ESG 앱 개발
pnpm dev --filter @repo/esg

# Falcon UI 컴포넌트 사용
# EChart 패키지 활용
```

## 패키지 의존성 관리

### 내부 패키지 참조
```json
{
  "dependencies": {
    "@repo/radix-ui": "workspace:^",
    "@repo/utils": "workspace:^",
    "@repo/i18n": "workspace:^"
  }
}
```

### Import 별칭 설정
```typescript
// Primes 앱
import { Button } from '@repo/radix-ui';
import { useTranslation } from '@repo/i18n';
import { formatDate } from '@repo/utils';

// ESG 앱
import { DataTable } from '@repo/falcon-ui';
import { LineChart } from '@repo/echart';
```

## 마이그레이션 전략

### LTS5 → Primes 마이그레이션

1. **기능 분석**
   - LTS5의 핵심 기능 식별
   - 비즈니스 로직 추출

2. **아키텍처 현대화**
   - Falcon UI → Radix UI 전환
   - 레거시 패턴 → 현대적 패턴

3. **점진적 마이그레이션**
   - 도메인별 순차 이전
   - 병렬 운영 기간 최소화

4. **데이터 마이그레이션**
   - API 호환성 유지
   - 사용자 데이터 보존

## 성능 최적화

### Turborepo 캐싱
- 빌드 결과 캐싱
- 의존성 기반 증분 빌드
- 원격 캐시 활용

### 패키지 최적화
- Tree-shaking 지원
- 번들 크기 최적화
- 지연 로딩 적용

## 배포 전략

### 개별 앱 배포
```bash
# Primes 앱 배포
pnpm build --filter @repo/primes
# 배포 스크립트 실행

# ESG 앱 배포
pnpm build --filter @repo/esg
# 배포 스크립트 실행
```

### 패키지 버전 관리
- Changesets 사용
- 시맨틱 버저닝
- 자동 릴리스 노트

## 베스트 프랙티스

### 1. 패키지 설계
- 단일 책임 원칙
- 명확한 API 설계
- 타입 안전성 보장

### 2. 의존성 관리
- 순환 의존성 방지
- 최소 의존성 원칙
- 버전 호환성 유지

### 3. 코드 품질
- 공통 린팅 규칙
- 타입스크립트 엄격 모드
- 자동화된 테스트

### 4. 개발자 경험
- 빠른 개발 서버
- Hot Module Replacement
- 자동 코드 생성

이 가이드는 MSA React Monorepo의 전체 구조와 개발 워크플로우를 이해하기 위한 종합적인 참조 문서입니다.