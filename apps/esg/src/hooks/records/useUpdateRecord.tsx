import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecord } from '@esg/services';
import { UpdateRecordPayload } from '@esg/types/record';

type UpdateRecordInput = { id: number; data: Partial<UpdateRecordPayload> };

export const useUpdateRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateRecordInput>({
		mutationFn: ({ id, data }) => updateRecord(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['records'].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
