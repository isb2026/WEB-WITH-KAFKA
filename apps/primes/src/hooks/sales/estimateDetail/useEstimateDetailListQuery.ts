import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllEstimateDetailListPayload,
	GetSearchEstimateDetailListPayload,
} from '@primes/types/sales/estimateDetail';
import {
	getAllEstimateDetailList,
	searchEstimateDetail,
	getEstimateDetailListById,
} from '@primes/services/sales/estimateDetailService';

export const useEstimateDetailListQuery = (
	params: GetAllEstimateDetailListPayload | GetSearchEstimateDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'EstimateDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['EstimateDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchEstimateDetail(
						params as GetSearchEstimateDetailListPayload
					)
				: getAllEstimateDetailList(
						params as GetAllEstimateDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

export const useEstimateDetailListByMasterIdQuery = (
	estimateMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	return useQuery({
		queryKey: ['EstimateDetail', 'byMasterId', estimateMasterId, page, size],
		queryFn: () => getEstimateDetailListById(estimateMasterId, page, size),
		enabled: !!estimateMasterId,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
