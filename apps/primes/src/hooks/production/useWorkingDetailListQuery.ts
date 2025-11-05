import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	getWorkingDetailList,
	getWorkingDetailByMasterId,
	WorkingDetailListParams,
} from '@primes/services/production/workingService';

export const useWorkingDetailListQuery = (params: WorkingDetailListParams) => {
	return useQuery({
		queryKey: ['workingDetail', params],
		queryFn: () =>
			getWorkingDetailList(
				params.searchRequest || {},
				params.page || 0,
				params.size || 10
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};

export const useWorkingDetailByMasterIdQuery = (
	masterId: number,
	enabled = true
) => {
	return useQuery({
		queryKey: ['workingDetail', 'byMasterId', masterId],
		queryFn: () => getWorkingDetailByMasterId(masterId),
		enabled: enabled && !!masterId,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
	});
};
