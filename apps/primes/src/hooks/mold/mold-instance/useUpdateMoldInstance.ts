import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMoldInstance } from '@primes/services/mold/moldInstanceService';
import { MoldInstanceDto, MoldInstanceCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useUpdateMoldInstance = () => {
	const queryClient = useQueryClient();

	return useMutation<{ status: string; data: MoldInstanceDto }, Error, { id: number; data: Partial<MoldInstanceCreateRequest> }>({
		mutationFn: ({ id, data }) => updateMoldInstance(id, data),
		onSuccess: (_, { id }) => {
			toast.success('성공적으로 수정 되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['moldInstance'],
			});
			queryClient.invalidateQueries({
				queryKey: ['moldInstance', id],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}; 