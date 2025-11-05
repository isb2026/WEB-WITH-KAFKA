import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeter } from '@esg/services';
import { Meter } from '@esg/types/meter';

export const useCreateMeter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Meter>) => createMeter(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meter', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['meter-fields'] });
		},
	});
};
