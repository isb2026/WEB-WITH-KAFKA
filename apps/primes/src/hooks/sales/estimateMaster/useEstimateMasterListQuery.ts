import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllEstimateMasterListPayload,
	GetSearchEstimateMasterListPayload,
} from '@primes/types/sales/estimateMaster';
import {
	getAllEstimateMasterList,
	searchEstimateMaster,
} from '@primes/services/sales/estimateMasterService';

export const useEstimateMasterListQuery = (
	params: GetAllEstimateMasterListPayload | GetSearchEstimateMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'EstimateMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['EstimateMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchEstimateMaster(
						params as GetSearchEstimateMasterListPayload
					)
				: getAllEstimateMasterList(
						params as GetAllEstimateMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
