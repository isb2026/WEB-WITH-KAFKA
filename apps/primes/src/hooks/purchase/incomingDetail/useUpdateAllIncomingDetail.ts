import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAllIncomingDetail } from '@primes/services/purchase/incomingDetailService';
import { UpdateIncomingDetailPayload } from '@primes/types/purchase/incomingDetail';

export const useUpdateAllIncomingDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateIncomingDetailPayload[]) => updateAllIncomingDetail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['incomingDetailList', page, size],
			});
		},
	});
};
