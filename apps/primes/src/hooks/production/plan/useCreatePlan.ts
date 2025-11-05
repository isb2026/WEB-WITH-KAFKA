import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlan } from '@primes/services/production/planService';
import { CreatePlanPayload, Plan } from '@primes/types/production';
import { toast } from 'sonner';

export const useCreatePlan = () => {
	const queryClient = useQueryClient();

	return useMutation<Plan, Error, CreatePlanPayload[]>({
		mutationFn: (data) => createPlan(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Plan'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Plan-field'],
			});
			toast.success('생산 계획 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine part:', error);
			toast.error('생산 계획 등록에 실패했습니다.');
		},
	});
};
