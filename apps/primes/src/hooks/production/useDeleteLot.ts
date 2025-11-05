import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLot } from '@primes/services/production/lotService';

export const useDeleteLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => deleteLot(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lots'] });
		},
	});
};
