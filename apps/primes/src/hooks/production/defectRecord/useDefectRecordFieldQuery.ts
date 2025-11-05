import { useQuery } from '@tanstack/react-query';
import { getDefectRecordFields } from '@primes/services/production/defectRecordService';

export const useDefectRecordFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['DefectRecord-field', fieldName],
		queryFn: () => getDefectRecordFields(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션
	});
};
