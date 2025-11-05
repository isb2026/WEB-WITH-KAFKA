import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachinePart } from '@primes/services/machine/machinePartService';
import { toast } from 'sonner';

export const useDeleteMachinePart = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteMachinePart(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePart'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePart-field'],
			});
			toast.success('설비 예비부품 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine part:', error);
			toast.error('설비 예비부품 삭제에 실패했습니다.');
		},
	});
};
