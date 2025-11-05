import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllPurchaseDetailListPayload,
	GetSearchPurchaseDetailListPayload,
} from '@primes/types/purchase/purchaseDetail';
import {
	searchPurchaseDetail,
	getAllPurchaseDetailList,
	getPurchaseDetailListByMasterId,
} from '@primes/services/purchase/purchaseDetailService';

export const usePurchaseDetailListQuery = (
	params: GetAllPurchaseDetailListPayload | GetSearchPurchaseDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'PurchaseDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['PurchaseDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchPurchaseDetail(
						params as GetSearchPurchaseDetailListPayload
					)
				: getAllPurchaseDetailList(
						params as GetAllPurchaseDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

export const usePurchaseDetailListByMasterIdQuery = (
	purchaseMasterId: number,
	page: number = 0,
	size: number = 10
) => {
	return useQuery({
		queryKey: ['PurchaseDetail', 'byMasterId', purchaseMasterId, page, size],
		queryFn: () => getPurchaseDetailListByMasterId(purchaseMasterId, page, size),
		enabled: !!purchaseMasterId,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
