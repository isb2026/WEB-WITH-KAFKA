import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachine } from '@primes/services/machine/machineService';
import { UpdateMachinePayload, Machine } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachine = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Machine,
		Error,
		{ id: number; data: UpdateMachinePayload }
	>({
		mutationFn: ({ id, data }) => updateMachine(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['Machine'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Machine', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['Machine-field'],
			});
			toast.success('설비 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine :', error);
			toast.error('설비 수정에 실패했습니다.');
		},
	});
};
