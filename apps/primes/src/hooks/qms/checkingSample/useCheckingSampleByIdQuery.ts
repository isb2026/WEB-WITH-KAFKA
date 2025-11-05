import { useQuery } from '@tanstack/react-query';
import { getCheckingSampleById } from '@primes/services/qms/checkingSampleService';

/**
 * QMS 검사 샘플 단일 조회 Hook (Atomic Pattern)
 * 단일 책임: 특정 검사 샘플 페칭만 담당
 */
export const useCheckingSampleByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['checking-sample', id],
		queryFn: () => getCheckingSampleById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
