import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	getWorkingList,
	WorkingListParams,
} from '@primes/services/production/workingService';

export const useWorkingListQuery = (params: WorkingListParams) => {
	return useQuery({
		queryKey: ['working', params],
		queryFn: () =>
			getWorkingList(
				params.searchRequest || {},
				params.page || 0,
				params.size || 10
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
