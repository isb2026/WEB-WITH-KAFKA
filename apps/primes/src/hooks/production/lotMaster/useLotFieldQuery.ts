import { useQuery } from '@tanstack/react-query';
import { getLotFields } from '@primes/services/production/lotService';

export const useLotFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['Lot-field', fieldName],
		queryFn: () => getLotFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
