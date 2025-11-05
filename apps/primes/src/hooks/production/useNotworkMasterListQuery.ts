import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getNotworkMasterList } from '@primes/services/production/notworkService';
import { NotworkMasterListParams } from '@primes/types/production/notwork';

/**
 * 비가동 Master 목록 조회 전용 Atomic Hook
 */
export const useNotworkMasterListQuery = (params: NotworkMasterListParams) => {
	return useQuery({
		queryKey: ['notwork-master', params],
		queryFn: () =>
			getNotworkMasterList(params, params.page || 0, params.size || 10),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
