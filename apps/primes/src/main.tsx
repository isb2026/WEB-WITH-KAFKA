import './global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Apps from './Apps';
import { Toaster } from '@radix-ui/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './providers/queryClient';
// import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster richColors position="top-right" />
			<Apps />
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>
);
