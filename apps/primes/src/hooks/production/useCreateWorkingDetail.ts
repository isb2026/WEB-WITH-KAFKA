import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createWorkingDetail,
	CreateWorkingDetailPayload,
} from '@primes/services/production/workingService';

export const useCreateWorkingDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<CreateWorkingDetailPayload>) =>
			createWorkingDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
			queryClient.invalidateQueries({ queryKey: ['working'] });
		},
	});
};
