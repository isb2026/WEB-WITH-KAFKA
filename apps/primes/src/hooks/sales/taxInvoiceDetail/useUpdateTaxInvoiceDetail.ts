import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaxInvoiceDetail } from '@primes/services/sales/taxInvoiceDetailService';
import { UpdateTaxInvoiceDetailPayload } from '@primes/types/sales/taxInvoiceDetail';
import { toast } from 'sonner';

type UpdateTaxInvoiceInput = {
	id: number;
	data: Partial<UpdateTaxInvoiceDetailPayload>;
};

export const useUpdateTaxInvoiceDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateTaxInvoiceInput>({
		mutationFn: ({ id, data }) => updateTaxInvoiceDetail(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
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
