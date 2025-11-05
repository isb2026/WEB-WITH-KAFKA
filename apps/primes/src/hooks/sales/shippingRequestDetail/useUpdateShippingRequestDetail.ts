import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShippingRequestDetail } from '@primes/services/sales/shippingRequestDetailService';
import { UpdateShippingRequestDetailPayload } from '@primes/types/sales/shippingRequestDetail';
import { toast } from 'sonner';

export const useUpdateShippingRequestDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateShippingRequestDetailPayload[];
		}) => updateShippingRequestDetail(id, data),
		onSuccess: () => {
			toast.success('배송 요청 상세가 성공적으로 업데이트되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['shippingRequestDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(`배송 요청 상세 업데이트 실패: ${error.message}`);
		},
	});
};
