import { useQuery } from '@tanstack/react-query';
import { getShippingRequestMasterById } from '@primes/services/sales/shippingRequestMasterService';

export const useGetShippingRequestMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['shippingRequestMaster', 'byId', id],
		queryFn: () => getShippingRequestMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 