import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorkingUser } from '@primes/services/production';

export const useDeleteWorkingUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteWorkingUser(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['working-user'] });
			queryClient.invalidateQueries({
				queryKey: ['working-user-fields'],
			});
		},
	});
};
