import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldMaster } from '@primes/services/mold/moldMasterService';
import { MoldMasterDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMold = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldMasterDto, Error, { id: number; data: Partial<MoldMasterDto> }>({
		mutationFn: ({ id, data }) => updateMoldMaster(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['mold'],
			});
			queryClient.invalidateQueries({
				queryKey: ['mold', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 