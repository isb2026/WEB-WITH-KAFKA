import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDeliveryMaster } from '@primes/services/sales/deliveryService';
import { toast } from 'sonner';

export const useDeleteDeliveryMaster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteDeliveryMaster(ids),
		onSuccess: () => {
			toast.success('납품이 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['deliveryMaster'],
			});
		},
		onError: (error: Error) => {
			toast.error(`납품 삭제 실패: ${error.message}`);
		},
	});
};
