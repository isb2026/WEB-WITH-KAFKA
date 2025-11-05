import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShippingRequestMaster } from '@primes/services/sales/shippingRequestMasterService';
import { UpdateShippingRequestMasterPayload } from '@primes/types/sales/shippingRequestMaster';
import { toast } from 'sonner';

type UpdateShippingRequestInput = {
	id: number;
	data: Partial<UpdateShippingRequestMasterPayload>;
};

export const useUpdateShippingRequestMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateShippingRequestInput>({
		mutationFn: ({ id, data }) => updateShippingRequestMaster(id, data),
		onSuccess: () => {
			toast.success('배송 요청 마스터가 성공적으로 업데이트되었습니다.');
			// Invalidate all shippingRequestMaster queries to refresh all pages including byId queries
			queryClient.invalidateQueries({
				queryKey: ['shippingRequestMaster'],
			});
		},
		onError: (error) => {
			toast.error(`배송 요청 마스터 업데이트 실패: ${error.message}`);
		},
	});
};
