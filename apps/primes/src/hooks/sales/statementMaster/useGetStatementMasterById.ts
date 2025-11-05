import { useQuery } from '@tanstack/react-query';
import { getStatementMasterById } from '@primes/services/sales/statementMasterService';

export const useGetStatementMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['StatementMaster', 'byId', id, page, size],
		queryFn: () => getStatementMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 