import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachinePart } from '@primes/services/machine/machinePartService';
import { CreateMachinePartPayload, MachinePart } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachinePart = () => {
	const queryClient = useQueryClient();

	return useMutation<MachinePart, Error, CreateMachinePartPayload[]>({
		mutationFn: (data) => createMachinePart(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePart'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePart-field'],
			});
			toast.success('설비 예비부품 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine part:', error);
			toast.error('설비 예비부품 등록에 실패했습니다.');
		},
	});
};
