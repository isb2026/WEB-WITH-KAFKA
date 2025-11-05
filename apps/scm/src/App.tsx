import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { Theme, Toaster } from '@repo/radix-ui/components';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5분
			retry: 1,
		},
		mutations: {
			retry: 1,
		},
	},
});

export default function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="scm-theme">
			<Theme>
				<Toaster richColors position="top-right" />
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</Theme>
		</ThemeProvider>
	);
}
