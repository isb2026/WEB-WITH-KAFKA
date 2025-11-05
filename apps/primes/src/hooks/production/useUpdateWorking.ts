import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	updateWorking,
	CreateWorkingPayload,
} from '@primes/services/production/workingService';

export const useUpdateWorking = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<CreateWorkingPayload>;
		}) => updateWorking(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['working'] });
			queryClient.invalidateQueries({ queryKey: ['working', id] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
		},
	});
};
