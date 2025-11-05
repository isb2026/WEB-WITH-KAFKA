import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachineRepair } from '@primes/services/machine/machineRepairService';
import { toast } from 'sonner';

export const useDeleteMachineRepair = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteMachineRepair(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair-field'],
			});
			toast.success('설비 수리 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine repair:', error);
			toast.error('설비 수리 삭제에 실패했습니다.');
		},
	});
};
