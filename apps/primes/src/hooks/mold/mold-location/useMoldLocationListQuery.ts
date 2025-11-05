import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldLocationList } from '@primes/services/mold/moldLocationService';
import { MoldLocationSearchRequest } from '@primes/types/mold';

export const useMoldLocationListQuery = (params: { 
	searchRequest?: MoldLocationSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldLocation', params.page, params.size],
		queryFn: () => getMoldLocationList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 