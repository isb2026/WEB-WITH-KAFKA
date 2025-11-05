import { useQuery } from '@tanstack/react-query';
import { getItemsVendorFieldName } from '@primes/services/purchase/itemsVendorService';

export const useItemsVendorFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['ItemsVendor-field', fieldName],
		queryFn: () => getItemsVendorFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
