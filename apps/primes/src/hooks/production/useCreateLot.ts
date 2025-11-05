import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLot } from '@primes/services/production/lotService';
import { CreateLotPayload } from '@primes/types/production';

export const useCreateLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateLotPayload) => createLot(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lots'] });
		},
	});
};
