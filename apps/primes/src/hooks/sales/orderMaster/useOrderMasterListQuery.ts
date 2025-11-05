import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getOrderMasterList } from '@primes/services/sales/orderService';

import { GetSearchOrderMasterListPayload } from '@primes/types/sales/orderMaster';

export const useOrderMasterListQuery = (params: GetSearchOrderMasterListPayload = { page: 0, size: 10, searchRequest: {} }) => {
	return useQuery({
		queryKey: ['orderMaster', params.page, params.size, params.searchRequest],
		queryFn: () => getOrderMasterList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};