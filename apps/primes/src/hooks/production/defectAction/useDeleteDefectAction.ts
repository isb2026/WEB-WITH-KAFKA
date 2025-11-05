import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDefectAction } from '@primes/services/production/defectActionService';
import { toast } from 'sonner';

export const useDeleteDefectAction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteDefectAction(ids),
		onSuccess: (data, variables) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['defectActions'],
			});
			
			// 단일 항목 캐시도 무효화
			variables.forEach(id => {
				queryClient.invalidateQueries({
					queryKey: ['defectAction', id],
				});
			});
			
			// 성공 메시지
			const message = variables.length === 1 
				? '불량 처리 기록이 삭제되었습니다.'
				: `${variables.length}개의 불량 처리 기록이 삭제되었습니다.`;
			toast.success(message);
		},
		onError: (error: Error) => {
			// 에러 메시지
			toast.error(error.message || '불량 처리 기록 삭제에 실패했습니다.');
		},
	});
}; 