import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldRepairList } from '@primes/services/mold/moldRepairService';
import { MoldRepairSearchRequest } from '@primes/types/mold';

export const useMoldRepairListQuery = (params: { 
	searchRequest?: MoldRepairSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldRepair', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldRepairList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 