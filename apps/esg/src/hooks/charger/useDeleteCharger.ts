import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCharger } from '@esg/services/chargerService';

export const useDeleteCharger = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteCharger(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					[
						'chargerList',
						'chargerDetail',
					].some((key) => query.queryKey.includes(key)),
			});
		},
		onError: (error) => {
			// Error handling moved to component level
		},
	});
};
