import { useQuery } from '@tanstack/react-query';
import { getCheckingHeadById } from '@primes/services/qms/checkingHeadService';

/**
 * QMS 검사 헤드 단일 조회 Hook (Atomic Pattern)
 * 단일 책임: 특정 검사 헤드 페칭만 담당
 */
export const useCheckingHeadByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['checking-head', id],
		queryFn: () => getCheckingHeadById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
