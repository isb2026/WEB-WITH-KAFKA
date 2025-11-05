import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTaxInvoiceDetail } from '@primes/services/sales/taxInvoiceDetailService';
import { toast } from 'sonner';

type DeleteTaxInvoiceDetailInput = { ids: number[] };

export const useDeleteTaxInvoiceDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteTaxInvoiceDetailInput>({
		mutationFn: ({ ids }) => deleteTaxInvoiceDetail(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
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
