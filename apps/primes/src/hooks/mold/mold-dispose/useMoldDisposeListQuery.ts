import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldDisposeList } from '@primes/services/mold/moldDisposeService';
import { MoldDisposeSearchRequest } from '@primes/types/mold';

export const useMoldDisposeListQuery = (params: { 
	searchRequest?: MoldDisposeSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldDispose', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldDisposeList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 