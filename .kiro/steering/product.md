---
inclusion: always
---

# Product Architecture & Conventions

## English

### Core Principles
- **Component Reusability**: Prioritize shared components over app-specific implementations
- **Design System Consistency**: Use established UI libraries (Falcon, Moornmo, Radix) before creating custom components
- **Type Safety**: Leverage TypeScript strictly - avoid `any` types, define proper interfaces
- **Performance**: Implement lazy loading for routes and heavy components

### Architecture Patterns

#### Component Libraries
- **Falcon UI**: Bootstrap-based components for traditional enterprise UIs
- **Moornmo UI**: Material-UI based components for modern interfaces  
- **Radix UI**: Accessible primitives for custom component development
- **Priority Order**: Use Radix > Moornmo > Falcon > Custom components

#### Application Structure
- **Pages**: Route-level components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Hooks**: Custom React hooks for business logic in `src/hooks/`
- **Services**: API layer and external integrations in `src/services/`
- **Types**: TypeScript definitions in `src/types/`

#### State Management
- **React Query**: For server state and API caching
- **Context + Reducers**: For complex local state (see MenuProvider pattern)
- **Local State**: useState for simple component state only

### Code Conventions

#### Component Development
- Use functional components with TypeScript
- Implement proper prop interfaces with JSDoc comments
- Follow atomic design principles (atoms → molecules → organisms)
- Export components from index files for clean imports

#### API Integration
- Use axios with proper error handling
- Implement loading states and error boundaries
- Cache responses with React Query when appropriate
- Define service functions in dedicated service files

#### Internationalization
- Use `@repo/i18n` package for translations
- Support both English and Korean (한글)
- Store translations in `src/locales/` directories
- Use translation keys, not hardcoded strings

#### File Organization
- Group related files in feature-based folders
- Use barrel exports (index.ts) for clean imports
- Keep components small and focused (< 200 lines)
- Separate business logic into custom hooks

### Application-Specific Guidelines

#### Demo App
- **Purpose**: Testing and showcasing Radix components and other UI libraries
- **Primary Use**: Component demonstration and testing environment
- **Tech Stack**: Radix UI components for accessibility testing
- **Features**: Interactive component examples with code previews using PreviewCodeTabs

#### ESG App
- **Tech Stack**: Falcon UI (Bootstrap-based components)
- **Focus**: Data visualization and ESG reporting systems
- **Features**: Form validation for data collection, charts from `@repo/echart` package
- **Status**: Production system using traditional enterprise UI patterns

#### LTS5 App
- **Tech Stack**: Falcon UI (Bootstrap-based components)  
- **Purpose**: Legacy enterprise management system (predecessor to Primes)
- **Features**: Complex navigation with MenuProvider, multi-language support
- **Status**: Existing system being replaced by Primes

#### Primes App (Priority Development)
- **Tech Stack**: Tailwind CSS + Radix UI for modern, accessible design
- **Purpose**: Renewed version replacing LTS5 with modern architecture
- **Features**: Script-based page generation, master-detail patterns, tab navigation
- **Status**: Currently in active development - highest priority
- **Design Philosophy**: Modern, accessible UI with Tailwind styling and Radix primitives

### Development Workflow
- **Priority Focus**: Primes app development is the current highest priority
- Create components in shared packages when reusable across apps
- Use Turborepo for efficient builds and caching
- Follow semantic versioning with changesets
- Test Radix components in demo app before implementing in Primes
- Leverage Tailwind + Radix combination for new Primes features
## 
한글

### 핵심 원칙
- **컴포넌트 재사용성**: 앱별 구현보다 공유 컴포넌트를 우선시
- **디자인 시스템 일관성**: 커스텀 컴포넌트 생성 전에 기존 UI 라이브러리(Falcon, Moornmo, Radix) 사용
- **타입 안전성**: TypeScript를 엄격하게 활용 - `any` 타입 지양, 적절한 인터페이스 정의
- **성능**: 라우트 및 무거운 컴포넌트에 대한 지연 로딩 구현

### 아키텍처 패턴

#### 컴포넌트 라이브러리
- **Falcon UI**: 전통적인 엔터프라이즈 UI를 위한 Bootstrap 기반 컴포넌트
- **Moornmo UI**: 모던 인터페이스를 위한 Material-UI 기반 컴포넌트
- **Radix UI**: 커스텀 컴포넌트 개발을 위한 접근성 프리미티브
- **우선순위**: Radix > Moornmo > Falcon > 커스텀 컴포넌트

#### 애플리케이션 구조
- **Pages**: `src/pages/`의 라우트 레벨 컴포넌트
- **Components**: `src/components/`의 재사용 가능한 UI 컴포넌트
- **Hooks**: `src/hooks/`의 비즈니스 로직을 위한 커스텀 React 훅
- **Services**: `src/services/`의 API 레이어 및 외부 통합
- **Types**: `src/types/`의 TypeScript 정의

#### 상태 관리
- **React Query**: 서버 상태 및 API 캐싱용
- **Context + Reducers**: 복잡한 로컬 상태용 (MenuProvider 패턴 참조)
- **Local State**: 간단한 컴포넌트 상태에만 useState 사용

### 코드 규칙

#### 컴포넌트 개발
- TypeScript와 함께 함수형 컴포넌트 사용
- JSDoc 주석과 함께 적절한 prop 인터페이스 구현
- 아토믹 디자인 원칙 준수 (atoms → molecules → organisms)
- 깔끔한 import를 위해 index 파일에서 컴포넌트 내보내기

#### API 통합
- 적절한 에러 처리와 함께 axios 사용
- 로딩 상태 및 에러 바운더리 구현
- 적절한 경우 React Query로 응답 캐싱
- 전용 서비스 파일에서 서비스 함수 정의

#### 다국어 지원
- 번역을 위해 `@repo/i18n` 패키지 사용
- 영어와 한글 모두 지원
- `src/locales/` 디렉토리에 번역 저장
- 하드코딩된 문자열이 아닌 번역 키 사용

#### 파일 구성
- 기능 기반 폴더에서 관련 파일 그룹화
- 깔끔한 import를 위해 배럴 내보내기(index.ts) 사용
- 컴포넌트를 작고 집중적으로 유지 (< 200줄)
- 비즈니스 로직을 커스텀 훅으로 분리

### 애플리케이션별 가이드라인

#### Demo 앱
- **목적**: Radix 컴포넌트 및 기타 UI 라이브러리 테스트 및 쇼케이스
- **주요 용도**: 컴포넌트 데모 및 테스트 환경
- **기술 스택**: 접근성 테스트를 위한 Radix UI 컴포넌트
- **기능**: PreviewCodeTabs를 사용한 코드 미리보기가 포함된 인터랙티브 컴포넌트 예제

#### ESG 앱
- **기술 스택**: Falcon UI (Bootstrap 기반 컴포넌트)
- **집중 영역**: 데이터 시각화 및 ESG 보고 시스템
- **기능**: 데이터 수집을 위한 폼 검증, `@repo/echart` 패키지의 차트
- **상태**: 전통적인 엔터프라이즈 UI 패턴을 사용하는 프로덕션 시스템

#### LTS5 앱
- **기술 스택**: Falcon UI (Bootstrap 기반 컴포넌트)
- **목적**: 레거시 엔터프라이즈 관리 시스템 (Primes의 전신)
- **기능**: MenuProvider를 사용한 복잡한 네비게이션, 다국어 지원
- **상태**: Primes로 교체되고 있는 기존 시스템

#### Primes 앱 (우선 개발 대상)
- **기술 스택**: 모던하고 접근성 있는 디자인을 위한 Tailwind CSS + Radix UI
- **목적**: LTS5를 모던 아키텍처로 교체하는 리뉴얼 버전
- **기능**: 스크립트 기반 페이지 생성, 마스터-디테일 패턴, 탭 네비게이션
- **상태**: 현재 활발히 개발 중 - 최우선 순위
- **디자인 철학**: Tailwind 스타일링과 Radix 프리미티브를 사용한 모던하고 접근성 있는 UI

### 개발 워크플로우
- **우선순위 집중**: Primes 앱 개발이 현재 최우선 순위
- 앱 간 재사용 가능한 경우 공유 패키지에서 컴포넌트 생성
- 효율적인 빌드 및 캐싱을 위해 Turborepo 사용
- changeset을 사용한 시맨틱 버저닝 준수
- Primes에서 구현하기 전에 데모 앱에서 Radix 컴포넌트 테스트
- 새로운 Primes 기능을 위해 Tailwind + Radix 조합 활용