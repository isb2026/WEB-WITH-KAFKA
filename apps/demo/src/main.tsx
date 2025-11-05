import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Theme, Toaster } from '@repo/radix-ui/components';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Theme>
			<Toaster richColors position="top-right" />
			<RouterProvider router={router} />
		</Theme>
	</StrictMode>
);
