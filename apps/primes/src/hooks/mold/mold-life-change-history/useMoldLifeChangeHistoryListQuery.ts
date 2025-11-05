import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldLifeChangeHistoryList } from '@primes/services/mold/moldLifeChangeHistoryService';
import { MoldLifeChangeHistorySearchRequest } from '@primes/types/mold';

export const useMoldLifeChangeHistoryListQuery = (params: { 
	searchRequest?: MoldLifeChangeHistorySearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldLifeChangeHistory', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldLifeChangeHistoryList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 