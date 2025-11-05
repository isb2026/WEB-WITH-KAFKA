import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldInoutInformation } from '@primes/services/mold/moldInoutInformationService';
import { toast } from 'sonner';

export const useDeleteMoldInoutInformation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => deleteMoldInoutInformation(ids),
		onSuccess: () => {
			toast.success('성공적으로 삭제 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 