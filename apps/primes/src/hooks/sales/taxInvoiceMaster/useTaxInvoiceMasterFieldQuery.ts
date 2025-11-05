import { useQuery } from '@tanstack/react-query';
import { getTaxInvoiceMasterFieldName } from '@primes/services/sales/taxInvoiceMasterService';

export const useTaxInvoiceMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['TaxInvoiceMaster-field', fieldName],
		queryFn: () => getTaxInvoiceMasterFieldName(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
