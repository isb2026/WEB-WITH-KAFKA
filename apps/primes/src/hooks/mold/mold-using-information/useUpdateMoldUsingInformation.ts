import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldUsingInformation } from '@primes/services/mold/moldUsingInformationService';
import { MoldUsingInformationDto } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldUsingInformation = () => {
	const queryClient = useQueryClient();

	return useMutation<MoldUsingInformationDto, Error, { id: number; data: Partial<MoldUsingInformationDto> }>({
		mutationFn: ({ id, data }) => updateMoldUsingInformation(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldUsingInformation'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldUsingInformation', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 