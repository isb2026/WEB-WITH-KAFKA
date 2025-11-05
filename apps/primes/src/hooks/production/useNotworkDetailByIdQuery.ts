import { useQuery } from '@tanstack/react-query';
import { getNotworkDetailById } from '@primes/services/production/notworkService';

/**
 * 비가동 Detail 개별 조회 전용 Atomic Hook
 */
export const useNotworkDetailByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['notwork-detail', id],
		queryFn: () => getNotworkDetailById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
