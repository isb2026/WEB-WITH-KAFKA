import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncomingMaster } from '@primes/services/purchase/incomingMasterService';
import { CreateIncomingMasterPayload } from '@primes/types/purchase/incomingMaster';
import { toast } from 'sonner';

type CreateIncomingMasterInput = { data: Partial<CreateIncomingMasterPayload> };

export const useCreateIncomingMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, CreateIncomingMasterInput>({
		mutationFn: ({ data }) => createIncomingMaster(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['IncomingMaster', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
