import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMachineCheckSpec } from '@primes/services/machine/machineCheckSpecService';

export const useDeleteMachineCheckSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteMachineCheckSpec(id),
		onSuccess: () => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['machine-check-specs'],
			});
			queryClient.invalidateQueries({
				queryKey: ['machine-check-spec-fields'],
			});
		},
		onError: (error) => {
			console.error('기계 검사 기준 삭제 실패:', error);
		},
	});
};
