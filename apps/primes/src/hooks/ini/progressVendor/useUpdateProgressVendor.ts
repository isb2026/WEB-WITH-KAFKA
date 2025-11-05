import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgressVendorByCompositeKey } from '@primes/services/init/progressVendorService';
import { ProgressVendorCreateRequest } from '@primes/services/init/progressVendorService';
import { toast } from 'sonner';

interface UpdateProgressVendorParams {
	progressId: number;
	vendorId: number;
	data: Partial<ProgressVendorCreateRequest>;
}

export const useUpdateProgressVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdateProgressVendorParams>({
		mutationFn: ({ progressId, vendorId, data }: UpdateProgressVendorParams) => 
			updateProgressVendorByCompositeKey(progressId, vendorId, data),
		onSuccess: () => {
			toast.success('거래처 연결이 수정되었습니다.');
			// Invalidate all progress-vendor related queries
			queryClient.invalidateQueries({
				queryKey: ['progress-vendors'],
			});
			queryClient.invalidateQueries({
				queryKey: ['progress'],
			});
		},
		onError: (error) => {
			toast.error(`수정 실패: ${error.message}`);
		},
	});
}; 