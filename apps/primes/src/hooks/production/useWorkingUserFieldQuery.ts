import { useQuery } from '@tanstack/react-query';
import { getWorkingUserFields } from '@primes/services/production';

export const useWorkingUserFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['working-user-field', fieldName],
		queryFn: () => getWorkingUserFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분 캐시
		gcTime: 1000 * 60 * 3, // 3분 가비지 컬렉션
	});
};
