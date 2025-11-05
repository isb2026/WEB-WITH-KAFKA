import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldBom } from '@primes/services/mold/moldBomService';
import { toast } from 'sonner';

export const useDeleteMoldBom = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: number[]) => deleteMoldBom(data),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBom', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
