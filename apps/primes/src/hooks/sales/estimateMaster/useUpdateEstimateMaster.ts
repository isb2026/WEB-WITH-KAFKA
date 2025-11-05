import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEstimateMaster } from '@primes/services/sales/estimateMasterService';
import { UpdateEstimateMasterPayload } from '@primes/types/sales/estimateMaster';
import { toast } from 'sonner';

type UpdateEstimateInput = {
	id: number;
	data: Partial<UpdateEstimateMasterPayload>;
};

export const useUpdateEstimateMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateEstimateInput>({
		mutationFn: ({ id, data }) => updateEstimateMaster(id, data),
		onSuccess: (_, { id }) => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['EstimateMaster', page, size],
			});
			queryClient.invalidateQueries({
				queryKey: ['EstimateMaster', 'byId', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
