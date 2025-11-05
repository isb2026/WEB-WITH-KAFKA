import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldOrderMaster } from '@primes/services/mold/moldOrderMasterService';
import { toast } from 'sonner';

export const useDeleteMoldOrderMaster = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldOrderMaster(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldOrderMaster queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldOrderMaster'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
