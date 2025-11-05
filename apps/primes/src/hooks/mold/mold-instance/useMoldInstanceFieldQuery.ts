import { useQuery } from '@tanstack/react-query';
import {
	getMoldInstanceFieldName,
	getMoldInstanceFields,
} from '@primes/services/mold/moldInstanceService';

export const useMoldInstanceFieldQuery = (
	fieldName: string,
	enabled = true
) => {
	return useQuery({
		queryKey: ['MoldInstance-field', fieldName],
		queryFn: async () => {
			console.log('useMoldInstanceFieldQuery - Calling API with fieldName:', fieldName);
			const result = await getMoldInstanceFieldName(fieldName);
			console.log('useMoldInstanceFieldQuery - API result:', result);
			return result.data; // .data 부분만 반환
		},
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};

// MoldInstance Field API for dropdowns (Custom Select용)
export const useMoldInstanceFieldsQuery = (params?: any) => {
	return useQuery({
		queryKey: ['mold-instance-fields', params],
		queryFn: () => getMoldInstanceFields(params),
		staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
		retry: 1, // 실패 시 1번만 재시도
	});
};
