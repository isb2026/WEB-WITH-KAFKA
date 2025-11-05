import { useQuery } from '@tanstack/react-query';
import { getOrderMasterById } from '@primes/services/sales/orderService';

export const useGetOrderMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['orderMaster', 'byId', id, page, size],
		queryFn: () => getOrderMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 