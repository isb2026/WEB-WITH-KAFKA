import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldSet } from '@primes/services/mold/moldSetService';

export const useCreateMoldSet = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createMoldSet,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['moldSet'] });
		},
	});
};