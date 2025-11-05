import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldInoutInformation } from '@primes/services/mold/moldInoutInformationService';
import { MoldInoutInformationDto, MoldInoutInformationListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldInoutInformation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldInoutInformationDto[], Error, MoldInoutInformationListCreateRequest>({
		mutationFn: (data) => createMoldInoutInformation(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['moldInoutInformation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 