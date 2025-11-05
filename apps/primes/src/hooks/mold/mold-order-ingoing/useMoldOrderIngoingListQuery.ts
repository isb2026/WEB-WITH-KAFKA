import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldOrderIngoingList } from '@primes/services/mold/moldOrderIngoingService';
import { MoldOrderIngoingSearchRequest } from '@primes/types/mold';

export const useMoldOrderIngoingListQuery = (params: { 
	searchRequest?: MoldOrderIngoingSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldOrderIngoing', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldOrderIngoingList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 