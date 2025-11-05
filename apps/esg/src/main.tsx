// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AppProvider, AweSomeIconProvider } from '@repo/falcon-ui/providers';
import { MenuProvider } from './providers/MenuProvider';
import { TabProvider, ActionButtonProvider } from '@repo/moornmo-ui/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import '@repo/falcon-ui/css/theme';

const container = document.getElementById('main');
if (!container) {
	throw new Error('Container not found');
}
const root = createRoot(container);

root.render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<MenuProvider>
				<AppProvider>
					<TabProvider>
						<ActionButtonProvider>
							<AweSomeIconProvider>
								<RouterProvider router={router} />
							</AweSomeIconProvider>
						</ActionButtonProvider>
					</TabProvider>
				</AppProvider>
			</MenuProvider>
		</QueryClientProvider>
	</StrictMode>
);
