import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachine } from '@primes/services/machine/machineService';
import { CreateMachinePayload, Machine } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachine = () => {
	const queryClient = useQueryClient();

	return useMutation<Machine, Error, CreateMachinePayload[]>({
		mutationFn: (data) => createMachine(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['Machine'],
			});
			queryClient.invalidateQueries({
				queryKey: ['Machine-field'],
			});
			toast.success('설비 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine :', error);
			toast.error('설비 등록에 실패했습니다.');
		},
	});
};