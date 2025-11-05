# WEB-WITH-KAFKA

Kafka를 사용하는 웹 애플리케이션 모노레포입니다.

## 기술 스택

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Package Manager**: pnpm 8
- **Monorepo**: Turborepo
- **UI Library**: Material-UI, React Bootstrap
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS, SCSS
- **Message Queue**: Kafka

## 프로젝트 구조

### 앱 (Apps)

- **primes**: 메인 프로덕션 애플리케이션
- **aips**: AI 인사이트 및 스케줄링 애플리케이션
- **esg**: ESG 관리 애플리케이션
- **scm**: 공급망 관리 애플리케이션
- **demo**: 데모 애플리케이션

### 패키지 (Packages)

공통 라이브러리 및 UI 컴포넌트를 포함하는 공유 패키지들입니다.

## 실행 방법

### 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```

### 빌드
```bash
pnpm build
```

### 린트
```bash
pnpm lint
```

## 주요 기능

- 멀티 애플리케이션 모노레포 구조
- 공유 패키지를 통한 코드 재사용
- Kafka를 통한 실시간 데이터 처리
- 다국어 지원 (i18n)
- 반응형 디자인
- API 문서 자동 생성 및 동기화