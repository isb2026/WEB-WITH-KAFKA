# 🛠️ MCP (Model Context Protocol) 문서

## 📋 **MCP 시스템 개요**

MCP는 AI 기반 코드 생성 시스템으로, 프로젝트별 템플릿과 Swagger API 통합을 통해 일관된 고품질 코드를 자동 생성합니다.

### **🎯 주요 기능**

- **프로젝트별 템플릿**: Primes, ESG, AIPS, SCM 각각의 특화된 템플릿
- **Swagger 통합**: 실시간 API 스키마 동기화
- **AI Chat 통합**: 자연어로 코드 생성 요청
- **패턴 검증**: 생성된 코드의 품질 자동 검증

## 📚 **문서 목록**

### **🚀 사용 가이드**

- **[템플릿 사용 가이드](./template-usage-guide.md)**: 템플릿 시스템 완전 가이드
- **[Swagger 동기화](./swagger-sync-guide.md)**: API 스키마 동기화 시스템

### **🏗️ 시스템 구조**

- **[MCP 서버](../../mcp/server.py)**: 메인 MCP 서버 구현
- **[템플릿 엔진](../../mcp/core/template_engine.py)**: 템플릿 렌더링 엔진
- **[Swagger 분석기](../../mcp/core/swagger_sync_analyzer.py)**: API 스키마 분석

### **📋 프로젝트별 생성기**

- **[Primes 생성기](../../mcp/generators/primes/generator.py)**: Primes 전용 템플릿
- **[ESG 생성기](../../mcp/generators/esg/generator.py)**: ESG 전용 템플릿
- **[베이스 생성기](../../mcp/generators/base_generator.py)**: 공통 생성기 인터페이스

## 🎯 **MCP 명령어 참조**

### **📋 핵심 명령어 (우선순위 순)**

| 우선순위       | 명령어    | 목적                         | 예시                                       |
| -------------- | --------- | ---------------------------- | ------------------------------------------ |
| **🥇 HIGHEST** | `swagger` | **Swagger 기반 서비스 생성** | `swagger Machine machine --domain=machine` |
| **🥈 HIGH**    | `pp`      | 페이지 생성/수정             | `pp "거래처 리스트 페이지"`                |
| **🥉 MEDIUM**  | `pc`      | 컴포넌트 사용법              | `pc "DeleteConfirmDialog"`                 |
| **🥉 MEDIUM**  | `pv`      | 패턴 검증                    | `pv "패턴 검증해줘"`                       |
| **🥉 MEDIUM**  | `pfix`    | 코드 개선                    | `pfix "코드 개선해줘"`                     |

### **🌐 Swagger API 참조 명령어**

| 우선순위        | 명령어        | 목적             | 예시                                             |
| --------------- | ------------- | ---------------- | ------------------------------------------------ |
| **🚨 CRITICAL** | `sg-validate` | **필드 검증**    | `sg-validate ini vendor "vendorName,vendorCode"` |
| **🥇 FIRST**    | `sg-overview` | API 도메인 개요  | `sg-overview`                                    |
| **🥈 SECOND**   | `sg-suggest`  | 모듈 추천        | `sg-suggest "거래처 선택 기능"`                  |
| **🥉 THIRD**    | `sg-analyze`  | 모듈 호환성 분석 | `sg-analyze ini vendor "거래처 관리"`            |

## 🎨 **템플릿 시스템**

### **Primes 템플릿 (Radix UI + Tailwind)**

```typescript
// 자동 생성 예시
pp "Vendor 리스트 페이지 만들어줘"

// 생성되는 파일들:
✅ VendorListPage.tsx           // SinglePage template
✅ VendorTabNavigation.tsx      // TabNavigation template
✅ VendorSelectComponent.tsx    // CustomSelect template
✅ useVendor.ts                 // AtomicHooks template
✅ vendorValidation.ts          // ValidationSchema template
✅ VendorErrorBoundary.tsx      // ErrorBoundary template
✅ vendor.json                  // TranslationKeys template
```

### **ESG 템플릿 (Falcon UI + Bootstrap)**

```typescript
// 자동 생성 예시
pp "CarbonEmission 대시보드 만들어줘"

// 생성되는 파일들:
✅ CarbonEmissionDashboardPage.tsx    // DashboardPage template
✅ CarbonEmissionChartWidget.tsx      // ChartWidget template
✅ CarbonEmissionKPICard.tsx          // KPICard template
✅ CarbonEmissionFormWizard.tsx       // FormWizard template
✅ useCarbonEmission.ts               // ESGHooks template
✅ carbonEmissionValidation.ts        // ESGValidation template
```

## 🔧 **통합 스키마 시스템**

### **단일 정의 → 다중 출력**

```typescript
// 한 번 정의
FieldSchema({
  name: "vendorName",
  label: "거래처명",
  type: FieldType.TEXT,
  required: true,
  searchable: true,
  sortable: true
})

// 자동 생성
- searchFields: [{ key: "vendorName", type: "text" }]
- tableColumns: [{ accessorKey: "vendorName", header: "거래처명" }]
- formFields: [{ name: "vendorName", type: "text", required: true }]
```

## 🚀 **빠른 시작**

### **MCP 서버 실행**

```bash
# MCP 서버 시작
cd mcp
python server.py

# 또는 백그라운드 실행
python server.py &
```

### **첫 번째 코드 생성**

```bash
# 1. API 확인
sg-overview

# 2. 모듈 추천
sg-suggest "거래처 관리 기능"

# 3. 서비스 생성
swagger Vendor vendor --domain=ini

# 4. 페이지 생성
pp "Vendor 리스트 페이지 만들어줘"
```

### **코드 검증 및 개선**

```bash
# 패턴 검증
pv "이 페이지 템플릿 패턴 검증해줘"

# 코드 개선
pfix "이 코드 Primes 표준에 맞게 개선해줘"

# 컴포넌트 사용법
pc "DeleteConfirmDialog"
```

## 📊 **MCP 워크플로우**

### **🆕 새 기능 개발 워크플로우**

1. **API 탐색**: `sg-overview` → 사용 가능한 도메인 확인
2. **모듈 추천**: `sg-suggest "요청사항"` → 최적 모듈 추천
3. **호환성 분석**: `sg-analyze domain module "컨텍스트"` → 호환성 확인
4. **서비스 생성**: `swagger Module module --domain=domain` → API 기반 서비스
5. **필드 검증**: `sg-validate domain module "field1,field2"` → 필드 정확성 확인
6. **페이지 생성**: `pp "페이지 요청"` → UI 컴포넌트 생성
7. **최종 검증**: `pv` 또는 `pfix` → 표준 준수 확인

### **🔧 기존 코드 개선 워크플로우**

1. **현재 필드 확인**: `sg-validate domain module "현재 필드들"`
2. **호환성 분석**: `sg-analyze domain module "새 요구사항"`
3. **코드 개선**: `pfix "개선 요청"`
4. **재검증**: `pv "업데이트된 코드"`

## 🛡️ **품질 보장**

### **필수 검증 규칙**

- **🚨 MANDATORY**: 모든 서비스 개발 시 `sg-validate` 필수 실행
- **🔒 REQUIRED**: `swagger` 명령어 우선 사용 (`ps` 명령어 지양)
- **✅ CRITICAL**: 실제 API 스키마와 100% 일치 확인
- **🚫 FORBIDDEN**: 수동 필드 추측 금지

### **cleanedParams 패턴 자동 적용**

```typescript
// 자동 생성되는 보안 패턴
export const createVendor = async (data: Partial<CreateVendorPayload>) => {
	// Swagger 검증된 필드만 추출
	const { vendorName, vendorCode, companyRegNo } = data;

	const cleanedParams = { vendorName, vendorCode, companyRegNo };

	const res = await FetchApiPost('/ini/vendor', cleanedParams);
	// 에러 처리 포함
};
```

## 🔗 **관련 문서**

- **[메인 문서](../README.md)**: 전체 프로젝트 문서
- **[Primes 가이드](../primes/README.md)**: Primes 프로젝트 문서
- **[ESG 가이드](../esg/README.md)**: ESG 프로젝트 문서
- **[공통 컴포넌트](../common/README.md)**: 공유 컴포넌트 가이드

## 📞 **지원**

- **MCP 개발팀**: mcp-dev@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/msa-react-monorepo/issues?label=mcp)
- **기능 요청**: [Feature Requests](https://github.com/your-org/msa-react-monorepo/discussions)

---

**📝 Last Updated**: 2025-01-08  
**🎯 Current Version**: v2.0.0  
**👥 Team**: MCP Development Team
