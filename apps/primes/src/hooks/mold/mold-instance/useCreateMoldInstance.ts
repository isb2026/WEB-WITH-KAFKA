import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldInstance, createMoldInstanceList } from '@primes/services/mold/moldInstanceService';
import { MoldInstanceDto, MoldInstanceCreateRequest, MoldInstanceListCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldInstance = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<{ status: string; data: MoldInstanceDto }, Error, MoldInstanceCreateRequest>({
		mutationFn: (data) => createMoldInstance(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldInstance'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 