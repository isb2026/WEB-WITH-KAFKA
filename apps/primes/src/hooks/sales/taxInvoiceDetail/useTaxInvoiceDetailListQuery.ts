import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllTaxInvoiceDetailListPayload,
	GetSearchTaxInvoiceDetailListPayload,
} from '@primes/types/sales/taxInvoiceDetail';
import {
	searchTaxInvoiceDetail,
	getAllTaxInvoiceDetailList,
	getTaxInvoiceDetailByMasterId,
} from '@primes/services/sales/taxInvoiceDetailService';

export const useTaxInvoiceDetailListQuery = (
	params:
		| GetAllTaxInvoiceDetailListPayload
		| GetSearchTaxInvoiceDetailListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'TaxInvoiceDetail',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['TaxInvoiceDetail', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchTaxInvoiceDetail(
						params as GetSearchTaxInvoiceDetailListPayload
					)
				: getAllTaxInvoiceDetailList(
						params as GetAllTaxInvoiceDetailListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

export const useTaxInvoiceDetailListByMasterIdQuery = (
	masterId: number,
	page: number = 0,
	size: number = 10
) => {
	return useQuery({
		queryKey: ['TaxInvoiceDetail', 'byMasterId', masterId, page, size],
		queryFn: () => getTaxInvoiceDetailByMasterId(masterId, page, size),
		enabled: !!masterId,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
