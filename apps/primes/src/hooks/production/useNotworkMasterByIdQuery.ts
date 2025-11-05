import { useQuery } from '@tanstack/react-query';
import { getNotworkMasterById } from '@primes/services/production/notworkService';

/**
 * 비가동 Master 개별 조회 전용 Atomic Hook
 */
export const useNotworkMasterByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['notwork-master', id],
		queryFn: () => getNotworkMasterById(id),
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};
