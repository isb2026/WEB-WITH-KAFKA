import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShippingRequestDetail } from '@primes/services/sales/shippingRequestDetailService';
import { toast } from 'sonner';

type DeleteShippingRequestDetailInput = { ids: number[] };

export const useDeleteShippingRequestDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteShippingRequestDetailInput>({
		mutationFn: ({ ids }) => deleteShippingRequestDetail(ids),
		onSuccess: () => {
			toast.success('배송 요청 상세가 성공적으로 삭제되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['shippingRequestDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(`배송 요청 상세 삭제 실패: ${error.message}`);
		},
	});
};
