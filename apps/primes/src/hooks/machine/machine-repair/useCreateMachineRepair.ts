import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachineRepair } from '@primes/services/machine/machineRepairService';
import { CreateMachineRepairPayload, MachineRepair } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachineRepair = () => {
	const queryClient = useQueryClient();

	return useMutation<MachineRepair, Error, CreateMachineRepairPayload | CreateMachineRepairPayload[]>({
		mutationFn: (data) => createMachineRepair(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachineRepair-field'],
			});
			toast.success('설비 예비부품 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine repair:', error);
			toast.error('설비 예비부품 등록에 실패했습니다.');
		},
	});
};
