import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVendor } from '@primes/services/init/vendorService';
import { VendorCreateRequest, VendorListCreateRequest } from '@primes/types/vendor';

import { toast } from 'sonner';

export const useCreateVendor = () => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, VendorListCreateRequest>({
		mutationFn: (data) => {
			// 백엔드에서 List<VendorCreateRequest> 형태로 받으므로
			// dataList 배열을 직접 전달하여 여러 공급업체를 한 번에 생성
			if (!data.dataList || data.dataList.length === 0) {
				console.log(data)
				throw new Error('생성할 공급업체 데이터가 없습니다.');
			}
			
			// createVendorList 서비스를 사용하여 여러 공급업체를 한 번에 생성
			return createVendor(data.dataList);
		},
		onSuccess: () => {
			toast.success('공급업체가 생성되었습니다.');
			// Invalidate all vendor-related queries
			queryClient.invalidateQueries({
				queryKey: ['vendor'],
			});
			queryClient.invalidateQueries({
				queryKey: ['vendor-field'],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};

// Legacy version with page/size parameters for backward compatibility
export const useCreateVendorLegacy = (page: number, size: number) => {
	const queryClient = useQueryClient();

	return useMutation<any, Error, Partial<VendorCreateRequest>>({
		mutationFn: (data) => {
			// 단일 공급업체 데이터를 배열로 감싸서 createVendorList에 전달
			return createVendor([data]);
		},
		onSuccess: () => {
			toast.success('공급업체가 생성되었습니다.');
			queryClient.invalidateQueries({
				queryKey: ['vendor', page, size],
			});
		},
		onError: (error) => {
			toast.error(`생성 실패: ${error.message}`);
		},
	});
};
