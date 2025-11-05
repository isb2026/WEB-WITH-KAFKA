import { useQuery } from '@tanstack/react-query';
import { getPurchaseDetailFieldName } from '@primes/services/purchase/purchaseDetailService';

export const usePurchaseDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['PurchaseDetail-field', fieldName],
		queryFn: () => getPurchaseDetailFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
