import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachine } from '@primes/services/machine/machineService';
import { toast } from 'sonner';

export const useDeleteMachine = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deleteMachine(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Machine'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Machine-field'],
			});
			toast.success('설비 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine :', error);
			toast.error('설비 삭제에 실패했습니다.');
		},
	});
};
