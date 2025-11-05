import { useQuery } from '@tanstack/react-query';
import { getMoldOrderMasterById } from '@primes/services/mold/moldOrderMasterService';

export const useGetMoldOrderMasterById = (id: number | string | null) => {
	return useQuery({
		queryKey: ['moldOrderMaster', 'byId', id],
		queryFn: () => getMoldOrderMasterById(id!),
		enabled: !!id && id !== '0' && id !== 0,
		staleTime: 1000 * 60 * 3,
	});
}; 