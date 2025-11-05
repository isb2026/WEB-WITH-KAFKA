import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@scm/pages/Dashboard';
import Layout from '@scm/layouts/Layout';
import VendorListPage from '@scm/pages/ini/vendor/VendorListPage';
import { orderRoutes } from './orderRoutes';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{
				path: 'dashboard',
				element: <Dashboard />,
			},
			{
				path: 'ini/vendor',
				element: <VendorListPage />,
			},
			// 주문 관리 라우트
			...orderRoutes,
		],
	},
]);
