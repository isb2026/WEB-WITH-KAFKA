import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachinePartRelation } from '@primes/services/machine/machinePartRelationService';
import { CreateMachinePartRelationPayload, MachinePartRelation } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation<MachinePartRelation, Error, CreateMachinePartRelationPayload | CreateMachinePartRelationPayload[]>({
		mutationFn: (data) => createMachinePartRelation(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation-field'],
			});
			toast.success('설비 예비부품 연동 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine PartRelation:', error);
			toast.error('설비 예비부품 연동 등록에 실패했습니다.');
		},
	});
};
