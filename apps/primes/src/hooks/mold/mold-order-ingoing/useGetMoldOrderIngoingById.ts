import { useQuery } from '@tanstack/react-query';
import { getMoldOrderIngoingById } from '@primes/services/mold/moldOrderIngoingService';
import { MoldOrderIngoingDto } from '@primes/types/mold';

export const useGetMoldOrderIngoingById = (id: number | null) => {
	return useQuery<MoldOrderIngoingDto, Error>({
		queryKey: ['moldOrderIngoing', 'detail', id],
		queryFn: () => getMoldOrderIngoingById(id!),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};
