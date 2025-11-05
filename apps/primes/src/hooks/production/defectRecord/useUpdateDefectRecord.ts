import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDefectRecord } from '@primes/services/production/defectRecordService';
import type { DefectRecordUpdateRequest } from '@primes/types/production/defectTypes';
import { toast } from 'sonner';

export const useUpdateDefectRecord = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: DefectRecordUpdateRequest }) => 
			updateDefectRecord(id, data),
		onSuccess: (data, variables) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['defectRecords'],
			});
			queryClient.invalidateQueries({
				queryKey: ['defectRecord', variables.id],
			});
			
			// 성공 메시지
			toast.success('불량 기록이 수정되었습니다.');
		},
		onError: (error: Error) => {
			// 에러 메시지
			toast.error(error.message || '불량 기록 수정에 실패했습니다.');
		},
	});
}; 