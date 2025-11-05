import { useQuery } from '@tanstack/react-query';
import { getPlanFields } from '@primes/services/production/planService';

export const usePlanFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Plan-field', fieldName],
		queryFn: () => getPlanFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
