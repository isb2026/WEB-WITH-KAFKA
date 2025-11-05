import { useQuery } from '@tanstack/react-query';
import { getStatementDetailFieldName } from '@primes/services/sales/statementDetailService';

export const useStatementDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['StatementDetail-field', fieldName],
		queryFn: () => getStatementDetailFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
