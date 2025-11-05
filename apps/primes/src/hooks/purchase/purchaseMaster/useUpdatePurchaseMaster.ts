import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePurchaseMaster } from '@primes/services/purchase/purchaseMasterService';
import { UpdatePurchaseMasterPayload } from '@primes/types/purchase/purchaseMaster';
import { toast } from 'sonner';

type UpdatePurchaseMasterInput = {
	id: number;
	data: Partial<UpdatePurchaseMasterPayload>;
};

export const useUpdatePurchaseMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdatePurchaseMasterInput>({
		mutationFn: ({ id, data }) => updatePurchaseMaster(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['PurchaseMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
