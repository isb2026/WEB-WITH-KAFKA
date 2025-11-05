import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShipmentDetail } from '@primes/services/sales/shipmentDetailService';
import { toast } from 'sonner';

type DeleteShipmentDetailInput = number[];

export const useDeleteShipmentDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteShipmentDetailInput>({
		mutationFn: (ids) => deleteShipmentDetail(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
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
