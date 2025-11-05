import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldOrderDetail } from '@primes/services/mold/moldOrderDetailService';
import { MoldOrderDetailDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldOrderDetail = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldOrderDetailDto, Error, { id: number; data: Partial<MoldOrderDetailDto> }>({
		mutationFn: ({ id, data }) => updateMoldOrderDetail(id, data),
		onSuccess: (result, { id, data }) => {
			toast.success('성공적으로 수정 되었습니다.');
			
			// 기존 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['moldOrderDetail'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldOrderDetail', id],
			});
			
			// 특정 마스터 ID에 대한 쿼리만 무효화 (추가)
			if (data.moldOrderMasterId) {
				queryClient.invalidateQueries({
					queryKey: ['mold-order-detail-by-master', data.moldOrderMasterId],
				});
			}
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 