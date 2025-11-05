import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDefectRecord } from '@primes/services/production/defectRecordService';
import { toast } from 'sonner';

export const useDeleteDefectRecord = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteDefectRecord(ids),
		onSuccess: (data, variables) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['defectRecords'],
			});
			
			// 단일 항목 캐시도 무효화
			variables.forEach(id => {
				queryClient.invalidateQueries({
					queryKey: ['defectRecord', id],
				});
			});
			
			// 성공 메시지
			const message = variables.length === 1 
				? '불량 기록이 삭제되었습니다.'
				: `${variables.length}개의 불량 기록이 삭제되었습니다.`;
			toast.success(message);
		},
		onError: (error: Error) => {
			// 에러 메시지
			toast.error(error.message || '불량 기록 삭제에 실패했습니다.');
		},
	});
}; 