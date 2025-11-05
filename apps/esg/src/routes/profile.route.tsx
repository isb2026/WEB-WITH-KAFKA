import { lazy, Suspense } from 'react';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy load profile pages
const MyPage = lazy(() => import('../pages/profile/MyPage').then(module => ({ default: module.MyPage })));

export const ProfileRoute = {
	path: 'profile',
	children: [
		{
			path: 'my',
			element: (
				<Suspense fallback={<LoadingFallback />}>
					<MyPage />
				</Suspense>
			),
		},
	],
}; 