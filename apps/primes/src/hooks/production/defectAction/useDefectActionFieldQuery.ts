import { useQuery } from '@tanstack/react-query';
import { getDefectActionField } from '@primes/services/production/defectActionService';

export const useDefectActionFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['DefectAction-field', fieldName],
		queryFn: () => getDefectActionField(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
