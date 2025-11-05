import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldBom } from '@primes/services/mold/moldBomService';
import { toast } from 'sonner';

export const useUpdateMoldBom = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: any) => updateMoldBom(data),
		onSuccess: () => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBom', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
