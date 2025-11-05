import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMachineCheckSpec } from '@primes/services/machine/machineCheckSpecService';
import type { UpdateMachineCheckSpecPayload } from '@primes/types/machine/machineCheckSpec';

export const useUpdateMachineCheckSpec = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<UpdateMachineCheckSpecPayload>;
		}) => updateMachineCheckSpec(id, data),
		onSuccess: (_, { id }) => {
			// 관련된 모든 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: ['machine-check-specs'],
			});
			queryClient.invalidateQueries({
				queryKey: ['machine-check-spec', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['machine-check-spec-fields'],
			});
		},
		onError: (error) => {
			console.error('기계 검사 기준 수정 실패:', error);
		},
	});
};
