import { useQuery } from '@tanstack/react-query';
import { getNotworkMasterFields } from '@primes/services/production/notworkService';

/**
 * 비가동 Master Field API 전용 Atomic Hook
 */
export const useNotworkMasterFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['notwork-master-fields', fieldName],
		queryFn: () => getNotworkMasterFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		gcTime: 1000 * 60 * 5, // 5분 가비지 컬렉션
	});
};
