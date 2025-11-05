import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProgressMachine } from '@primes/services/machine/progressMachineService';
import { progressMachineKeys } from './keys';

export const useDeleteProgressMachine = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (ids: number[]) => {
			return deleteProgressMachine(ids);
		},
		onSuccess: () => {
			// 캐시 무효화
			qc.invalidateQueries({ queryKey: progressMachineKeys.all });
		},
	});
};
