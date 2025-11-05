import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMoldRepair } from '@primes/services/mold/moldRepairService';
import { toast } from 'sonner';

export const useDeleteMoldRepair = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: async (ids) => {
			console.log('=== useDeleteMoldRepair DEBUG ===');
			console.log('Attempting to delete IDs:', ids);

			try {
				const result = await deleteMoldRepair(ids);
				console.log('Delete successful:', result);
				return result;
			} catch (error) {
				console.error('Delete failed:', error);
				throw error;
			}
		},
		onSuccess: (data, variables) => {
			console.log('Delete mutation successful:', { data, variables });
			toast.success('성공적으로 삭제 되었습니다.');
			// Invalidate all moldRepair queries to ensure list updates
			queryClient.invalidateQueries({
				queryKey: ['moldRepair'],
			});
		},
		onError: (error, variables) => {
			console.error('Delete mutation failed:', { error, variables });
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
