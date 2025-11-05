import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCheckingHeadList } from '@primes/services/qms/checkingHeadService';
import type { CheckingHeadListParams } from '@primes/types/qms/checkingHead';

/**
 * QMS 검사 헤드 목록 조회 Hook (Atomic Pattern)
 * 단일 책임: 검사 헤드 목록 페칭만 담당
 */
export const useCheckingHeadListQuery = (params: CheckingHeadListParams) => {
	return useQuery({
		queryKey: ['checking-heads', params],
		queryFn: () => getCheckingHeadList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
