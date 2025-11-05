import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachinePartRelation } from '@primes/services/machine/machinePartRelationService';
import { UpdateMachinePartRelationPayload, MachinePartRelation } from '@primes/types/machine';
import { toast } from 'sonner';

export const useUpdateMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation<
		MachinePartRelation,
		Error,
		{ id: number; data: UpdateMachinePartRelationPayload }
	>({
		mutationFn: ({ id, data }) => updateMachinePartRelation(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation-field'],
			});
			toast.success('설비 예비 부품 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating machine PartRelation:', error);
			toast.error('설비 예비 부품 수정에 실패했습니다.');
		},
	});
};
