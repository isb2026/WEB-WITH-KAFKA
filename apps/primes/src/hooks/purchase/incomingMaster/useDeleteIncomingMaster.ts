import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIncomingMaster } from '@primes/services/purchase/incomingMasterService';
import { toast } from 'sonner';

type DeleteIncomingMasterInput = { ids: number[] };

export const useDeleteIncomingMaster = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteIncomingMasterInput>({
		mutationFn: async ({ ids }) => {
			await deleteIncomingMaster(ids);
		},
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['IncomingMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
