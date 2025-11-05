import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaxInvoiceDetail } from '@primes/services/sales/taxInvoiceDetailService';
import { CreateTaxInvoiceDetailPayload } from '@primes/types/sales/taxInvoiceDetail';
import { toast } from 'sonner';

type CreateTaxInvoiceInput = { data: CreateTaxInvoiceDetailPayload[] };

export const useCreateTaxInvoiceDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateTaxInvoiceInput>({
		mutationFn: ({ data }) => createTaxInvoiceDetail(data),
		onSuccess: () => {
			toast.success('생성이 완료되었습니다.');
			// Invalidate both the general list and byMasterId queries
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceDetail'],
			});
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
