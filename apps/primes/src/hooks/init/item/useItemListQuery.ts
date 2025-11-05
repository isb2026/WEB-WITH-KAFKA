import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getItemList } from '@primes/services/init/itemService';
import { GetAllItemListPayload, GetSearchItemListPayload, ItemSearchRequest } from '@primes/types/item';

export const useItemListQuery = (
	params: GetAllItemListPayload | GetSearchItemListPayload
) => {
	// Extract parameters for the new API structure
	const { page = 0, size = 10 } = params;
	const searchRequest: ItemSearchRequest = 'searchRequest' in params 
		? params.searchRequest || {}
		: {};

	return useQuery({
		queryKey: ['item', page, size, searchRequest],
		queryFn: () => getItemList({
			searchRequest,
			page,
			size,
		}),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
