import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstimateMaster } from '@primes/services/sales/estimateMasterService';
import { CreateEstimateMasterPayload } from '@primes/types/sales/estimateMaster';
import { toast } from 'sonner';

type CreateEstimateInput = { data: Partial<CreateEstimateMasterPayload> };

export const useCreateEstimateMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		Partial<CreateEstimateMasterPayload>,
		Error,
		CreateEstimateInput
	>({
		mutationFn: ({ data }) => createEstimateMaster(data),
		onSuccess: () => {
			toast.success('생성이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['EstimateMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
