# Project Structure

## English

### Monorepo Organization
```
msa-monorepo/
├── apps/                    # Application packages
│   ├── demo/               # Component showcase app
│   ├── esg/                # ESG reporting system
│   ├── lts5/               # LTS5 management system
│   └── primes/             # Primes application
├── packages/               # Shared packages
│   ├── bootstrap-ui/       # Bootstrap-based components
│   ├── falcon-ui/          # Main Bootstrap UI library
│   ├── moornmo-ui/         # Material-UI based components
│   ├── radix-ui/           # Radix primitives components
│   ├── echart/             # Chart components
│   ├── editor-js/          # Editor functionality
│   ├── i18n/               # Internationalization
│   ├── toasto/             # Toast notifications
│   └── utils/              # Common utilities
└── scripts/                # Build and release scripts
```

### Application Structure Pattern
Each app follows this standard structure:
```
apps/[app-name]/
├── src/
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # App-specific utilities
│   ├── providers/          # Context providers
│   ├── reducers/           # State reducers
│   ├── routes/             # Routing configuration
│   ├── locales/            # Translation files
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static public files
├── package.json            # App dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

### Package Structure Pattern
Shared packages follow this structure:
```
packages/[package-name]/
├── src/
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── types/              # Type definitions
│   ├── utils/              # Utility functions
│   └── index.ts            # Main export file
├── package.json            # Package configuration
└── tsconfig.json           # TypeScript configuration
```

### Import Path Aliases
- `@falcon/*` → `packages/falcon-ui/*`
- `@moornmo/*` → `packages/moornmo-ui/src/*`
- `@radix-ui/*` → `packages/radix-ui/src/*`
- `@esg/*` → `apps/esg/src/*`
- `@lts5/*` → `apps/lts5/src/*`
- `@demo/*` → `apps/demo/src/*`
- `@primes/*` → `apps/primes/src/*`

### Naming Conventions
- **Packages**: `@repo/[package-name]` (kebab-case)
- **Components**: PascalCase (e.g., `MyComponent.tsx`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Folders**: kebab-case

## 한글

### 모노레포 구조
```
msa-monorepo/
├── apps/                    # 애플리케이션 패키지
│   ├── demo/               # 컴포넌트 쇼케이스 앱
│   ├── esg/                # ESG 보고 시스템
│   ├── lts5/               # LTS5 관리 시스템
│   └── primes/             # Primes 애플리케이션
├── packages/               # 공유 패키지
│   ├── bootstrap-ui/       # Bootstrap 기반 컴포넌트
│   ├── falcon-ui/          # 메인 Bootstrap UI 라이브러리
│   ├── moornmo-ui/         # Material-UI 기반 컴포넌트
│   ├── radix-ui/           # Radix primitives 컴포넌트
│   ├── echart/             # 차트 컴포넌트
│   ├── editor-js/          # 에디터 기능
│   ├── i18n/               # 다국어 지원
│   ├── toasto/             # 토스트 알림
│   └── utils/              # 공통 유틸리티
└── scripts/                # 빌드 및 릴리스 스크립트
```

### 애플리케이션 구조 패턴
각 앱은 다음 표준 구조를 따릅니다:
```
apps/[앱이름]/
├── src/
│   ├── components/         # React 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── hooks/              # 커스텀 React 훅
│   ├── services/           # API 서비스
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 앱별 유틸리티
│   ├── providers/          # Context 프로바이더
│   ├── reducers/           # 상태 리듀서
│   ├── routes/             # 라우팅 설정
│   ├── locales/            # 번역 파일
│   ├── assets/             # 정적 자산
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── main.tsx            # 앱 진입점
├── public/                 # 정적 공개 파일
├── package.json            # 앱 의존성
├── vite.config.ts          # Vite 설정
└── tsconfig.json           # TypeScript 설정
```

### 패키지 구조 패턴
공유 패키지는 다음 구조를 따릅니다:
```
packages/[패키지이름]/
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── types/              # 타입 정의
│   ├── utils/              # 유틸리티 함수
│   └── index.ts            # 메인 내보내기 파일
├── package.json            # 패키지 설정
└── tsconfig.json           # TypeScript 설정
```

### Import 경로 별칭
- `@falcon/*` → `packages/falcon-ui/*`
- `@moornmo/*` → `packages/moornmo-ui/src/*`
- `@radix-ui/*` → `packages/radix-ui/src/*`
- `@esg/*` → `apps/esg/src/*`
- `@lts5/*` → `apps/lts5/src/*`
- `@demo/*` → `apps/demo/src/*`
- `@primes/*` → `apps/primes/src/*`

### 명명 규칙
- **패키지**: `@repo/[패키지이름]` (kebab-case)
- **컴포넌트**: PascalCase (예: `MyComponent.tsx`)
- **파일**: 유틸리티는 kebab-case, 컴포넌트는 PascalCase
- **폴더**: kebab-case