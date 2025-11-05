import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlan } from '@primes/services/production/planService';
import { toast } from 'sonner';

export const useDeletePlan = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number[]>({
		mutationFn: (ids) => deletePlan(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Plan'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Plan-field'],
			});
			toast.success('생산 계획 삭제가 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error deleting machine part:', error);
			toast.error('생산 계획 삭제에 실패했습니다.');
		},
	});
};
