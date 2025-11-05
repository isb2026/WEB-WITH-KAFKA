import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMoldOrderDetailList } from '@primes/services/mold/moldOrderDetailService';
import { MoldOrderDetailSearchRequest } from '@primes/types/mold';

export const useMoldOrderDetailListQuery = (params: {
	searchRequest?: MoldOrderDetailSearchRequest;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['moldOrderDetail', params.page, params.size],
		queryFn: () => getMoldOrderDetailList(params.searchRequest, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
}; 