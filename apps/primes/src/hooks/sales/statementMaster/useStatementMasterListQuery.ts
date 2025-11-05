import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllStatementMasterListPayload,
	GetSearchStatementMasterListPayload,
} from '@primes/types/sales/statementMaster';
import {
	searchStatementMaster,
	getAllStatementMasterList,
} from '@primes/services/sales/statementMasterService';

export const useStatementMasterListQuery = (
	params:
		| GetAllStatementMasterListPayload
		| GetSearchStatementMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'StatementMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['StatementMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchStatementMaster(
						params as GetSearchStatementMasterListPayload
					)
				: getAllStatementMasterList(
						params as GetAllStatementMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
