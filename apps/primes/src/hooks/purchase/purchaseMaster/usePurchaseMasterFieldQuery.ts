import { useQuery } from '@tanstack/react-query';
import { getPurchaseMasterFieldName } from '@primes/services/purchase/purchaseMasterService';

export const usePurchaseMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['PurchaseMaster-field', fieldName],
		queryFn: () => getPurchaseMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
