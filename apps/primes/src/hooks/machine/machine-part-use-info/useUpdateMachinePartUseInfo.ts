import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachinePartUseInfo } from '@primes/services/machine/machinePartUseInfoService';
import { UpdateMachinePartUseInfoPayload, MachinePartUseInfo } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachinePartUseInfo = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachinePartUseInfo,
		Error,
		{ id: number; data: UpdateMachinePartUseInfoPayload }
	>({
		mutationFn: ({ id, data }) => updateMachinePartUseInfo(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo-field'],
			});
			toast.success('설비 예비 부품 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine PartUseInfo:', error);
			toast.error('설비 예비 부품 수정에 실패했습니다.');
		},
	});
};
