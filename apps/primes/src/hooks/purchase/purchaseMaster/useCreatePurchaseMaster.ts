import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchaseMaster } from '@primes/services/purchase/purchaseMasterService';
import { CreatePurchaseMasterPayload } from '@primes/types/purchase/purchaseMaster';
import { toast } from 'sonner';

type CreatePurchaseMasterInput = { data: any };

export const useCreatePurchaseMaster = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreatePurchaseMasterInput>({
		mutationFn: ({ data }) => createPurchaseMaster(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['PurchaseMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
