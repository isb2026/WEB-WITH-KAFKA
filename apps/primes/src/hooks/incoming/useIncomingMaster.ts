import { useIncomingMasterQuery } from './useIncomingMasterQuery';
import { useCreateIncoming } from './useCreateIncoming';
import { useUpdateIncoming } from './useUpdateIncoming';
import { useDeleteIncoming } from './useDeleteIncoming';
import { SearchIncomingMasterRequest } from '@primes/types/purchase/incomingMaster';

interface IncomingMasterParams extends SearchIncomingMasterRequest {
	page?: number;
	size?: number;
	sort?: string;
}

export const useIncomingMaster = (params: IncomingMasterParams) => {
	const list = useIncomingMasterQuery(params);
	const create = useCreateIncoming(params.page || 0, params.size || 10);
	const update = useUpdateIncoming(params.page || 0, params.size || 10);
	const deleteIncoming = useDeleteIncoming(params.page || 0, params.size || 10);
	
	return {
		list,
		create,
		update,
		delete: deleteIncoming,
	};
}; 