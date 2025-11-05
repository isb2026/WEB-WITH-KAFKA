import { useQuery } from '@tanstack/react-query';
import { getCheckingSampleFields } from '@primes/services/qms/checkingSampleService';
import type { FieldQueryParams } from '@primes/types/common/field';

/**
 * QMS 검사 샘플 Field API Hook (Atomic Pattern)
 * 단일 책임: Custom Select용 필드 데이터 페칭만 담당
 * Swagger API에서 Field API 지원 확인됨 ✅
 */
export const useCheckingSampleFieldQuery = (params?: FieldQueryParams) => {
	return useQuery({
		queryKey: ['checking-sample-fields', params],
		queryFn: () => getCheckingSampleFields(params),
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 5, // 5분 가비지 컬렉션
	});
};
