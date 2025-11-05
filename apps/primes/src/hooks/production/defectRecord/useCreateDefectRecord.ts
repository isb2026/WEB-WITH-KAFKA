import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDefectRecord } from '@primes/services/production/defectRecordService';
import { DefectRecordCreateRequest, CommonResponseListDefectRecordDto } from '@primes/types/production/defectTypes';
import { toast } from 'sonner';

export const useCreateDefectRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<CommonResponseListDefectRecordDto, Error, DefectRecordCreateRequest[]>({
		mutationFn: (data) => createDefectRecord(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['DefectRecord'],
			});
			queryClient.invalidateQueries({
				queryKey: ['DefectRecord-field'],
			});
			toast.success('불량 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating defect record:', error);
			toast.error('불량 등록에 실패했습니다.');
		},
	});
};
