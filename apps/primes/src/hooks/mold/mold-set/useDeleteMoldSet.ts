import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldSet } from '@primes/services/mold/moldSetService';

export const useDeleteMoldSet = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteMoldSet,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['moldSet'] });
		},
	});
};