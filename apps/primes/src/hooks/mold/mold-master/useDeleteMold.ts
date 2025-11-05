import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	deleteMoldMaster,
	deleteMoldMasters,
} from '@primes/services/mold/moldMasterService';
import { toast } from 'sonner';

export const useDeleteMold = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, number[]>({
		mutationFn: (ids) => {
			console.log('=== DELETE MOLD HOOK DEBUG ===');
			console.log('IDs to delete:', ids);

			// ✅ FIXED: Use appropriate delete method based on number of IDs
			if (ids.length === 1) {
				console.log('Using single delete method');
				return deleteMoldMaster(ids[0]);
			} else {
				console.log('Using bulk delete method');
				return deleteMoldMasters(ids);
			}
		},
		onSuccess: (data, variables) => {
			console.log('Delete successful:', data);
			toast.success('성공적으로 삭제 되었습니다.');

			// ✅ FIXED: Comprehensive cache invalidation
			queryClient.invalidateQueries({
				queryKey: ['mold'],
			});
			queryClient.invalidateQueries({
				queryKey: ['mold', 'list'],
			});

			// Force refetch to update the list immediately
			queryClient.refetchQueries({
				queryKey: ['mold', 'list'],
			});
		},
		onError: (error, variables) => {
			console.error('Delete failed:', error);
			console.error('Failed to delete IDs:', variables);
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
