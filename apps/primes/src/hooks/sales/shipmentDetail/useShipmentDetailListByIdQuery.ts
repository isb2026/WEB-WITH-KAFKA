import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getShipmentDetailListById } from '@primes/services/sales/shipmentDetailService';

export const useShipmentDetailListByIdQuery = (params: {
	shipmentMasterId: number;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['ShipmentDetail', 'byMasterId', params.shipmentMasterId, params.page, params.size],
		queryFn: () => getShipmentDetailListById(params.shipmentMasterId, params.page, params.size),
		enabled: params.shipmentMasterId > 0,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
}; 