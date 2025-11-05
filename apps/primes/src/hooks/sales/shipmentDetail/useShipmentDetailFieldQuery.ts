import { useQuery } from '@tanstack/react-query';
import { getShipmentDetailFieldName } from '@primes/services/sales/shipmentDetailService';

export const useShipmentDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['ShipmentDetail-field', fieldName],
		queryFn: () => getShipmentDetailFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
