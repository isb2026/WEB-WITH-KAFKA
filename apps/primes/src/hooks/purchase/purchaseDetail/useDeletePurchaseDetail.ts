import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePurchaseDetail } from '@primes/services/purchase/purchaseDetailService';
import { toast } from 'sonner';

type DeletePurchaseDetailInput = { ids: number[] };

export const useDeletePurchaseDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeletePurchaseDetailInput>({
		mutationFn: async ({ ids }) => {
			await deletePurchaseDetail(ids);
		},
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all purchase detail related queries
			queryClient.invalidateQueries({
				queryKey: ['PurchaseDetail'],
			});
			// Also refetch all queries to ensure immediate UI update
			queryClient.refetchQueries({
				queryKey: ['PurchaseDetail'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
