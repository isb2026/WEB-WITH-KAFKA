import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendor } from '@primes/services/init/vendorService';
import { VendorUpdateRequest } from '@primes/types/vendor';
import { toast } from 'sonner';

type UpdateVendorInput = { id: number; data: Partial<VendorUpdateRequest> };

export const useUpdateVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateVendorInput>({
		mutationFn: ({ id, data }) => updateVendor(id, data),
		onSuccess: (_, { id }) => {
			toast.success('수정이 완료되었습니다.');
			// Invalidate all vendor-related queries
			queryClient.invalidateQueries({
				queryKey: ['vendor'],
			});
			queryClient.invalidateQueries({
				queryKey: ['vendor-field'],
			});
			// Also invalidate specific vendor query if it exists
			queryClient.invalidateQueries({
				queryKey: ['vendor', id],
			});
		},
		onError: (error) => {
			toast.error(`수정 실패: ${error.message}`);
		},
	});
};

// Legacy version with page/size parameters for backward compatibility
export const useUpdateVendorLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateVendorInput>({
		mutationFn: ({ id, data }) => updateVendor(id, data),
		onSuccess: () => {
			toast.success('수정이 완료되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['vendor', page, size],
			});
		},
		onError: (error) => {
			toast.error(`수정 실패: ${error.message}`);
		},
	});
};
