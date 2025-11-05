import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProgressMachine } from '@primes/services/machine/progressMachineService';
import { progressMachineKeys } from './keys';
import { ProgressMachineCreateRequest } from '@primes/types/progressMachine';

export const useCreateProgressMachine = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (dataList: ProgressMachineCreateRequest[]) => {
			return createProgressMachine(dataList);
		},
		onSuccess: () => {
			// 캐시 무효화
			qc.invalidateQueries({ queryKey: progressMachineKeys.all });
		},
	});
};
