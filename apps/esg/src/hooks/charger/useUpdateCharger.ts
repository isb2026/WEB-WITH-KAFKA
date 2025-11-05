import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCharger } from '@esg/services/chargerService';

export const useUpdateCharger = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, any>({
		mutationFn: ({ id, data }) => updateCharger({ id, data }),
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
