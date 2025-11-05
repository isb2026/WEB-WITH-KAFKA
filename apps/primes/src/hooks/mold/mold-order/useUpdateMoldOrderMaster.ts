import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldOrderMaster } from '@primes/services/mold/moldOrderMasterService';
import { MoldOrderMasterDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldOrderMaster = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldOrderMasterDto, Error, { id: number | string; data: Partial<MoldOrderMasterDto> }>({
		mutationFn: ({ id, data }) => updateMoldOrderMaster(id, data),
		onSuccess: (result, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldOrderMaster'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldOrderMaster', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['mold-order-detail-by-master'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 