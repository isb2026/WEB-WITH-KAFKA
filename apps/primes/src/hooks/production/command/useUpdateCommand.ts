import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommand } from '@primes/services/production/commandService';
import { UpdateCommandPayload, Command } from '@primes/types/production';
import { toast } from 'sonner';

export const useUpdateCommand = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Command,
		Error,
		{ id: number; data: UpdateCommandPayload }
	>({
		mutationFn: ({ id, data }) => updateCommand(id, data),
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['Command'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Command', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['Command-field'],
			});
			toast.success('생산 계획 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating command:', error);
			toast.error('생산 계획 수정에 실패했습니다.');
		},
	});
};
