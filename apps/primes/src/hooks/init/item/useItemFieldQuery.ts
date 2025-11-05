import { useQuery } from '@tanstack/react-query';
import { getItemFieldValues } from '@primes/services/init/itemService';
import { ItemSearchRequest } from '@primes/types/item';

export const useItemFieldQuery = (
	fieldName: string, 
	searchRequest: ItemSearchRequest = {},
	enabled = true
) => {
	return useQuery({
		queryKey: ['item-field', fieldName, searchRequest],
		queryFn: () => getItemFieldValues(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 5, // 5 minutes cache
		gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
	});
};

// Legacy version for backward compatibility
export const useItemFieldQueryLegacy = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['item-field', fieldName],
		queryFn: () => getItemFieldValues(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
