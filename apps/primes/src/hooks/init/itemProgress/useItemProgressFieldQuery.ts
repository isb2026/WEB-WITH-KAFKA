import { useQuery } from '@tanstack/react-query';
import { getProgressFieldName } from '@primes/services/init/progressService';

export const useItemProgressFieldQuery = (
	fieldName: string,
	enabled = true,
	itemId?: number | string
) => {
	return useQuery({
		queryKey: ['ItemProgress-field', fieldName, itemId],
		queryFn: () => getProgressFieldName(fieldName, itemId),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
