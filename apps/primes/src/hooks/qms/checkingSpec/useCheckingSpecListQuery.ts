import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCheckingSpecList } from '@primes/services/qms/checkingSpecService';
import type { CheckingSpecListParams } from '@primes/types/qms/checkingSpec';

/**
 * QMS 검사 규격 목록 조회 Hook (Atomic Pattern)
 * 단일 책임: 검사 규격 목록 페칭만 담당
 */
export const useCheckingSpecListQuery = (
	params: CheckingSpecListParams,
	options?: {
		staleTime?: number;
	}
) => {
	return useQuery({
		queryKey: ['checking-specs', params],
		queryFn: () => getCheckingSpecList(params),
		placeholderData: keepPreviousData,
		staleTime: options?.staleTime ?? 1000 * 60 * 5, // 기본값 5분, 옵션으로 오버라이드 가능
	});
};
