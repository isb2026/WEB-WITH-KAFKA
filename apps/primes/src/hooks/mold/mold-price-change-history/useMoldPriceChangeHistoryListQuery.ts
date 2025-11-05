import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldPriceChangeHistoryList } from '@primes/services/mold/moldPriceChangeHistoryService';
import { MoldPriceChangeHistorySearchRequest } from '@primes/types/mold';

export const useMoldPriceChangeHistoryListQuery = (params: { 
	searchRequest?: MoldPriceChangeHistorySearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldPriceChangeHistory', params.page, params.size],
		queryFn: () => getMoldPriceChangeHistoryList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 