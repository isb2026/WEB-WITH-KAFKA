import { useQuery } from '@tanstack/react-query';
import { incomingService } from '@primes/services/incoming';
import { SearchIncomingMasterRequest } from '@primes/types/purchase/incomingMaster';

interface IncomingMasterListParams extends SearchIncomingMasterRequest {
	page?: number;
	size?: number;
	sort?: string;
}

export const useIncomingMasterQuery = (params: IncomingMasterListParams = {}) => {
	return useQuery({
		queryKey: ['incoming-master', params.page, params.size, params.sort, params.incomingCode, params.vendorName],
		queryFn: async () => {
			try {
				const response = await incomingService.getIncomingMasterList(params);
				return response;
			} catch (error) {
				console.error('Incoming master list query error:', error);
				throw error;
			}
		},
		staleTime: 1000 * 60 * 3, // 3 minutes
	});
}; 