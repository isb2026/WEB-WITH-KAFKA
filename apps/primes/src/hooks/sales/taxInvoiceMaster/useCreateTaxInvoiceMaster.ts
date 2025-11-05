import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaxInvoiceMaster } from '@primes/services/sales/taxInvoiceMasterService';
import { CreateTaxInvoiceMasterPayload } from '@primes/types/sales/taxInvoiceMaster';
import { toast } from 'sonner';

type CreateTaxInvoiceInput = { data: Partial<CreateTaxInvoiceMasterPayload> };

export const useCreateTaxInvoiceMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateTaxInvoiceInput>({
		mutationFn: ({ data }) => createTaxInvoiceMaster(data),
		onSuccess: () => {
			toast.success('생성이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
