import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIncomingDetail } from '@primes/services/purchase/incomingDetailService';
import { UpdateIncomingDetailPayload } from '@primes/types/purchase/incomingDetail';
import { toast } from 'sonner';

type UpdateIncomingDetailInput = {
	id: number;
	data: Partial<UpdateIncomingDetailPayload>;
};

export const useUpdateIncomingDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateIncomingDetailInput>({
		mutationFn: ({ id, data }) => updateIncomingDetail(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
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
