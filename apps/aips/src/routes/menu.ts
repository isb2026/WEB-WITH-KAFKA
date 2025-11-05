import { MenuType } from '@aips/types/menus';

export const AipsServiceMenus: MenuType = {
	label: 'menuGroup.aips',
	icon: 'Database',
	children: [
		// 1. 기준정보 관리 (Master Data)
		{
			name: 'menu.aips_master_data',
			to: '/aips/master-data/product-master',
			icon: 'Database',
			children: [
				{
					name: 'menu.aips_product_master',
					to: '/aips/master-data/product-master',
					icon: 'Package',
				},
				{
					name: 'menu.aips_bom_management',
					to: '/aips/master-data/bom-management',
					icon: 'GitBranch',
				},
				{
					name: 'menu.aips_process_routing',
					to: '/aips/master-data/process-routing',
					icon: 'Route',
				},
			],
		},
		{
			name: 'menu.aips_resource_master',
			to: '/aips/resource/machine-master',
			icon: 'Settings',
			children: [
				{
					name: 'menu.aips_machine_master',
					to: '/aips/resource/machine-master',
					icon: 'Settings',
				},
				{
					name: 'menu.aips_work_center_management',
					to: '/aips/resource/work-center-management',
					icon: 'Building',
				},
				{
					name: 'menu.aips_work_calendar',
					to: '/aips/resource/work-calendar',
					icon: 'Calendar',
				},
			],
		},
		{
			name: 'menu.aips_mes_integration',
			to: '/aips/mes-integration/table-mapping',
			icon: 'Link',
			children: [
				{
					name: 'menu.aips_table_mapping',
					to: '/aips/mes-integration/table-mapping',
					icon: 'Table',
				},
				{
					name: 'menu.aips_code_conversion',
					to: '/aips/mes-integration/code-conversion',
					icon: 'Code',
				},
				{
					name: 'menu.aips_data_sync',
					to: '/aips/mes-integration/data-sync',
					icon: 'RefreshCw',
				},
			],
		},
		// 2. 수요 관리 (Demand)
		{
			name: 'menu.aips_demand_management',
			to: '/aips/demand/sales-order-management',
			icon: 'TrendingUp',
			children: [
				{
					name: 'menu.aips_sales_order_management',
					to: '/aips/demand/sales-order-management',
					icon: 'ShoppingCart',
				},
				{
					name: 'menu.aips_forecast_demand_management',
					to: '/aips/demand/forecast-demand-management',
					icon: 'TrendingUp',
				},
				{
					name: 'menu.aips_order_change_history',
					to: '/aips/demand/order-change-history',
					icon: 'History',
				},
				{
					name: 'menu.aips_monthly_demand_planning',
					to: '/aips/demand/monthly-demand-planning',
					icon: 'Calendar',
				},
				{
					name: 'menu.aips_weekly_demand_adjustment',
					to: '/aips/demand/weekly-demand-adjustment',
					icon: 'CalendarDays',
				},
				{
					name: 'menu.aips_atp',
					to: '/aips/demand/atp',
					icon: 'CheckCircle',
				},
			],
		},
		// 3. 월간 생산계획 (Master Planning)
		{
			name: 'menu.aips_master_planning',
			to: '/aips/master-planning/monthly-production-plan',
			icon: 'Calendar',
			children: [
				{
					name: 'menu.aips_monthly_production_plan',
					to: '/aips/master-planning/monthly-production-plan',
					icon: 'Calendar',
				},
				{
					name: 'menu.aips_weekly_production_plan',
					to: '/aips/master-planning/weekly-production-plan',
					icon: 'CalendarDays',
				},
				{
					name: 'menu.aips_production_leveling',
					to: '/aips/master-planning/production-leveling',
					icon: 'BarChart3',
				},
				{
					name: 'menu.aips_mrp',
					to: '/aips/master-planning/mrp',
					icon: 'Calculator',
				},
				{
					name: 'menu.aips_inventory_availability',
					to: '/aips/master-planning/inventory-availability',
					icon: 'Package',
				},
				{
					name: 'menu.aips_purchase_requests',
					to: '/aips/master-planning/purchase-requests',
					icon: 'ShoppingBag',
				},
				{
					name: 'menu.aips_capacity_analysis',
					to: '/aips/master-planning/capacity-analysis',
					icon: 'Activity',
				},
			],
		},
		// 4. 일일 작업지시 (Detail Scheduling)
		{
			name: 'menu.aips_detail_scheduling',
			to: '/aips/detail-scheduling/daily-production-targets',
			icon: 'Clock',
			children: [
				{
					name: 'menu.aips_daily_production_targets',
					to: '/aips/detail-scheduling/daily-production-targets',
					icon: 'Target',
				},
				{
					name: 'menu.aips_process_input_plan',
					to: '/aips/detail-scheduling/process-input-plan',
					icon: 'ArrowRight',
				},
				{
					name: 'menu.aips_machine_scheduling',
					to: '/aips/detail-scheduling/machine-scheduling',
					icon: 'Settings',
				},
				{
					name: 'menu.aips_work_order_creation',
					to: '/aips/detail-scheduling/work-order-creation',
					icon: 'FileText',
				},
				{
					name: 'menu.aips_mes_work_order_send',
					to: '/aips/detail-scheduling/mes-work-order-send',
					icon: 'Send',
				},
				{
					name: 'menu.aips_work_priority_adjustment',
					to: '/aips/detail-scheduling/work-priority-adjustment',
					icon: 'ArrowUpDown',
				},
			],
		},
		// 5. 실행 모니터링 (Execution Monitoring)
		{
			name: 'menu.aips_execution_monitoring',
			to: '/aips/execution-monitoring/realtime-work-status',
			icon: 'Monitor',
			children: [
				{
					name: 'menu.aips_realtime_work_status',
					to: '/aips/execution-monitoring/realtime-work-status',
					icon: 'Activity',
				},
				{
					name: 'menu.aips_plan_vs_actual',
					to: '/aips/execution-monitoring/plan-vs-actual',
					icon: 'BarChart3',
				},
				{
					name: 'menu.aips_delivery_delay_alerts',
					to: '/aips/execution-monitoring/delivery-delay-alerts',
					icon: 'AlertTriangle',
				},
				{
					name: 'menu.aips_mes_integration_monitoring',
					to: '/aips/execution-monitoring/mes-integration-monitoring',
					icon: 'Link',
				},
				{
					name: 'menu.aips_work_completion_feedback',
					to: '/aips/execution-monitoring/work-completion-feedback',
					icon: 'CheckCircle',
				},
				{
					name: 'menu.aips_equipment_status_integration',
					to: '/aips/execution-monitoring/equipment-status-integration',
					icon: 'Settings',
				},
				{
					name: 'menu.aips_quality_info_reflection',
					to: '/aips/execution-monitoring/quality-info-reflection',
					icon: 'Award',
				},
			],
		},
		// 6. 시뮬레이션 & 분석
		{
			name: 'menu.aips_simulation_analysis',
			to: '/aips/simulation/planning-simulation',
			icon: 'Play',
			children: [
				{
					name: 'menu.aips_planning_simulation',
					to: '/aips/simulation/planning-simulation',
					icon: 'Play',
				},
				{
					name: 'menu.aips_what_if_analysis',
					to: '/aips/simulation/what-if-analysis',
					icon: 'HelpCircle',
				},
				{
					name: 'menu.aips_bottleneck_analysis',
					to: '/aips/simulation/bottleneck-analysis',
					icon: 'AlertCircle',
				},
				{
					name: 'menu.aips_ai_optimization_simulation',
					to: '/aips/simulation/ai-optimization-simulation',
					icon: 'Brain',
				},
			],
		},
		// 7. 계획 조정 (Adjustment)
		{
			name: 'menu.aips_adjustment',
			to: '/aips/adjustment/manual-plan-adjustment',
			icon: 'Edit',
			children: [
				{
					name: 'menu.aips_manual_plan_adjustment',
					to: '/aips/adjustment/manual-plan-adjustment',
					icon: 'Edit',
				},
				{
					name: 'menu.aips_emergency_order_insertion',
					to: '/aips/adjustment/emergency-order-insertion',
					icon: 'AlertTriangle',
				},
				{
					name: 'menu.aips_plan_confirmation_approval',
					to: '/aips/adjustment/plan-confirmation-approval',
					icon: 'CheckSquare',
				},
				{
					name: 'menu.aips_plan_history_management',
					to: '/aips/adjustment/plan-history-management',
					icon: 'History',
				},
				{
					name: 'menu.aips_version_management',
					to: '/aips/adjustment/version-management',
					icon: 'GitBranch',
				},
				{
					name: 'menu.aips_change_reason_management',
					to: '/aips/adjustment/change-reason-management',
					icon: 'MessageSquare',
				},
				{
					name: 'menu.aips_rollback_function',
					to: '/aips/adjustment/rollback-function',
					icon: 'RotateCcw',
				},
			],
		},
		// 8. 보고서 (Reports)
		{
			name: 'menu.aips_reports',
			to: '/aips/reports/monthly-production-report',
			icon: 'FileText',
			children: [
				{
					name: 'menu.aips_monthly_production_report',
					to: '/aips/reports/monthly-production-report',
					icon: 'FileText',
				},
				{
					name: 'menu.aips_weekly_production_report',
					to: '/aips/reports/weekly-production-report',
					icon: 'FileText',
				},
				{
					name: 'menu.aips_daily_work_order_report',
					to: '/aips/reports/daily-work-order-report',
					icon: 'FileText',
				},
				{
					name: 'menu.aips_plan_vs_actual_analysis',
					to: '/aips/reports/plan-vs-actual-analysis',
					icon: 'BarChart3',
				},
				{
					name: 'menu.aips_equipment_efficiency_report',
					to: '/aips/reports/equipment-efficiency-report',
					icon: 'Activity',
				},
				{
					name: 'menu.aips_delivery_compliance_analysis',
					to: '/aips/reports/delivery-compliance-analysis',
					icon: 'CheckCircle',
				},
			],
		},
		// 9. 시스템 관리 (System Admin)
		{
			name: 'menu.aips_system_admin',
			to: '/aips/system-admin/master-data-validation',
			icon: 'Shield',
			children: [
				{
					name: 'menu.aips_master_data_validation',
					to: '/aips/system-admin/master-data-validation',
					icon: 'CheckCircle2',
				},
				{
					name: 'menu.aips_data_backup_restore',
					to: '/aips/system-admin/data-backup-restore',
					icon: 'HardDrive',
				},
				{
					name: 'menu.aips_user_permission_management',
					to: '/aips/system-admin/user-permission-management',
					icon: 'Users',
				},
				{
					name: 'menu.aips_log_management',
					to: '/aips/system-admin/log-management',
					icon: 'FileText',
				},
				{
					name: 'menu.aips_environment_settings',
					to: '/aips/system-admin/environment-settings',
					icon: 'Settings',
				},
			],
		},
		// AI Insights (보조 패널/버튼)
		{
			name: 'menu.aips_ai_insights',
			to: '/aips/ai-insights/ai-plan-summary',
			icon: 'Brain',
			children: [
				{
					name: 'menu.aips_ai_plan_summary',
					to: '/aips/ai-insights/ai-plan-summary',
					icon: 'Brain',
				},
				{
					name: 'menu.aips_ai_plan_correction',
					to: '/aips/ai-insights/ai-plan-correction',
					icon: 'Edit',
				},
				{
					name: 'menu.aips_ai_what_if',
					to: '/aips/ai-insights/ai-what-if',
					icon: 'HelpCircle',
				},
				{
					name: 'menu.aips_ai_auto_reports',
					to: '/aips/ai-insights/ai-auto-reports',
					icon: 'FileText',
				},
			],
		},
	],
};

export const MainMenus: (MenuType | { type: 'divider' })[] = [AipsServiceMenus];
