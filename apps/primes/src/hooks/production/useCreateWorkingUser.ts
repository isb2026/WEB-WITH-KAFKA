import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkingUser } from '@primes/services/production';
import { CreateWorkingUserPayload } from '@primes/types/production';

export const useCreateWorkingUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateWorkingUserPayload) => createWorkingUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['working-user'] });
			queryClient.invalidateQueries({
				queryKey: ['working-user-fields'],
			});
		},
	});
};
