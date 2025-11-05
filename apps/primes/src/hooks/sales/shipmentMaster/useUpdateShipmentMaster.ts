import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShipmentMaster } from '@primes/services/sales/shipmentMasterService';
import { UpdateShipmentMasterPayload } from '@primes/types/sales/shipmentMaster';
import { toast } from 'sonner';

type UpdateShipmentInput = {
	id: number;
	data: Partial<UpdateShipmentMasterPayload>;
};

export const useUpdateShipmentMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateShipmentInput>({
		mutationFn: ({ id, data }) => updateShipmentMaster(id, data),
		onSuccess: (_, { id }) => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShipmentMaster', page, size],
			});
			queryClient.invalidateQueries({
				queryKey: ['shipmentMaster', 'byId', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
