import { useQuery } from '@tanstack/react-query';
import { getTerminalFieldName } from '@primes/services/init/terminalService';

export const useTerminalFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['terminal-field', fieldName],
		queryFn: () => getTerminalFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
