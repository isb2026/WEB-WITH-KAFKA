import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWorkingUser } from '@primes/services/production';
import { UpdateWorkingUserPayload } from '@primes/types/production';

export const useUpdateWorkingUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateWorkingUserPayload;
		}) => updateWorkingUser(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['working-user'] });
			queryClient.invalidateQueries({ queryKey: ['working-user', id] });
			queryClient.invalidateQueries({
				queryKey: ['working-user-fields'],
			});
		},
	});
};
