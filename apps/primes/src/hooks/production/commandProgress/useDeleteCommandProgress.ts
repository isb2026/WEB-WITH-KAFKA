import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommandProgress } from '@primes/services/production/commandProgressService';
import { toast } from 'sonner';

export const useDeleteCommandProgress = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteCommandProgress(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['commandProgress'],
			});
			toast.success('공정 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting command progress:', error);
			toast.error('공정 삭제에 실패했습니다.');
		},
	});
}; 