import { useQuery } from '@tanstack/react-query';
import { getCheckingSpecById } from '@primes/services/qms/checkingSpecService';

/**
 * QMS 검사 규격 단일 조회 Hook (Atomic Pattern)
 * 단일 책임: 특정 검사 규격 페칭만 담당
 */
export const useCheckingSpecByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['checking-spec', id],
		queryFn: () => getCheckingSpecById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
