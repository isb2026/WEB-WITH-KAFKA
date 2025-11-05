import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeliveryDetail } from '@primes/services/sales/deliveryService';
import { CreateDeliveryDetailPayload } from '@primes/types/sales/deliveryDetail';
import { toast } from 'sonner';

export const useCreateDeliveryDetail = (
	deliveryMasterId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateDeliveryDetailPayload[]) => createDeliveryDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['deliveryDetail', deliveryMasterId, page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
