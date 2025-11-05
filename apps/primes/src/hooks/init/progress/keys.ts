// src/hooks/qms/progress/keys.ts
import type { ItemProgressSearchRequest } from '@primes/types/progress';

export type ProgressListParams = {
	page: number;
	size: number;
	searchRequest?: ItemProgressSearchRequest;
	enabled?: boolean; // ✅ enabled 옵션 추가
};

export const progressKeys = {
	base: ['progress'] as const,
	list: (p: ProgressListParams) =>
		['progress', p.searchRequest?.itemId ?? null, p.page, p.size] as const,
	latest: (itemId: number | string) =>
		['progress', itemId, '__latest'] as const,
	recentArgs: (itemId: number | string) =>
		['progress', '__recentArgs', itemId] as const,
	byItemPrefix: (itemId: number | string) => ['progress', itemId] as const,
};
