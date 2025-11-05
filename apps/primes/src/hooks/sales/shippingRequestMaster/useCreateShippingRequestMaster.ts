import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShippingRequestMaster } from '@primes/services/sales/shippingRequestMasterService';
import {
	CreateShippingRequestMasterPayload,
	ShippingRequestMaster,
} from '@primes/types/sales/shippingRequestMaster';
import { toast } from 'sonner';

export const useCreateShippingRequestMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		ShippingRequestMaster,
		Error,
		CreateShippingRequestMasterPayload
	>({
		mutationFn: (data) => createShippingRequestMaster(data),
		onSuccess: () => {
			toast.success('배송 요청 마스터가 성공적으로 생성되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['ShippingRequestMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(`배송 요청 마스터 생성 실패: ${error.message}`);
		},
	});
};
