import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShipmentDetail } from '@primes/services/sales/shipmentDetailService';
import { toast } from 'sonner';

type CreateShipmentDetailInput = any[];

export const useCreateShipmentDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateShipmentDetailInput>({
		mutationFn: (data) => createShipmentDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			// Invalidate both the general list and byMasterId queries
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
