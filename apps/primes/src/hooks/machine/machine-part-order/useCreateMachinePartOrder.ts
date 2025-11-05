import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachinePartOrder } from '@primes/services/machine/machinePartOrderService';
import { CreateMachinePartOrderPayload, MachinePartOrder } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachinePartOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<MachinePartOrder, Error, CreateMachinePartOrderPayload | CreateMachinePartOrderPayload[]>({
		mutationFn: (data) => createMachinePartOrder(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartOrder-field'],
			});
			toast.success('설비 예비부품 발주 등록이 완료되었습니다.');
		},
		onError: (error) => {
			toast.error('설비 예비부품 발주 등록에 실패했습니다.');
		},
	});
};
