import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePurchaseDetail } from '@primes/services/purchase/purchaseDetailService';
import { UpdatePurchaseDetailPayload } from '@primes/types/purchase/purchaseDetail';
import { toast } from 'sonner';

type UpdatePurchaseDetailInput = {
	id: number;
	data: Partial<UpdatePurchaseDetailPayload>;
};

export const useUpdatePurchaseDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdatePurchaseDetailInput>({
		mutationFn: ({ id, data }) => updatePurchaseDetail(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
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
