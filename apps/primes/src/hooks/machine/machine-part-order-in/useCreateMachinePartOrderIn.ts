import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachinePartOrderIn } from '@primes/services/machine/machinePartOrderInService';
import { CreateMachinePartOrderInPayload, MachinePartOrderIn } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachinePartOrderIn = () => {
	const queryClient = useQueryClient();

	return useMutation<MachinePartOrderIn, Error, CreateMachinePartOrderInPayload | CreateMachinePartOrderInPayload[]>({
		mutationFn: (data) => createMachinePartOrderIn(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrderIn-field'],
			});
			toast.success('설비 예비부품 입고 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine part order in:', error);
			toast.error('설비 예비부품 입고 등록에 실패했습니다.');
		},
	});
};
