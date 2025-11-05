import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldUsingInformation } from '@primes/services/mold/moldUsingInformationService';
import { toast } from 'sonner';

export const useDeleteMoldUsingInformation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldUsingInformation(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldUsingInformation queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldUsingInformation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
