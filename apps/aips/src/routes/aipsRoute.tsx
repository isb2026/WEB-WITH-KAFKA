// Import actual AIPS pages
import { MasterDataTabNavigation } from '../tabs/master-data';
import { ResourceDataTabNavigation } from '../tabs/resource-data';
import { MesIntegrationTabNavigation } from '../tabs/mes-integration';
import { DemandTabNavigation } from '../tabs/demand';
import { MasterPlanningTabNavigation } from '../tabs/master-planning';
import { ExecutionMonitoringTabNavigation } from '../tabs/execution-monitoring';
import { DetailSchedulingTabNavigation } from '../tabs/detail-scheduling';
import { SimulationTabNavigation } from '../tabs/simulation';
import { SystemAdminTabNavigation } from '../tabs/system-admin';
import { PlanAdjustmentTabNavigation } from '../tabs/plan-adjustment';
import { ReportsTabNavigation } from '../tabs/reports';
import { AiInsightsTabNavigation } from '@aips/tabs/ai-insights';

// Placeholder components for other AIPS pages
const PlaceholderPage = ({ title }: { title: string }) => (
	<div className="p-6">
		<h1 className="text-2xl font-bold mb-4">{title}</h1>
		<p className="text-gray-600">This page is under development.</p>
	</div>
);

export const aipsRoutes = [
	// 1. 기준정보 관리 (Master Data)
	{
		path: '/aips/master-data',
		children: [
			{
				path: 'product-master',
				element: <MasterDataTabNavigation activetab="product" />,
			},
			{
				path: 'bom-management',
				element: <MasterDataTabNavigation activetab="bom" />,
			},
			{
				path: 'process-routing',
				element: <MasterDataTabNavigation activetab="routing" />,
			},
		],
	},
	{
		path: '/aips/resource',
		children: [
			{
				path: 'machine-master',
				element: <ResourceDataTabNavigation activetab="machine" />,
			},
			{
				path: 'work-center-management',
				element: <ResourceDataTabNavigation activetab="work-center" />,
			},
			{
				path: 'work-calendar',
				element: (
					<ResourceDataTabNavigation activetab="work-calendar" />
				),
			},
		],
	},
	{
		path: '/aips/mes-integration',
		children: [
			{
				path: 'table-mapping',
				element: (
					<MesIntegrationTabNavigation activetab="table-mapping" />
				),
			},
			{
				path: 'code-conversion',
				element: (
					<MesIntegrationTabNavigation activetab="code-conversion" />
				),
			},
			{
				path: 'data-sync',
				element: <MesIntegrationTabNavigation activetab="data-sync" />,
			},
		],
	},
	// 2. 수요 관리 (Demand)
	{
		path: '/aips/demand',
		children: [
			{
				path: 'sales-order-management',
				element: <DemandTabNavigation activetab="sales-order" />,
			},
			{
				path: 'forecast-demand-management',
				element: <DemandTabNavigation activetab="forecast" />,
			},
			{
				path: 'order-change-history',
				element: <DemandTabNavigation activetab="change-history" />,
			},
			{
				path: 'monthly-demand-planning',
				element: <DemandTabNavigation activetab="monthly-planning" />,
			},
			{
				path: 'weekly-demand-adjustment',
				element: <DemandTabNavigation activetab="weekly-adjustment" />,
			},
			{
				path: 'atp',
				element: <DemandTabNavigation activetab="atp" />,
			},
		],
	},
	// 3. 월간 생산계획 (Master Planning)
	{
		path: '/aips/master-planning',
		children: [
			{
				path: 'monthly-production-plan',
				element: (
					<MasterPlanningTabNavigation activetab="monthly-production-plan" />
				),
			},
			{
				path: 'weekly-production-plan',
				element: (
					<MasterPlanningTabNavigation activetab="weekly-production-plan" />
				),
			},
			{
				path: 'production-leveling',
				element: (
					<MasterPlanningTabNavigation activetab="production-leveling" />
				),
			},
			{
				path: 'mrp',
				element: <MasterPlanningTabNavigation activetab="mrp" />,
			},
			{
				path: 'inventory-availability',
				element: (
					<MasterPlanningTabNavigation activetab="inventory-availability" />
				),
			},
			{
				path: 'purchase-requests',
				element: (
					<MasterPlanningTabNavigation activetab="purchase-requests" />
				),
			},
			{
				path: 'capacity-analysis',
				element: (
					<MasterPlanningTabNavigation activetab="capacity-analysis" />
				),
			},
		],
	},
	// 4. 일일 작업지시 (Detail Scheduling)
	{
		path: '/aips/detail-scheduling',
		children: [
			{
				path: 'daily-production-targets',
				element: (
					<DetailSchedulingTabNavigation activetab="daily-production-targets" />
				),
			},
			{
				path: 'process-input-plan',
				element: (
					<DetailSchedulingTabNavigation activetab="process-input-plan" />
				),
			},
			{
				path: 'machine-scheduling',
				element: (
					<DetailSchedulingTabNavigation activetab="machine-scheduling" />
				),
			},
			{
				path: 'work-order-creation',
				element: (
					<DetailSchedulingTabNavigation activetab="work-order-creation" />
				),
			},
			{
				path: 'mes-work-order-send',
				element: (
					<DetailSchedulingTabNavigation activetab="mes-work-order-send" />
				),
			},
			{
				path: 'work-priority-adjustment',
				element: (
					<DetailSchedulingTabNavigation activetab="work-priority-adjustment" />
				),
			},
		],
	},
	// 5. 실행 모니터링 (Execution Monitoring)
	{
		path: '/aips/execution-monitoring',
		children: [
			{
				path: 'realtime-work-status',
				element: (
					<ExecutionMonitoringTabNavigation activetab="realtime-work-status" />
				),
			},
			{
				path: 'plan-vs-actual',
				element: (
					<ExecutionMonitoringTabNavigation activetab="plan-vs-actual" />
				),
			},
			{
				path: 'delivery-delay-alerts',
				element: (
					<ExecutionMonitoringTabNavigation activetab="delivery-delay-alerts" />
				),
			},
			{
				path: 'mes-integration-monitoring',
				element: (
					<ExecutionMonitoringTabNavigation activetab="mes-integration-monitoring" />
				),
			},
			{
				path: 'work-completion-feedback',
				element: (
					<ExecutionMonitoringTabNavigation activetab="work-completion-feedback" />
				),
			},
			{
				path: 'equipment-status-integration',
				element: (
					<ExecutionMonitoringTabNavigation activetab="equipment-status-integration" />
				),
			},
			{
				path: 'quality-info-reflection',
				element: (
					<ExecutionMonitoringTabNavigation activetab="quality-info-reflection" />
				),
			},
		],
	},
	// 6. 시뮬레이션 & 분석
	{
		path: '/aips/simulation',
		children: [
			{
				path: 'planning-simulation',
				element: (
					<SimulationTabNavigation activetab="planning-simulation" />
				),
			},
			{
				path: 'what-if-analysis',
				element: (
					<SimulationTabNavigation activetab="what-if-analysis" />
				),
			},
			{
				path: 'bottleneck-analysis',
				element: (
					<SimulationTabNavigation activetab="bottleneck-analysis" />
				),
			},
			{
				path: 'ai-optimization-simulation',
				element: (
					<SimulationTabNavigation activetab="ai-optimization-simulation" />
				),
			},
		],
	},
	// 7. 계획 조정 (Adjustment)
	{
		path: '/aips/adjustment',
		children: [
			{
				path: 'manual-plan-adjustment',
				element: (
					<PlanAdjustmentTabNavigation activetab="manual-plan-adjustment" />
				),
			},
			{
				path: 'emergency-order-insertion',
				element: (
					<PlanAdjustmentTabNavigation activetab="emergency-order-insertion" />
				),
			},
			{
				path: 'plan-confirmation-approval',
				element: (
					<PlanAdjustmentTabNavigation activetab="plan-confirmation-approval" />
				),
			},
			{
				path: 'plan-history-management',
				element: (
					<PlanAdjustmentTabNavigation activetab="plan-history-management" />
				),
			},
			{
				path: 'version-management',
				element: (
					<PlanAdjustmentTabNavigation activetab="version-management" />
				),
			},
			{
				path: 'change-reason-management',
				element: (
					<PlanAdjustmentTabNavigation activetab="change-reason-management" />
				),
			},
			{
				path: 'rollback-function',
				element: (
					<PlanAdjustmentTabNavigation activetab="rollback-function" />
				),
			},
		],
	},
	// 8. 보고서 (Reports)
	{
		path: '/aips/reports',
		children: [
			{
				index: true,
				element: (
					<ReportsTabNavigation activetab="monthly-production-report" />
				),
			},
			{
				path: 'monthly-production-report',
				element: (
					<ReportsTabNavigation activetab="monthly-production-report" />
				),
			},
			{
				path: 'weekly-production-report',
				element: (
					<ReportsTabNavigation activetab="weekly-production-report" />
				),
			},
			{
				path: 'daily-work-order-report',
				element: (
					<ReportsTabNavigation activetab="daily-work-order-report" />
				),
			},
			{
				path: 'plan-vs-actual-analysis',
				element: (
					<ReportsTabNavigation activetab="plan-vs-actual-analysis" />
				),
			},
			{
				path: 'equipment-efficiency-report',
				element: (
					<ReportsTabNavigation activetab="equipment-efficiency-report" />
				),
			},
			{
				path: 'delivery-compliance-analysis',
				element: (
					<ReportsTabNavigation activetab="delivery-compliance-analysis" />
				),
			},
		],
	},
	// 9. 시스템 관리 (System Admin)
	{
		path: '/aips/system-admin',
		children: [
			{
				path: 'master-data-validation',
				element: <SystemAdminTabNavigation activetab="master-data-validation" />,
			},
			{
				path: 'data-backup-restore',
				element: <SystemAdminTabNavigation activetab="data-backup-restore" />,
			},
			{
				path: 'user-permission-management',
				element: <SystemAdminTabNavigation activetab="user-permission-management" />,
			},
			{
				path: 'log-management',
				element: <SystemAdminTabNavigation activetab="log-management" />,
			},
			{
				path: 'environment-settings',
				element: <SystemAdminTabNavigation activetab="environment-settings" />,
			},
		],
	},
	// AI Insights (보조 패널/버튼)
	{
		path: '/aips/ai-insights',
		children: [
			{
				path: 'ai-plan-summary',
				element: (
					<AiInsightsTabNavigation activetab="ai-plan-summary" />
				),
			},
			{
				path: 'ai-plan-correction',
				element: (
					<AiInsightsTabNavigation activetab="ai-plan-correction" />
				),
			},
			{
				path: 'ai-what-if',
				element: <AiInsightsTabNavigation activetab="ai-what-if" />,
			},
			{
				path: 'ai-auto-reports',
				element: (
					<AiInsightsTabNavigation activetab="ai-auto-reports" />
				),
			},
		],
	},
];
