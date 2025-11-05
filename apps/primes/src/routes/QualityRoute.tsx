import { MenuType } from '@primes/types/menus';

// 품질검사 Tab Navigation들
import PatrolInspectionTabNavigation from '@primes/tabs/quality/PatrolInspectionTabNavigation';
import SelfInspectionTabNavigation from '@primes/tabs/quality/SelfInspectionTabNavigation';
import IncomingInspectionTabNavigation from '@primes/tabs/quality/IncomingInspectionTabNavigation';
import OutgoingInspectionTabNavigation from '@primes/tabs/quality/OutgoingInspectionTabNavigation';
import FinalInspectionTabNavigation from '@primes/tabs/quality/FinalInspectionTabNavigation';
import EquipmentDailyCheckTabNavigation from '@primes/tabs/quality/EquipmentDailyCheckTabNavigation';
import PeriodicInspectionTabNavigation from '@primes/tabs/quality/PeriodicInspectionTabNavigation';
import QualityPeriodicInspectionRegisterPage from '@primes/pages/quality/periodic-inspection/QualityPeriodicInspectionRegisterPage';
import PrecisionInspectionTabNavigation from '@primes/tabs/quality/PrecisionInspectionTabNavigation';
import QualityPrecisionInspectionRegisterPage from '@primes/pages/quality/precision-inspection/QualityPrecisionInspectionRegisterPage';
import SpecialCharacteristicsTabNavigation from '@primes/tabs/quality/SpecialCharacteristicsTabNavigation';
import CertificateTabNavigation from '@primes/tabs/quality/CertificateTabNavigation';
import QualityCertificateGeneratePage from '@primes/pages/quality/certificate/QualityCertificateGeneratePage';
import InspectionItemsTabNavigation from '@primes/tabs/quality/InspectionItemsTabNavigation';
import QualityPatrolInspectionRegisterPage from '@primes/pages/quality/patrol/QualityPatrolInspectionRegisterPage';
import {
	QualitySelfInspectionRegisterPage,
	QualitySelfInspectionEditPage,
	QualitySelfInspectionReportPage,
} from '@primes/pages/quality/self';
import {
	QualityIncomingInspectionRegisterPage,
	QualityIncomingInspectionEditPage,
	QualityIncomingInspectionReportPage,
} from '@primes/pages/quality/incoming';
import {
	QualityOutgoingInspectionRegisterPage,
	QualityOutgoingInspectionEditPage,
	QualityOutgoingInspectionReportPage,
} from '@primes/pages/quality/outgoing';
import {
	QualityFinalInspectionRegisterPage,
	QualityFinalInspectionEditPage,
	QualityFinalInspectionReportPage,
} from '@primes/pages/quality/final';
import {
	QualityEquipmentInspectionRegisterPage,
	QualityEquipmentInspectionEditPage,
	QualityEquipmentInspectionReportPage,
} from '@primes/pages/quality/equipment';
import { QualityPatrolInspectionReportPage } from '@primes/pages/quality/patrol';


export const QualityRoutes = [
	// 🔄 순회검사 (Patrol Inspection) - 라우트 비활성화
	/*
	{
		path: '/quality/patrol-inspection',
		children: [
			{
				path: 'list',
				element: <PatrolInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: <PatrolInspectionTabNavigation activetab="analysis" />,
			},
			{
				path: 'report/:reportId',
				element: <QualityPatrolInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualityPatrolInspectionRegisterPage />,
			},
			{
				path: ':id',
				element: <div>순회검사 상세/수정 페이지 (샘플)</div>,
			},
		],
	},
	*/

	// ⚡ 순회/자주검사 (Patrol/Self Inspection)
	{
		path: '/quality/self-inspection',
		children: [
			{
				path: 'list',
				element: <SelfInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: <SelfInspectionTabNavigation activetab="analysis" />,
			},
			{
				path: 'report/:reportId',
				element: <QualitySelfInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualitySelfInspectionRegisterPage />,
			},
			{
				path: 'edit/:id',
				element: <QualitySelfInspectionEditPage />,
			},
		],
	},

	// 📦 수입검사 (Incoming Inspection)
	{
		path: '/quality/incoming-inspection',
		children: [
			{
				path: 'list',
				element: <IncomingInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: (
					<IncomingInspectionTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'report/:reportId',
				element: <QualityIncomingInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualityIncomingInspectionRegisterPage />,
			},
			{
				path: 'edit/:id',
				element: <QualityIncomingInspectionEditPage />,
			},
		],
	},

	// 🚚 출하검사 (Outgoing Inspection)
	{
		path: '/quality/outgoing-inspection',
		children: [
			{
				path: 'list',
				element: <OutgoingInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: (
					<OutgoingInspectionTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'report/:reportId',
				element: <QualityOutgoingInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualityOutgoingInspectionRegisterPage />,
			},
			{
				path: 'edit/:id',
				element: <QualityOutgoingInspectionEditPage />,
			},
		],
	},

	// ✅ 최종검사 (Final Inspection)
	{
		path: '/quality/final-inspection',
		children: [
			{
				path: 'list',
				element: <FinalInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: <FinalInspectionTabNavigation activetab="analysis" />,
			},
			{
				path: 'report/:reportId',
				element: <QualityFinalInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualityFinalInspectionRegisterPage />,
			},
			{
				path: 'edit/:id',
				element: <QualityFinalInspectionEditPage />,
			},
		],
	},

	// 🔧 설비일상점검 (Equipment Daily Check)
	{
		path: '/quality/equipment-daily-check',
		children: [
			{
				path: 'list',
				element: <EquipmentDailyCheckTabNavigation activetab="list" />,
			},
			{
				path: 'analysis',
				element: (
					<EquipmentDailyCheckTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'report/:reportId',
				element: <QualityEquipmentInspectionReportPage />,
			},
			{
				path: 'register',
				element: <QualityEquipmentInspectionRegisterPage />,
			},
			{
				path: 'edit/:id',
				element: <QualityEquipmentInspectionEditPage />,
			},
		],
	},

	// ⭐ 특별특성 관리 (Special Characteristics) - Tab 구조
	{
		path: '/quality/special-characteristics',
		children: [
			{
				path: 'xr-analysis',
				element: (
					<SpecialCharacteristicsTabNavigation activetab="xr-analysis" />
				),
			},
			// 추후 확장을 위한 예시 (주석처리)
			/*
			{
				path: 'statistics',
				element: <SpecialCharacteristicsTabNavigation activetab="statistics" />,
			},
			{
				path: 'reports',
				element: <SpecialCharacteristicsTabNavigation activetab="reports" />,
			},
			*/
		],
	},

	// 🔧 검사항목 관리 (Inspection Items Management)
	{
		path: '/quality/inspection-items',
		children: [
			{
				path: 'patrol',
				element: <InspectionItemsTabNavigation activetab="patrol" />,
			},
			{
				path: 'self',
				element: <InspectionItemsTabNavigation activetab="self" />,
			},
			{
				path: 'incoming',
				element: <InspectionItemsTabNavigation activetab="incoming" />,
			},
			{
				path: 'outgoing',
				element: <InspectionItemsTabNavigation activetab="outgoing" />,
			},
			{
				path: 'final',
				element: <InspectionItemsTabNavigation activetab="final" />,
			},
			{
				path: 'machine',
				element: <InspectionItemsTabNavigation activetab="machine" />,
			},
			{
				path: 'periodic',
				element: <InspectionItemsTabNavigation activetab="periodic" />,
			},
			{
				path: 'precision',
				element: <InspectionItemsTabNavigation activetab="precision" />,
			},
		],
	},

	// 📅 정기검사 (Periodic Inspection)
	{
		path: '/quality/periodic-inspection',
		children: [
			{
				path: 'plan',
				element: <PeriodicInspectionTabNavigation activetab="plan" />,
			},
			{
				path: 'list',
				element: <PeriodicInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'calendar',
				element: (
					<PeriodicInspectionTabNavigation activetab="calendar" />
				),
			},
			{
				path: 'report',
				element: <PeriodicInspectionTabNavigation activetab="report" />,
			},
			{
				path: 'register',
				element: <QualityPeriodicInspectionRegisterPage />,
			},
			{
				path: ':id',
				element: <div>정기검사 상세/수정 페이지 (샘플)</div>,
			},
		],
	},

	// 🔍 정밀검사 (Precision Inspection)
	{
		path: '/quality/precision-inspection',
		children: [
			{
				path: 'list',
				element: <PrecisionInspectionTabNavigation activetab="list" />,
			},
			{
				path: 'report',
				element: (
					<PrecisionInspectionTabNavigation activetab="report" />
				),
			},
			{
				path: 'analysis',
				element: (
					<PrecisionInspectionTabNavigation activetab="analysis" />
				),
			},
			{
				path: 'register',
				element: <QualityPrecisionInspectionRegisterPage />,
			},
			{
				path: ':id',
				element: <div>정밀검사 상세/수정 페이지 (샘플)</div>,
			},
		],
	},

	// 📊 성적서 (Certificate/Report)
	{
		path: '/quality/certificate',
		children: [
			{
				path: 'list',
				element: <CertificateTabNavigation activetab="list" />,
			},
			{
				path: 'generate',
				element: <QualityCertificateGeneratePage />,
			},
			{
				path: 'template',
				element: <CertificateTabNavigation activetab="template" />,
			},
			{
				path: ':id',
				element: <div>성적서 상세/수정 페이지 (샘플)</div>,
			},
		],
	},
];

export const QualityServiceMenus: MenuType = {
	label: 'menuGroup.quality',
	desc: 'menuGroup.qualityDesc',
	icon: 'Shield',
	children: [
		// 🔧 검사항목 관리 (최상단으로 이동)
		{
			name: 'menu.quality_inspection_items',
			to: '/quality/inspection-items/patrol',
			icon: 'Settings',
			children: [
				{
					name: 'menu.quality_inspection_items_patrol',
					to: '/quality/inspection-items/patrol',
					icon: 'RotateCcw',
				},
				{
					name: 'menu.quality_inspection_items_self',
					to: '/quality/inspection-items/self',
					icon: 'Zap',
				},
				{
					name: 'menu.quality_inspection_items_incoming',
					to: '/quality/inspection-items/incoming',
					icon: 'Package',
				},
				{
					name: 'menu.quality_inspection_items_outgoing',
					to: '/quality/inspection-items/outgoing',
					icon: 'Truck',
				},
				{
					name: 'menu.quality_inspection_items_final',
					to: '/quality/inspection-items/final',
					icon: 'CheckCircle',
				},
				{
					name: 'menu.quality_inspection_items_machine',
					to: '/quality/inspection-items/machine',
					icon: 'Wrench',
				},
				{
					name: 'menu.quality_inspection_items_periodic',
					to: '/quality/inspection-items/periodic',
					icon: 'Calendar',
				},
				{
					name: 'menu.quality_inspection_items_precision',
					to: '/quality/inspection-items/precision',
					icon: 'Search',
				},
			],
		},

		// 🔄 순회검사 - 메뉴 비활성화
		/*
		{
			name: 'menu.quality_patrol_inspection',
			to: '/quality/patrol-inspection/list',
			icon: 'RotateCcw',
			children: [
				{
					name: 'menu.quality_patrol_inspection_list',
					to: '/quality/patrol-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_patrol_inspection_register',
					to: '/quality/patrol-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/patrol-inspection/analysis',
					icon: 'BarChart3',
				},
			],
		},
		*/

		// ⚡ 순회/자주검사
		{
			name: 'menu.quality_patrol_self_inspection',
			to: '/quality/self-inspection/list',
			icon: 'Zap',
			children: [
				{
					name: 'menu.quality_patrol_self_inspection_list',
					to: '/quality/self-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_patrol_self_inspection_register',
					to: '/quality/self-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/self-inspection/analysis',
					icon: 'BarChart3',
				},
			],
		},

		// 📦 수입검사
		{
			name: 'menu.quality_incoming_inspection',
			to: '/quality/incoming-inspection/list',
			icon: 'Package',
			children: [
				{
					name: 'menu.quality_incoming_inspection_list',
					to: '/quality/incoming-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_incoming_inspection_register',
					to: '/quality/incoming-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/incoming-inspection/analysis',
					icon: 'BarChart3',
				},
			],
		},

		// 🚚 출하검사
		{
			name: 'menu.quality_outgoing_inspection',
			to: '/quality/outgoing-inspection/list',
			icon: 'Truck',
			children: [
				{
					name: 'menu.quality_outgoing_inspection_list',
					to: '/quality/outgoing-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_outgoing_inspection_register',
					to: '/quality/outgoing-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/outgoing-inspection/analysis',
					icon: 'BarChart3',
				},
			],
		},

		// ✅ 최종검사
		{
			name: 'menu.quality_final_inspection',
			to: '/quality/final-inspection/list',
			icon: 'CheckCircle',
			children: [
				{
					name: 'menu.quality_final_inspection_list',
					to: '/quality/final-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_final_inspection_register',
					to: '/quality/final-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/final-inspection/analysis',
					icon: 'BarChart3',
				},
			],
		},

		// 🔧 설비일상점검
		{
			name: 'menu.quality_equipment_daily_check',
			to: '/quality/equipment-daily-check/list',
			icon: 'Wrench',
			children: [
				{
					name: 'menu.quality_equipment_daily_check_list',
					to: '/quality/equipment-daily-check/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_equipment_daily_check_register',
					to: '/quality/equipment-daily-check/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.analysis',
					to: '/quality/equipment-daily-check/analysis',
					icon: 'BarChart3',
				},
			],
		},

		// 📅 정기검사
		{
			name: 'menu.quality_periodic_inspection',
			to: '/quality/periodic-inspection/plan',
			icon: 'Calendar',
			children: [
				{
					name: 'menu.quality_periodic_inspection_plan',
					to: '/quality/periodic-inspection/plan',
					icon: 'CalendarPlus',
				},
				{
					name: 'menu.quality_periodic_inspection_list',
					to: '/quality/periodic-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_periodic_inspection_register',
					to: '/quality/periodic-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.quality_periodic_inspection_report',
					to: '/quality/periodic-inspection/report',
					icon: 'FileBarChart',
				},
				{
					name: 'menu.quality_periodic_inspection_calendar',
					to: '/quality/periodic-inspection/calendar',
					icon: 'CalendarDays',
				},
			],
		},

		// 🔍 정밀검사
		{
			name: 'menu.quality_precision_inspection',
			to: '/quality/precision-inspection/list',
			icon: 'Search',
			children: [
				{
					name: 'menu.quality_precision_inspection_list',
					to: '/quality/precision-inspection/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_precision_inspection_register',
					to: '/quality/precision-inspection/register',
					icon: 'PlusCircle',
				},
				{
					name: 'menu.quality_precision_inspection_report',
					to: '/quality/precision-inspection/report',
					icon: 'FileBarChart',
				},
				{
					name: 'menu.quality_precision_inspection_analysis',
					to: '/quality/precision-inspection/analysis',
					icon: 'TrendingUp',
				},
			],
		},

		// ⭐ 특별특성 관리 - 정밀검사와 성적서 사이로 이동
		{
			name: 'menu.quality_special_characteristics',
			to: '/quality/special-characteristics/xr-analysis',
			icon: 'Star',
			children: [
				{
					name: 'menu.quality_special_characteristics_xr',
					to: '/quality/special-characteristics/xr-analysis',
					icon: 'BarChart3',
				},
				// 추후 확장을 위한 예시 (주석처리)
				/*
				{
					name: 'menu.quality_special_characteristics_statistics',
					to: '/quality/special-characteristics/statistics',
					icon: 'TrendingUp',
				},
				{
					name: 'menu.quality_special_characteristics_reports',
					to: '/quality/special-characteristics/reports',
					icon: 'FileText',
				},
				*/
			],
		},

		// 📊 성적서
		{
			name: 'menu.quality_certificate',
			to: '/quality/certificate/list',
			icon: 'Award',
			children: [
				{
					name: 'menu.quality_certificate_list',
					to: '/quality/certificate/list',
					icon: 'FileText',
				},
				{
					name: 'menu.quality_certificate_generate',
					to: '/quality/certificate/generate',
					icon: 'FilePlus',
				},
				{
					name: 'menu.quality_certificate_template',
					to: '/quality/certificate/template',
					icon: 'Settings',
				},
			],
		},
	],
};
