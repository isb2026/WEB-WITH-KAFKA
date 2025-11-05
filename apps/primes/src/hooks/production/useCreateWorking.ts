import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createWorking,
	CreateWorkingPayload,
} from '@primes/services/production/workingService';

export const useCreateWorking = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<CreateWorkingPayload>) =>
			createWorking(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['working'] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
		},
	});
};
