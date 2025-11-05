import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLot } from '@primes/services/production/lotService';
import { UpdateLotPayload } from '@primes/types/production';

export const useUpdateLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateLotPayload }) =>
			updateLot(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['lots'] });
			queryClient.invalidateQueries({ queryKey: ['lot', id] });
		},
	});
};
