import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getOrderDetailList } from '@primes/services/sales/orderService';

export const useOrderDetailListQuery = (params: {
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['orderDetail', params.page, params.size],
		queryFn: () => getOrderDetailList(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
	});
};
