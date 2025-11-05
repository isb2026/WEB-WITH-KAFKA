import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIncomingDetail } from '@primes/services/purchase/incomingDetailService';
import { toast } from 'sonner';

type DeleteIncomingDetailInput = { ids: number[] };

export const useDeleteIncomingDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteIncomingDetailInput>({
		mutationFn: ({ ids }) => deleteIncomingDetail(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['IncomingDetail', page, size],
			});
			queryClient.invalidateQueries({
				queryKey: ['IncomingDetail', 'byMasterId'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
