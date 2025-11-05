import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderDetail } from '@primes/services/sales/orderService';
import { OrderDetailItem } from '@primes/types/sales';
import { toast } from 'sonner';

type UpdateOrderDetailInput = { id: number; data: OrderDetailItem };

export const useUpdateOrderDetail = (
	orderMasterId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateOrderDetailInput>({
		mutationFn: ({ id, data }) => updateOrderDetail(id, data),
		onSuccess: () => {
			toast.success('주문 상세가 수정되었습니다.');

			// Invalidate the specific query
			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderMasterId, page, size],
			});

			// Also invalidate any queries that start with 'orderDetailById' for this orderMasterId
			// This ensures data refresh even if page/size parameters don't match exactly
			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderMasterId],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
