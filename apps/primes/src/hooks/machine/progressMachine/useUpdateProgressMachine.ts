import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgressMachine } from '@primes/services/machine/progressMachineService';
import { progressMachineKeys } from './keys';
import { ProgressMachineUpdateRequest } from '@primes/types/progressMachine';

export const useUpdateProgressMachine = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: ProgressMachineUpdateRequest;
		}) => {
			return updateProgressMachine(id, data);
		},
		onSuccess: () => {
			// 캐시 무효화
			qc.invalidateQueries({ queryKey: progressMachineKeys.all });
		},
	});
};
