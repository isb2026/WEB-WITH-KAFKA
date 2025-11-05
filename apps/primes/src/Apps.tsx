// import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
// import { getToken } from './utils/auth';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DevModeProvider } from './contexts/DevModeContext';
import { Theme, Toaster } from '@repo/radix-ui/components';
import { initI18n } from '@repo/i18n';
import commonKo from './locales/ko/common.json';
import menuKo from './locales/ko/menu.json';
import vendorKo from './locales/ko/vendor.json';
import dataTableKo from './locales/ko/dataTable.json';
import commonEn from './locales/en/common.json';
import menuEn from './locales/en/menu.json';
import vendorEn from './locales/en/vendor.json';
import dataTableEn from './locales/en/dataTable.json';

initI18n({
	fallbackLng: 'ko',
	resources: {
		ko: {
			common: commonKo,
			menu: menuKo,
			vendor: vendorKo,
			dataTable: dataTableKo,
		},
		en: {
			common: commonEn,
			menu: menuEn,
			vendor: vendorEn,
			dataTable: dataTableEn,
		},
	},
});

// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			staleTime: 1000 * 60 * 5,
// 			gcTime: 1000 * 60 * 10,
// 			retry: 1,
// 			refetchOnWindowFocus: false,
// 		},
// 		mutations: {
// 			retry: 2,
// 		},
// 	},
// });

export default function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="primes-theme">
			<LanguageProvider defaultLanguage="ko" storageKey="primes-language">
				<DevModeProvider>
					<Theme>
						<Toaster richColors position="top-right" />
						<RouterProvider router={router} />
					</Theme>
				</DevModeProvider>
			</LanguageProvider>
		</ThemeProvider>
	);
}
