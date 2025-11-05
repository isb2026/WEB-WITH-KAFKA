import { useQuery } from '@tanstack/react-query';
import { getMoldMasterField } from '@primes/services/mold/moldMasterService';

export const useMoldMasterFieldQuery = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['MoldMaster-field', fieldName],
		queryFn: () => getMoldMasterField(fieldName),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 5, // 5분으로 증가
		gcTime: 1000 * 60 * 5, // 5분으로 증가
		refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
		refetchOnMount: false, // 마운트 시 재요청 방지 (staleTime 내에서)
	});
};
