// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

// TS 타입 보강(선택)
declare global {
	// eslint-disable-next-line no-var
	var __rqClient: QueryClient | undefined;
}

export const queryClient =
	globalThis.__rqClient ??
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				gcTime: 1000 * 60 * 10,
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	});

// 개발 모드에서만 전역 보관 → HMR에도 싱글톤 유지
if (import.meta.env.DEV) globalThis.__rqClient = queryClient;
