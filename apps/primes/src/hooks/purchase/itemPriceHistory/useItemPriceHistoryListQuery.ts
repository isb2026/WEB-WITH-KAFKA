import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllItemPriceHistoryListPayload,
	GetSearchItemPriceHistoryListPayload,
} from '@primes/types/purchase/itemPriceHistory';
import {
	searchItemPriceHistory,
	getAllItemPriceHistoryList,
} from '@primes/services/purchase/itemPriceHistoryService';

export const useItemPriceHistoryListQuery = (
	params:
		| GetAllItemPriceHistoryListPayload
		| GetSearchItemPriceHistoryListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'ItemPriceHistory',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['ItemPriceHistory', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchItemPriceHistory(
						params as GetSearchItemPriceHistoryListPayload
					)
				: getAllItemPriceHistoryList(
						params as GetAllItemPriceHistoryListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
