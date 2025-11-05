import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldLocation } from '@primes/services/mold/moldLocationService';
import { MoldLocationDto, MoldLocationListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldLocation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldLocationDto[], Error, MoldLocationListCreateRequest>({
		mutationFn: (data) => createMoldLocation(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldLocation', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 