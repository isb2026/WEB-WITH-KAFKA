import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	updateWorkingDetail,
	CreateWorkingDetailPayload,
} from '@primes/services/production/workingService';

export const useUpdateWorkingDetail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<CreateWorkingDetailPayload>;
		}) => updateWorkingDetail(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['workingDetail'] });
			queryClient.invalidateQueries({ queryKey: ['workingDetail', id] });
			queryClient.invalidateQueries({ queryKey: ['working'] });
		},
	});
};
