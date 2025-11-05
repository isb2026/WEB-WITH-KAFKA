import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccount } from '@esg/services';

export const useDeleteAccount = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteAccount(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					['accounts'].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			alert(error);
		},
	});
};
