import { useQuery } from '@tanstack/react-query';
import { getDeliveryMasterFieldName } from '@primes/services/sales/deliveryMasterService';

export const useDeliveryMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['DeliveryMaster-field', fieldName],
		queryFn: () => getDeliveryMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
