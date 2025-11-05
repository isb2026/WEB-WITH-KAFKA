import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDefectAction } from '@primes/services/production/defectActionService';
import { CommonResponseListDefectActionDto, DefectActionCreateRequest } from '@primes/types/production/defectTypes';
import { toast } from 'sonner';

export const useCreateDefectAction = () => {
	const queryClient = useQueryClient();

	return useMutation<CommonResponseListDefectActionDto, Error, DefectActionCreateRequest[]>({
		mutationFn: (data) => createDefectAction(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['DefectAction'],
			});
			queryClient.invalidateQueries({
				queryKey: ['DefectAction-field'],
			});
			toast.success('불량 처리가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating defect action:', error);
			toast.error('불량 처리에 실패했습니다.');
		},
	});
};
