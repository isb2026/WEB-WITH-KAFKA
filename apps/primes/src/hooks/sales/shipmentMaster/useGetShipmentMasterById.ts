import { useQuery } from '@tanstack/react-query';
import { getShipmentMasterById } from '@primes/services/sales/shipmentMasterService';

export const useGetShipmentMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['shipmentMaster', 'byId', id, page, size],
		queryFn: () => getShipmentMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 