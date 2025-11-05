import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldOrderDetail } from '@primes/services/mold/moldOrderDetailService';
import { toast } from 'sonner';

export const useDeleteMoldOrderDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldOrderDetail(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			
			// 기존 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['moldOrderDetail'],
			});
			
			// 모든 mold-order-detail-by-master 쿼리 무효화 (삭제의 경우 어떤 마스터인지 알기 어려우므로)
			queryClient.invalidateQueries({
				queryKey: ['mold-order-detail-by-master'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
