import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachineRepair } from '@primes/services/machine/machineRepairService';
import type { CreateMachineRepairPayload } from '@primes/types/machine';

export const useCreateMachineRepair = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMachineRepairPayload) =>
			createMachineRepair(data),
		onSuccess: () => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['machine-repairs'] });
			queryClient.invalidateQueries({
				queryKey: ['machine-repair-fields'],
			});
		},
		onError: (error) => {
			console.error('설비 수리 등록 실패:', error);
		},
	});
};
