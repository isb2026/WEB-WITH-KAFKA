import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaxInvoiceMaster } from '@primes/services/sales/taxInvoiceMasterService';
import { UpdateTaxInvoiceMasterPayload } from '@primes/types/sales/taxInvoiceMaster';
import { toast } from 'sonner';

type UpdateTaxInvoiceInput = {
	id: number;
	data: Partial<UpdateTaxInvoiceMasterPayload>;
};

export const useUpdateTaxInvoiceMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateTaxInvoiceInput>({
		mutationFn: ({ id, data }) => updateTaxInvoiceMaster(id, data),
		onSuccess: (_, { id }) => {
			toast.success('수정이 완료되었습니다.');
			// Invalidate all TaxInvoiceMaster queries
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceMaster'],
			});
			// Invalidate specific byId query
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceMaster', 'byId', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
