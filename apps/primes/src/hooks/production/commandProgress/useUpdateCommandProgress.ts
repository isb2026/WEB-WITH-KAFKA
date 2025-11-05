import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommandProgress } from '@primes/services/production/commandProgressService';
import { CommandProgressUpdateRequest, CommonResponseCommandProgressDto } from '@primes/types/production/commandProgressTypes';
import { toast } from 'sonner';

export const useUpdateCommandProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<CommonResponseCommandProgressDto, Error, { id: number; data: CommandProgressUpdateRequest }>({
		mutationFn: ({ id, data }) => updateCommandProgress(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['commandProgress'],
			});
			toast.success('공정 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating command progress:', error);
			toast.error('공정 수정에 실패했습니다.');
		},
	});
}; 