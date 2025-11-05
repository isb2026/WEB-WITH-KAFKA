import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldOrderDetail } from '@primes/services/mold/moldOrderDetailService';
import {
	MoldOrderDetailDto,
	MoldOrderDetailCreateRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldOrderDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		MoldOrderDetailDto[],
		Error,
		MoldOrderDetailCreateRequest[]
	>({
		mutationFn: (data) => createMoldOrderDetail(data),
		onSuccess: (data, variables) => {
			toast.success('성공적으로 등록 되었습니다.');
			
			// 기존 쿼리 무효화 (범위 축소)
			queryClient.invalidateQueries({
				queryKey: ['moldOrderDetail', page, size],
			});
			
			// 특정 마스터 ID에 대한 쿼리만 무효화 (추가)
			if (variables && variables.length > 0 && variables[0].moldOrderMasterId) {
				queryClient.invalidateQueries({
					queryKey: ['mold-order-detail-by-master', variables[0].moldOrderMasterId],
				});
			}
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
