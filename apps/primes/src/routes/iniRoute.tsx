import { MenuType } from '@primes/types/menus';
import {
	UsersTabNavigation,
	VendorTabNavigation,
	CodesTabNavigation,
	ItemTabNavigation,
	BomTabNavigation,
	TerminalTabNavigation,
	IniProgressListPage,
} from './lazyRoutes';
// import ItemProgressTabNavigation from '@primes/tabs/ini/ItemProgressTabNavigation';
// import VendorsTabNavigation from '@primes/tabs/ini/VendorsTabNavigation';
// import IniCodeTabNavigation from '@primes/tabs/IniCodeTabNavigation';
// import IniItemTabNavigation from '@primes/tabs/InitItemTabNavigation';

export const InitServiceMenus: MenuType = {
	label: 'menuGroup.ini',
	desc: 'menuGroup.iniDesc',
	icon: 'Database',
	children: [
		{
			name: 'menu.ini_user',
			to: '/ini/user/list',
			children: [
				{
					name: 'menu.ini_user_list',
					icon: 'User',
					to: '/ini/user/list',
				},
				{
					name: 'menu.ini_user_group_list',
					icon: 'User',
					to: '/ini/user/group-list',
				},
			],
			icon: 'User',
		},
		{
			name: 'menu.ini_vendor',
			to: '/ini/vendor/list',
			icon: 'Building',
		},
		{
			name: 'menu.ini_item',
			to: 'ini/items/list',
			icon: 'Package',
		},
		{
			name: 'menu.ini_item_bom',
			to: 'ini/items/bom/status',
			icon: 'GitBranch',
		},
		{
			name: 'menu.ini_terminal',
			to: '/ini/terminal/list',
			icon: 'Settings',
		},
		{
			name: 'menu.ini_code',
			to: '/ini/code/list',
			icon: 'Settings',
		},
	],
};

export const iniRoutes = [
	{
		path: '/ini/user',
		children: [
			{
				path: 'list',
				element: <UsersTabNavigation activetab="list" />,
			},
			{
				path: 'group-list',
				element: <UsersTabNavigation activetab="group-list" />,
			},
		],
	},
	{
		path: '/ini/vendor',
		children: [
			{
				path: 'list',
				element: <VendorTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/ini/code',
		children: [
			{
				path: 'list',
				element: <CodesTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/ini/items',
		children: [
			{
				path: 'list',
				element: <ItemTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/ini/items/bom',
		children: [
			{
				path: 'status',
				element: <BomTabNavigation activetab="status" />,
			},
			{
				path: 'tree-view',
				element: <BomTabNavigation activetab="tree-view" />,
			},
		],
	},
	{
		path: '/ini/item-progress/:productId',
		element: <IniProgressListPage />,
	},
	{
		path: '/ini/terminal',
		children: [
			{
				path: 'list',
				element: <TerminalTabNavigation />,
			},
		],
	},
];
