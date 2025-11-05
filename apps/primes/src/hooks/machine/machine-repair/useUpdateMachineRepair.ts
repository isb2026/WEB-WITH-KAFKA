import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachineRepair } from '@primes/services/machine/machineRepairService';
import { UpdateMachineRepairPayload, MachineRepair } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachineRepair = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachineRepair,
		Error,
		{ id: number; data: UpdateMachineRepairPayload }
	>({
		mutationFn: ({ id, data }) => updateMachineRepair(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair-field'],
			});
			toast.success('설비 예비 부품 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine repair:', error);
			toast.error('설비 예비 부품 수정에 실패했습니다.');
		},
	});
};
