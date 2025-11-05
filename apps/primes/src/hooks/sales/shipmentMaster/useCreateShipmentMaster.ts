import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShipmentMaster } from '@primes/services/sales/shipmentMasterService';
import {
	CreateShipmentMasterPayload,
	ShipmentMaster,
} from '@primes/types/sales/shipmentMaster';
import { toast } from 'sonner';

type CreateShipmentInput = { data: CreateShipmentMasterPayload };

export const useCreateShipmentMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<ShipmentMaster, Error, CreateShipmentInput>({
		mutationFn: ({ data }) => createShipmentMaster(data),
		onSuccess: () => {
			toast.success('생성이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShipmentMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
