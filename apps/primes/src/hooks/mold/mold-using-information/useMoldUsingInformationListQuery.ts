import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldUsingInformationList } from '@primes/services/mold/moldUsingInformationService';
import { MoldUsingInformationSearchRequest } from '@primes/types/mold';

export const useMoldUsingInformationListQuery = (params: { 
	searchRequest?: MoldUsingInformationSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldUsingInformation', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldUsingInformationList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 