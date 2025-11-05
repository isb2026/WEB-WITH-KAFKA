import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachinePartOrderIn } from '@primes/services/machine/machinePartOrderInService';
import { UpdateMachinePartPayload, MachinePartOrderIn } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachinePartOrderIn = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachinePartOrderIn,
		Error,
		{ id: number; data: UpdateMachinePartPayload }
	>({
		mutationFn: ({ id, data }) => updateMachinePartOrderIn(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn-field'],
			});
			toast.success('설비 예비 부품 입고 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine part:', error);
			toast.error('설비 예비 부품 입고 수정에 실패했습니다.');
		},
	});
};
