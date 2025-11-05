import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlan } from '@primes/services/production/planService';
import { UpdatePlanPayload, Plan } from '@primes/types/production';
import { toast } from 'sonner';

export const useUpdatePlan = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Plan,
		Error,
		{ id: number; data: UpdatePlanPayload }
	>({
		mutationFn: ({ id, data }) => updatePlan(id, data),
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({
				queryKey: ['Plan'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Plan', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['Plan-field'],
			});
			toast.success('생산 계획 수정이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error updating plan:', error);
			toast.error('생산 계획 수정에 실패했습니다.');
		},
	});
};
