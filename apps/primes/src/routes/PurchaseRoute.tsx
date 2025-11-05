import React from 'react';
import { MenuType } from '@primes/types/menus';
// 구매품 관리
import ItemsVendorTabNavigation from '@primes/tabs/purchase/ItemsVendorTabNavigation';

// 구매
import PurchaseTabNavigation from '@primes/tabs/purchase/PurchaseTabNavigation';

// 구매입고
import IncomingTabNavigation from '@primes/tabs/purchase/IncomingTabNavigation';
import { PurchaseOrdersRegisterPage } from '@primes/pages/purchase/purchase-orders/PurchaseOrdersRegisterPage';
import PurchaseOrdersEditPage from '@primes/pages/purchase/purchase-orders/PurchaseOrdersEditPage';
import { IncomingOrdersRegisterPage } from '@primes/pages/purchase/incoming-orders/IncomingOrdersRegisterPage';

// 구매반품
import PurchaseReturnsTabNavigation from '@primes/tabs/purchase/PurchaseReturnsTabNavigation';
import IncomingOrdersEditPage from '@primes/pages/purchase/incoming-orders/IncomingOrdersEditPage';

export const PurchaseServiceMenus: MenuType = {
	label: 'menuGroup.purchase',
	desc: 'menuGroup.purchaseDesc',
	icon: 'Home',
	children: [
		{
			name: 'menu.purchase_vendor_items',
			to: '/purchase/vendor-items',
			icon: 'Package',
			children: [
				{
					name: 'menu.purchase_vendor_items_list',
					to: '/purchase/vendor-items/list',
					icon: 'Table',
				},
			],
		},
		{
			name: 'menu.purchase_orders',
			to: '/purchase/request/related-list',
			icon: 'Package',
			children: [
				{
					name: 'menu.purchase_orders_related_list',
					to: 'purchase/request/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.purchase_orders_list',
					to: 'purchase/request/list',
					icon: 'FileText',
				},
				// {
				// 	name: 'menu.purchase_orders_analsis',
				// 	to: 'purchase/request/analyze',
				// 	icon: 'PieChart',
				// },
				{
					name: 'menu.purchase_orders_register',
					to: 'purchase/request/register',
					icon: 'Plus',
				},
			],
		},
		{
			name: 'menu.incoming_orders',
			to: '/purchase/incoming/related-list',
			icon: 'Truck',
			children: [
				{
					name: 'menu.incoming_orders_related_list',
					to: 'purchase/incoming/related-list',
					icon: 'List',
				},
				{
					name: 'menu.incoming_orders_list',
					to: 'purchase/incoming/list',
					icon: 'FileText',
				},
				// {
				// 	name: 'menu.incoming_orders_analsis',
				// 	to: 'purchase/incoming/analyze',
				// 	icon: 'PieChart',
				// },
				{
					name: 'menu.incoming_orders_register',
					to: 'purchase/incoming/register',
					icon: 'Plus',
				},
			],
		},
		{
			name: 'menu.purchase_returns',
			to: '/purchase/returns/list',
			icon: 'RotateCcw',
			children: [
				{
					name: 'menu.purchase_returns_list',
					to: 'purchase/returns/list',
					icon: 'Table',
				},
			],
		},
	],
};

export const PurchaseRoutes = [
	{
		path: '/purchase/vendor-items',
		children: [
			{
				path: 'list',
				element: <ItemsVendorTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: 'purchase/request',
		children: [
			{
				path: 'related-list',
				element: <PurchaseTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <PurchaseTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <PurchaseOrdersRegisterPage />,
			},
			{
				path: ':id',
				element: <PurchaseOrdersEditPage />,
			},
		],
	},
	{
		path: 'purchase/incoming',
		children: [
			{
				path: 'related-list',
				element: <IncomingTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <IncomingTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <IncomingOrdersRegisterPage />,
			},
			{
				path: ':id',
				element: <IncomingOrdersEditPage />,
			},
		],
	},
	{
		path: 'purchase/returns',
		children: [
			{
				path: 'list',
				element: <PurchaseReturnsTabNavigation activetab="list" />,
			},
		],
	},
];
