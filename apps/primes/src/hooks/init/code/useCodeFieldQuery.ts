import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCodeFieldName } from '@primes/services/init/codeService';

export const useCodeFieldQuery = (code: string, enabled = true) => {
	return useQuery({
		queryKey: ['code-field', code],
		queryFn: () => getCodeFieldName(code),
		enabled: !!code && enabled,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
