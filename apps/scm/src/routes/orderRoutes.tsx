import React from 'react';
import { RouteObject } from 'react-router-dom';
import OrderListPage from '@scm/pages/order/OrderListPage';
import OrderReceivePage from '@scm/pages/order/OrderReceivePage';

export const orderRoutes: RouteObject[] = [
	{
		path: '/order/list',
		element: <OrderListPage />,
	},
	{
		path: '/order/receive',
		element: <OrderReceivePage />,
	},
];
