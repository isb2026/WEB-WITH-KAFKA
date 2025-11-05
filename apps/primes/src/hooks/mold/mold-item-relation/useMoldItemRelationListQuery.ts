import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldItemRelationList } from '@primes/services/mold/moldItemRelationService';
import { MoldItemRelationSearchRequest } from '@primes/types/mold';

export const useMoldItemRelationListQuery = (params: { 
	searchRequest?: MoldItemRelationSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldItemRelation', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldItemRelationList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 