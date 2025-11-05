import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrderDetail } from '@primes/services/sales/orderService';
import { toast } from 'sonner';

export const useDeleteOrderDetail = (
	orderId: number,
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteOrderDetail(ids),
		onSuccess: () => {
			toast.success('주문 상세가 삭제되었습니다.');
			
			// Invalidate specific query
			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderId, page, size],
			});
			
			// Also invalidate any queries that might be related to this order
			queryClient.invalidateQueries({
				queryKey: ['orderDetailById', orderId],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
