import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShipmentDetail } from '@primes/services/sales/shipmentDetailService';
import { toast } from 'sonner';

type UpdateShipmentDetailInput = {
	id: number;
	data: any;
};

export const useUpdateShipmentDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateShipmentDetailInput>({
		mutationFn: ({ data }) => updateShipmentDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 업데이트 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShipmentDetail'],
			});
			queryClient.invalidateQueries({
				queryKey: ['ShipmentDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
