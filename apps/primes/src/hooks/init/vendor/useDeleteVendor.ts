import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVendor } from '@primes/services/init/vendorService';

import { toast } from 'sonner';

// Atomic version (recommended)
export const useDeleteVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number | number[]>({
		mutationFn: (ids) => {
			// Convert single ID to array for the new bulk delete API
			const idsArray = Array.isArray(ids) ? ids : [ids];
			return deleteVendor(idsArray);
		},
		onSuccess: () => {
			toast.success('공급업체가 삭제되었습니다.');
			// Invalidate all vendor queries (broader invalidation to catch all variants)
			queryClient.invalidateQueries({
				queryKey: ['vendor'],
			});
			// Also invalidate vendor field queries
			queryClient.invalidateQueries({
				queryKey: ['vendor-field'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};

// Legacy version for backward compatibility
export const useDeleteVendorLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number | number[]>({
		mutationFn: (ids) => {
			// Convert single ID to array for the new bulk delete API
			const idsArray = Array.isArray(ids) ? ids : [ids];
			return deleteVendor(idsArray);
		},
		onSuccess: () => {
			toast.success('공급업체가 삭제되었습니다.');
			// Invalidate all vendor queries (broader invalidation to catch all variants)
			queryClient.invalidateQueries({
				queryKey: ['vendor'],
			});
			// Also invalidate vendor field queries
			queryClient.invalidateQueries({
				queryKey: ['vendor-field'],
			});
		},
		onError: (error) => {
			toast.error(`삭제 실패: ${error.message}`);
		},
	});
};
