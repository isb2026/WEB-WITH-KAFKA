# 🤖 AI Development Rules for MSA React Monorepo

**📋 이 파일은 모든 AI 도구(Cursor, GitHub Copilot, Claude, GPT, Codeium 등)에서 참조할 수 있는 범용 개발 가이드입니다.**

---

## 🎯 **STEP 1: 프로젝트 식별 (필수)**

**⚠️ 모든 작업 전에 반드시 프로젝트를 확인하세요!**

### **사용 가능한 프로젝트**

```
🎯 Primes    → ERP 시스템 (Radix UI + Tailwind)
🌱 ESG       → 지속가능성 관리 (Falcon UI + Bootstrap)
🤖 AIPS      → AI 생산성 시스템 (Radix UI + Tailwind)
📦 SCM       → 공급망 관리 (Radix UI + Tailwind)
```

### **프로젝트 결정 질문**

```
"어떤 프로젝트에서 작업하시겠습니까?"

💡 힌트:
- 거래처/재고/주문 관리 → Primes
- 탄소배출/ESG 대시보드 → ESG
- AI 분석/자동화 → AIPS
- 공급업체/물류 → SCM
```

---

## 📁 **프로젝트 구조**

### **Monorepo 구조**

```
msa-react-monorepo/
├── apps/
│   ├── primes/     # ERP 시스템
│   ├── esg/        # ESG 관리
│   ├── aips/       # AI 생산성
│   └── scm/        # 공급망 관리
├── packages/       # 공유 컴포넌트
├── mcp/           # AI 코드 생성 시스템
└── docs/          # 프로젝트별 문서
```

### **각 프로젝트 앱 구조**

```
apps/{project}/src/
├── components/    # 재사용 UI 컴포넌트
├── hooks/        # 커스텀 React 훅 (도메인별)
├── pages/        # 페이지 컴포넌트 (도메인별)
├── services/     # API 서비스 레이어
├── types/        # TypeScript 타입 정의
├── utils/        # 유틸리티 함수
└── locales/      # 다국어 번역 파일
```

---

## 🎨 **UI 프레임워크 매핑**

| 프로젝트   | UI 프레임워크 | 스타일링     | 패키지            |
| ---------- | ------------- | ------------ | ----------------- |
| **Primes** | Radix UI      | Tailwind CSS | `@repo/radix-ui`  |
| **AIPS**   | Radix UI      | Tailwind CSS | `@repo/radix-ui`  |
| **SCM**    | Radix UI      | Tailwind CSS | `@repo/radix-ui`  |
| **ESG**    | Falcon UI     | Bootstrap    | `@repo/falcon-ui` |

### **컴포넌트 Import 패턴**

```typescript
// Primes, AIPS, SCM
import { DataTable, DraggableDialog } from '@repo/radix-ui/components';

// ESG
import { MainLayout } from '@repo/falcon-ui/layouts';
import { ChartCardComponents } from '@repo/falcon-ui/components/cards';

// 공통 (모든 프로젝트)
import { EchartComponent } from '@repo/echart/components';
import { useTranslation } from '@repo/i18n';
```

### **프로젝트별 컴포넌트 패턴**

```typescript
// 🎯 Primes (ERP 시스템)
// UI: Radix UI + Tailwind CSS
// 패턴: Modal CRUD, Master-Detail, Tab Navigation
// 주요 컴포넌트: ActionButtons, InfoGrid, DataTable, Dialog

// 🌱 ESG (지속가능성 관리)
// UI: Falcon UI + Bootstrap
// 패턴: Dashboard, Chart Widgets, KPI Cards, Form Wizard
// 주요 컴포넌트: ChartCard, Avatar, LoadingFallback

// 🤖 AIPS (AI 생산성 시스템)
// UI: Radix UI + Tailwind CSS
// 패턴: AI Integration, Real-time Processing
// 주요 컴포넌트: Header, DataTable, AI Components

// 📦 SCM (공급망 관리)
// UI: Radix UI + Tailwind CSS
// 패턴: Supply Chain Workflows, Logistics
// 주요 컴포넌트: DataTable, Supply Chain Components
```

---

## 🏗️ **필수 아키텍처 패턴**

### **1. MCP 시스템 실행 및 활용 (최우선)**

```bash
# 🚨 MCP 서버 실행 필수!
# 모든 코드 생성은 MCP 시스템을 우선 사용하세요

cd mcp
python server.py

# 또는 백그라운드에서 실행
cd mcp && python server.py &

# MCP 서버 상태 확인
ps aux | grep "python.*server.py"
```

#### **MCP 정보 활용 워크플로우**

```bash
# 1. 프로젝트 정보 확인
"Primes 개발 패턴 알려줘"
"ESG 특화 기능 설명해줘"

# 2. Swagger 정보 확인
"Primes production API 정보 보여줘"
"ESG API 스키마 확인해줘"

# 3. 템플릿 정보 확인
"SinglePage 템플릿 구조 설명해줘"
"MasterDetailPage 패턴 보여줘"

# 4. 프로젝트 비교
"각 프로젝트의 기술 스택 비교해줘"
"UI 프레임워크 차이점 설명해줘"
```

#### **⚠️ MCP 시스템 한계 및 주의사항**

```bash
# 🚨 현재 MCP는 정보 제공만 가능 (코드 생성 불가)
# ✅ 정보 제공: 프로젝트 패턴, Swagger 정보, 템플릿 구조
# ❌ 코드 생성: 실제 컴포넌트나 페이지 생성 불가
# ❌ 실시간 동기화: Swagger 변경사항 실시간 반영 불가

# 💡 실제 코드 생성 시 활용법
# 1. MCP로 프로젝트 패턴 파악
# 2. Swagger 정보로 API 구조 이해
# 3. 템플릿 정보로 컴포넌트 구조 설계
# 4. 수동으로 코드 작성 (AI 도구 활용)
```

### **2. Atomic Hooks 패턴 (필수)**

```typescript
// ✅ 올바른 패턴 - 단일 책임
useCreateEntity(); // 생성 전용
useUpdateEntity(); // 수정 전용
useDeleteEntity(); // 삭제 전용
useEntityListQuery(); // 목록 조회 전용
useEntityByIdQuery(); // 단일 조회 전용
useEntityFieldQuery(); // Field API 전용

// ✅ 복합 훅 (Field API 제외)
useEntity(); // CRUD 작업 통합
```

### **3. 컴포넌트 Props 패턴 (필수)**

```typescript
// 📋 공통 Props 패턴
interface CommonProps {
	className?: string; // 기본 스타일링
	[key: string]: any; // 기타 props 전달
}

// 🔄 조건부 렌더링 패턴
interface ConditionalProps {
	useFeature?: boolean; // 기능 사용 여부
	showElement?: boolean; // 요소 표시 여부
	visible?: boolean; // 가시성 제어
}

// 🎨 스타일링 클래스 객체 패턴
interface StyleClassNames {
	container?: string; // 컨테이너 클래스
	title?: string; // 제목 클래스
	content?: string; // 내용 클래스
	[elementName]?: string; // 요소별 클래스
}

// 🎯 이벤트 핸들러 패턴
interface EventHandlers {
	onClick?: () => void; // 클릭 이벤트
	onChange?: (value: any) => void; // 변경 이벤트
	onSubmit?: (data: any) => void; // 제출 이벤트
	onCancel?: () => void; // 취소 이벤트
}
```

### **4. 컴포넌트 개발 가이드라인 (필수)**

```typescript
// 🎯 Props 설계 원칙
// 1. 일관성: 모든 컴포넌트에 className prop 포함
// 2. 확장성: ...props 패턴으로 추가 속성 전달
// 3. 타입 안전성: 제네릭 타입과 인터페이스 활용
// 4. 접근성: ARIA 속성 및 키보드 네비게이션 지원

// 🔧 상태 관리 전략
// 1. 로컬 상태: 컴포넌트 내부 상태는 최소화
// 2. Props 기반: 부모로부터 데이터와 이벤트 받기
// 3. Context 활용: 전역 상태가 필요한 경우에만 사용

// ⚡ 성능 최적화
// 1. React.memo: 비용이 큰 컴포넌트에 적용
// 2. 메모이제이션: 불필요한 리렌더링 방지
// 3. Lazy Loading: 라우트 및 컴포넌트 지연 로딩
```

// ❌ 잘못된 패턴
useEntityEverything() // 모든 기능을 하나에

````

### **2. cleanedParams 패턴 (보안 필수)**
```typescript
// ✅ 모든 CREATE/UPDATE에서 필수
export const createEntity = async (data: Partial<CreateEntityPayload>) => {
  // Swagger 검증된 필드만 추출
  const { field1, field2, field3 } = data;

  const cleanedParams = { field1, field2, field3 };

  const res = await FetchApiPost('/api/entity', cleanedParams);
  if (res.status !== 'success') {
    throw new Error(res.errorMessage || 'API 호출 실패');
  }
  return res.data;
};

// ❌ 잘못된 패턴 - 전체 데이터 전송
const res = await FetchApiPost('/api/entity', data); // 보안 위험
````

### **3. 파일 명명 규칙**

```typescript
// ✅ 올바른 명명
VendorListPage.tsx; // 컴포넌트: PascalCase
useVendor.ts; // 훅: camelCase + use prefix
vendorService.ts; // 서비스: camelCase + Service suffix
vendor.ts; // 타입: camelCase
ini /
	vendor / // 디렉토리: kebab-case
	// ❌ 잘못된 명명
	vendor -
	list -
	page.tsx; // kebab-case 사용 금지
UseVendor.ts; // PascalCase 사용 금지
VendorService.ts; // 서비스에 PascalCase 사용 금지
```

---

## 🔄 **MCP 시스템 활용 (권장)**

### **MCP 명령어 우선순위**

```bash
# 🥇 최우선 (서비스 개발)
swagger Module module --domain=domain

# 🥈 높음 (UI 개발)
pp "페이지 요청"

# 🥉 중간 (검증)
sg-validate domain module "fields"
pv "코드 검증"
pfix "코드 개선"
```

### **서비스 개발 워크플로우**

```bash
1. sg-overview                    # API 도메인 확인
2. sg-suggest "요청사항"          # 모듈 추천
3. sg-analyze domain module       # 호환성 분석
4. swagger Module module          # 서비스 생성
5. sg-validate domain module      # 필드 검증
```

---

## 📚 **문서 참조 시스템**

### **프로젝트별 상세 문서**

```
📖 docs/README.md                    # 전체 문서 인덱스
🎯 docs/primes/README.md             # Primes 완전 가이드
🌱 docs/esg/README.md                # ESG 완전 가이드
🤖 docs/aips/README.md               # AIPS 완전 가이드
📦 docs/scm/README.md                # SCM 완전 가이드
🛠️ docs/mcp/README.md                # MCP 시스템 가이드
📦 docs/common/packages-guide.md     # 패키지 사용 가이드
```

### **문서 우선 확인 규칙**

```
1. 프로젝트 확인 후 해당 프로젝트 문서 먼저 읽기
2. 공통 패키지 사용 시 packages-guide.md 참조
3. MCP 사용 시 docs/mcp/ 디렉토리 참조
4. 불확실한 경우 docs/README.md에서 시작
```

---

## 🎯 **프로젝트별 특화 패턴**

### **🎯 Primes (MES)**

```typescript
// 주요 패턴
- Modal CRUD: DraggableDialog 사용
- Master-Detail: TabNavigation 구조
- Field API: CustomSelect 컴포넌트
- 도메인: ini, sales, purchase, production, machine, mold

// 예시 코드
import { DataTable, DraggableDialog } from '@repo/radix-ui/components';
import { useVendor } from '@primes/hooks/ini/vendor';

const VendorListPage = () => {
  const { list, create, update, remove } = useVendor({ page, size });

  return (
    <div>
      <DataTable data={list.data} />
      <DraggableDialog title="거래처 등록" />
    </div>
  );
};
```

### **🌱 ESG (지속가능성)**

```typescript
// 주요 패턴
- Dashboard: KPI Cards + Chart Widgets
- Form Wizard: 다단계 데이터 입력
- ESG 프레임워크: GRI, SASB, TCFD, CDP 준수

// 예시 코드
import { MainLayout } from '@repo/falcon-ui/layouts';
import { ChartCardComponents } from '@repo/falcon-ui/components/cards';

const ESGDashboard = () => {
  return (
    <MainLayout>
      <ChartCardComponents
        title="탄소 배출량"
        data={carbonData}
        unit="tCO2e"
      />
    </MainLayout>
  );
};
```

### **🤖 AIPS (AI 생산및 계획 최적화)**

```typescript
// 주요 패턴
- AI Integration: 실시간 AI 분석
- Real-time Processing: WebSocket 통신
- Radix UI 기반: Primes와 동일한 UI 패턴

// 예시 코드 (Primes 패턴 준용)
import { DataTable, Kanban } from '@repo/radix-ui/components';
```

### **📦 SCM (공급망 관리)**

```typescript
// 주요 패턴
- Supply Chain Workflows: 공급망 프로세스
- Logistics: 물류 관리
- Radix UI 기반: Primes와 동일한 UI 패턴

// 예시 코드 (Primes 패턴 준용)
import { DataTable, FlowChart } from '@repo/radix-ui/components';
```

---

## 🔒 **보안 및 품질 규칙**

### **필수 보안 패턴**

```typescript
// ✅ 입력 검증
const schema = z.object({
	name: z.string().min(1, '이름은 필수입니다'),
	email: z.string().email('올바른 이메일 형식이 아닙니다'),
});

// ✅ 에러 처리
try {
	const result = await apiCall();
	if (result.status !== 'success') {
		throw new Error(result.errorMessage);
	}
} catch (error) {
	console.error('API 호출 실패:', error);
	// 사용자 친화적 에러 메시지 표시
}

// ✅ 타입 안전성
interface ApiResponse<T> {
	status: 'success' | 'error';
	data?: T;
	errorMessage?: string;
}
```

### **성능 최적화**

```typescript
// ✅ React Query 캐싱
const { data, isLoading } = useQuery({
  queryKey: ['entity', id],
  queryFn: () => getEntity(id),
  staleTime: 1000 * 60 * 5, // 5분 캐시
});

// ✅ 지연 로딩
const LazyComponent = lazy(() => import('./HeavyComponent'));

// ✅ 메모이제이션
const MemoizedComponent = memo(({ data }) => {
  return <ExpensiveComponent data={data} />;
});
```

---

## 🌍 **국제화 및 접근성**

### **다국어 지원**

```typescript
// ✅ 번역 키 사용
import { useTranslation } from '@repo/i18n';

const Component = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('tabs.titles.vendor')}</h1>
      <button>{t('tabs.actions.register')}</button>
    </div>
  );
};

// ❌ 하드코딩 금지
const title = '거래처'; // 금지
const action = '등록';  // 금지
```

### **접근성 (WCAG 2.1 AA)**

```typescript
// ✅ 접근성 속성
<button
  aria-label="거래처 삭제"
  onClick={handleDelete}
>
  <TrashIcon />
</button>

// ✅ 키보드 네비게이션
<div
  tabIndex={0}
  onKeyDown={handleKeyDown}
  role="button"
>
  클릭 가능한 영역
</div>
```

---

## 📊 **공통 패키지 사용법**

### **주요 패키지 Quick Reference**

```typescript
// UI 컴포넌트
import { DataTable } from '@repo/radix-ui/components'; // Primes용
import { MainLayout } from '@repo/falcon-ui/layouts'; // ESG용
import {} from /* components */ '@repo/moornmo-ui/components'; // Material-UI

// 차트
import { EchartComponent } from '@repo/echart/components'; // 모든 프로젝트
import { GanttChart } from '@repo/gantt-charts/components'; // 프로젝트 관리
import { FlowChart } from '@repo/react-flow/components'; // 프로세스 다이어그램

// 유틸리티
import { formatDate, formatCurrency } from '@repo/utils'; // 공통 유틸
import { useTranslation } from '@repo/i18n'; // 다국어
import { EditorJS } from '@repo/editor-js'; // 리치 에디터
```

### **패키지 선택 가이드**

```
데이터 테이블 필요 → @repo/radix-ui/components (Primes계열)
                  → @repo/falcon-ui (ESG)

차트 필요 → @repo/echart (고성능, 모든 프로젝트)
         → @repo/moornmo-ui (Material 스타일)

레이아웃 필요 → @repo/radix-ui/layouts (Primes계열)
            → @repo/falcon-ui/layouts (ESG)

에디터 필요 → @repo/editor-js (리치 텍스트)
           → @repo/flora-editor (간단한 에디터)
```

### **📦 패키지 설치 방법**

#### **프로젝트별 필수 패키지 설치**

```bash
# Primes/AIPS/SCM 프로젝트
cd apps/your-project
pnpm add @repo/radix-ui@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# ESG 프로젝트
cd apps/esg
pnpm add @repo/falcon-ui@workspace:*
pnpm add @repo/echart@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# 선택적 패키지
pnpm add @repo/gantt-charts@workspace:*  # 간트 차트
pnpm add @repo/react-flow@workspace:*    # 플로우 차트
pnpm add @repo/editor-js@workspace:*     # 에디터
```

#### **⚠️ 중요: Workspace 패키지 사용**

```bash
# ✅ 올바른 방법
pnpm add @repo/radix-ui@workspace:*

# ❌ 잘못된 방법
pnpm add @repo/radix-ui@1.0.0  # workspace 연결 끊어짐
```

---

## ⚠️ **중요한 금지사항**

### **🚫 절대 하지 말 것**

```typescript
// ❌ 전체 데이터 객체를 API에 전송
await FetchApiPost('/api/entity', formData); // 보안 위험

// ❌ 하드코딩된 문자열
const title = '거래처 관리'; // 다국어 지원 불가

// ❌ 거대한 단일 훅
const useEverything = () => {
	/* 모든 기능 */
}; // 유지보수 불가

// ❌ 잘못된 import
import * as Everything from '@repo/radix-ui'; // 번들 크기 증가

// ❌ 타입 무시
const data: any = apiResponse; // 타입 안전성 상실
```

### **✅ 반드시 할 것**

```typescript
// ✅ cleanedParams 패턴
const { name, email } = formData;
const cleanedParams = { name, email };

// ✅ 번역 키 사용
const title = t('pages.titles.vendorManagement');

// ✅ Atomic Hooks
const create = useCreateVendor();
const list = useVendorListQuery(params);

// ✅ 명시적 import
import { DataTable, Dialog } from '@repo/radix-ui/components';

// ✅ 타입 안전성
const data: VendorData = apiResponse.data;
```

---

## 🎯 **AI 도구별 활용 팁**

### **Cursor AI**

- `.cursorrules` 파일 자동 참조
- MCP 시스템과 완전 통합
- 실시간 코드 생성 및 검증

### **MCP 서버 실행 (모든 AI 도구에서 필수!)**

```bash
# MCP 서버가 실행되어야 AI 기반 코드 생성이 가능합니다
cd mcp
python server.py

# 또는 백그라운드에서 실행
cd mcp && python server.py &

# MCP 서버 상태 확인
ps aux | grep "python.*server.py"
```

### **GitHub Copilot**

- 이 AI_RULES 파일을 채팅에 첨부
- 코드 주석에 패턴 명시
- 프로젝트 컨텍스트 제공

### **Claude/GPT (웹)**

- 이 AI_RULES 파일 전체 복사 후 대화 시작
- 프로젝트별 문서 링크 활용
- 구체적인 요구사항과 함께 질문

### **VSCode AI 확장들**

- 워크스페이스 설정에 이 파일 경로 추가
- 프로젝트 루트에서 AI 도구 실행
- 패키지 구조 이해를 위해 docs/ 디렉토리 참조

---

## 🚀 **빠른 시작 체크리스트**

### **새 기능 개발 시**

```
□ 1. MCP 서버 실행 확인 (AI 코드 생성 필수!)
□ 2. 프로젝트 확인 (Primes/ESG/AIPS/SCM)
□ 3. 해당 프로젝트 문서 읽기 (docs/{project}/README.md)
□ 4. 필요한 패키지 확인 (docs/common/packages-guide.md)
□ 5. MCP 활용 (sg-overview → swagger → pp)
□ 6. Atomic Hooks 패턴 적용
□ 7. cleanedParams 패턴 적용
□ 8. 번역 키 사용
□ 9. 타입 안전성 확보
□ 10. 접근성 고려
□ 11. 성능 최적화
```

### **코드 리뷰 시**

```
□ 프로젝트별 패턴 준수 확인
□ 보안 패턴 (cleanedParams) 적용 확인
□ 타입 안전성 확인
□ 번역 키 사용 확인
□ 접근성 속성 확인
□ 성능 최적화 확인
□ 패키지 올바른 사용 확인
```

---

## 📞 **지원 및 문서**

### **문서 위치**

- **전체 가이드**: `docs/README.md`
- **프로젝트별**: `docs/{project}/README.md`
- **패키지 가이드**: `docs/common/packages-guide.md`
- **MCP 시스템**: `docs/mcp/README.md`

### **개발 지원**

- **MCP 시스템**: 자동 코드 생성 및 검증
- **Swagger 동기화**: API 스키마 실시간 동기화
- **템플릿 시스템**: 프로젝트별 최적화된 코드 생성

---

**🎯 최종 목표: 개발자가 아닌 사람도 AI와 함께 고품질 소프트웨어를 개발할 수 있는 환경**

**📝 Last Updated**: 2025-01-08  
**🤖 Compatible with**: Cursor, GitHub Copilot, Claude, GPT, Codeium, 기타 모든 AI 도구  
**👥 Team**: AI Development Platform Team
