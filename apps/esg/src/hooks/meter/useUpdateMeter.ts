import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeter } from '@esg/services';
import { Meter } from '@esg/types/meter';

export const useUpdateMeter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<Meter> }) =>
			updateMeter(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['meter', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['meter', id] });
			queryClient.invalidateQueries({ queryKey: ['meter-fields'] });
		},
	});
};
