import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDataRequest } from '@esg/services/requestService';
import { CreateDataRequestPayload } from '@esg/types/request';

export const useCreateDataRequest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateDataRequestPayload) => createDataRequest(data),
		onSuccess: () => {
			console.log('onSuccess');
			queryClient.invalidateQueries({
				queryKey: ['data-request', 'list'],
			});
		},
	});
};
