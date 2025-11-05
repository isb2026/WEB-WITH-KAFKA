import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotworkDetail } from '@primes/services/production/notworkService';
import { UpdateNotworkDetailPayload } from '@primes/types/production/notwork';

/**
 * 비가동 Detail 수정 전용 Atomic Hook
 */
export const useUpdateNotworkDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateNotworkDetailPayload;
		}) => updateNotworkDetail(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['notwork-detail'] });
			queryClient.invalidateQueries({ queryKey: ['notwork-detail', id] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-detail-fields'],
			});
		},
	});
};
