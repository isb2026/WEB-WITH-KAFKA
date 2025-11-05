import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachinePartUseInfo } from '@primes/services/machine/machinePartUseInfoService';
import { CreateMachinePartUseInfoPayload, MachinePartUseInfo } from '@primes/types/machine';
import { toast } from 'sonner';

export const useCreateMachinePartUseInfo = () => {
	const queryClient = useQueryClient();

	return useMutation<MachinePartUseInfo, Error, CreateMachinePartUseInfoPayload | CreateMachinePartUseInfoPayload[]>({
		mutationFn: (data) => createMachinePartUseInfo(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo'],
			});
			queryClient.invalidateQueries({
				queryKey: ['MachinePartUseInfo-field'],
			});
			toast.success('설비 예비부품 사용내역 등록이 완료되었습니다.');
		},
		onError: (error) => {
			console.error('Error creating machine PartUseInfo:', error);
			toast.error('설비 예비부품 사용내역 등록에 실패했습니다.');
		},
	});
};
