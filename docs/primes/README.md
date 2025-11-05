# 🎯 Primes 프로젝트 문서

## 📋 **프로젝트 개요**

Primes는 현대적인 기업용 ERP 시스템으로, React 18 + TypeScript + Radix UI를 기반으로 구축된 고품질 웹 애플리케이션입니다.

### **🏗️ 기술 스택**
- **Frontend**: React 18.3.1 + TypeScript 5.7.2
- **UI Framework**: Radix UI + Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Build Tool**: Vite 6.2.0
- **Package Manager**: pnpm

### **📊 현재 상태**
- **완성도**: 🟢 98%
- **페이지 수**: 260개
- **Hook 수**: 422개
- **솔루션 도메인**: 7개 (ini, sales, purchase, production, machine, mold, quality)

## 📚 **문서 목록**

### **🛡️ 품질 관리**
- **[GS 인증 가이드](./gs-certification.md)**: GS 인증을 위한 개발 패턴 및 요구사항
- **[GS 구현 계획](./gs-implementation-plan.md)**: 단계별 구현 계획 및 코드 예시
- **[테스트 전략](./testing-strategy.md)**: 로그인 기반 API 테스트 전략

### **🏗️ 아키텍처**
- **[개발 패턴](.cursorrules)**: Cursor Rules에 정의된 개발 표준
- **[컴포넌트 가이드](../../apps/primes/src/components/README.md)**: 컴포넌트 사용법
- **[Hook 패턴](../../apps/primes/src/hooks/README.md)**: Atomic Hooks 패턴

### **🚀 개발 가이드**
- **[스크립트 가이드](../../apps/primes/script/README.md)**: 코드 생성 스크립트
- **[변경사항](../../apps/primes/script/CHANGELOG.md)**: 버전별 변경 내역
- **[아키텍처](../../apps/primes/script/ARCHITECTURE.md)**: 시스템 아키텍처

## 🎯 **주요 특징**

### **📋 Enhanced Template System**
- **SinglePage**: Modal-based CRUD with DatatableComponent
- **MasterDetailPage**: Navigation-based CRUD with relationships
- **TabNavigation**: Tab-based navigation structure
- **CustomSelect**: Field API integrated select components
- **AtomicHooks**: Single responsibility hooks pattern
- **ValidationSchema**: Zod-based validation with business rules
- **ErrorBoundary**: Component-level error handling
- **TranslationKeys**: Hierarchical i18n key structure

### **🔧 개발 도구**
- **MCP 통합**: AI 기반 코드 생성
- **Swagger 동기화**: API 스키마 자동 동기화
- **자동 번역**: 다국어 지원 자동화
- **성능 모니터링**: Web Vitals 통합

## 🚀 **빠른 시작**

### **개발 환경 설정**
```bash
# 프로젝트 루트에서
cd apps/primes

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

### **MCP 사용법**
```bash
# 페이지 생성
pp "Vendor 리스트 페이지 만들어줘"

# Swagger 기반 서비스 생성
swagger Vendor vendor --domain=ini

# 코드 검증
pv "이 페이지 패턴 검증해줘"
```

### **코드 생성**
```bash
# 솔루션별 코드 생성
npm run generate:solution

# Swagger 기반 생성
npm run generate:swagger

# 개별 컴포넌트 생성
npm run page
npm run tab
```

## 🛡️ **품질 관리**

### **GS 인증 준비**
- **현재 수준**: 75% → **목표**: 95%
- **핵심 개선 영역**: 보안성, 신뢰성, 감사 추적
- **구현 일정**: 6주 계획

### **테스트 전략**
- **Unit Tests (80%)**: Hook, Utils 테스트
- **Integration Tests (15%)**: API 연동 테스트
- **E2E Tests (5%)**: 핵심 플로우 테스트

### **보안 강화**
- **입력 검증**: XSS/SQL Injection 방지
- **감사 추적**: 사용자 행동 로깅
- **접근 제어**: 역할 기반 권한 관리
- **성능 모니터링**: 실시간 성능 추적

## 📊 **개발 현황**

### **완료된 기능**
- ✅ 7개 솔루션 도메인 완성
- ✅ 422개 Hook, 260개 페이지
- ✅ MCP 통합 완료
- ✅ Template System 구축
- ✅ Swagger 동기화 시스템

### **진행 중인 작업**
- 🔄 GS 인증 준비
- 🔄 테스트 코드 도입
- 🔄 성능 최적화
- 🔄 보안 강화

### **계획된 작업**
- 📋 모바일 반응형 개선
- 📋 실시간 알림 시스템
- 📋 고급 분석 대시보드
- 📋 오프라인 지원

## 🔗 **관련 링크**

- **[메인 문서](../README.md)**: 전체 프로젝트 문서
- **[MCP 가이드](../mcp/README.md)**: 코드 생성 시스템
- **[공통 컴포넌트](../common/README.md)**: 공유 컴포넌트
- **[프로젝트 상태](../common/project-status-analysis.md)**: 전체 프로젝트 현황

## 📞 **지원**

- **개발팀**: primes-dev@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues)
- **문서 기여**: [Contributing Guide](../../CONTRIBUTING.md)

---

**📝 Last Updated**: 2025-01-08  
**🎯 Current Version**: v2.1.0  
**👥 Team**: Primes Development Team
