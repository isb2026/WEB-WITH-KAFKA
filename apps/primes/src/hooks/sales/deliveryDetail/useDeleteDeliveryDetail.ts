import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDeliveryDetail } from '@primes/services/sales/deliveryService';
import { toast } from 'sonner';

export const useDeleteDeliveryDetail = (
	deliveryId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteDeliveryDetail(ids),
		onSuccess: () => {
			toast.success('납품 상세가 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['deliveryDetail', deliveryId, page, size],
			});
		},
		onError: (error: Error) => {
			toast.error(`납품 상세 삭제 실패: ${error.message}`);
		},
	});
};
