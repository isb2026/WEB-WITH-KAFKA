import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldRepair } from '@primes/services/mold/moldRepairService';
import { MoldRepairDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldRepair = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldRepairDto, Error, { id: number; data: Partial<MoldRepairDto> }>({
		mutationFn: ({ id, data }) => updateMoldRepair(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldRepair'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldRepair', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 