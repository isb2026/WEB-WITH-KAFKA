import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderMaster } from '@primes/services/sales/orderService';
import { UpdateOrderMasterPayload, OrderMaster } from '@primes/types/sales/orderMaster';
import { toast } from 'sonner';

type UpdateOrderMasterInput = { id: number; data: UpdateOrderMasterPayload };

export const useUpdateOrderMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<OrderMaster, Error, UpdateOrderMasterInput, void>({
		mutationFn: ({ id, data }) => updateOrderMaster(id, data),
		onSuccess: () => {
			toast.success('주문이 수정되었습니다.');
			// Invalidate all orderMaster queries to refresh all pages
			queryClient.invalidateQueries({
				queryKey: ['orderMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
