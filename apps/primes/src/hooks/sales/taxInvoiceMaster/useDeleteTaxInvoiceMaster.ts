import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTaxInvoiceMaster } from '@primes/services/sales/taxInvoiceMasterService';
import { toast } from 'sonner';

type DeleteTaxInvoiceMasterInput = { ids: number[] };

export const useDeleteTaxInvoiceMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteTaxInvoiceMasterInput>({
		mutationFn: ({ ids }) => {
			return deleteTaxInvoiceMaster(ids);
		},
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['TaxInvoiceMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
