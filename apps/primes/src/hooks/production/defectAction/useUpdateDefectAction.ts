import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDefectAction } from '@primes/services/production/defectActionService';
import type { DefectActionUpdateRequest } from '@primes/types/production/defectTypes';
import { toast } from 'sonner';

export const useUpdateDefectAction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: DefectActionUpdateRequest }) => 
			updateDefectAction(id, data),
		onSuccess: (data, variables) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['defectActions'],
			});
			queryClient.invalidateQueries({
				queryKey: ['defectAction', variables.id],
			});
			
			// 성공 메시지
			toast.success('불량 처리 기록이 수정되었습니다.');
		},
		onError: (error: Error) => {
			// 에러 메시지
			toast.error(error.message || '불량 처리 기록 수정에 실패했습니다.');
		},
	});
}; 