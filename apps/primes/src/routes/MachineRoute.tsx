import { MenuType } from '@primes/types/menus';
import MachineTabNavigation from '@primes/tabs/machine/MachineTabNavigation';
import MachinePartTabNavigation from '@primes/tabs/machine/MachinePartTabNavigation';
import MachinePartRelationTabNavigation from '@primes/tabs/machine/MachinePartRelationTabNavigation';
import MachinePartOrderTabNavigation from '@primes/tabs/machine/MachinePartOrderTabNavigation';
import MachineRepairTabNavigation from '@primes/tabs/machine/MachineRepairTabNavigation';
import MachinePartOrderInTabNavigation from '@primes/tabs/machine/MachinePartOrderInTabNavigation';
import MachinePartUseInfoTabNavigation from '@primes/tabs/machine/MachinePartUseInfoTabNavigation';

export const MachineServiceMenus: MenuType = {
	label: 'menuGroup.machine',
	desc: 'menuGroup.machineDesc',
	icon: 'Wrench',
	children: [
		{
			name: 'menu.machine_info',
			to: '/machine/info/list',
			icon: 'Info',
		},
		{
			name: 'menu.machine_part_management',
			to: '/machine/part/list',
			icon: 'Package',
			children: [
				{
					name: 'menu.machine_part',
					to: '/machine/part/list',
					icon: 'Wrench',
				},
				{
					name: 'menu.machine_part_order',
					to: '/machine/part/order/list',
					icon: 'Order',
				},
				{
					name: 'menu.machine_part_order_in',
					to: '/machine/part/order/in/list',
					icon: 'Inbox',
				},
				{
					name: 'menu.machine_part_use_info',
					to: '/machine/part/useinfo/list',
					icon: 'Inbox',
				},
			],
		},
		{
			name: 'menu.machine_repair',
			to: '/machine/repair/list',
			icon: 'Wrench',
		},
		{
			name: 'menu.machine_part_relation',
			to: '/machine/machine-part-relation/list',
			icon: 'Wrench',
		},
	],
};

export const MachineRoutes = [
	{
		path: '/machine/info',
		children: [
			{
				path: 'list',
				element: <MachineTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/part',
		children: [
			{
				path: 'list',
				element: <MachinePartTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/part/relation',
		children: [
			{
				path: 'list',
				element: <MachinePartRelationTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/part/order',
		children: [
			{
				path: 'list',
				element: <MachinePartOrderTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/part/order/in',
		children: [
			{
				path: 'list',
				element: <MachinePartOrderInTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/part/useinfo',
		children: [
			{
				path: 'list',
				element: <MachinePartUseInfoTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/repair',
		children: [
			{
				path: 'list',
				element: <MachineRepairTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/machine/machine-part-relation',
		children: [
			{
				path: 'list',
				element: <MachinePartRelationTabNavigation activetab="list" />,
			},
		],
	},
];
