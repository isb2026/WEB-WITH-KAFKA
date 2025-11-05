import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProgressVendorByCompositeKey } from '@primes/services/init/progressVendorService';
import { toast } from 'sonner';

interface DeleteProgressVendorParams {
	progressId: number;
	vendorId: number;
}

export const useDeleteProgressVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, DeleteProgressVendorParams>({
		mutationFn: ({ progressId, vendorId }: DeleteProgressVendorParams) => 
			deleteProgressVendorByCompositeKey(progressId, vendorId),
		onSuccess: () => {
			toast.success('거래처 연결이 삭제되었습니다.');
			// Invalidate all progress-vendor related queries
			queryClient.invalidateQueries({
				queryKey: ['progress-vendors'],
			});
			queryClient.invalidateQueries({
				queryKey: ['progress'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
}; 