import { useQuery } from '@tanstack/react-query';
import { getCheckingHeadFields } from '@primes/services/qms/checkingHeadService';
import type { FieldQueryParams } from '@primes/types/common/field';

/**
 * QMS 검사 헤드 Field API Hook (Atomic Pattern)
 * 단일 책임: Custom Select용 필드 데이터 페칭만 담당
 * Swagger API에서 Field API 지원 확인됨 ✅
 * 엔드포인트: /api/checking/heads/fields/{fieldName}
 */
export const useCheckingHeadFieldQuery = (params?: FieldQueryParams) => {
	return useQuery({
		queryKey: ['checking-head-fields', params],
		queryFn: () => getCheckingHeadFields(params),
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 5, // 5분 가비지 컬렉션
	});
};
