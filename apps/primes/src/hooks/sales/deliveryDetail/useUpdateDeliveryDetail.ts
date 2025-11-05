import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDeliveryDetail } from '@primes/services/sales/deliveryService';
import { toast } from 'sonner';
import { DeliveryDetailItem } from '@primes/types/sales/deliveryDetail';

export const useUpdateDeliveryDetail = (
	deliveryId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: DeliveryDetailItem[] }) =>
			updateDeliveryDetail(id, data),
		onSuccess: () => {
			toast.success('납품 상세가 수정되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['deliveryDetail', deliveryId, page, size],
			});
		},
		onError: (error: Error) => {
			toast.error(`납품 상세 수정 실패: ${error.message}`);
		},
	});
};
