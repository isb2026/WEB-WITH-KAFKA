import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldInoutInformationList } from '@primes/services/mold/moldInoutInformationService';
import { MoldInoutInformationSearchRequest } from '@primes/types/mold';

export const useMoldInoutInformationListQuery = (params: { 
	searchRequest?: MoldInoutInformationSearchRequest;
	page: number; 
	size: number; 
}) => {
	return useQuery({
		queryKey: ['moldInoutInformation', params.searchRequest, params.page, params.size],
		queryFn: () => getMoldInoutInformationList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 