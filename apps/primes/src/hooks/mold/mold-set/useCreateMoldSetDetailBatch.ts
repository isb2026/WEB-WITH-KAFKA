import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldSetDetailBatch } from '@primes/services/mold/moldSetService';

export const useCreateMoldSetDetailBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createMoldSetDetailBatch,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['moldSet'] });
			queryClient.invalidateQueries({ queryKey: ['moldSetDetail'] });
		},
	});
};