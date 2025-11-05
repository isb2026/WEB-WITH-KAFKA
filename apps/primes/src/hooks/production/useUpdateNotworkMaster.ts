import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotworkMaster } from '@primes/services/production/notworkService';
import { UpdateNotworkMasterPayload } from '@primes/types/production/notwork';

/**
 * 비가동 Master 수정 전용 Atomic Hook
 */
export const useUpdateNotworkMaster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateNotworkMasterPayload;
		}) => updateNotworkMaster(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['notwork-master'] });
			queryClient.invalidateQueries({ queryKey: ['notwork-master', id] });
			queryClient.invalidateQueries({
				queryKey: ['notwork-master-fields'],
			});
		},
	});
};
