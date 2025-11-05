import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Calendar, BarChart3, TrendingUp, Target } from 'lucide-react';
import { monthlyDemandPlanningData } from '../dummy-data/monthlyDemandPlanningData';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface MonthlyDemandPlanning {
	id: number;
	productName: string;
	january: { forecast: number; plan: number; variance: number };
	february: { forecast: number; plan: number; variance: number };
	march: { forecast: number; plan: number; variance: number };
	april: { forecast: number; plan: number; variance: number };
	may: { forecast: number; plan: number; variance: number };
	june: { forecast: number; plan: number; variance: number };
	july: { forecast: number; plan: number; variance: number };
	august: { forecast: number; plan: number; variance: number };
	september: { forecast: number; plan: number; variance: number };
	october: { forecast: number; plan: number; variance: number };
	november: { forecast: number; plan: number; variance: number };
	december: { forecast: number; plan: number; variance: number };
	totalForecast: number;
	totalPlan: number;
	totalVariance: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export const MonthlyDemandPlanningPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<MonthlyDemandPlanning[]>([]);

	useEffect(() => {
		setData(monthlyDemandPlanningData);
	}, []);

	const months = [
		{ key: 'january', label: '1월' },
		{ key: 'february', label: '2월' },
		{ key: 'march', label: '3월' },
		{ key: 'april', label: '4월' },
		{ key: 'may', label: '5월' },
		{ key: 'june', label: '6월' },
		{ key: 'july', label: '7월' },
		{ key: 'august', label: '8월' },
		{ key: 'september', label: '9월' },
		{ key: 'october', label: '10월' },
		{ key: 'november', label: '11월' },
		{ key: 'december', label: '12월' },
	];

	const getVarianceColor = (variance: number) => {
		if (variance > 0) return 'text-green-600';
		if (variance < 0) return 'text-red-600';
		return 'text-gray-600';
	};

	const getVarianceIcon = (variance: number) => {
		if (variance > 0)
			return <TrendingUp className="h-4 w-4 text-green-600" />;
		if (variance < 0)
			return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
		return <Target className="h-4 w-4 text-gray-600" />;
	};

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<MonthlyDemandPlanning>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				align: 'left' as const,
			},
			...months.map((month) => ({
				accessorKey: month.key as keyof MonthlyDemandPlanning,
				header: month.label,
				size: 120,
				align: 'left' as const,
				accessorFn: (row: MonthlyDemandPlanning) => {
					const monthKey = month.key as keyof MonthlyDemandPlanning;
					const monthData = row[monthKey] as {
						forecast: number;
						plan: number;
						variance: number;
					};
					return monthData.plan; // Return plan value for editing
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as MonthlyDemandPlanning;
					const monthKey = month.key as keyof MonthlyDemandPlanning;
					const monthData = item[monthKey] as {
						forecast: number;
						plan: number;
						variance: number;
					};

					return (
						<div className="space-y-1">
							<div className="text-gray-600">
								{monthData.forecast.toLocaleString()}
							</div>
							<div className="font-medium">
								{monthData.plan.toLocaleString()}
							</div>
							<div
								className={`flex items-center justify-center gap-1 ${getVarianceColor(monthData.variance)}`}
							>
								{getVarianceIcon(monthData.variance)}
								<span className="text-xs">
									{monthData.variance > 0 ? '+' : ''}
									{monthData.variance.toLocaleString()}
								</span>
							</div>
						</div>
					);
				},
			})),
			{
				accessorKey: 'totalForecast',
				header: '합계',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => {
					const item = row.original as MonthlyDemandPlanning;
					return (
						<div className="space-y-1">
							<div className="text-gray-600">
								{item.totalForecast.toLocaleString()}
							</div>
							<div className="font-medium">
								{item.totalPlan.toLocaleString()}
							</div>
							<div
								className={`flex items-center justify-center gap-1 ${getVarianceColor(item.totalVariance)}`}
							>
								{getVarianceIcon(item.totalVariance)}
								<span className="text-xs">
									{item.totalVariance > 0 ? '+' : ''}
									{item.totalVariance.toLocaleString()}
								</span>
							</div>
						</div>
					);
				},
			},
		],
		[months]
	);

	const processedColumns = useDataTableColumns(columns);
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30,
		0,
		0,
		data.length,
		undefined
	);

	// Handle cell updates for plan values
	const handleCellUpdate = (id: number, field: string, value: string) => {
		const numValue = parseInt(value) || 0;

		// Check if it's a month field
		if (months.some((m) => m.key === field)) {
			setData((prev) =>
				prev.map((item) => {
					if (item.id === id) {
						const updatedItem = { ...item };
						const monthKey = field as keyof MonthlyDemandPlanning;
						const monthData = updatedItem[monthKey] as any;

						// Update plan value
						monthData.plan = numValue;
						// Recalculate variance
						monthData.variance =
							monthData.plan - monthData.forecast;

						// Recalculate totals
						let totalPlan = 0;
						months.forEach((month) => {
							const monthKey =
								month.key as keyof MonthlyDemandPlanning;
							const monthData = updatedItem[monthKey] as any;
							totalPlan += monthData.plan;
						});

						updatedItem.totalPlan = totalPlan;
						updatedItem.totalVariance =
							totalPlan - updatedItem.totalForecast;

						return updatedItem;
					}
					return item;
				})
			);
		}
	};

	return (
		<div className="space-y-4">
			{/* 요약 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<TrendingUp className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 예측 수요
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.totalForecast,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<Target className="h-6 w-6 text-green-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								총 계획 수량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.totalPlan,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<BarChart3 className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								계획 정확도
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									(1 -
										Math.abs(
											data.reduce(
												(sum, item) =>
													sum + item.totalVariance,
												0
											)
										) /
											data.reduce(
												(sum, item) =>
													sum + item.totalForecast,
												0
											)) *
										100
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Calendar className="h-6 w-6 text-purple-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">
								관리 제품 수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 영역 */}
			<div className="p-4 rounded-lg border">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					월별 계획 vs 예측 비교
				</h3>
				<div className="h-64">
					<EchartComponent
						options={{
							title: {
								text: '월별 예측 vs 계획 비교',
								left: 'center',
							},
							tooltip: {
								trigger: 'axis',
							},
							legend: {
								data: ['예측', '계획'],
								top: 30,
							},
							xAxis: {
								type: 'category',
								data: months.map((m) => m.label),
							},
							yAxis: {
								type: 'value',
							},
							series: [
								{
									name: '예측',
									type: 'bar',
									data: months.map((month) =>
										data.reduce(
											(sum, item) =>
												sum +
												(
													item[
														month.key as keyof MonthlyDemandPlanning
													] as any
												).forecast,
											0
										)
									),
								},
								{
									name: '계획',
									type: 'bar',
									data: months.map((month) =>
										data.reduce(
											(sum, item) =>
												sum +
												(
													item[
														month.key as keyof MonthlyDemandPlanning
													] as any
												).plan,
											0
										)
									),
								},
							],
						}}
						height="250px"
					/>
				</div>
			</div>

			{/* DataTable */}
			<div className="rounded-lg border overflow-hidden">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="월간 수요 계획 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					onCellUpdate={handleCellUpdate}
					useEditable={true}
				/>
			</div>
		</div>
	);
};

export default MonthlyDemandPlanningPage;
