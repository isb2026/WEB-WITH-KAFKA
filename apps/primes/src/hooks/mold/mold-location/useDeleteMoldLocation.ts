import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldLocation } from '@primes/services/mold/moldLocationService';
import { toast } from 'sonner';

export const useDeleteMoldLocation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldLocation(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldLocation queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldLocation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
