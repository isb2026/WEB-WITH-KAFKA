import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDeliveryDetailList } from '@primes/services/sales/deliveryService';

export const useDeliveryDetailListQuery = (params: {
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['deliveryDetail', params.page, params.size],
		queryFn: () => getDeliveryDetailList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};
