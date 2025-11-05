import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShipmentMaster } from '@primes/services/sales/shipmentMasterService';
import { toast } from 'sonner';

export const useDeleteShipmentMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteShipmentMaster(ids),
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShipmentMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
