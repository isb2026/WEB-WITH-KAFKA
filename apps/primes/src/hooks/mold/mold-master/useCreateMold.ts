import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMoldMaster } from '@primes/services/mold/moldMasterService';
import { MoldMasterDto, MoldMasterCreateRequest } from '@primes/types/mold';
import { toast } from 'sonner';

export const useCreateMold = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<MoldMasterDto, Error, MoldMasterCreateRequest>({
		mutationFn: async (data) => {
			console.log('=== useCreateMold Hook DEBUG ===');
			console.log('Mutation data:', data);

			try {
				const result = await createMoldMaster(data);
				console.log('Mutation successful:', result);
				return result;
			} catch (error: any) {
				console.error('Mutation failed:', error);
				throw error;
			}
		},
		onSuccess: (data, variables) => {
			console.log('Create mold success:', data);
			toast.success('성공적으로 등록 되었습니다.');

			// ✅ FIXED: Invalidate all mold-related queries with proper key structure
			queryClient.invalidateQueries({
				queryKey: ['mold'],
			});
			queryClient.invalidateQueries({
				queryKey: ['mold', 'list'],
			});
			// Force refetch of current page
			queryClient.refetchQueries({
				queryKey: ['mold', 'list'],
			});
		},
		onError: (error, variables) => {
			console.error('Create mold error:', error);
			console.error('Failed variables:', variables);

			// Provide more specific error messages
			let errorMessage = 'Unknown error occurred';
			if (error.message) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}

			toast.error(`등록 실패: ${errorMessage}`);
		},
	});
};
