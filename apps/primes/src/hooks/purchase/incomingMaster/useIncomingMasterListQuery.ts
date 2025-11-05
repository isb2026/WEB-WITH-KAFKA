import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllIncomingMasterListPayload,
	GetSearchIncomingMasterListPayload,
} from '@primes/types/purchase/incomingMaster';
import {
	searchIncomingMaster,
	getAllIncomingMasterList,
} from '@primes/services/purchase/incomingMasterService';

export const useIncomingMasterListQuery = (
	params: GetAllIncomingMasterListPayload | GetSearchIncomingMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'IncomingMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['IncomingMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchIncomingMaster(
						params as GetSearchIncomingMasterListPayload
					)
				: getAllIncomingMasterList(
						params as GetAllIncomingMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
