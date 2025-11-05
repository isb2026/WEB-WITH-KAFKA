import { useQuery } from '@tanstack/react-query';
import { getNotworkDetailFields } from '@primes/services/production/notworkService';

/**
 * 비가동 Detail Field API 전용 Atomic Hook
 */
export const useNotworkDetailFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['notwork-detail-fields', fieldName],
		queryFn: () => getNotworkDetailFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 5, // 5분 가비지 컬렉션
	});
};
