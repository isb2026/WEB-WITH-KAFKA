import React from 'react';
import { MenuType } from '@primes/types/menus';

// 그룹별 TabNavigation
import StandardTabNavigation from '@primes/tabs/outsourcing/StandardTabNavigation';
import OutgoingManagementTabNavigation from '@primes/tabs/outsourcing/OutgoingManagementTabNavigation';
import IncomingManagementTabNavigation from '@primes/tabs/outsourcing/IncomingManagementTabNavigation';

// 수정 페이지들
import { OutsourcingVendorRegisterPage } from '@primes/pages/outsourcing/standard/OutsourcingVendorRegisterPage';
import { OutsourcingVendorEditPage } from '@primes/pages/outsourcing/standard/OutsourcingVendorEditPage';
import { OutsourcingProcessRegisterPage } from '@primes/pages/outsourcing/standard/OutsourcingProcessRegisterPage';
import { OutsourcingProcessEditPage } from '@primes/pages/outsourcing/standard/OutsourcingProcessEditPage';
import { OutgoingEditPage } from '@primes/pages/outsourcing/inoutgoing/OutgoingEditPage';
import { IncomingEditPage } from '@primes/pages/outsourcing/inoutgoing/IncomingEditPage';

export const OutsourcingServiceMenus: MenuType = {
	label: 'menuGroup.outsourcing',
	desc: 'menuGroup.outsourcingDesc',
	icon: 'Factory',
	children: [
		// Standard (기준) 모듈
		{
			name: 'menu.outsourcing_standard',
			to: '/outsourcing/standard/vendors/list', // 첫 번째 하위 메뉴로 이동
			icon: 'Settings',
			children: [
				{
					name: 'menu.outsourcing_vendors',
					to: '/outsourcing/standard/vendors/list',
					icon: 'Building2',
				},
				{
					name: 'menu.outsourcing_process_price',
					to: '/outsourcing/standard/process/list',
					icon: 'DollarSign',
				},
			],
		},
		// Outgoing Management (출고 관리) 모듈
		{
			name: 'menu.outsourcing_outgoing_management',
			to: '/outsourcing/outgoing/ready', // 첫 번째 하위 메뉴로 이동
			icon: 'ArrowRight',
			children: [
				{
					name: 'menu.outsourcing_out_ready_lot',
					to: '/outsourcing/outgoing/ready',
					icon: 'Clock',
				},
				{
					name: 'menu.outsourcing_outgoing',
					to: '/outsourcing/outgoing/status',
					icon: 'BarChart3',
				}
			],
		},
		// Incoming Management (입고 관리) 모듈
		{
			name: 'menu.outsourcing_incoming_management',
			to: '/outsourcing/incoming/ready', // 첫 번째 하위 메뉴로 이동
			icon: 'ArrowLeft',
			children: [
				{
					name: 'menu.outsourcing_in_ready_lot',
					to: '/outsourcing/incoming/ready',
					icon: 'Clock',
				},
				{
					name: 'menu.outsourcing_incoming',
					to: '/outsourcing/incoming/status',
					icon: 'BarChart3',
				}
			],
		},
	],
};

export const outsourcingRoutes = [
	// Standard (기준정보) 그룹 라우트
	{
		path: '/outsourcing/standard',
		children: [
			{
				path: 'vendors/list',
				element: <StandardTabNavigation activetab="vendors" />,
			},
			{
				path: 'process/list',
				element: <StandardTabNavigation activetab="process-price" />,
			},
			{
				path: 'vendors/register',
				element: <OutsourcingVendorRegisterPage />,
			},
			{
				path: 'vendors/edit/:id',
				element: <OutsourcingVendorEditPage />,
			},
			{
				path: 'process/register',
				element: <OutsourcingProcessRegisterPage />,
			},
			{
				path: 'process/edit/:id',
				element: <OutsourcingProcessEditPage />,
			},
		],
	},

	// Outgoing Management (출고 관리) 그룹 라우트
	{
		path: '/outsourcing/outgoing',
		children: [
			{
				path: 'ready',
				element: <OutgoingManagementTabNavigation activetab="ready" />,
			},
			{
				path: 'status',
				element: <OutgoingManagementTabNavigation activetab="status" />,
			},
			{
				path: 'edit/:id',
				element: <OutgoingEditPage />,
			},
		],
	},

	// Incoming Management (입고 관리) 그룹 라우트
	{
		path: '/outsourcing/incoming',
		children: [
			{
				path: 'ready',
				element: <IncomingManagementTabNavigation activetab="ready" />,
			},
			{
				path: 'status',
				element: <IncomingManagementTabNavigation activetab="status" />,
			},
			{
				path: 'edit/:id',
				element: <IncomingEditPage />,
			},
		],
	},
];
