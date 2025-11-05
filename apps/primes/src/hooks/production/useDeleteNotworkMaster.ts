import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotworkMaster } from '@primes/services/production/notworkService';

/**
 * 비가동 Master 삭제 전용 Atomic Hook
 */
export const useDeleteNotworkMaster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteNotworkMaster(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-master'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-master-fields'],
			});
		},
	});
};
