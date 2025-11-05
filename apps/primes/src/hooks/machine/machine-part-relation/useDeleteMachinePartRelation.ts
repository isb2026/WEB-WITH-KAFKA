import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachinePartRelation } from '@primes/services/machine/machinePartRelationService';
import { toast } from 'sonner';

export const useDeleteMachinePartRelation = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteMachinePartRelation(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartRelation-field'],
			});
			toast.success('설비 예비부품 사용내역 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine PartRelation:', error);
			toast.error('설비 예비부품 사용내역 삭제에 실패했습니다.');
		},
	});
};
