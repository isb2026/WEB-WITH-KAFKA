import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldItemRelation } from '@primes/services/mold/moldItemRelationService';
import {
	MoldItemRelationDto,
	MoldItemRelationCreateRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldItemRelation = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		MoldItemRelationDto[],
		Error,
		MoldItemRelationCreateRequest[]
	>({
		mutationFn: (data) => createMoldItemRelation(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldItemRelation'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
