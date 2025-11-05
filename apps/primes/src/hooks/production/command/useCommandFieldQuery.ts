import { useQuery } from '@tanstack/react-query';
import { getCommandFieldName } from '@primes/services/production/commandService';

export const useCommandFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Command-field', fieldName],
		queryFn: () => getCommandFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
