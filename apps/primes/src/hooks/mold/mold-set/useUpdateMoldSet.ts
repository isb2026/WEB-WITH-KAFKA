import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldSet } from '@primes/services/mold/moldSetService';

export const useUpdateMoldSet = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateMoldSet(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['moldSet'] });
		},
	});
};