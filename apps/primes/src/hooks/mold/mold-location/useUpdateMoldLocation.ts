import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldLocation } from '@primes/services/mold/moldLocationService';
import { MoldLocationDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldLocation = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldLocationDto, Error, { id: number; data: Partial<MoldLocationDto> }>({
		mutationFn: ({ id, data }) => updateMoldLocation(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldLocation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldLocation', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 