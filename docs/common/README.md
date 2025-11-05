# 🏗️ 공통 컴포넌트 및 리소스

## 📋 **개요**

이 디렉토리는 모든 프로젝트에서 공유하는 컴포넌트, 유틸리티, 문서 및 분석 자료를 포함합니다.

## 📚 **문서 목록**

### **📊 프로젝트 분석**

- **[프로젝트 상태 분석](./project-status-analysis.md)**: 전체 프로젝트 현황 및 완성도 분석

### **⭐ 개발 가이드**

- **[베스트 프랙티스](../../mcp/best_practices_guide.md)**: 개발 베스트 프랙티스 종합 가이드
- **[패키지 구조](../../mcp/patterns/packages_inventory.py)**: 공유 패키지 및 컴포넌트 인벤토리

## 🎯 **공통 리소스**

### **📦 공유 패키지**

```
packages/
├── radix-ui/          # Radix UI 컴포넌트 (Primes, AIPS, SCM)
├── moornmo-ui/        # Material-UI 기반 컴포넌트
├── falcon-ui/         # Bootstrap 기반 컴포넌트 (ESG)
├── utils/             # 공통 유틸리티
├── echart/            # 차트 컴포넌트
├── gantt-charts/      # 간트 차트
├── react-flow/        # 플로우 차트
└── swiper/            # 슬라이더 컴포넌트
```

### **🛠️ 개발 도구**

- **ESLint Config**: 공통 린팅 규칙
- **TypeScript Config**: 공통 타입스크립트 설정
- **Tailwind Config**: 공통 스타일 시스템

### **🎨 디자인 시스템**

- **Color System**: `Colors-Brand-*`, `Colors-Gray-*` 등
- **Spacing System**: `Spacing-*` 유틸리티
- **Typography**: 일관된 폰트 시스템
- **Component Tokens**: 컴포넌트별 디자인 토큰

## 🏗️ **아키텍처 패턴**

### **Monorepo 구조**

```
msa-react-monorepo/
├── apps/              # 각 프로젝트 애플리케이션
│   ├── primes/        # ERP 시스템
│   ├── esg/           # ESG 관리 시스템
│   ├── aips/          # AI 생산성 시스템
│   └── scm/           # 공급망 관리 시스템
├── packages/          # 공유 패키지
├── mcp/               # 코드 생성 시스템
└── docs/              # 프로젝트별 문서
```

### **패키지 의존성 관리**

- **pnpm Workspace**: 효율적인 의존성 관리
- **Turborepo**: 빌드 최적화 및 캐싱
- **공유 의존성**: 중복 제거 및 버전 통일

### **코드 공유 전략**

- **UI 컴포넌트**: 프로젝트별 특화 vs 공통 컴포넌트
- **비즈니스 로직**: 도메인별 분리
- **유틸리티**: 순수 함수 중심 공유

## 🔧 **개발 도구 및 설정**

### **공통 설정 파일**

```typescript
// packages/eslint-config/index.js
module.exports = {
  extends: [
    '@repo/eslint-config/base',
    '@repo/eslint-config/react'
  ],
  rules: {
    // 프로젝트 공통 규칙
  }
};

// packages/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### **빌드 시스템**

- **Vite**: 빠른 개발 서버 및 빌드
- **Turborepo**: 모노레포 빌드 최적화
- **TypeScript**: 전체 프로젝트 타입 안전성

## 📊 **품질 관리**

### **코드 품질**

- **ESLint**: 코드 스타일 및 품질 검사
- **Prettier**: 코드 포맷팅 자동화
- **TypeScript**: 타입 안전성 보장
- **Husky**: Git Hook을 통한 품질 게이트

### **테스트 전략**

- **Unit Tests**: 공통 유틸리티 테스트
- **Integration Tests**: 패키지 간 연동 테스트
- **Visual Tests**: 컴포넌트 시각적 회귀 테스트

### **성능 모니터링**

- **Bundle Analysis**: 번들 크기 분석
- **Performance Metrics**: 로딩 시간 추적
- **Memory Usage**: 메모리 사용량 모니터링

## 🚀 **사용 가이드**

### **새 프로젝트 추가**

```bash
# 1. 앱 디렉토리 생성
mkdir apps/new-project

# 2. 기본 구조 복사
cp -r apps/primes/package.json apps/new-project/
cp -r apps/primes/vite.config.ts apps/new-project/

# 3. 의존성 설치
cd apps/new-project
pnpm install

# 4. 문서 생성
mkdir docs/new-project
cp docs/primes/README.md docs/new-project/
```

### **공통 컴포넌트 사용**

```typescript
// 공통 컴포넌트 import
import { Button } from '@repo/radix-ui/components';
import { DataTable } from '@repo/moornmo-ui/components';
import { formatDate } from '@repo/utils';

// 프로젝트별 컴포넌트
import { VendorForm } from '@primes/components/vendor';
```

### **패키지 개발**

```bash
# 새 공통 패키지 생성
mkdir packages/new-package
cd packages/new-package

# package.json 생성
npm init -y

# TypeScript 설정
cp ../utils/tsconfig.json ./
```

## 🔗 **관련 문서**

- **[메인 문서](../README.md)**: 전체 프로젝트 문서
- **[Primes 가이드](../primes/README.md)**: Primes 프로젝트
- **[ESG 가이드](../esg/README.md)**: ESG 프로젝트
- **[MCP 시스템](../mcp/README.md)**: 코드 생성 시스템

## 📞 **지원**

- **공통 컴포넌트 팀**: common-components@company.com
- **아키텍처 문의**: architecture@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues?label=common)

---

**📝 Last Updated**: 2025-01-08  
**🏗️ Architecture Version**: v2.0.0  
**👥 Team**: Platform Team
