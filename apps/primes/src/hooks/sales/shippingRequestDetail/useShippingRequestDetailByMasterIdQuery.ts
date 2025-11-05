import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getShippingRequestDetailByMasterId } from '@primes/services/sales/shippingRequestDetailService';

export const useShippingRequestDetailByMasterIdQuery = (params: {
	masterId?: number;
	page: number;
	size: number;
}) => {
	return useQuery({
		queryKey: ['shippingRequestDetail', 'byMasterId', params.masterId, params.page, params.size],
		queryFn: () => getShippingRequestDetailByMasterId(params.masterId!, params.page, params.size),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3분
		enabled: !!params.masterId, // masterId가 있을 때만 실행
	});
}; 