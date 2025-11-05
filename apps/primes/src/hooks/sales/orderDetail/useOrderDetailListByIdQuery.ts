import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getOrderDetailListById } from '@primes/services/sales/orderService';

export const useOrderDetailListByIdQuery = (params: {
	orderMasterId: number;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: [
			'orderDetailById',
			params.orderMasterId,
			params.page,
			params.size,
		],
		queryFn: () =>
			getOrderDetailListById(
				params.orderMasterId,
				params.page,
				params.size
			),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		enabled: !!params.orderMasterId, // Only run query if orderMasterId is provided
	});
};
