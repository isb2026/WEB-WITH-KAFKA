# Primes 앱 아키텍처 가이드 (한글)

## 개요

Primes 앱은 MSA React 모노레포 구조에서 가장 우선순위가 높은 메인 애플리케이션입니다. 
LTS5를 대체하는 현대적인 아키텍처로 설계되었으며, Tailwind CSS + Radix UI 조합을 사용합니다.

### Monorepo 컨텍스트
- **Turborepo** 기반 빌드 시스템
- **패키지 우선순위**: `@repo/radix-ui` > `@repo/moornmo-ui` > `@repo/falcon-ui`
- **애플리케이션 현황**: Primes (최우선) > ESG (운영) > Demo (개발도구) > LTS5 (제거예정)
- **개발 전략**: Demo에서 UI 테스트 → Radix UI 패키지 개발 → Primes 적용

## 기술 스택

- **프론트엔드**: React 18.3.1 + TypeScript 5.8.3
- **빌드 도구**: Vite 6.2.0
- **스타일링**: Tailwind CSS 3.4.3 + Radix UI
- **상태 관리**: React Query (@tanstack/react-query)
- **라우팅**: React Router DOM 7.5.0
- **아이콘**: Lucide React

## 디렉토리 구조

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
├── hooks/                 # 커스텀 React 훅들
├── services/              # API 서비스 레이어
├── types/                 # TypeScript 타입 정의
└── utils/                 # 유틸리티 함수들
```

## 템플릿 패턴

### 탭 콘텐츠 타입

#### Master-Detail 패턴
관련 리스트가 있는 마스터-디테일 관계를 표현합니다.

```typescript
const MasterDetailPage: React.FC = () => {
  const [selectedMaster, setSelectedMaster] = useState<MasterData | null>(null);
  const { list: masterList } = useMasters({ page, size });
  const { list: detailList } = useDetails({ masterId: selectedMaster?.id });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="master-section">
        <DatatableComponent data={masterList} onRowSelect={setSelectedMaster} />
      </div>
      <div className="detail-section">
        {selectedMaster && (
          <DatatableComponent data={detailList} />
        )}
      </div>
    </div>
  );
};
```

#### Single Page List 패턴
CRUD 작업이 있는 단순 리스트 뷰입니다.

```typescript
const SingleListPage: React.FC = () => {
  const { list, create, update, remove } = useItems({ page, size });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  return (
    <PageTemplate>
      <div className="actions-bar mb-4">
        <Button onClick={() => setOpenCreateModal(true)}>등록</Button>
        <Button onClick={() => handleBulkDelete(selectedRows)}>삭제</Button>
      </div>
      <DatatableComponent
        data={list.data}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </PageTemplate>
  );
};
```

#### Analysis 패턴
데이터 시각화 및 리포팅 페이지입니다.

### 데이터 처리 패턴

#### Page Navigation 패턴
복잡한 폼을 위한 별도 등록/수정 페이지를 사용합니다.

```typescript
const PageNavigationHandling: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/ini/items/register');
  };

  const handleEdit = (id: number) => {
    navigate(`/ini/items/edit/${id}`);
  };

  return (
    <div className="actions-bar">
      <Button onClick={handleCreate}>등록</Button>
      <Button onClick={() => handleEdit(selectedId)}>수정</Button>
    </div>
  );
};
```

#### Modal 패턴
간단한 폼을 위한 모달 다이얼로그를 사용합니다.

```typescript
const ModalHandling: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { create } = useItems();

  return (
    <DraggableDialog
      open={openModal}
      onOpenChange={setOpenModal}
      title="등록"
      content={
        <SimpleForm
          onSubmit={(data) => {
            create.mutate(data);
            setOpenModal(false);
          }}
          onCancel={() => setOpenModal(false)}
        />
      }
    />
  );
};
```

## Hook 아키텍처 (단일 책임 원칙)

Hook은 단일 책임 원칙을 따라 원자적 작업으로 구성됩니다.

### 원자적 Hook들

```typescript
// useCreateItem.ts - 생성만 담당
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemPayload) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useUpdateItem.ts - 수정만 담당
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemPayload }) => 
      updateItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useDeleteItem.ts - 삭제만 담당
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useItemListQuery.ts - 리스트 조회만 담당
export const useItemListQuery = (params: ItemListParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItemList(params),
    placeholderData: keepPreviousData,
  });
};

// useItemByIdQuery.ts - 단일 조회만 담당
export const useItemByIdQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: enabled && !!id,
  });
};

// useItemFieldQuery.ts - Field API 전용 (Custom Select용)
export const useItemFieldQuery = (params?: FieldQueryParams) => {
  return useQuery({
    queryKey: ['item-fields', params],
    queryFn: () => getItemFields(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
```

### 복합 Hook

```typescript
// useItems.ts - 모든 작업을 결합한 복합 훅 (Field Hook 제외)
export const useItems = (params: ItemListParams) => {
  const list = useItemListQuery(params);
  const create = useCreateItem();
  const update = useUpdateItem();
  const remove = useDeleteItem();

  return { list, create, update, remove };
};
```

### Field API 패턴

Field API는 Custom Select, Autocomplete 등에서 사용할 간소화된 데이터를 제공합니다.

```typescript
// Field API 타입 정의
interface FieldOption {
  id: number | string;
  name: string;
  code?: string;
  disabled?: boolean;
}

interface FieldQueryParams {
  search?: string;
  limit?: number;
  active?: boolean;
}

// Field API 사용 예시
const ItemSelect: React.FC = () => {
  const { data: itemOptions } = useItemFieldQuery({ active: true });
  
  return (
    <CustomSelect
      options={itemOptions}
      placeholder="제품을 선택하세요"
    />
  );
};

// Field Hook은 메인 Entity Hook과 독립적으로 사용
const CreateOrderPage: React.FC = () => {
  const { create } = useCreateOrder(); // 주문 생성만 필요
  const { data: itemOptions } = useItemFieldQuery(); // 제품 선택용
  const { data: vendorOptions } = useVendorFieldQuery(); // 거래처 선택용
  
  // useItems나 useVendors 전체를 가져올 필요 없음
};
```

## 타입 시스템 구조

타입은 솔루션/서비스 패턴으로 구성됩니다.

### 구조 예시

```typescript
// types/ini/items.ts - 도메인별 타입
export interface ItemData {
  id: number;
  name: string;
  code: string;
  // ... 기타 필드
}

export interface CreateItemPayload {
  name: string;
  code: string;
  // ... 생성에 필요한 필드들
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {
  id: number;
}

// types/ini/index.ts - 솔루션 레벨 내보내기
export * from './items';
export * from './vendor';
export * from './terminal';

// types/index.ts - 루트 레벨 내보내기
export * from './ini';
export * from './sales';
export * from './production';
// ... 기타 솔루션들
```

## 도메인 구성

앱은 비즈니스 도메인(솔루션)별로 구성됩니다:

- `ini/` - 기초정보 관리
- `sales/` - 영업 관리
- `purchase/` - 구매 관리
- `production/` - 생산 관리
- `machine/` - 설비 관리
- `mold/` - 금형 관리

## 라우팅 패턴

### 솔루션별 라우팅 구조
```
/[solution]/[entity]/[action]

예시:
/ini/vendor/list        # 기초정보 > 거래처 > 목록
/sales/order/register   # 영업 > 주문 > 등록
/production/plan/edit   # 생산 > 계획 > 수정
```

### Tab Navigation 라우팅
- Tab 클릭 시 해당 경로로 이동
- URL 변경 시 자동으로 해당 탭 활성화

## 스타일링 가이드

### Tailwind CSS 사용법
- 커스텀 컬러 시스템 사용 (Colors-Brand-*, Colors-Gray-* 등)
- 반응형 디자인 (sm:, md:, lg:, xl:)
- 다크모드 지원 (dark: prefix)

### 컴포넌트 스타일링 예시
```typescript
// Radix UI + Tailwind 조합
<RadixButton className="bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white px-4 py-2 rounded-lg">
  등록
</RadixButton>
```

## Import 순서

1. React 및 외부 라이브러리
2. 내부 컴포넌트 및 훅
3. 타입 및 인터페이스
4. 상대 경로 import

```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useItems } from '@primes/hooks';
import { PageTemplate } from '@primes/templates';
import { ItemData, CreateItemPayload } from '@primes/types/ini';
```

## 베스트 프랙티스

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

## 코드 생성 패턴

### 자동 생성 가능한 컴포넌트들
- Tab Navigation 컴포넌트
- CRUD 페이지 (List, Register, MasterDetail)
- API Service 함수들
- React Query Hook들
- TypeScript 타입 정의

### 생성기 사용법
```bash
cd apps/primes
npm run page    # 페이지 생성
npm run tab     # 탭 생성
npm run generate # 설정 기반 생성
```

이 가이드는 Primes 앱 개발 시 일관된 아키텍처와 코드 품질을 유지하기 위한 종합적인 참조 문서입니다.