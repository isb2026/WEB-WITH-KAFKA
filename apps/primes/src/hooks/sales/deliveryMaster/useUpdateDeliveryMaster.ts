import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDeliveryMaster } from '@primes/services/sales/deliveryService';
import { UpdateDeliveryMasterPayload } from '@primes/types/sales';
import { toast } from 'sonner';

export const useUpdateDeliveryMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateDeliveryMasterPayload;
		}) => updateDeliveryMaster(id, data),
		onSuccess: () => {
			toast.success('납품이 수정되었습니다.');
			// Invalidate all deliveryMaster queries to refresh all pages including byId queries
			queryClient.invalidateQueries({
				queryKey: ['deliveryMaster', page, size],
			});
		},
		onError: (error: Error) => {
			toast.error(`납품 수정 실패: ${error.message}`);
		},
	});
};
