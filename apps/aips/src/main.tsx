import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { initI18n } from '@repo/i18n';
import { Theme, Toaster } from '@repo/radix-ui/components';
import commonKo from './locales/ko/common.json';
import menuKo from './locales/ko/menu.json';
import dataTableKo from './locales/ko/dataTable.json';
import commonEn from './locales/en/common.json';
import menuEn from './locales/en/menu.json';
import dataTableEn from './locales/en/dataTable.json';
import './global.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// i18n 초기화
initI18n({
	fallbackLng: 'ko',
	resources: {
		ko: {
			common: commonKo,
			menu: menuKo,
			dataTable: dataTableKo,
		},
		en: {
			common: commonEn,
			menu: menuEn,
			dataTable: dataTableEn,
		},
	},
});

// React Query 클라이언트 설정
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5분
			gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="light" storageKey="primes-theme">
			<LanguageProvider defaultLanguage="ko" storageKey="primes-language">
				<Theme>
					<Toaster richColors position="top-right" />
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={router} />
						{import.meta.env.DEV && (
							<ReactQueryDevtools initialIsOpen={false} />
						)}
					</QueryClientProvider>
				</Theme>
			</LanguageProvider>
		</ThemeProvider>
	</React.StrictMode>
);
