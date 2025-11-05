import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldBom } from '@primes/services/mold/moldBomService';
import { toast } from 'sonner';

export const useCreateMoldBom = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: any) => createMoldBom(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldBom', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
