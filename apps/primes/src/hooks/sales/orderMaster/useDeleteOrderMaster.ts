import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrderMaster } from '@primes/services/sales/orderService';
import { toast } from 'sonner';

export const useDeleteOrderMaster = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteOrderMaster(ids),
		onSuccess: () => {
			toast.success('주문이 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['orderMaster'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
