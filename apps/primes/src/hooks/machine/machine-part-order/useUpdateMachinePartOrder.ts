import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachinePartOrder } from '@primes/services/machine/machinePartOrderService';
import { UpdateMachinePartOrderPayload, MachinePartOrder } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachinePartOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachinePartOrder,
		Error,
		{ id: number; data: UpdateMachinePartOrderPayload }
	>({
		mutationFn: ({ id, data }) => updateMachinePartOrder(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder-field'],
			});
			toast.success('설비 예비 부품 발주 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine part:', error);
			toast.error('설비 예비 부품 발주 수정에 실패했습니다.');
		},
	});
};
