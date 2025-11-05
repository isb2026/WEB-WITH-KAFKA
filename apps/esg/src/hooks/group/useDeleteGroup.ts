import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteGroup } from '@esg/services';

export const useDeleteGroup = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteGroup(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['group', 'groupList', 'groupTree'].some((key) =>
						query.queryKey.includes(key)
					),
			});
		},
		onError: (error) => {
			// Error handling moved to component level with useDeleteSnackbarWithTransition
		},
	});
};
