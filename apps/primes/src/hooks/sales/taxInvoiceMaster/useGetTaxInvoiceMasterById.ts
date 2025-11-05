import { useQuery } from '@tanstack/react-query';
import { getTaxInvoiceMasterById } from '@primes/services/sales/taxInvoiceMasterService';

export const useGetTaxInvoiceMasterById = (id: number, page: number = 0, size: number = 10) => {
	return useQuery({
		queryKey: ['TaxInvoiceMaster', 'byId', id, page, size],
		queryFn: () => getTaxInvoiceMasterById({ id, page, size }),
		enabled: id > 0,
		staleTime: 1000 * 60 * 3,
	});
}; 