import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldRepair } from '@primes/services/mold/moldRepairService';
import {
	MoldRepairDto,
	MoldRepairListCreateRequest,
	MoldRepairCreateRequest,
} from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMoldRepair = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<
		MoldRepairDto[],
		Error,
		MoldRepairListCreateRequest | MoldRepairCreateRequest[]
	>({
		mutationFn: (data) => createMoldRepair(data),
		onSuccess: () => {
			toast.success('성공적으로 등록 되었습니다.');
			// Invalidate all moldRepair queries regardless of search parameters
			queryClient.invalidateQueries({
				queryKey: ['moldRepair'],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
