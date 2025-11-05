import { useQuery } from '@tanstack/react-query';
import { getVendorsFieldName } from '@primes/services/purchase/vendorsService';

export const useVendorsFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Vendors-field', fieldName],
		queryFn: () => getVendorsFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
