import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDeliveryMasterList } from '@primes/services/sales/deliveryService';
import { SearchDeliveryMasterRequest } from '@primes/types/sales/deliveryMaster';

export const useDeliveryMasterListQuery = (params: {
	page: number;
	size: number;
	searchRequest: Partial<SearchDeliveryMasterRequest>;
}) => {
	return useQuery({
		queryKey: ['deliveryMaster', params.page, params.size, params.searchRequest],
		queryFn: () => getDeliveryMasterList(params),
		placeholderData: keepPreviousData,
		// staleTime: 1000 * 60 * 3,
	});
};
