import { useQuery } from '@tanstack/react-query';
import { getIncomingDetailFieldName } from '@primes/services/purchase/incomingDetailService';

export const useIncomingDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['IncomingDetail-field', fieldName],
		queryFn: () => getIncomingDetailFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
