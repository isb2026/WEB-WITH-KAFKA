import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIncomingMaster } from '@primes/services/purchase/incomingMasterService';
import { UpdateIncomingMasterPayload } from '@primes/types/purchase/incomingMaster';
import { toast } from 'sonner';

type UpdateIncomingMasterInput = {
	id: number;
	data: Partial<UpdateIncomingMasterPayload>;
};

export const useUpdateIncomingMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateIncomingMasterInput>({
		mutationFn: ({ id, data }) => updateIncomingMaster(id, data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['IncomingMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
