import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllPurchaseMasterListPayload,
	GetSearchPurchaseMasterListPayload,
} from '@primes/types/purchase/purchaseMaster';
import {
	searchPurchaseMaster,
	getAllPurchaseMasterList,
} from '@primes/services/purchase/purchaseMasterService';

export const usePurchaseMasterListQuery = (
	params: GetAllPurchaseMasterListPayload | GetSearchPurchaseMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'PurchaseMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['PurchaseMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchPurchaseMaster(
						params as GetSearchPurchaseMasterListPayload
					)
				: getAllPurchaseMasterList(
						params as GetAllPurchaseMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
