import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommandProgress } from '@primes/services/production/commandProgressService';
import { CommandProgressCreateRequest, CommonResponseListCommandProgressDto } from '@primes/types/production/commandProgressTypes';
import { toast } from 'sonner';

export const useCreateCommandProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<CommonResponseListCommandProgressDto, Error, CommandProgressCreateRequest[]>({
		mutationFn: (data) => createCommandProgress(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['commandProgress'],
			});
			toast.success('공정 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating command progress:', error);
			toast.error('공정 등록에 실패했습니다.');
		},
	});
}; 