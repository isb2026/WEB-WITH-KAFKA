import React from 'react';
import { MenuType } from '@primes/types/menus';

// QMS 페이지들 (추후 구현)
// import CheckingSpecListPage from '@primes/pages/qms/checking-spec/CheckingSpecListPage';
// import CheckingHeadTabNavigation from '@primes/tabs/qms/CheckingHeadTabNavigation';
// import CheckingSampleTabNavigation from '@primes/tabs/qms/CheckingSampleTabNavigation';
// import QmsAnalysisPage from '@primes/pages/qms/analysis/QmsAnalysisPage';
// import QmsDashboardPage from '@primes/pages/qms/dashboard/QmsDashboardPage';

export const QmsServiceMenus: MenuType = {
	label: 'menuGroup.qms',
	desc: 'menuGroup.qmsDesc',
	icon: 'ShieldCheck', // 품질보증 아이콘
	children: [
		// 🎯 QMS 대시보드 - 전체 품질 현황 한눈에
		{
			name: 'menu.qms_dashboard',
			to: '/qms/dashboard',
			icon: 'BarChart3',
			children: [
				{
					name: 'menu.qms_dashboard_overview',
					to: '/qms/dashboard',
					icon: 'PieChart',
				},
			],
		},

		// 📋 검사 규격 관리 - 핵심 기능
		{
			name: 'menu.qms_checking_spec',
			to: '/qms/checking-spec/list',
			icon: 'ClipboardCheck',
			children: [
				{
					name: 'menu.qms_checking_spec_list',
					to: '/qms/checking-spec/list',
					icon: 'FileText',
				},
				{
					name: 'menu.qms_checking_spec_item_master_detail',
					to: '/qms/checking-spec/item-master-detail',
					icon: 'Table',
				},
				{
					name: 'menu.qms_checking_spec_machine_master_detail',
					to: '/qms/checking-spec/machine-master-detail',
					icon: 'Cog',
				},
				{
					name: 'menu.qms_checking_spec_mold_master_detail',
					to: '/qms/checking-spec/mold-master-detail',
					icon: 'Package',
				},
				{
					name: 'menu.qms_checking_spec_register',
					to: '/qms/checking-spec/register',
					icon: 'PlusCircle',
				},
			],
		},

		// 🗂️ 검사 헤드 관리 - 검사 그룹 관리
		{
			name: 'menu.qms_checking_head',
			to: '/qms/checking-head/list',
			icon: 'FolderOpen',
			children: [
				{
					name: 'menu.qms_checking_head_list',
					to: '/qms/checking-head/list',
					icon: 'FileText',
				},
				{
					name: 'menu.qms_checking_head_register',
					to: '/qms/checking-head/register',
					icon: 'PlusCircle',
				},
			],
		},

		// 🧪 검사 샘플 관리 - 실제 검사 데이터
		{
			name: 'menu.qms_checking_sample',
			to: '/qms/checking-sample/list',
			icon: 'TestTube',
			children: [
				{
					name: 'menu.qms_checking_sample_list',
					to: '/qms/checking-sample/list',
					icon: 'FileText',
				},
				{
					name: 'menu.qms_checking_sample_analysis',
					to: '/qms/checking-sample/analysis',
					icon: 'TrendingUp',
				},
				{
					name: 'menu.qms_checking_sample_register',
					to: '/qms/checking-sample/register',
					icon: 'PlusCircle',
				},
			],
		},

		// 📊 품질 분석 - 통계 및 트렌드
		{
			name: 'menu.qms_analysis',
			to: '/qms/analysis/quality-trends',
			icon: 'TrendingUp',
			children: [
				{
					name: 'menu.qms_analysis_quality_trends',
					to: '/qms/analysis/quality-trends',
					icon: 'LineChart',
				},
				{
					name: 'menu.qms_analysis_defect_analysis',
					to: '/qms/analysis/defect-analysis',
					icon: 'AlertTriangle',
				},
				{
					name: 'menu.qms_analysis_control_chart',
					to: '/qms/analysis/control-chart',
					icon: 'BarChart2',
				},
				{
					name: 'menu.qms_analysis_capability_study',
					to: '/qms/analysis/capability-study',
					icon: 'Target',
				},
			],
		},

		// 📈 품질 리포트 - 정기 보고서
		{
			name: 'menu.qms_reports',
			to: '/qms/reports/monthly',
			icon: 'FileBarChart',
			children: [
				{
					name: 'menu.qms_reports_monthly',
					to: '/qms/reports/monthly',
					icon: 'Calendar',
				},
				{
					name: 'menu.qms_reports_weekly',
					to: '/qms/reports/weekly',
					icon: 'CalendarDays',
				},
				{
					name: 'menu.qms_reports_daily',
					to: '/qms/reports/daily',
					icon: 'CalendarCheck',
				},
				{
					name: 'menu.qms_reports_custom',
					to: '/qms/reports/custom',
					icon: 'Settings',
				},
			],
		},

		// ⚙️ 시스템 설정 - QMS 환경설정
		{
			name: 'menu.qms_settings',
			to: '/qms/settings/inspection-types',
			icon: 'Settings',
			children: [
				{
					name: 'menu.qms_settings_inspection_types',
					to: '/qms/settings/inspection-types',
					icon: 'List',
				},
				{
					name: 'menu.qms_settings_formulas',
					to: '/qms/settings/formulas',
					icon: 'Calculator',
				},
				{
					name: 'menu.qms_settings_standards',
					to: '/qms/settings/standards',
					icon: 'Ruler',
				},
				{
					name: 'menu.qms_settings_notification',
					to: '/qms/settings/notification',
					icon: 'Bell',
				},
			],
		},
	],
};

export const QmsRoutes = [
	// 🎯 대시보드
	{
		path: '/qms/dashboard',
		element: <div>QMS Dashboard (추후 구현)</div>,
	},

	// 📋 검사 규격 관리
	{
		path: '/qms/checking-spec',
		children: [
			{
				path: 'list',
				element: <div>Checking Spec List (추후 구현)</div>,
			},
			{
				path: 'item-master-detail',
				element: (
					<div>Item-Checking Spec Master Detail (추후 구현)</div>
				),
			},
			{
				path: 'machine-master-detail',
				element: (
					<div>Machine-Checking Spec Master Detail (추후 구현)</div>
				),
			},
			{
				path: 'mold-master-detail',
				element: (
					<div>Mold-Checking Spec Master Detail (추후 구현)</div>
				),
			},
			{
				path: 'register',
				element: <div>Checking Spec Register (추후 구현)</div>,
			},
			{
				path: ':id',
				element: <div>Checking Spec Edit (추후 구현)</div>,
			},
		],
	},

	// 🗂️ 검사 헤드 관리
	{
		path: '/qms/checking-head',
		children: [
			{
				path: 'list',
				element: <div>Checking Head List (추후 구현)</div>,
			},
			{
				path: 'register',
				element: <div>Checking Head Register (추후 구현)</div>,
			},
			{
				path: ':id',
				element: <div>Checking Head Edit (추후 구현)</div>,
			},
		],
	},

	// 🧪 검사 샘플 관리
	{
		path: '/qms/checking-sample',
		children: [
			{
				path: 'list',
				element: <div>Checking Sample List (추후 구현)</div>,
			},
			{
				path: 'analysis',
				element: <div>Checking Sample Analysis (추후 구현)</div>,
			},
			{
				path: 'register',
				element: <div>Checking Sample Register (추후 구현)</div>,
			},
			{
				path: ':id',
				element: <div>Checking Sample Edit (추후 구현)</div>,
			},
		],
	},

	// 📊 품질 분석
	{
		path: '/qms/analysis',
		children: [
			{
				path: 'quality-trends',
				element: <div>Quality Trends Analysis (추후 구현)</div>,
			},
			{
				path: 'defect-analysis',
				element: <div>Defect Analysis (추후 구현)</div>,
			},
			{
				path: 'control-chart',
				element: <div>Control Chart (추후 구현)</div>,
			},
			{
				path: 'capability-study',
				element: <div>Process Capability Study (추후 구현)</div>,
			},
		],
	},

	// 📈 품질 리포트
	{
		path: '/qms/reports',
		children: [
			{
				path: 'monthly',
				element: <div>Monthly Quality Report (추후 구현)</div>,
			},
			{
				path: 'weekly',
				element: <div>Weekly Quality Report (추후 구현)</div>,
			},
			{
				path: 'daily',
				element: <div>Daily Quality Report (추후 구현)</div>,
			},
			{
				path: 'custom',
				element: <div>Custom Quality Report (추후 구현)</div>,
			},
		],
	},

	// ⚙️ 시스템 설정
	{
		path: '/qms/settings',
		children: [
			{
				path: 'inspection-types',
				element: <div>Inspection Types Settings (추후 구현)</div>,
			},
			{
				path: 'formulas',
				element: <div>Formula Settings (추후 구현)</div>,
			},
			{
				path: 'standards',
				element: <div>Standards Settings (추후 구현)</div>,
			},
			{
				path: 'notification',
				element: <div>Notification Settings (추후 구현)</div>,
			},
		],
	},
];
