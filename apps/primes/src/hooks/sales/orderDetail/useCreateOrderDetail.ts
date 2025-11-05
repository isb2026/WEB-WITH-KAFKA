import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrderDetail } from '@primes/services/sales/orderService';
import { CreateOrderDetailPayload } from '@primes/types/sales/orderDetail';
import { toast } from 'sonner';

export const useCreateOrderDetail = (
	orderMasterId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateOrderDetailPayload[]>({
		mutationFn: (data) => createOrderDetail(data),
		onSuccess: () => {
			toast.success('주문 상세가 생성되었습니다.');

			// Invalidate the specific query
			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderMasterId, page, size],
			});

			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderMasterId],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
