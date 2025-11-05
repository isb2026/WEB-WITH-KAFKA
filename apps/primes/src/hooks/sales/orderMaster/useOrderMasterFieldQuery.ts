import { useQuery } from '@tanstack/react-query';
import { getOrderMasterField } from '@primes/services/sales/orderService';

export const useOrderMasterFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['OrderMaster-field', fieldName],
		queryFn: () => getOrderMasterField(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
