import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllIncomingDetailListPayload,
	GetSearchIncomingDetailListPayload,
} from '@primes/types/purchase/incomingDetail';
import {
	searchIncomingDetail,
	getAllIncomingDetailList,
	getIncomingDetailListByMasterId,
} from '@primes/services/purchase/incomingDetailService';

export const useIncomingDetailListQuery = (
	params: GetAllIncomingDetailListPayload | GetSearchIncomingDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'IncomingDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['IncomingDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchIncomingDetail(
						params as GetSearchIncomingDetailListPayload
					)
				: getAllIncomingDetailList(
						params as GetAllIncomingDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

export const useIncomingDetailListByMasterIdQuery = (
	incomingMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	return useQuery({
		queryKey: ['IncomingDetail', 'byMasterId', incomingMasterId, page, size],
		queryFn: () => getIncomingDetailListByMasterId(incomingMasterId, page, size),
		enabled: !!incomingMasterId,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
