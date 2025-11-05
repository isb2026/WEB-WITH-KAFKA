import { lazy, Suspense } from 'react';
import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import { NotFoundTemplate } from '@moornmo/components';
import LoadingFallback from '../components/common/LoadingFallback';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AppProviders from '../components/providers/AppProviders';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));

// Import route configurations (not lazy, as they're just config objects)
import { ColloectRoute } from './collect.route';
import { LocationRoute } from './locations.route';
import { AnalyzeRoute } from './analyze.route';
import { ReportRoute } from './report.route';
import { ProfileRoute } from './profile.route';

// import { DashboardRoute } from './dashboard.route';

const routes = [
	{
		path: '/login',
		element: (
			<AppProviders>
				<Suspense fallback={<LoadingFallback />}>
					<LoginPage />
				</Suspense>
			</AppProviders>
		),
	},
	{
		element: (
			<AppProviders>
				<ProtectedRoute>
					<App />
				</ProtectedRoute>
			</AppProviders>
		),
		children: [
			{
				path: '/',
				children: [
					{
						index: true,
						element: (
							<Suspense fallback={<LoadingFallback />}>
								<HomePage />
							</Suspense>
						),
					},
					LocationRoute,
					ColloectRoute,
					AnalyzeRoute,
					ReportRoute,
					ProfileRoute,
					{
						path: '*',
						element: <NotFoundTemplate />,
					},
				],
			},
		],
	},
];

export const router = createBrowserRouter(routes, {
	basename: import.meta.env.BASE_URL,
});

export default routes;
