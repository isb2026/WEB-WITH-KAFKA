// src/hooks/qms/progress/useProgressListQuery.ts
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemProgressList } from '@primes/services/init/progressService';
// import type { ItemProgressSearchRequest } from '@primes/types/progress';
import { progressKeys, type ProgressListParams } from './keys';

export type ProgressList = {
	content?: any[];
	totalElements?: number;
	totalPages?: number;
};

export const useProgressListQuery = (params: ProgressListParams) => {
	const qc = useQueryClient();
	const itemId = params.searchRequest?.itemId ?? null;

	const q = useQuery<ProgressList>({
		queryKey: progressKeys.list(params),
		queryFn: async () => {
			if (itemId == null) return { content: [], totalElements: 0 };
			return getItemProgressList({
				...params,
				searchRequest: params.searchRequest ?? {},
			});
		},
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 3,
		enabled: params.enabled !== false, // ✅ enabled 옵션 적용 (기본값: true)
	});

	useEffect(() => {
		if (itemId == null || !q.data) return;
		qc.setQueryData(progressKeys.latest(itemId), q.data);
		// 필요해지면 다음도 활성화:
		// qc.setQueryData(progressKeys.recentArgs(itemId), params);
	}, [qc, itemId, q.data, params]);

	return q;
};
