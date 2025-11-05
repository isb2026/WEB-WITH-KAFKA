import { useQuery } from '@tanstack/react-query';
import { getMoldInstanceById } from '@primes/services/mold/moldInstanceService';

export const useMoldInstanceByIdQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: ['mold-instance', id],
		queryFn: async () => {
			console.log('useMoldInstanceByIdQuery - Fetching mold instance with ID:', id);
			const result = await getMoldInstanceById(id);
			console.log('useMoldInstanceByIdQuery - API result:', result);
			return result.data; // .data 부분만 반환
		},
		enabled: enabled && !!id,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
	});
};