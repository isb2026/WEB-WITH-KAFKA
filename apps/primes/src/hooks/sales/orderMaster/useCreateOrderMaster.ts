import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrderMaster } from '@primes/services/sales/orderService';
import { CreateOrderMasterPayload, OrderMaster } from '@primes/types/sales/orderMaster';
import { toast } from 'sonner';

export const useCreateOrderMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<OrderMaster, Error, CreateOrderMasterPayload>({
		mutationFn: (data) => createOrderMaster(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['orderMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
