import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeliveryMaster } from '@primes/services/sales/deliveryService';
import { DeliveryMasterPayload } from '@primes/types/sales';
import { toast } from 'sonner';

export const useCreateDeliveryMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeliveryMasterPayload) => createDeliveryMaster(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['deliveryMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
