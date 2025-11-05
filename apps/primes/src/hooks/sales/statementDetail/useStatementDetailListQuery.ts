import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllStatementDetailListPayload,
	GetSearchStatementDetailListPayload,
} from '@primes/types/sales/statementDetail';
import {
	searchStatementDetail,
	getAllStatementDetailList,
	getStatementDetailListById,
} from '@primes/services/sales/statementDetailService';

export const useStatementDetailListQuery = (
	params:
		| GetAllStatementDetailListPayload
		| GetSearchStatementDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'StatementDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['StatementDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchStatementDetail(
						params as GetSearchStatementDetailListPayload
					)
				: getAllStatementDetailList(
						params as GetAllStatementDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

export const useStatementDetailListByMasterIdQuery = (
	statementMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	return useQuery({
		queryKey: ['StatementDetail', 'byMasterId', statementMasterId, page, size],
		queryFn: () => getStatementDetailListById(statementMasterId, page, size),
		enabled: !!statementMasterId,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
