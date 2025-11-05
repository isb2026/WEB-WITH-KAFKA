import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSingleMoldUsingInformation } from '@primes/services/mold/moldUsingInformationService';
import {
	MoldUsingInformationDto,
	MoldUsingInformationCreateRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateSingleMoldUsingInformation = (
	page: number,
	size: number
) => {
	const queryClient = useQueryClient();

	return useMutation<
		MoldUsingInformationDto,
		Error,
		MoldUsingInformationCreateRequest
	>({
		mutationFn: (data) => createSingleMoldUsingInformation(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldUsingInformation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
