import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVendorFieldValues } from '@primes/services/init/vendorService';
import { VendorSearchRequest } from '@primes/types/vendor';

export const useVendorFieldQuery = (
	fieldName: string, 
	searchRequest: VendorSearchRequest = {},
	enabled = true
) => {
	// 검색 요청 객체를 안정화하여 불필요한 재요청 방지
	const stableSearchRequest = React.useMemo(() => {
		// 빈 객체인 경우 null로 통일하여 쿼리 키 안정화
		const keys = Object.keys(searchRequest);
		if (keys.length === 0) return null;
		
		// 객체의 키를 정렬하여 일관된 쿼리 키 생성
		const sortedRequest: VendorSearchRequest = {};
		keys.sort().forEach(key => {
			const value = searchRequest[key as keyof VendorSearchRequest];
			if (value !== undefined) {
				(sortedRequest as any)[key] = value;
			}
		});
		
		return sortedRequest;
	}, [searchRequest]);

	return useQuery({
		queryKey: ['vendor-field', fieldName, stableSearchRequest],
		queryFn: () => getVendorFieldValues(fieldName, searchRequest),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 5, // 5 minutes cache
		gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
		refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
		refetchOnMount: false, // 마운트 시 재요청 방지 (staleTime 내에서)
	});
};

// Legacy version for backward compatibility
export const useVendorFieldQueryLegacy = (fieldName: string, enabled = true) => {
	return useQuery({
		queryKey: ['vendor-field', fieldName],
		queryFn: () => getVendorFieldValues(fieldName, {}),
		enabled: !!fieldName && enabled,
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 3,
	});
};
