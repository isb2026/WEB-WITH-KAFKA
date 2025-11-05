import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMeter } from '@esg/services';

export const useDeleteMeter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteMeter(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meter', 'list'] });
			queryClient.invalidateQueries({ queryKey: ['meter-fields'] });
		},
	});
};
