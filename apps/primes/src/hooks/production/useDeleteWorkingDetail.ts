import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorkingDetail } from '@primes/services/production/workingService';

export const useDeleteWorkingDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteWorkingDetail(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
			queryClient.invalidateQueries({ queryKey: ['working'] });
		},
	});
};
