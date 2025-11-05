import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachinePartOrder } from '@primes/services/machine/machinePartOrderService';
import { toast } from 'sonner';

export const useDeleteMachinePartOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteMachinePartOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder'],
			});
			toast.success('설비 예비부품 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine part:', error);
			toast.error('설비 예비부품 삭제에 실패했습니다.');
		},
	});
};
