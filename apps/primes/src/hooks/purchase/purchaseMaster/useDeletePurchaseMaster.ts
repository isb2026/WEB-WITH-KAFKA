import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePurchaseMaster } from '@primes/services/purchase/purchaseMasterService';
import { toast } from 'sonner';

type DeletePurchaseMasterInput = { ids: number[] };

export const useDeletePurchaseMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeletePurchaseMasterInput>({
		mutationFn: async ({ ids }) => {
			await deletePurchaseMaster(ids);
		},
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['PurchaseMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
