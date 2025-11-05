import React, { useState } from 'react';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';

// 임시 데이터 타입
interface PlanVsActualData {
	id: number;
	planDate: string;
	itemName: string;
	itemCode: string;
	planQuantity: number;
	actualQuantity: number;
	achievementRate: number;
	status: string;
	unit: string;
}

// 임시 KPI 데이터
interface KPIData {
	totalPlanQuantity: number;
	totalActualQuantity: number;
	overallAchievementRate: number;
	onTimeDeliveryRate: number;
}

export const ProductionPlanVsActualPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');

	// 임시 데이터
	const [kpiData] = useState<KPIData>({
		totalPlanQuantity: 15000,
		totalActualQuantity: 13500,
		overallAchievementRate: 90,
		onTimeDeliveryRate: 85,
	});

	const [planVsActualData] = useState<PlanVsActualData[]>([
		{
			id: 1,
			planDate: '2024-01-15',
			itemName: '스마트폰 케이스',
			itemCode: 'SC001',
			planQuantity: 1000,
			actualQuantity: 950,
			achievementRate: 95,
			status: '완료',
			unit: 'EA',
		},
		{
			id: 2,
			planDate: '2024-01-16',
			itemName: '태블릿 스탠드',
			itemCode: 'TS002',
			planQuantity: 800,
			actualQuantity: 750,
			achievementRate: 94,
			status: '완료',
			unit: 'EA',
		},
		{
			id: 3,
			planDate: '2024-01-17',
			itemName: '무선 충전기',
			itemCode: 'WC003',
			planQuantity: 500,
			actualQuantity: 400,
			achievementRate: 80,
			status: '지연',
			unit: 'EA',
		},
	]);

	// 테이블 컬럼 정의
	const planVsActualColumns = [
		{
			accessorKey: 'planDate',
			header: () => tDataTable('columns.planDate'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as string;
				return new Date(value).toLocaleDateString('ko-KR');
			},
		},
		{
			accessorKey: 'itemCode',
			header: () => tDataTable('columns.itemCode'),
		},
		{
			accessorKey: 'itemName',
			header: () => tDataTable('columns.itemName'),
		},
		{
			accessorKey: 'planQuantity',
			header: () => tDataTable('columns.planQuantity'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'actualQuantity',
			header: () => tDataTable('columns.actualQuantity'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				return value.toLocaleString();
			},
		},
		{
			accessorKey: 'achievementRate',
			header: () => tDataTable('columns.achievementRate'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as number;
				const color =
					value >= 95
						? 'text-green-600'
						: value >= 85
							? 'text-yellow-600'
							: 'text-red-600';
				return <span className={color}>{value}%</span>;
			},
		},
		{
			accessorKey: 'status',
			header: () => tDataTable('columns.status'),
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue() as string;
				const statusColors = {
					[t('production.plan.status.completed')]:
						'bg-green-100 text-green-800',
					[t('production.plan.status.delayed')]:
						'bg-red-100 text-red-800',
					[t('production.plan.status.inProgress')]:
						'bg-blue-100 text-blue-800',
				};
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}
					>
						{value}
					</span>
				);
			},
		},
		{
			accessorKey: 'unit',
			header: () => tDataTable('columns.unit'),
		},
	];

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		planVsActualData,
		planVsActualColumns,
		10,
		Math.ceil(planVsActualData.length / 10),
		0,
		planVsActualData.length
	);

	// KPI 카드 컴포넌트
	const KPICard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		color: string;
		trend?: 'up' | 'down' | 'neutral';
	}> = ({ title, value, icon, color, trend }) => (
		<div className="bg-white rounded-lg border p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className={`text-2xl font-bold ${color}`}>{value}</p>
				</div>
				<div className={`${color} opacity-80`}>{icon}</div>
			</div>
			{trend && (
				<div className="mt-2 flex items-center">
					{trend === 'up' ? (
						<TrendingUp className="w-4 h-4 text-green-500" />
					) : trend === 'down' ? (
						<TrendingDown className="w-4 h-4 text-red-500" />
					) : null}
					<span className="text-xs text-gray-500 ml-1">
						{trend === 'up'
							? t('production.plan.trend.up')
							: trend === 'down'
								? t('production.plan.trend.down')
								: t('production.plan.trend.neutral')}
					</span>
				</div>
			)}
		</div>
	);

	return (
		<PageTemplate>
			<div className="space-y-6 h-full">
				{/* KPI 대시보드 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<KPICard
						title={t('production.plan.kpi.totalPlanQuantity')}
						value={kpiData.totalPlanQuantity.toLocaleString()}
						icon={<Target className="w-8 h-8" />}
						color="text-blue-600"
						trend="neutral"
					/>
					<KPICard
						title={t('production.plan.kpi.totalActualQuantity')}
						value={kpiData.totalActualQuantity.toLocaleString()}
						icon={<BarChart3 className="w-8 h-8" />}
						color="text-green-600"
						trend="up"
					/>
					<KPICard
						title={t('production.plan.kpi.overallAchievementRate')}
						value={`${kpiData.overallAchievementRate}%`}
						icon={<TrendingUp className="w-8 h-8" />}
						color="text-purple-600"
						trend="up"
					/>
					<KPICard
						title={t('production.plan.kpi.onTimeDeliveryRate')}
						value={`${kpiData.onTimeDeliveryRate}%`}
						icon={<Target className="w-8 h-8" />}
						color="text-orange-600"
						trend="down"
					/>
				</div>

				{/* 차트 영역 (추후 구현) */}
				<div className="bg-white rounded-lg border p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">
						{t('production.plan.chart.planVsActualTrend')}
					</h3>
					<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
						<div className="text-center">
							<BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500">
								{t('production.plan.chart.chartPlaceholder')}
							</p>
							<p className="text-sm text-gray-400">
								{t(
									'production.plan.chart.chartLibraryPlaceholder'
								)}
							</p>
						</div>
					</div>
				</div>

				{/* 상세 데이터 테이블 */}
				<div className="bg-white rounded-lg border shadow-sm">
					<DatatableComponent
						table={table}
						columns={planVsActualColumns}
						data={planVsActualData}
						tableTitle={t(
							'production.plan.table.planVsActualDetail'
						)}
						rowCount={planVsActualData.length}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
					/>
				</div>
			</div>
		</PageTemplate>
	);
};
