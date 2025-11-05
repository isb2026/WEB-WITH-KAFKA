# 변경사항 (Changelog)

## [2.1.0] - 2025-01-15

### 🎯 Primes Standard Patterns 정립

#### ✨ Selected Row Handling Pattern 표준화

- **문제 해결**: selectedRows 처리 방식 통일화
- **성능 개선**: ID 검색(O(n)) → 인덱스 접근(O(1))
- **패턴 통일**: IniVendorListPage와 동일한 방식 적용
- **디버깅 강화**: console.log로 selectedRows 추적 가능
- **코드 간소화**: 복잡한 getSelected 함수 제거

#### 🔧 Modal-based CRUD Pattern 완성

- **Single Select**: `enableSingleSelect={true}` 표준
- **Real-time Sync**: selectedRows 변경 시 즉시 데이터 저장
- **Toast Notifications**: 사용자 친화적 경고 메시지
- **Component Reuse**: DeleteConfirmDialog 표준 사용

#### 📋 Component Standards 문서화

- **Radix UI 우선순위**: 컴포넌트 사용 가이드라인 정립
- **Primes Common Components**: 재사용 가능한 컴포넌트 목록화
- **Form & DataTable Patterns**: 표준 사용법 정의
- **Toast & Dialog Guidelines**: UX 일관성 확보

## [2.0.0] - 2025-01-01

### 🎉 주요 개선사항

#### ✨ 하이픈 처리 완전 개선

- **문제 해결**: kebab-case API 이름을 올바른 JavaScript 변수명으로 변환
- **이전**: `tax-invoice` → `taxInvoiceTabNavigation` (잘못된 변환)
- **개선**: `tax-invoice` → `TaxInvoiceTabNavigation` (올바른 변환)
- **Hook 정규화**: `useTax-invoice` → `useTaxInvoice`

#### 🚀 Node.js 20 완전 호환성

- Optional chaining 제거 → `safeGet()` 함수 사용
- ESM 모듈 완전 지원
- `.nvmrc` 파일로 버전 관리 (v20.20.4)

#### 📊 배치 처리 및 성능 최적화

- 여러 솔루션을 병렬로 처리
- 실시간 진행률 표시 (10개 파일마다)
- 생성 통계 자동 출력 (성공/실패 개수, 소요 시간)
- 메모리 효율적인 파일 생성

#### 🛡️ 에러 처리 및 백업 시스템

- 각 단계별 세밀한 에러 처리
- 기존 파일 자동 백업 (타임스탬프 포함)
- 실패한 파일 목록 및 원인 상세 표시
- 에러 격리 (한 솔루션 실패가 다른 솔루션에 영향 없음)

### 🔧 새로운 유틸리티 함수들

#### stringUtils.js

- `toCamelCase()`: kebab-case → camelCase 변환
- `toPascalCase()`: kebab-case → PascalCase 변환
- `toKebabCase()`: PascalCase → kebab-case 변환
- `normalizeHookName()`: Hook 이름 정규화

#### compatibilityUtils.js

- `safeGet()`: Optional chaining 안전한 대체
- `safeAccess()`: 중첩 객체 안전 접근
- `nullishCoalescing()`: Nullish coalescing 대체

#### columnUtils.js

- `generateDefaultColumns()`: 기본 컬럼 세트 생성
- `improveColumns()`: 컬럼 개선 (날짜 필드 렌더러 등)
- `generateInfoGridKeys()`: InfoGrid 키 자동 생성
- `detectColumnType()`: 컬럼 타입 자동 감지

#### templateUtils.js (새로 추가)

- `generateImports()`: 공통 import 문 생성
- `generateInterface()`: TypeScript 인터페이스 생성
- `generateJSDoc()`: JSDoc 주석 생성

### 📝 템플릿 생성기 개선

#### TabNavigationGenerater.js

- 컴포넌트명 단순화 및 export default 사용
- useEffect 로직 개선으로 정확한 경로 매칭
- TypeScript 타입 정의 개선

#### SinglePageGenerater.js

- 빈 컬럼 배열 처리 로직 개선
- 기본 컬럼 세트 자동 생성
- 날짜 필드 cell 렌더러 자동 추가
- 로딩 상태 및 에러 처리 로직 추가

#### MasterDetailPageGenerater.js

- InfoGrid 키 자동 생성 로직 구현
- useCallback을 사용한 성능 최적화
- 마스터-디테일 관계 처리 개선

#### RegisterPageGenerater.js

- 폼 필드 검증 및 개선 로직 구현
- 기본 폼 필드 세트 생성
- 에러 처리 및 토스트 알림 추가
- 중복 제출 방지 로직 구현

### 🔄 메인 스크립트 개선

#### generateFromSolutionConfig.js

- 배치 파일 생성으로 성능 향상
- 상세한 진행률 및 통계 표시
- 에러 격리 및 복구 로직
- 백업 시스템 통합

#### ConfigGenerator.js (Swagger 분석기)

- 새로운 유틸리티 함수들 적용
- Hook 이름 정규화 로직 추가
- 스키마 참조 해결 로직 완성
- 다양한 헬퍼 함수들 추가

### 📚 문서화 개선

- README.md 전면 업데이트
- ARCHITECTURE.md 아키텍처 문서 추가
- DEVELOPER_GUIDE.md 개발자 가이드 추가
- SCRIPTS_GUIDE.md 스크립트 사용법 가이드 추가
- CHANGELOG.md 변경사항 문서 추가

### 🐛 버그 수정

- Hook 이름에서 하이픈 제거 처리
- 라우트 구조에서 TabNavigation 우선순위 수정
- 빈 컬럼 배열로 인한 생성 실패 문제 해결
- Node.js 20에서 Optional chaining 오류 해결

### ⚠️ Breaking Changes

- Node.js 18 이하 버전 지원 중단 (Node.js 20+ 필수)
- 일부 생성된 파일의 구조 변경 (TabNavigation export 방식)
- Hook 이름 정규화로 기존 Hook 이름과 다를 수 있음

### 🔄 마이그레이션 가이드

자세한 마이그레이션 방법은 `MIGRATION.md` 파일을 참조하세요.

---

## [1.0.0] - 2024-12-01

### 🎉 초기 릴리스

- 기본 코드 생성 시스템 구현
- SinglePage, MasterDetailPage, RegisterPage 템플릿 지원
- TabNavigation 자동 생성
- Swagger 기반 코드 생성
- 솔루션별 config 지원
