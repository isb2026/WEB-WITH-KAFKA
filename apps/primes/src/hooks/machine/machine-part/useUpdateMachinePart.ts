import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachinePart } from '@primes/services/machine/machinePartService';
import { UpdateMachinePartPayload, MachinePart } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachinePart = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachinePart,
		Error,
		{ id: number; data: UpdateMachinePartPayload }
	>({
		mutationFn: ({ id, data }) => updateMachinePart(id, data),
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePart'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePart', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePart-field'],
			});
			toast.success('설비 예비 부품 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine part:', error);
			toast.error('설비 예비 부품 수정에 실패했습니다.');
		},
	});
};
