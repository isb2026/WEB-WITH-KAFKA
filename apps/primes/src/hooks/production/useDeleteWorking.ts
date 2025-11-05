import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorking } from '@primes/services/production/workingService';

export const useDeleteWorking = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteWorking(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['working'] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
		},
	});
};
