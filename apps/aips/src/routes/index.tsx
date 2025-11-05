import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@aips/layouts/MainLayout';
import DashboardPage from '@aips/pages/DashboardPage';
import { aipsRoutes } from './aipsRoute';

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            ...aipsRoutes,
            {
                path: '*',
                element: <div className="p-4 text-center text-gray-500">Page not found.</div>,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);

export default routes;