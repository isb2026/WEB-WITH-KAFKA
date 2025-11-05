import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachinePartOrderIn } from '@primes/services/machine/machinePartOrderInService';
import { toast } from 'sonner';

export const useDeleteMachinePartOrderIn = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => deleteMachinePartOrderIn(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn'],
			});
			toast.success('설비 예비부품 입고 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine part:', error);
			toast.error('설비 예비부품 입고 삭제에 실패했습니다.');
		},
	});
};
