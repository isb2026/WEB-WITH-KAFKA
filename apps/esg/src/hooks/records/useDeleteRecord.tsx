import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecord } from '@esg/services';

export const useDeleteRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteRecord(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['records'].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {},
	});
};
