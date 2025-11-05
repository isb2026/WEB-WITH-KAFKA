import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldUsingInformation } from '@primes/services/mold/moldUsingInformationService';
import { MoldUsingInformationDto, MoldUsingInformationListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldUsingInformation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldUsingInformationDto[], Error, MoldUsingInformationListCreateRequest>({
		mutationFn: (data) => createMoldUsingInformation(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldUsingInformation', page, size],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 