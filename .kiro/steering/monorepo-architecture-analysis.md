# MSA React Monorepo 구조 및 프론트엔드 패턴 분석

## 프로젝트 개요

### 기본 정보
- **프로젝트명**: msa-monorepo
- **패키지 매니저**: pnpm@8.15.6
- **빌드 시스템**: Turborepo
- **Node.js 버전**: 20.20.4 (apps/primes/.nvmrc)

### 모노레포 구조
```
msa-monorepo/
├── apps/                    # 애플리케이션들
│   ├── demo/               # 컴포넌트 쇼케이스 앱
│   ├── esg/                # ESG 보고 시스템
│   ├── lts5/               # 레거시 시스템 (교체 예정)
│   └── primes/             # 메인 애플리케이션 (최우선 개발)
├── packages/               # 공유 패키지들
│   ├── radix-ui/           # Radix 기반 UI 컴포넌트 (최우선)
│   ├── falcon-ui/          # Bootstrap 기반 UI 컴포넌트
│   ├── moornmo-ui/         # Material-UI 기반 컴포넌트
│   ├── echart/             # 차트 컴포넌트
│   ├── i18n/               # 다국어 지원
│   └── utils/              # 공통 유틸리티
└── scripts/                # 빌드 및 릴리스 스크립트
```

## Primes 앱 구조 (메인 애플리케이션)

### 기술 스택
- **프론트엔드**: React 18.3.1 + TypeScript 5.8.3
- **빌드 도구**: Vite 6.2.0
- **스타일링**: Tailwind CSS 3.4.3 + Radix UI
- **상태 관리**: React Query (@tanstack/react-query)
- **라우팅**: React Router DOM 7.5.0
- **아이콘**: Lucide React 0.511.0

### 디렉토리 구조
```
apps/primes/src/
├── components/             # 재사용 가능한 컴포넌트
│   ├── common/            # 공통 컴포넌트
│   ├── datatable/         # 데이터테이블 컴포넌트
│   ├── form/              # 폼 컴포넌트
│   └── charts/            # 차트 컴포넌트
├── pages/                 # 페이지 컴포넌트
│   ├── ini/               # 기초정보 페이지들
│   ├── sales/             # 영업 페이지들
│   ├── purchase/          # 구매 페이지들
│   ├── production/        # 생산 페이지들
│   └── machine/           # 설비 페이지들
├── tabs/                  # Tab Navigation 컴포넌트들
│   ├── ini/               # 기초정보 탭들
│   ├── sales/             # 영업 탭들
│   ├── purchase/          # 구매 탭들
│   ├── production/        # 생산 탭들
│   └── machine/           # 설비 탭들
├── hooks/                 # 커스텀 React 훅들
│   ├── ini/               # 기초정보 훅들
│   ├── sales/             # 영업 훅들
│   └── [solution]/        # 솔루션별 훅들
├── services/              # API 서비스 레이어
│   ├── ini/               # 기초정보 서비스들
│   ├── sales/             # 영업 서비스들
│   └── [solution]/        # 솔루션별 서비스들
├── routes/                # 라우팅 설정
├── layouts/               # 레이아웃 컴포넌트
├── templates/             # 페이지 템플릿들
├── types/                 # TypeScript 타입 정의
└── utils/                 # 유틸리티 함수들
```

### 스크립트 생성 시스템
```
apps/primes/script/
├── template_generater/    # 템플릿 생성기들
│   ├── tabNavigationGenerater.js      # Tab Navigation 생성기
│   ├── singlePageGenerater.js         # 단일 페이지 생성기
│   ├── masterDetailPageGenerater.js   # Master-Detail 페이지 생성기
│   └── registerPageGenerater.js       # 등록 페이지 생성기
├── utils/                 # 유틸리티 함수들
├── configs/               # 설정 파일들
└── [생성 스크립트들].js   # 실행 스크립트들
```

## 프론트엔드 아키텍처 패턴

### 1. 컴포넌트 라이브러리 우선순위
1. **Radix UI** (최우선) - 접근성과 커스터마이징 중심
2. **Moornmo UI** - Material-UI 기반
3. **Falcon UI** - Bootstrap 기반 (레거시)
4. **커스텀 컴포넌트** (최후 수단)

### 2. 페이지 패턴

#### A. Tab Navigation 패턴
```typescript
// 기본 구조
interface TabItem {
    id: string;
    label: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    to?: string;  // 라우팅 경로
}

// 사용 예시
const tabs: TabItem[] = [
    {
        id: 'list',
        icon: <TableProperties size={16} />,
        label: '현황',
        to: '/ini/vendor/list',
        content: <VendorListPage />,
    }
];
```

#### B. 페이지 타입별 패턴

**1) Single Page (단일 페이지)**
- 기본 CRUD 기능
- Modal 기반 등록/수정
- DataTable + SearchSlot 조합

**2) Master-Detail Page**
- 좌측: Master 목록
- 우측: Detail 정보 + 관련 데이터
- Navigation 기반 등록/수정

**3) Register Page**
- 폼 기반 데이터 입력
- React Hook Form 사용
- 유효성 검증 포함

### 3. 데이터 플로우 패턴

#### API 레이어 구조
```typescript
// Service Layer (API 호출)
export const getVendorList = async (params) => {
    const res = await FetchApiGet('/ini/vendor', params);
    return res.data;
};

// Hook Layer (React Query 래핑)
export const useVendor = (params) => {
    const list = useQuery({
        queryKey: ['vendor', params],
        queryFn: () => getVendorList(params),
    });
    return { list };
};

// Component Layer (UI 렌더링)
const VendorListPage = () => {
    const { list } = useVendor({ page: 0, size: 30 });
    return <DataTable data={list.data} />;
};
```

### 4. 스타일링 패턴

#### Tailwind CSS 사용
- 커스텀 컬러 시스템 (Colors-Brand-*, Colors-Gray-* 등)
- 반응형 디자인 (sm:, md:, lg:, xl:)
- 다크모드 지원 (dark: prefix)

#### 컴포넌트 스타일링
```typescript
// Radix UI + Tailwind 조합
<RadixButton className="bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white px-4 py-2 rounded-lg">
    등록
</RadixButton>
```

### 5. 라우팅 패턴

#### 솔루션별 라우팅
```typescript
// 기본 구조: /[solution]/[entity]/[action]
/ini/vendor/list        // 기초정보 > 거래처 > 목록
/sales/order/register   // 영업 > 주문 > 등록
/production/plan/edit   // 생산 > 계획 > 수정
```

#### Tab Navigation 라우팅
- Tab 클릭 시 해당 경로로 이동
- URL 변경 시 자동으로 해당 탭 활성화

### 6. 상태 관리 패턴

#### React Query 중심
- 서버 상태: React Query
- 로컬 상태: useState, useReducer
- 전역 상태: Context API (최소한 사용)

#### 캐싱 전략
```typescript
const list = useQuery({
    queryKey: ['vendor', params],
    queryFn: () => getVendorList(params),
    staleTime: 1000 * 60 * 3, // 3분
    placeholderData: keepPreviousData,
});
```

## 코드 생성 패턴

### 1. 자동 생성 가능한 컴포넌트들
- Tab Navigation 컴포넌트
- CRUD 페이지 (List, Register, MasterDetail)
- API Service 함수들
- React Query Hook들
- TypeScript 타입 정의

### 2. 생성기 템플릿 구조
```javascript
// 기본 생성기 패턴
export const ComponentGenerator = (
    componentName,
    options,
    customConfig
) => {
    // 1. 파라미터 파싱 및 검증
    // 2. 템플릿 문자열 생성
    // 3. 동적 내용 삽입
    // 4. 최종 코드 반환
    return generatedCode;
};
```

### 3. 파일 명명 규칙
- **컴포넌트**: PascalCase (VendorTabNavigation.tsx)
- **훅**: camelCase (useVendor.ts)
- **서비스**: camelCase (vendorService.ts)
- **타입**: PascalCase (VendorData.ts)
- **폴더**: kebab-case (ini/, sales/)

## 빌드 및 배포

### 개발 명령어
```bash
# 전체 개발 서버 실행
pnpm dev

# Primes 앱만 실행
pnpm dev --filter @repo/primes

# 빌드
pnpm build --filter @repo/primes

# 코드 생성
cd apps/primes
npm run page    # 페이지 생성
npm run tab     # 탭 생성
npm run generate # 설정 기반 생성
```

### 패키지 의존성
```json
{
  "dependencies": {
    "@repo/radix-ui": "workspace:^",
    "@repo/utils": "workspace:^",
    "lucide-react": "^0.511.0",
    "react": "^18.3.1",
    "react-router-dom": "^7.5.0",
    "@tanstack/react-query": "^5.75.5"
  }
}
```

## 주요 특징 및 베스트 프랙티스

### 1. 접근성 우선
- Radix UI 사용으로 WCAG 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 2. 타입 안전성
- 엄격한 TypeScript 설정
- API 응답 타입 정의
- 컴포넌트 Props 인터페이스

### 3. 성능 최적화
- React Query 캐싱
- 지연 로딩 (Lazy Loading)
- 번들 최적화 (Vite)

### 4. 개발자 경험
- 자동 코드 생성
- Hot Module Replacement
- TypeScript 자동 완성

### 5. 확장성
- 모노레포 구조
- 패키지 기반 아키텍처
- 솔루션별 모듈화

이 문서는 향후 컴포넌트 생성, 빌드 에러 해결, 새로운 기능 개발 시 참조할 수 있는 종합적인 가이드입니다.