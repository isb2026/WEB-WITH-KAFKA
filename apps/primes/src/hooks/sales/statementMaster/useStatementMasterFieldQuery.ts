import { useQuery } from '@tanstack/react-query';
import { getStatementMasterFieldName } from '@primes/services/sales/statementMasterService';

export const useStatementMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['StatementMaster-field', fieldName],
		queryFn: () => getStatementMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
