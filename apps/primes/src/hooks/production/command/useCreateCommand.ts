import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommand } from '@primes/services/production/commandService';
import { CreateCommandPayload, Command } from '@primes/types/production';
import { toast } from 'sonner';

export const useCreateCommand = () => {
	const queryClient = useQueryClient();

	return useMutation<Command, Error, CreateCommandPayload[]>({
		mutationFn: (data) => createCommand(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Command'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Command-field'],
			});
			toast.success('생산 계획 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine part:', error);
			toast.error('생산 계획 등록에 실패했습니다.');
		},
	});
};
