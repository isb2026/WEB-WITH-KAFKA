import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstimateMaster } from '@primes/services/sales/estimateMasterService';
import { toast } from 'sonner';

type DeleteEstimateMasterInput = { ids: number[] };

export const useDeleteEstimateMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteEstimateMasterInput>({
		mutationFn: ({ ids }) => {
			return deleteEstimateMaster(ids);
		},
		onSuccess: () => {
			toast.success('삭제가 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['EstimateMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
