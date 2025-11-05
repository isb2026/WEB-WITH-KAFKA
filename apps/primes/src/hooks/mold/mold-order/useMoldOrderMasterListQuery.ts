import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldOrderMasterList } from '@primes/services/mold/moldOrderMasterService';
import { MoldOrderMasterSearchRequest } from '@primes/types/mold';

export const useMoldOrderMasterListQuery = (params: { 
	searchRequest?: MoldOrderMasterSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldOrderMaster', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldOrderMasterList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 