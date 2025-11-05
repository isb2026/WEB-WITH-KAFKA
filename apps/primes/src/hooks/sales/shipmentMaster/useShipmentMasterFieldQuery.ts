import { useQuery } from '@tanstack/react-query';
import { getShipmentMasterFieldName } from '@primes/services/sales/shipmentMasterService';

export const useShipmentMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['ShipmentMaster-field', fieldName],
		queryFn: () => getShipmentMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
