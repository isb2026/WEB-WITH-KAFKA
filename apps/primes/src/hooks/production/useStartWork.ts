import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startWork } from '@primes/services/production/workingService';

export const useStartWork = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => startWork(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['working'] });
			queryClient.invalidateQueries({ queryKey: ['working', id] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
		},
	});
};
