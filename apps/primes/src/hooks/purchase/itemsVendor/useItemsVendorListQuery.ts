import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllItemsVendorListPayload,
	GetSearchItemsVendorListPayload,
} from '@primes/types/purchase/itemsVendor';
import {
	searchItemsVendor,
	getAllItemsVendorList,
} from '@primes/services/purchase/itemsVendorService';

export const useItemsVendorListQuery = (
	params: GetAllItemsVendorListPayload | GetSearchItemsVendorListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ItemsVendor',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ItemsVendor', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchItemsVendor(params as GetSearchItemsVendorListPayload)
				: getAllItemsVendorList(params as GetAllItemsVendorListPayload),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
