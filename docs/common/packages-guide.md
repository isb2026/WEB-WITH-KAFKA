# 📦 Packages 사용 가이드

## 📋 **개요**

MSA React Monorepo의 `packages/` 디렉토리는 모든 프로젝트에서 공유하는 UI 컴포넌트, 유틸리티, 도구들을 포함합니다. 각 패키지는 특정 목적과 프로젝트에 최적화되어 있습니다.

---

## 🚀 **패키지 설치 및 설정**

### **📦 Monorepo 환경에서의 패키지 사용**

**⚠️ 중요: 이 프로젝트는 pnpm workspace를 사용하므로, 패키지들이 이미 연결되어 있습니다.**

#### **새 프로젝트에서 패키지 추가**

```bash
# 프로젝트 디렉토리로 이동
cd apps/your-project

# Workspace 패키지 추가
pnpm add @repo/radix-ui@workspace:*
pnpm add @repo/falcon-ui@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# 또는 한번에 여러 패키지 추가
pnpm add @repo/radix-ui@workspace:* @repo/echart@workspace:* @repo/utils@workspace:*
```

#### **package.json 설정 예시**

```json
{
	"name": "your-project",
	"dependencies": {
		"@repo/radix-ui": "workspace:*",
		"@repo/falcon-ui": "workspace:*",
		"@repo/echart": "workspace:*",
		"@repo/utils": "workspace:*",
		"@repo/i18n": "workspace:*"
	}
}
```

### **🎯 프로젝트별 권장 패키지 설치**

#### **Primes 프로젝트 설정**

```bash
cd apps/primes

# 필수 패키지
pnpm add @repo/radix-ui@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# 선택적 패키지
pnpm add @repo/echart@workspace:*        # 차트 필요시
pnpm add @repo/gantt-charts@workspace:*  # 간트 차트 필요시
pnpm add @repo/editor-js@workspace:*     # 에디터 필요시
```

#### **ESG 프로젝트 설정**

```bash
cd apps/esg

# 필수 패키지
pnpm add @repo/falcon-ui@workspace:*
pnpm add @repo/echart@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# 선택적 패키지
pnpm add @repo/moornmo-ui@workspace:*    # Material-UI 컴포넌트 필요시
pnpm add @repo/react-flow@workspace:*    # 플로우 차트 필요시
```

#### **AIPS/SCM 프로젝트 설정**

```bash
cd apps/aips  # 또는 apps/scm

# 필수 패키지 (Primes와 동일)
pnpm add @repo/radix-ui@workspace:*
pnpm add @repo/utils@workspace:*
pnpm add @repo/i18n@workspace:*

# AI/SCM 특화 패키지
pnpm add @repo/react-flow@workspace:*    # 프로세스 플로우
pnpm add @repo/gantt-charts@workspace:*  # 프로젝트 관리
```

### **⚙️ 개발 환경 설정**

#### **TypeScript 설정**

```bash
# TypeScript 설정 패키지 추가
pnpm add -D @repo/typescript-config@workspace:*

# tsconfig.json 설정
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### **ESLint 설정**

```bash
# ESLint 설정 패키지 추가
pnpm add -D @repo/eslint-config@workspace:*

# .eslintrc.js 설정
module.exports = {
  extends: ['@repo/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // 프로젝트별 추가 규칙
  }
};
```

#### **Vite 설정 (Radix UI 프로젝트)**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		include: ['@repo/radix-ui', '@repo/utils', '@repo/i18n'],
	},
});
```

#### **Tailwind CSS 설정 (Radix UI 프로젝트)**

```javascript
// tailwind.config.js
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@repo/radix-ui/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// Radix UI 색상 시스템
				'Colors-Brand-700': '#1f2937',
				'Colors-Brand-800': '#111827',
				'Colors-Gray-50': '#f9fafb',
				// 추가 커스텀 색상
			},
		},
	},
	plugins: [],
};
```

#### **Bootstrap 설정 (ESG 프로젝트)**

```typescript
// main.tsx 또는 App.tsx
import '@repo/falcon-ui/scss/theme';
import '@repo/falcon-ui/css/theme';

// 또는 CSS 파일에서
// @import '@repo/falcon-ui/scss/theme';
```

### **🔧 패키지별 상세 설정**

#### **@repo/radix-ui 설정**

```typescript
// App.tsx
import { Theme } from '@repo/radix-ui/components';
import '@repo/radix-ui/components'; // 스타일 자동 import

function App() {
  return (
    <Theme>
      {/* 앱 컨텐츠 */}
    </Theme>
  );
}
```

#### **@repo/falcon-ui 설정**

```typescript
// App.tsx
import { AppProvider } from '@repo/falcon-ui/providers';
import { MainLayout } from '@repo/falcon-ui/layouts';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        {/* 앱 컨텐츠 */}
      </MainLayout>
    </AppProvider>
  );
}
```

#### **@repo/i18n 설정**

```typescript
// i18n 설정
import { initI18n } from '@repo/i18n';

// 프로젝트별 번역 파일 경로 설정
initI18n({
	lng: 'ko',
	fallbackLng: 'en',
	resources: {
		ko: {
			common: require('./locales/ko/common.json'),
			// 추가 네임스페이스
		},
		en: {
			common: require('./locales/en/common.json'),
			// 추가 네임스페이스
		},
	},
});
```

#### **@repo/echart 설정**

```typescript
// 차트 컴포넌트 사용
import { EchartComponent } from '@repo/echart/components';

const Dashboard = () => {
  const chartOption = {
    title: { text: '매출 현황' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1월', '2월', '3월', '4월', '5월', '6월']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 70, 110],
      type: 'line',
      smooth: true
    }]
  };

  return (
    <EchartComponent
      option={chartOption}
      style={{ height: '400px', width: '100%' }}
      theme="light" // 또는 "dark"
    />
  );
};
```

### **🚨 설치 시 주의사항**

#### **Workspace 패키지 버전 관리**

```bash
# ✅ 올바른 방법 - workspace 버전 사용
pnpm add @repo/radix-ui@workspace:*

# ❌ 잘못된 방법 - 특정 버전 지정
pnpm add @repo/radix-ui@1.0.0  # workspace 연결 끊어짐
```

#### **Peer Dependencies 확인**

```bash
# 패키지 설치 후 peer dependencies 확인
pnpm install

# 누락된 peer dependencies가 있다면 설치
pnpm add react@^18.0.0 react-dom@^18.0.0
```

#### **캐시 문제 해결**

```bash
# 패키지 변경 후 캐시 문제가 있다면
pnpm store prune
pnpm install

# 또는 node_modules 재설치
rm -rf node_modules
pnpm install
```

### **📋 설치 체크리스트**

#### **새 프로젝트 설정 시**

```
□ 1. 프로젝트 타입 확인 (Primes/ESG/AIPS/SCM)
□ 2. 필수 패키지 설치 (UI 프레임워크, utils, i18n)
□ 3. TypeScript 설정 (@repo/typescript-config)
□ 4. ESLint 설정 (@repo/eslint-config)
□ 5. 빌드 도구 설정 (Vite/Webpack)
□ 6. 스타일링 설정 (Tailwind/Bootstrap)
□ 7. 프로바이더 설정 (Theme/App Provider)
□ 8. i18n 초기화
□ 9. 개발 서버 실행 테스트
□ 10. 빌드 테스트
```

#### **패키지 업데이트 시**

```
□ 1. workspace 패키지 버전 확인
□ 2. peer dependencies 확인
□ 3. 타입 정의 업데이트 확인
□ 4. Breaking changes 확인
□ 5. 테스트 실행
□ 6. 빌드 확인
```

---

## 🎨 **UI 컴포넌트 패키지**

### **🎯 @repo/radix-ui** (Primes, AIPS, SCM 전용)

**최신 Radix UI 기반 컴포넌트 라이브러리**

#### **주요 컴포넌트**

```typescript
// 기본 컴포넌트
import { Button, Text, Flex, Theme } from '@repo/radix-ui/components';
import { Dialog, Checkbox, Tabs } from '@repo/radix-ui/components';

// 데이터 테이블
import { DataTable } from '@repo/radix-ui/components/data-table';

// 고급 컴포넌트
import {
	DraggableDialog,
	ItemSearchModal,
	AutoComplate,
	SegmentedControl,
} from '@repo/radix-ui/components';

// Kanban 보드
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanItem,
} from '@repo/radix-ui/components';

// 편집 가능한 컴포넌트
import {
	Editable,
	EditableInput,
	EditablePreview,
} from '@repo/radix-ui/components';
```

#### **사용 예시**

```typescript
// Primes 프로젝트에서 사용
import { DataTable, DraggableDialog } from '@repo/radix-ui/components';

const VendorListPage = () => {
  return (
    <div>
      <DataTable
        data={vendors}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <DraggableDialog
        title="거래처 등록"
        content={<VendorForm />}
      />
    </div>
  );
};
```

#### **특징**

- ✅ **Tailwind CSS** 완전 호환
- ✅ **접근성** WCAG 2.1 AA 준수
- ✅ **타입 안전성** 완전한 TypeScript 지원
- ✅ **테마 시스템** 다크모드 지원
- ✅ **드래그 앤 드롭** @dnd-kit 통합

---

### **🌱 @repo/falcon-ui** (ESG 전용)

**Bootstrap 기반 ESG 특화 컴포넌트**

#### **주요 컴포넌트**

```typescript
// 레이아웃
import { MainLayout, AuthSimpleLayout } from '@repo/falcon-ui/layouts';

// 네비게이션
import { TopNavbar } from '@repo/falcon-ui/components/navbar/top';
import { VerticalNavbar } from '@repo/falcon-ui/components/navbar/vertical';

// 공통 컴포넌트
import {
	Avatar,
	Background,
	FalconCardHeader,
	Flex,
	Section,
	SolutionSelect,
	SubtleBadge,
} from '@repo/falcon-ui/components/common';

// 카드 컴포넌트
import { ChartCardComponents } from '@repo/falcon-ui/components/cards';

// 프로바이더
import { AppProvider, AwesomeIconProvider } from '@repo/falcon-ui/providers';

// 훅
import { useToggleStyle } from '@repo/falcon-ui/hooks';
```

#### **사용 예시**

```typescript
// ESG 프로젝트에서 사용
import { MainLayout } from '@repo/falcon-ui/layouts';
import { ChartCardComponents } from '@repo/falcon-ui/components/cards';

const ESGDashboard = () => {
  return (
    <MainLayout>
      <ChartCardComponents
        title="탄소 배출량"
        data={carbonData}
        chartType="line"
      />
    </MainLayout>
  );
};
```

#### **특징**

- ✅ **Bootstrap 5** 기반 스타일링
- ✅ **FontAwesome** 아이콘 통합
- ✅ **ESG 테마** 지속가능성 중심 디자인
- ✅ **반응형** 모바일 최적화
- ✅ **다국어** i18n 지원

---

### **🎨 @repo/moornmo-ui** (Material-UI 기반)

**Material Design 컴포넌트 라이브러리**

#### **주요 컴포넌트**

```typescript
// 컴포넌트 (Atomic Design Pattern)
import {} from /* atoms */ '@repo/moornmo-ui/components';
import {} from /* molecules */ '@repo/moornmo-ui/components';
import {} from /* organisms */ '@repo/moornmo-ui/components';
import {} from /* templates */ '@repo/moornmo-ui/components';

// 프로바이더
import {} from /* providers */ '@repo/moornmo-ui/providers';

// 훅
import {} from /* hooks */ '@repo/moornmo-ui/hooks';

// 타입
import {} from /* types */ '@repo/moornmo-ui/types';

// 유틸리티
import {} from /* utils */ '@repo/moornmo-ui/utils';
```

#### **특징**

- ✅ **Material-UI** 기반
- ✅ **Atomic Design** 패턴
- ✅ **Chart.js & Recharts** 차트 통합
- ✅ **MUI DataGrid** 고급 테이블

---

## 📊 **차트 및 시각화 패키지**

### **📈 @repo/echart**

**Apache ECharts 기반 차트 컴포넌트**

#### **사용법**

```typescript
import { EchartComponent } from '@repo/echart/components';

const Dashboard = () => {
  const chartOption = {
    title: { text: '매출 현황' },
    xAxis: { type: 'category', data: ['1월', '2월', '3월'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150], type: 'line' }]
  };

  return (
    <EchartComponent
      option={chartOption}
      style={{ height: '400px' }}
    />
  );
};
```

#### **특징**

- ✅ **고성능** 대용량 데이터 처리
- ✅ **다양한 차트** Line, Bar, Pie, Scatter 등
- ✅ **인터랙티브** 줌, 브러시, 툴팁
- ✅ **반응형** 자동 리사이징

### **📊 @repo/gantt-charts**

**간트 차트 전용 컴포넌트**

#### **사용법**

```typescript
import { GanttChart } from '@repo/gantt-charts/components';

const ProjectTimeline = () => {
  return (
    <GanttChart
      tasks={projectTasks}
      startDate={startDate}
      endDate={endDate}
      onTaskUpdate={handleTaskUpdate}
    />
  );
};
```

### **🔄 @repo/react-flow**

**플로우 차트 및 다이어그램**

#### **사용법**

```typescript
import { FlowChart } from '@repo/react-flow/components';

const ProcessFlow = () => {
  return (
    <FlowChart
      nodes={processNodes}
      edges={processEdges}
      onNodeClick={handleNodeClick}
    />
  );
};
```

---

## 🛠️ **유틸리티 및 도구 패키지**

### **🔧 @repo/utils**

**공통 유틸리티 함수**

#### **사용법**

```typescript
import {} from /* utility functions */ '@repo/utils';

// 단위 변환
import { convertUnit } from '@repo/utils';
const result = convertUnit(100, 'kg', 'g'); // 100000

// 기타 유틸리티
import { formatDate, formatCurrency } from '@repo/utils';
```

### **🌍 @repo/i18n**

**국제화 지원**

#### **사용법**

```typescript
import { useTranslation } from '@repo/i18n';

const Component = () => {
  const { t } = useTranslation('common');

  return <h1>{t('welcome')}</h1>;
};
```

### **📝 @repo/editor-js**

**리치 텍스트 에디터**

#### **사용법**

```typescript
import { EditorJS } from '@repo/editor-js';

const DocumentEditor = () => {
  return (
    <EditorJS
      data={editorData}
      onChange={handleChange}
      tools={editorTools}
    />
  );
};
```

### **🎨 @repo/swiper**

**슬라이더 컴포넌트**

#### **사용법**

```typescript
import { SwiperComponent } from '@repo/swiper/components';

const ImageGallery = () => {
  return (
    <SwiperComponent
      slides={images}
      autoplay={true}
      navigation={true}
    />
  );
};
```

---

## 🔧 **개발 도구 패키지**

### **📋 @repo/typescript-config**

**공통 TypeScript 설정**

#### **사용법**

```json
// tsconfig.json
{
	"extends": "@repo/typescript-config/base.json",
	"compilerOptions": {
		// 프로젝트별 추가 설정
	}
}
```

### **🎨 @repo/eslint-config**

**공통 ESLint 설정**

#### **사용법**

```javascript
// .eslintrc.js
module.exports = {
	extends: ['@repo/eslint-config'],
	rules: {
		// 프로젝트별 추가 규칙
	},
};
```

---

## 🎯 **프로젝트별 패키지 사용 가이드**

### **🎯 Primes 프로젝트**

```typescript
// 권장 패키지 조합
import { DataTable, DraggableDialog } from '@repo/radix-ui/components';
import { EchartComponent } from '@repo/echart/components';
import { useTranslation } from '@repo/i18n';
import { formatCurrency } from '@repo/utils';

// 사용 예시
const PrimesPage = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <DataTable data={data} />
      <EchartComponent option={chartOption} />
    </div>
  );
};
```

### **🌱 ESG 프로젝트**

```typescript
// 권장 패키지 조합
import { MainLayout } from '@repo/falcon-ui/layouts';
import { ChartCardComponents } from '@repo/falcon-ui/components/cards';
import { EchartComponent } from '@repo/echart/components';
import { useTranslation } from '@repo/i18n';

// 사용 예시
const ESGPage = () => {
  return (
    <MainLayout>
      <ChartCardComponents title="ESG 지표" />
      <EchartComponent option={esgChartOption} />
    </MainLayout>
  );
};
```

### **🤖 AIPS & 📦 SCM 프로젝트**

```typescript
// Radix UI 기반 (Primes와 동일)
import { DataTable, Kanban } from '@repo/radix-ui/components';
import { FlowChart } from '@repo/react-flow/components';
import { GanttChart } from '@repo/gantt-charts/components';
```

---

## 🚀 **패키지 개발 가이드**

### **새 패키지 생성**

```bash
# 1. 패키지 디렉토리 생성
mkdir packages/new-package
cd packages/new-package

# 2. package.json 생성
npm init -y

# 3. TypeScript 설정
cp ../typescript-config/base.json ./tsconfig.json

# 4. 소스 디렉토리 생성
mkdir src
```

### **패키지 구조 표준**

```
packages/new-package/
├── src/
│   ├── components/          # 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── utils/              # 유틸리티
│   ├── types/              # 타입 정의
│   └── index.ts            # 메인 export
├── package.json
├── tsconfig.json
└── README.md
```

### **Export 패턴**

```json
// package.json
{
	"name": "@repo/new-package",
	"exports": {
		".": "./src/index.ts",
		"./components": "./src/components/index.ts",
		"./hooks": "./src/hooks/index.ts",
		"./utils": "./src/utils/index.ts"
	}
}
```

---

## 🔗 **패키지 의존성 관리**

### **Workspace 의존성**

```json
// 다른 workspace 패키지 사용
{
	"dependencies": {
		"@repo/utils": "workspace:^",
		"@repo/i18n": "workspace:^"
	}
}
```

### **외부 의존성**

```json
// 외부 라이브러리 사용
{
	"dependencies": {
		"react": "^18.0.0",
		"@radix-ui/react-dialog": "^1.1.4"
	},
	"peerDependencies": {
		"react": "^18.0.0",
		"react-dom": "^18.0.0"
	}
}
```

---

## 📊 **패키지 현황 요약**

| 패키지                 | 버전  | 용도                 | 주요 프로젝트     |
| ---------------------- | ----- | -------------------- | ----------------- |
| **@repo/radix-ui**     | 1.0.0 | 현대적 UI 컴포넌트   | Primes, AIPS, SCM |
| **@repo/falcon-ui**    | 1.3.0 | Bootstrap 기반 UI    | ESG               |
| **@repo/moornmo-ui**   | 0.2.0 | Material-UI 컴포넌트 | 공통              |
| **@repo/echart**       | 1.1.0 | 차트 컴포넌트        | 모든 프로젝트     |
| **@repo/utils**        | 1.2.0 | 공통 유틸리티        | 모든 프로젝트     |
| **@repo/i18n**         | -     | 국제화 지원          | 모든 프로젝트     |
| **@repo/gantt-charts** | -     | 간트 차트            | 프로젝트 관리     |
| **@repo/react-flow**   | -     | 플로우 차트          | 프로세스 시각화   |
| **@repo/editor-js**    | -     | 리치 에디터          | 문서 작성         |
| **@repo/swiper**       | -     | 슬라이더             | 이미지 갤러리     |

---

## 🔗 **관련 문서**

- **[메인 문서](../README.md)**: 전체 프로젝트 문서
- **[공통 컴포넌트](./README.md)**: 공통 리소스 가이드
- **[Primes 가이드](../primes/README.md)**: Primes 프로젝트 문서
- **[ESG 가이드](../esg/README.md)**: ESG 프로젝트 문서

---

**📝 Last Updated**: 2025-01-08  
**📦 Package Count**: 15개  
**👥 Team**: Platform Team
