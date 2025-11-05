import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCheckingSampleList } from '@primes/services/qms/checkingSampleService';
import type { CheckingSampleListParams } from '@primes/types/qms/checkingSample';

/**
 * QMS 검사 샘플 목록 조회 Hook (Atomic Pattern)
 * 단일 책임: 검사 샘플 목록 페칭만 담당
 */
export const useCheckingSampleListQuery = (
	params: CheckingSampleListParams
) => {
	return useQuery({
		queryKey: ['checking-samples', params],
		queryFn: () => getCheckingSampleList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
