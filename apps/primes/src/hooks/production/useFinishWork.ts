import { useMutation, useQueryClient } from '@tanstack/react-query';
import { finishWork } from '@primes/services/production/workingService';

export const useFinishWork = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => finishWork(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['working'] });
			queryClient.invalidateQueries({ queryKey: ['working', id] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
		},
	});
};
