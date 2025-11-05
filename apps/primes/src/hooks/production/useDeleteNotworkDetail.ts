import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotworkDetail } from '@primes/services/production/notworkService';

/**
 * 비가동 Detail 삭제 전용 Atomic Hook
 */
export const useDeleteNotworkDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteNotworkDetail(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notwork-detail'] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-detail-fields'],
			});
		},
	});
};
