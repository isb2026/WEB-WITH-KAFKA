import { useQuery } from '@tanstack/react-query';
import { getMoldLocationFieldName } from '@primes/services/mold/moldLocationService';

export const useMoldLocationFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['MoldLocation-field', fieldName],
		queryFn: () => getMoldLocationFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
