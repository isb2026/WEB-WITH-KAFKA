import React from 'react';
import { MenuType } from '@primes/types/menus';

// Working (작업 관리)
import ProductionWorkingTabNavigation from '@primes/tabs/production/ProductionWorkingTabNavigation';
import ProductionWorkingRegisterPage from '@primes/pages/production/working/ProductionWorkingRegisterPage';

// 작업지시
import CommandTabNavigation from '@primes/tabs/production/CommandTabNavigation';
import CommandRegisterPage from '@primes/pages/production/command/ProductionCommandRegisterPage';

// Lot
// import ProductionLotTabNavigation from '@primes/tabs/production/ProductionLotTabNavigation';

// 비가동 (Notwork)
import ProductionNotworkTabNavigation from '@primes/tabs/production/ProductionNotworkTabNavigation';
import { ProductionNotworkRegisterPage } from '@primes/pages/production/notwork/ProductionNotworkRegisterPage';

// 작업자 (Working User)
// import ProductionWorkingUserTabNavigation from '@primes/tabs/production/ProductionWorkingUserTabNavigation';

// 생산계획
import ProductionPlanTabNavigation from '@primes/tabs/production/ProductionPlanTabNavigation';

// 자재요청
// import MaterialRequestTabNavigation from '@primes/tabs/production/MaterialRequestTabNavigation';

// 자재출고
// import MaterialOutgoingTabNavigation from '@primes/tabs/production/MaterialOutgoingTabNavigation';

// 자재관리 통합
import MaterialManagementTabNavigation from '@primes/tabs/production/MaterialManagementTabNavigation';
import { ProductionMaterialOutgoingRegisterPage } from '@primes/pages/production/material-outgoing/ProductionMaterialOutgoingRegisterPage';

// 금형관리 통합
import MoldManagementTabNavigation from '@primes/tabs/production/MoldManagementTabNavigation';
import ProductionMoldMaintenanceDetailPage from '@primes/pages/production/mold/ProductionMoldMaintenanceDetailPage';
import { MoldInoutInformationRegisterPage } from '@primes/pages/mold/mold-inout-information/MoldInoutInformationRegisterPage';

// 품질관리 통합
import ProductionQualityTabNavigation from '@primes/tabs/production/ProductionQualityTabNavigation';
import ProductionQualityInspectionRegisterPage from '@primes/pages/quality/self/QualitySelfInspectionRegisterPage';
import ProductionQualityInspectionDetailPage from '@primes/pages/quality/self/QualitySelfInspectionReportPage';

// 불량관리 통합
import ProductionDefectsTabNavigation from '@primes/tabs/production/ProductionDefectsTabNavigation';
import ProductionQualityDefectsListPage from '@primes/pages/production/quality/ProductionQualityDefectsListPage';
import ProductionQualityDefectsDetailPage from '@primes/pages/production/quality/ProductionQualityDefectsDetailPage';

// 작업 캘린더
import WorkCalendarTabNavigation from '@primes/tabs/production/WorkCalendarTabNavigation';

// Working 관련 서브 모듈들
import WorkingBufferTabNavigation from '@primes/tabs/production/WorkingBufferTabNavigation';
import WorkingInLotTabNavigation from '@primes/tabs/production/WorkingInLotTabNavigation';
import WorkingTransactionTabNavigation from '@primes/tabs/production/WorkingTransactionTabNavigation';

export const ProductionRoutes = [
	// 1. 📅 생산 계획 (Plan)
	{
		path: '/production/plan',
		children: [
			{
				path: 'monthly',
				element: <ProductionPlanTabNavigation activetab="monthly" />,
			},
			{
				path: 'vs-actual',
				element: <ProductionPlanTabNavigation activetab="vs-actual" />,
			},
			{
				path: 'calendar',
				element: <ProductionPlanTabNavigation activetab="calendar" />,
			},
			// 하위 호환성을 위한 기존 경로
			{
				path: 'list',
				element: <ProductionPlanTabNavigation activetab="monthly" />,
			},
			{
				path: 'status',
				element: <ProductionPlanTabNavigation activetab="vs-actual" />,
			},
		],
	},
	// 2. 📋 일일 작업지시 (Command)
	{
		path: '/production/command',
		children: [
			{
				path: 'list',
				element: <CommandTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: <CommandTabNavigation activetab="analysis" />,
			},
			// {
			// 	path: 'worker-management',
			// 	element: <CommandTabNavigation activetab="worker-management" />,
			// },
			{
				path: 'lot-status',
				element: (
					<ProductionWorkingTabNavigation activetab="lot-status" />
				),
			},
			{
				path: 'mold-setup',
				element: <CommandTabNavigation activetab="mold-setup" />,
			},
			{
				path: ':id',
				element: <CommandRegisterPage />, // Edit mode
			},
		],
	},
	// 3. 📊 생산실적 (Working)
	{
		path: '/production/working',
		children: [
			{
				path: 'related-list',
				element: (
					<ProductionWorkingTabNavigation activetab="related-list" />
				),
			},
			{
				path: 'list',
				element: <ProductionWorkingTabNavigation activetab="list" />,
			},
			{
				path: 'register',
				element: <ProductionWorkingRegisterPage />,
			},
			{
				path: 'analysis',
				element: (
					<ProductionWorkingTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'realtime',
				element: (
					<ProductionWorkingTabNavigation activetab="realtime" />
				),
			},
			{
				path: ':id',
				element: <ProductionWorkingRegisterPage />, // Edit mode
			},
		],
	},
	// 4. 📦 자재관리 (Material)
	{
		path: '/production/material/outgoing',
		children: [
			{
				path: 'outgoing-list',
				element: (
					<MaterialManagementTabNavigation activetab="outgoing" />
				),
			},
			{
				path: 'register',
				element: <ProductionMaterialOutgoingRegisterPage />,
			},
		],
	},
	{
		path: '/production/material/request',
		children: [
			{
				path: 'request-list',
				element: (
					<MaterialManagementTabNavigation activetab="request" />
				),
			},
		],
	},
	{
		path: '/production/material',
		children: [
			{
				path: 'analysis',
				element: (
					<MaterialManagementTabNavigation activetab="analysis" />
				),
			},
		],
	},
	// 5. 🔧 금형관리 (Mold Management) - 통합 탭
	{
		path: '/production/mold',
		children: [
			{
				path: 'setup',
				element: <MoldManagementTabNavigation activetab="setup" />,
			},
			{
				path: 'input',
				element: <MoldInoutInformationRegisterPage />,
			},
			{
				path: 'maintenance',
				element: (
					<MoldManagementTabNavigation activetab="maintenance" />
				),
			},
			{
				path: 'maintenance/:moldCode',
				element: <ProductionMoldMaintenanceDetailPage />,
			},
			{
				path: 'analysis',
				element: <MoldManagementTabNavigation activetab="analysis" />,
			},
		],
	},
	// 6. 🔍 품질관리 (Quality Management) - 통합 탭
	{
		path: '/production/quality',
		children: [
			{
				path: 'inspection/list',
				element: (
					<ProductionQualityTabNavigation activetab="inspection" />
				),
			},
			{
				path: 'inspection/register',
				element: <ProductionQualityInspectionRegisterPage />,
			},
			{
				path: 'inspection/:reportId',
				element: <ProductionQualityInspectionDetailPage />,
			},
			{
				path: 'analysis',
				element: (
					<ProductionQualityTabNavigation activetab="analysis" />
				),
			},
		],
	},
	// 6-1. 📋 불량 관리 (Defects Management) - 탭 구조
	{
		path: '/production/defects',
		children: [
			{
				path: 'status',
				element: <ProductionDefectsTabNavigation activetab="status" />,
			},
			{
				path: 'status/:defectId',
				element: <ProductionQualityDefectsDetailPage />,
			},
			{
				path: 'register',
				element: <ProductionQualityDefectsListPage />, // 임시, 나중에 등록 페이지로 교체
			},
			{
				path: 'analysis',
				element: (
					<ProductionDefectsTabNavigation activetab="analysis" />
				),
			},
		],
	},
	// 8. ⚠️ 비가동관리 (NotWork)
	{
		path: '/production/notwork',
		children: [
			{
				path: 'related-list',
				element: <ProductionNotworkTabNavigation activetab="status" />,
			},
			{
				path: 'status',
				element: <ProductionNotworkTabNavigation activetab="status" />,
			},
			{
				path: 'analysis',
				element: (
					<ProductionNotworkTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'register',
				element: (
					<ProductionNotworkRegisterPage
						mode="create"
						type="master"
						onSubmit={() => {}}
					/>
				),
			},
			{
				path: ':id',
				element: (
					<ProductionNotworkRegisterPage
						mode="edit"
						type="master"
						onSubmit={() => {}}
					/>
				), // Edit mode
			},
		],
	},
	// 9. 👥 작업자 관리 (Working User) - 임시 주석처리
	// {
	// 	path: '/production/working-user',
	// 	children: [
	// 		{
	// 			path: 'list',
	// 			element: <CommandTabNavigation activetab="worker-management" />,
	// 		},
	// 	],
	// },
	// 10. 📅 작업 캘린더 (Work Calendar) - 기존 유지
	{
		path: '/production/work-calendar',
		children: [
			{
				path: 'list',
				element: <WorkCalendarTabNavigation activetab="list" />,
			},
		],
	},
	// 11. 📊 LOT 관리 (Lot) - 기존 유지
	// {
	// 	path: '/production/lot',
	// 	children: [
	// 		{
	// 			path: 'list',
	// 			element: <ProductionLotTabNavigation activetab="list" />,
	// 		},
	// 	],
	// },
	// 🔧 기존 Working 서브 모듈들 (하위 메뉴에서 제거했지만 라우트는 유지)
	{
		path: '/production/working-buffer',
		children: [
			{
				path: 'list',
				element: <WorkingBufferTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/production/working-in-lot',
		children: [
			{
				path: 'list',
				element: <WorkingInLotTabNavigation activetab="list" />,
			},
		],
	},
	{
		path: '/production/working-transaction',
		children: [
			{
				path: 'list',
				element: <WorkingTransactionTabNavigation activetab="list" />,
			},
		],
	},
];
export const ProductionServiceMenus: MenuType = {
	label: 'menuGroup.production',
	desc: 'menuGroup.productionDesc',
	icon: 'Factory',
	children: [
		// 1. 📅 생산 계획
		{
			name: 'menu.production_plan_management',
			to: '/production/plan/monthly',
			icon: 'Calendar',
			children: [
				{
					name: 'menu.production_plan_monthly',
					to: '/production/plan/monthly',
					icon: 'Calendar',
				},
				{
					name: 'menu.production_plan_vs_actual',
					to: '/production/plan/vs-actual',
					icon: 'TrendingUp',
				},
				{
					name: 'menu.production_work_calendar',
					to: '/production/plan/calendar',
					icon: 'CalendarDays',
				},
			],
		},
		// 2. ⚡ 작업 지시
		{
			name: 'menu.production_work_order',
			to: '/production/command/list',
			icon: 'ClipboardList',
			children: [
				{
					name: 'menu.production_command_status',
					to: '/production/command/list',
					icon: 'FileText',
				},
				{
					name: 'menu.production_command_analysis',
					to: '/production/command/analysis',
					icon: 'BarChart3',
				},
				// {
				// 	name: 'menu.production_worker_management',
				// 	to: '/production/command/worker-management',
				// 	icon: 'Users',
				// },
			],
		},
		// 3. 🔧 생산 실적
		{
			name: 'menu.production_performance',
			to: '/production/working/related-list',
			icon: 'Cog',
			children: [
				{
					name: 'menu.production_detail_list',
					to: '/production/working/related-list',
					icon: 'Table',
				},
				{
					name: 'menu.production_overall_status',
					to: '/production/working/list',
					icon: 'FileText',
				},
				{
					name: 'menu.production_lot_status',
					to: '/production/command/lot-status',
					icon: 'Package',
				},
				{
					name: 'menu.production_analysis',
					to: '/production/working/analysis',
					icon: 'BarChart3',
				},
				{
					name: 'menu.production_working_register',
					to: '/production/working/register',
					icon: 'Plus',
				},
			],
		},
		// 4. 📦 자재 관리
		{
			name: 'menu.production_material_management',
			to: '/production/material/request/request-list',
			icon: 'Package2',
			children: [
				{
					name: 'menu.production_material_input_request',
					to: '/production/material/request/request-list',
					icon: 'Package',
				},
				{
					name: 'menu.production_material_outgoing_status',
					to: '/production/material/outgoing/outgoing-list',
					icon: 'Truck',
				},
				// {
				// 	name: 'menu.production_material_usage_analysis',
				// 	to: '/production/material/analysis',
				// 	icon: 'BarChart3',
				// },
			],
		},
		// 5. 🔧 금형 관리
		{
			name: 'menu.production_mold_management',
			to: '/production/mold/setup',
			icon: 'Settings',
			children: [
				{
					name: 'menu.production_mold_setup_status',
					to: '/production/mold/setup',
					icon: 'Settings',
				},
				{
					name: '금형 투입',
					to: '/production/mold/input',
					icon: 'ArrowDownToLine',
				},
				{
					name: 'menu.production_mold_maintenance_status',
					to: '/production/mold/maintenance',
					icon: 'Wrench',
				},
				{
					name: 'menu.production_mold_usage_analysis',
					to: '/production/mold/analysis',
					icon: 'BarChart3',
				},
			],
		},
		// 6. 🔍 품질 관리
		{
			name: 'menu.production_quality_management',
			to: '/production/quality/inspection/list',
			icon: 'Search',
			children: [
				{
					name: 'menu.production_quality_self_inspection',
					to: '/production/quality/inspection/list',
					icon: 'CheckCircle',
				},
				{
					name: 'menu.production_quality_inspection_register',
					to: '/production/quality/inspection/register',
					icon: 'Plus',
				},
				{
					name: 'menu.production_quality_analysis',
					to: '/production/quality/analysis',
					icon: 'BarChart3',
				},
			],
		},
		// 6-1. ⚠️ 불량 관리
		{
			name: 'menu.production_defects_management',
			to: '/production/defects/status',
			icon: 'AlertTriangle',
			children: [
				{
					name: 'menu.production_defects_status',
					to: '/production/defects/status',
					icon: 'AlertCircle',
				},
				{
					name: 'menu.production_defects_analysis',
					to: '/production/defects/analysis',
					icon: 'TrendingDown',
				},
			],
		},
		// 7. ⚠️ 비가동 관리
		{
			name: 'menu.production_downtime_management',
			to: '/production/notwork/status',
			icon: 'AlertTriangle',
			children: [
				{
					name: 'menu.production_downtime_status',
					to: '/production/notwork/status',
					icon: 'Clock',
				},
				{
					name: 'menu.production_downtime_analysis',
					to: '/production/notwork/analysis',
					icon: 'BarChart3',
				},
			],
		},
	],
};
