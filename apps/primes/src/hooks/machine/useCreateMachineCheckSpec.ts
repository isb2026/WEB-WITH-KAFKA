import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachineCheckSpec } from '@primes/services/machine/machineCheckSpecService';
import type { CreateMachineCheckSpecPayload } from '@primes/types/machine/machineCheckSpec';

export const useCreateMachineCheckSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMachineCheckSpecPayload) =>
			createMachineCheckSpec(data),
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
			console.error('기계 검사 기준 등록 실패:', error);
		},
	});
};
