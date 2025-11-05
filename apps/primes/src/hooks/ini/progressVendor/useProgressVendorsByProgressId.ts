import { useQuery } from '@tanstack/react-query';
import { getProgressVendorsByProgressId } from '@primes/services/init/progressVendorService';

export const useProgressVendorsByProgressId = (progressId: number, enabled = true) => {
	return useQuery({
		queryKey: ['progress-vendors', 'by-progress-id', progressId],
		queryFn: () => getProgressVendorsByProgressId(progressId),
		enabled: enabled && !!progressId,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
}; 