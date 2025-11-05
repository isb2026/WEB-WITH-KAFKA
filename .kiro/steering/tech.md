# Technology Stack

## English

### Build System & Package Management
- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: pnpm with workspace support
- **Node.js Version**: 18.20.4

### Core Technologies
- **Frontend**: React 18.3.1 with TypeScript 5.7.2
- **Build Tool**: Vite 6.2.0
- **Styling**: 
  - Tailwind CSS 3.4.3
  - Styled Components 6.1.17
  - Bootstrap 5.3.3
  - SCSS/Sass

### UI Libraries
- **Material-UI**: @mui/material 7.0.2
- **Radix UI**: Radix primitives for accessible components
- **Chart Libraries**: Chart.js, Recharts, ECharts
- **Icons**: Lucide React, FontAwesome, MUI Icons

### State Management & Data
- **HTTP Client**: Axios 1.8.4
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form 7.55.0
- **Routing**: React Router DOM 7.5.0

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier (tabs, single quotes, semicolons)
- **Testing**: Jest, React Testing Library

### Common Commands
```bash
# Development
pnpm dev                              # Run all apps
pnpm dev --filter @repo/[app-name]   # Run specific app

# Building
pnpm build                            # Build all packages
pnpm build --filter @repo/[app-name] # Build specific app

# Code Quality
pnpm lint                             # Lint all packages
pnpm format                           # Format code with Prettier

# Package Management
pnpm add [package] --filter @repo/[workspace] # Add dependency to specific workspace

# Release Management
pnpm commit                           # Commit with changeset
pnpm release                          # Release packages
```

## 한글

### 빌드 시스템 및 패키지 관리
- **모노레포**: Turborepo를 사용한 빌드 오케스트레이션 및 캐싱
- **패키지 매니저**: pnpm 워크스페이스 지원
- **Node.js 버전**: 18.20.4

### 핵심 기술
- **프론트엔드**: React 18.3.1 with TypeScript 5.7.2
- **빌드 도구**: Vite 6.2.0
- **스타일링**: 
  - Tailwind CSS 3.4.3
  - Styled Components 6.1.17
  - Bootstrap 5.3.3
  - SCSS/Sass

### UI 라이브러리
- **Material-UI**: @mui/material 7.0.2
- **Radix UI**: 접근성을 고려한 Radix primitives
- **차트 라이브러리**: Chart.js, Recharts, ECharts
- **아이콘**: Lucide React, FontAwesome, MUI Icons

### 상태 관리 및 데이터
- **HTTP 클라이언트**: Axios 1.8.4
- **상태 관리**: React Query (@tanstack/react-query)
- **폼**: React Hook Form 7.55.0
- **라우팅**: React Router DOM 7.5.0

### 개발 도구
- **린팅**: TypeScript 지원 ESLint
- **포매팅**: Prettier (탭, 단일 따옴표, 세미콜론)
- **테스팅**: Jest, React Testing Library

### 주요 명령어
```bash
# 개발
pnpm dev                              # 모든 앱 실행
pnpm dev --filter @repo/[앱이름]      # 특정 앱 실행

# 빌드
pnpm build                            # 모든 패키지 빌드
pnpm build --filter @repo/[앱이름]    # 특정 앱 빌드

# 코드 품질
pnpm lint                             # 모든 패키지 린트
pnpm format                           # Prettier로 코드 포맷

# 패키지 관리
pnpm add [패키지] --filter @repo/[워크스페이스] # 특정 워크스페이스에 의존성 추가

# 릴리스 관리
pnpm commit                           # changeset과 함께 커밋
pnpm release                          # 패키지 릴리스
```