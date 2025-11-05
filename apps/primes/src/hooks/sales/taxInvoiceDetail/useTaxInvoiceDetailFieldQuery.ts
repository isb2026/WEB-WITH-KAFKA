import { useQuery } from '@tanstack/react-query';
import { getTaxInvoiceDetailFieldName } from '@primes/services/sales/taxInvoiceDetailService';

export const useTaxInvoiceDetailFieldQuery = (fieldName: string) => {
	return useQuery({
		queryKey: ['TaxInvoiceDetail-field', fieldName],
		queryFn: () => getTaxInvoiceDetailFieldName(fieldName),
	});
};
