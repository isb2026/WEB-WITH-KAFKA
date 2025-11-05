# Hook Architecture Improvement Design

## Overview

이 설계는 Primes 앱의 Hook 아키텍처를 개선하여 단일 책임 원칙을 철저히 적용하고, Field API 패턴을 도입하여 성능과 유지보수성을 향상시킵니다.

## Architecture

### Hook 계층 구조

```
hooks/
├── [domain]/
│   ├── useCreate[Entity].ts      # 생성 전용 Hook
│   ├── useUpdate[Entity].ts      # 수정 전용 Hook
│   ├── useDelete[Entity].ts      # 삭제 전용 Hook
│   ├── use[Entity]ListQuery.ts   # 목록 조회 전용 Hook
│   ├── use[Entity]ByIdQuery.ts   # 단일 조회 전용 Hook
│   ├── use[Entity]FieldQuery.ts  # Field API 전용 Hook
│   ├── use[Entity]s.ts           # Composite Hook
│   └── index.ts                  # 내보내기 관리
```

### Field API 패턴

Field API는 Custom Select, Autocomplete 등에서 사용할 간소화된 데이터를 제공합니다.

```typescript
// Field API 응답 구조
interface FieldOption {
  id: number | string;
  name: string;
  code?: string;
  disabled?: boolean;
}

// Field API 엔드포인트
GET /api/[domain]/[entity]/fields
```

## Components and Interfaces

### 1. Atomic Hooks

#### Create Hook
```typescript
// hooks/ini/useCreateVendor.ts
export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVendorPayload) => createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });
    },
  });
};
```

#### Update Hook
```typescript
// hooks/ini/useUpdateVendor.ts
export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVendorPayload }) => 
      updateVendor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });
    },
  });
};
```

#### Delete Hook
```typescript
// hooks/ini/useDeleteVendor.ts
export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });
    },
  });
};
```

#### List Query Hook
```typescript
// hooks/ini/useVendorListQuery.ts
export const useVendorListQuery = (params: VendorListParams) => {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: () => getVendorList(params),
    placeholderData: keepPreviousData,
  });
};
```

#### Single Query Hook
```typescript
// hooks/ini/useVendorByIdQuery.ts
export const useVendorByIdQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => getVendorById(id),
    enabled: enabled && !!id,
  });
};
```

#### Field Query Hook
```typescript
// hooks/ini/useVendorFieldQuery.ts
export const useVendorFieldQuery = (params?: FieldQueryParams) => {
  return useQuery({
    queryKey: ['vendor-fields', params],
    queryFn: () => getVendorFields(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
```

### 2. Composite Hook

```typescript
// hooks/ini/useVendors.ts
export const useVendors = (params: VendorListParams) => {
  const list = useVendorListQuery(params);
  const create = useCreateVendor();
  const update = useUpdateVendor();
  const remove = useDeleteVendor();

  return {
    list,
    create,
    update,
    remove,
  };
};
```

### 3. Hook Index 파일

```typescript
// hooks/ini/index.ts
// Atomic hooks
export { useCreateVendor } from './useCreateVendor';
export { useUpdateVendor } from './useUpdateVendor';
export { useDeleteVendor } from './useDeleteVendor';
export { useVendorListQuery } from './useVendorListQuery';
export { useVendorByIdQuery } from './useVendorByIdQuery';
export { useVendorFieldQuery } from './useVendorFieldQuery';

// Composite hook
export { useVendors } from './useVendors';
```

## Data Models

### Field API 타입 정의

```typescript
// types/common/field.ts
export interface FieldOption {
  id: number | string;
  name: string;
  code?: string;
  disabled?: boolean;
}

export interface FieldQueryParams {
  search?: string;
  limit?: number;
  active?: boolean;
}

export interface FieldResponse {
  data: FieldOption[];
  total: number;
}
```

### Entity별 Field 타입

```typescript
// types/ini/vendor.ts
export interface VendorFieldOption extends FieldOption {
  type?: 'customer' | 'supplier' | 'both';
}

export interface VendorFieldParams extends FieldQueryParams {
  type?: 'customer' | 'supplier' | 'both';
}
```

## Error Handling

### Hook별 에러 처리

```typescript
// hooks/ini/useCreateVendor.ts
export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVendorPayload) => createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-fields'] });
    },
    onError: (error) => {
      console.error('Failed to create vendor:', error);
      // Toast 알림 등 에러 처리
    },
  });
};
```

### Field API 에러 처리

```typescript
// hooks/ini/useVendorFieldQuery.ts
export const useVendorFieldQuery = (params?: FieldQueryParams) => {
  return useQuery({
    queryKey: ['vendor-fields', params],
    queryFn: () => getVendorFields(params),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Field API는 실패 시 빈 배열 반환
      if (error.status === 404) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      console.warn('Failed to load vendor fields:', error);
    },
  });
};
```

## Testing Strategy

### Unit Testing

각 Atomic Hook에 대한 개별 테스트:

```typescript
// hooks/ini/__tests__/useCreateVendor.test.ts
describe('useCreateVendor', () => {
  it('should create vendor successfully', async () => {
    const { result } = renderHook(() => useCreateVendor());
    
    await act(async () => {
      result.current.mutate(mockVendorData);
    });
    
    expect(result.current.isSuccess).toBe(true);
  });
});
```

### Integration Testing

Composite Hook과 Atomic Hook 간의 상호작용 테스트:

```typescript
// hooks/ini/__tests__/useVendors.test.ts
describe('useVendors', () => {
  it('should provide all CRUD operations', () => {
    const { result } = renderHook(() => useVendors(mockParams));
    
    expect(result.current.list).toBeDefined();
    expect(result.current.create).toBeDefined();
    expect(result.current.update).toBeDefined();
    expect(result.current.remove).toBeDefined();
  });
});
```

## Performance Considerations

### 1. 선택적 Hook 로딩
- 필요한 Hook만 import하여 번들 크기 최적화
- Tree-shaking을 통한 미사용 Hook 제거

### 2. Field API 캐싱 전략
- 5분간 stale time 설정으로 불필요한 재요청 방지
- 여러 컴포넌트에서 동일한 Field Hook 사용 시 캐시 공유

### 3. Query Key 최적화
- 계층적 Query Key 구조로 효율적인 캐시 무효화
- 관련 데이터 변경 시 필요한 캐시만 무효화

## Migration Strategy

### 1. 기존 Hook 분석
- 현재 사용 중인 복합 Hook 식별
- 각 컴포넌트에서 실제 사용하는 기능 분석

### 2. 점진적 마이그레이션
- 새로운 기능부터 Atomic Hook 적용
- 기존 기능은 단계적으로 리팩토링

### 3. 호환성 유지
- 기존 Composite Hook 유지하면서 Atomic Hook 추가
- 점진적으로 Composite Hook 사용 줄이기

이 설계는 Hook의 단일 책임 원칙을 강화하고, Field API 패턴을 통해 성능을 최적화하며, 개발자 경험을 향상시키는 것을 목표로 합니다.