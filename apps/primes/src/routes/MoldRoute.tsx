import { MenuType } from '@primes/types/menus';

// 금형현황
import MoldTabNavigation from '@primes/tabs/mold/MoldTabNavigation';

// 금형발주
import MoldOrderTabNavigation from '@primes/tabs/mold/MoldOrderTabNavigation';
import MoldOrderRegisterPage from '@primes/pages/mold/mold-order/MoldOrderRegisterPage';

// 수명관리금형 (통합 탭 네비게이션)
import MoldInstanceTabNavigation from '@primes/tabs/mold/MoldInstanceTabNavigation';

// 금형 불출
import MoldInoutInformationTabNavigation from '@primes/tabs/mold/MoldInoutInformationTabNavigation';
import MoldInoutInformationRegisterPage from '@primes/pages/mold/mold-inout-information/MoldInoutInformationRegisterPage';

// 금형세트
import MoldSetTabNavigation from '@primes/tabs/mold/MoldSetTabNavigation';
import MoldSetRegisterPage from '@primes/pages/mold/mold-set/MoldSetRegisterPage';

// 금형 BOM
import MoldBomTabNavigation from '@primes/tabs/mold/MoldBomTabNavigation';
import MoldBomRegisterPage from '@primes/pages/mold/mold-bom/MoldBomRegisterPage';

// 제품별 금형
import MoldItemRelationTabNavigation from '@primes/tabs/mold/MoldItemRelationTabNavigation';

// 금형 입고 
import MoldIngoingRegisterPage from '@primes/pages/mold/mold-ingoing/MoldIngoingRegisterPage';

// 금형 투입 회수
import MoldInputRetrieveRegisterPage from '@primes/pages/mold/mold-input/MoldInputRetrieveRegisterPage';

export const MoldRoutes = [
	{
		path: '/mold/mold',
		children: [
			{
				path: 'master-list',
				element: <MoldTabNavigation activetab="list" />,
			},
			{
				path: 'instance-list',
				element: <MoldTabNavigation activetab="instance-list" />,
			},
		],
	},
	{
		path: '/mold/orders',
		children: [
			{
				path: 'related-list',
				element: <MoldOrderTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <MoldOrderTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <MoldOrderRegisterPage />,
			},
		],
	},
	{
		path: '/mold/orders',
		children: [
			{
				path: 'related-list',
				element: <MoldOrderTabNavigation activetab="related-list" />,
			},
			{
				path: 'list',
				element: <MoldOrderTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <MoldOrderRegisterPage />,
			},
			{
				path: 'ingoing-list',
				element: <MoldOrderTabNavigation activetab="ingoing-list" />,
			},
			{
				path: 'ingoing-register',
				element: <MoldIngoingRegisterPage />,
			},
		],
	},
	{
		path: '/mold/instance',
		children: [
			{
				path: 'instance-list',
				element: <MoldInstanceTabNavigation activetab="instance-list" />,
			},
			{
				path: 'dispose-list',
				element: <MoldInstanceTabNavigation activetab="dispose-list" />,
			},
			{
				path: 'grade-list',
				element: <MoldInstanceTabNavigation activetab="grade-list" />,
			},
			{
				path: 'life-list',
				element: <MoldInstanceTabNavigation activetab="life-list" />,
			},
			{
				path: 'repair-list',
				element: <MoldInstanceTabNavigation activetab="repair-list" />,
			},
			{
				path: 'using-list',
				element: <MoldInstanceTabNavigation activetab="using-list" />,
			},
		],
	},
	{
		path: '/mold/inout',
		children: [
			{
				path: 'list',
				element: <MoldInoutInformationTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <MoldInoutInformationRegisterPage />,
			},
		],
	},
	{
		path: '/mold/set',
		children: [
			{
				path: 'related-list',
				element: <MoldSetTabNavigation activetab="related-list" />,
			},
			{
				path: 'register',
				element: <MoldSetRegisterPage />,
			},
			{
				path: 'register',
				element: <MoldSetRegisterPage />,
			},
		],
	},
	{
		path: '/mold/bom',
		children: [
			{
				path: 'related-list',
				element: <MoldBomTabNavigation activetab="related-list" />,
			},
			{
				path: 'register',
				element: <MoldBomRegisterPage />,
			},
		],
	},
	{
		path: '/mold/item-relation',
		children: [
			{
				path: 'list',
				element: <MoldItemRelationTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/mold/inout',
		children: [
			{
				path: 'list',
				element: <MoldInoutInformationTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <MoldInoutInformationRegisterPage />,
			},
			{
				path: 'input/register',
				element: <MoldInoutInformationRegisterPage />,
			},
		],
	},
];

export const MoldServiceMenus: MenuType = {
	label: 'menuGroup.mold',
	desc: 'menuGroup.moldDesc',
	icon: 'Settings',
	children: [
		{
			name: 'menu.mold_mold',
			to: '/mold/mold/master-list',
			icon: 'Database',
			children: [
				{
					name: 'menu.mold_master_list',
					to: 'mold/mold/master-list',
					icon: 'Database',
				},
				{
					name: 'menu.mold_instance_list',
					to: 'mold/mold/instance-list',
					icon: 'Package',
				},
			],
		},
		{
			name: 'menu.mold_order_management',
			to: '/mold/orders/related-list',
			icon: 'ShoppingCart',
			children: [
				{
					name: 'menu.mold_orders_related_list',
					to: 'mold/orders/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.mold_orders_list',
					to: 'mold/orders/list',
					icon: 'FileText',
				},
				{
					name: 'menu.mold_orders_ingoingList',
					to: 'mold/orders/ingoing-list',
					icon: 'FileText',
				},
				{
					name: 'menu.mold_orders_register',
					to: 'mold/orders/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.mold_orders_ingoingRegister',
					to: 'mold/orders/ingoing-register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.real_mold_management',
			to: '/mold/instance/instance-list',
			icon: 'Settings',
			children: [
				{
					name: 'menu.mold_instance_list',
					to: 'mold/instance/instance-list',
					icon: 'Package',
				},
				{
					name: 'menu.mold_using_info',
					to: 'mold/instance/using-list',
					icon: 'Activity',
				},
				{
					name: 'menu.mold_dispose',
					to: 'mold/instance/dispose-list',
					icon: 'Trash',
				},
				{
					name: 'menu.mold_life',
					to: 'mold/instance/life-list',
					icon: 'Clock',
				},
				{
					name: 'menu.mold_repair',
					to: 'mold/instance/repair-list',
					icon: 'Wrench',
				},
				{
					name: 'menu.mold_grade',
					to: 'mold/instance/grade-list',
					icon: 'Star',
				},
			],
		},
		{
			name: 'menu.mold_inoutinfo',
			to: '/mold/inout/list',
			icon: 'MoldInout',
			children: [
				{
					name: 'menu.mold_inout_list',
					to: 'mold/inout/list',
					icon: 'FileText',
				},
				{
					name: 'menu.mold_inout_input_collect',
					to: 'mold/inout/input/register',
					icon: 'ArrowDownToLine',
				},
			],
		},
		{
			name: 'menu.mold_bom',
			to: '/mold/bom/related-list',
			icon: 'Boxes',
			children: [
				{
					name: 'menu.mold_bom_related_list',
					to: 'mold/bom/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.mold_bom_register',
					to: 'mold/bom/register',
					icon: 'PlusCircle',
				},
			],
		},
		{
			name: 'menu.mold_set',
			to: '/mold/set/related-list',
			icon: 'Boxes',
			children: [
				{
					name: 'menu.mold_set_list',
					to: 'mold/set/related-list',
					icon: 'Package',
				},
				{
					name: 'menu.mold_set_register',
					to: 'mold/set/register',
					icon: 'PlusCircle',
				},
			],
		},
	],
};
