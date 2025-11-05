import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachinePartUseInfo } from '@primes/services/machine/machinePartUseInfoService';
import { toast } from 'sonner';

export const useDeleteMachinePartUseInfo = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteMachinePartUseInfo(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo-field'],
			});
			toast.success('설비 예비부품 사용내역 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine PartUseInfo:', error);
			toast.error('설비 예비부품 사용내역 삭제에 실패했습니다.');
		},
	});
};
