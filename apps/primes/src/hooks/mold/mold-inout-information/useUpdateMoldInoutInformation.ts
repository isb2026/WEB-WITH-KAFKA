import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldInoutInformation } from '@primes/services/mold/moldInoutInformationService';
import { MoldInoutInformationDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldInoutInformation = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldInoutInformationDto, Error, { id: number; data: Partial<MoldInoutInformationDto> }>({
		mutationFn: ({ id, data }) => updateMoldInoutInformation(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 