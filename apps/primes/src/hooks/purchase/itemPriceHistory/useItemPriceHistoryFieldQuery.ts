import { useQuery } from '@tanstack/react-query';
import { getItemPriceHistoryFieldName } from '@primes/services/purchase/itemPriceHistoryService';

export const useItemPriceHistoryFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['ItemPriceHistory-field', fieldName],
		queryFn: () => getItemPriceHistoryFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
