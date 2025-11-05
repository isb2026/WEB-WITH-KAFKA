import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldDispose } from '@primes/services/mold/moldDisposeService';
import { MoldDisposeDto, MoldDisposeCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldDispose = (page: number, size: number, searchRequest?: any) => {
	const queryClient = useQueryClient();

	return useMutation<MoldDisposeDto, Error, Partial<MoldDisposeDto>>({
		mutationFn: (data) => createMoldDispose(data as MoldDisposeCreateRequest),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			// Invalidate all moldDispose queries to ensure proper updates
			queryClient.invalidateQueries({
				queryKey: ['moldDispose'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 