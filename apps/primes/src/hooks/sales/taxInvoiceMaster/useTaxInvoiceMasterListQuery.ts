import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
	GetAllTaxInvoiceMasterListPayload,
	GetSearchTaxInvoiceMasterListPayload,
} from '@primes/types/sales/taxInvoiceMaster';
import {
	searchTaxInvoiceMaster,
	getAllTaxInvoiceMasterList,
} from '@primes/services/sales/taxInvoiceMasterService';

export const useTaxInvoiceMasterListQuery = (
	params:
		| GetAllTaxInvoiceMasterListPayload
		| GetSearchTaxInvoiceMasterListPayload
) => {
	const isSearching = 'searchRequest' in params;

	return useQuery({
		queryKey: isSearching
			? [
					'TaxInvoiceMaster',
					'search',
					params.page,
					params.size,
					params.searchRequest,
				]
			: ['TaxInvoiceMaster', params.page, params.size],
		queryFn: () =>
			isSearching
				? searchTaxInvoiceMaster(
						params as GetSearchTaxInvoiceMasterListPayload
					)
				: getAllTaxInvoiceMasterList(
						params as GetAllTaxInvoiceMasterListPayload
					),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
