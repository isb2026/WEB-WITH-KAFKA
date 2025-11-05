import { useQuery } from '@tanstack/react-query';
import { getDeliveryMasterById } from '@primes/services/sales/deliveryService';

export const useGetDeliveryMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['deliveryMaster', 'byId', id, page, size],
		queryFn: () => getDeliveryMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
};
