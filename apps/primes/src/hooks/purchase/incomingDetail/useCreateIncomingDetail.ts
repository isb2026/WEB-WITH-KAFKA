import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncomingDetail } from '@primes/services/purchase/incomingDetailService';
import { CreateIncomingDetailPayload } from '@primes/types/purchase/incomingDetail';
import { toast } from 'sonner';

type CreateIncomingDetailInput = { data: Partial<CreateIncomingDetailPayload> };

export const useCreateIncomingDetail = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateIncomingDetailInput>({
		mutationFn: ({ data }) => createIncomingDetail(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
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
