import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { BarChart3, TrendingUp, Target, Factory } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface WeeklyProductionPlan {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	week1: { plan: number; actual: number; variance: number };
	week2: { plan: number; actual: number; variance: number };
	week3: { plan: number; actual: number; variance: number };
	week4: { plan: number; actual: number; variance: number };
	week5: { plan: number; actual: number; variance: number };
	week6: { plan: number; actual: number; variance: number };
	week7: { plan: number; actual: number; variance: number };
	week8: { plan: number; actual: number; variance: number };
	totalPlan: number;
	totalActual: number;
	totalVariance: number;
	status: 'planned' | 'in-progress' | 'completed' | 'delayed';
	priority: 'high' | 'medium' | 'low';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const weeklyProductionPlanData: WeeklyProductionPlan[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		week1: { plan: 250, actual: 240, variance: -10 },
		week2: { plan: 260, actual: 0, variance: -260 },
		week3: { plan: 270, actual: 0, variance: -270 },
		week4: { plan: 280, actual: 0, variance: -280 },
		week5: { plan: 290, actual: 0, variance: -290 },
		week6: { plan: 300, actual: 0, variance: -300 },
		week7: { plan: 310, actual: 0, variance: -310 },
		week8: { plan: 320, actual: 0, variance: -320 },
		totalPlan: 2180,
		totalActual: 240,
		totalVariance: -1940,
		status: 'in-progress',
		priority: 'high',
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-01-31',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		week1: { plan: 200, actual: 195, variance: -5 },
		week2: { plan: 210, actual: 0, variance: -210 },
		week3: { plan: 220, actual: 0, variance: -220 },
		week4: { plan: 230, actual: 0, variance: -230 },
		week5: { plan: 240, actual: 0, variance: -240 },
		week6: { plan: 250, actual: 0, variance: -250 },
		week7: { plan: 260, actual: 0, variance: -260 },
		week8: { plan: 270, actual: 0, variance: -270 },
		totalPlan: 1860,
		totalActual: 195,
		totalVariance: -1665,
		status: 'planned',
		priority: 'medium',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
];

const WeeklyProductionPlanPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<WeeklyProductionPlan[]>([]);

	useEffect(() => {
		setData(weeklyProductionPlanData);
	}, []);

	const weeks = [
		{ key: 'week1', label: '1주차' },
		{ key: 'week2', label: '2주차' },
		{ key: 'week3', label: '3주차' },
		{ key: 'week4', label: '4주차' },
		{ key: 'week5', label: '5주차' },
		{ key: 'week6', label: '6주차' },
		{ key: 'week7', label: '7주차' },
		{ key: 'week8', label: '8주차' },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'planned':
				return 'text-blue-600 bg-blue-100';
			case 'in-progress':
				return 'text-yellow-600 bg-yellow-100';
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'delayed':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'planned':
				return '계획됨';
			case 'in-progress':
				return '진행중';
			case 'completed':
				return '완료';
			case 'delayed':
				return '지연';
			default:
				return '알 수 없음';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-100';
			case 'medium':
				return 'text-yellow-600 bg-yellow-100';
			case 'low':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				planData: [],
				actualData: [],
				weeks: [],
			};
		}

		const planData = weeks.map((week) => {
			const weekKey = week.key as keyof WeeklyProductionPlan;
			return data.reduce((sum, item) => {
				const weekData = item[weekKey] as {
					plan: number;
					actual: number;
					variance: number;
				};
				return sum + weekData.plan;
			}, 0);
		});

		const actualData = weeks.map((week) => {
			const weekKey = week.key as keyof WeeklyProductionPlan;
			return data.reduce((sum, item) => {
				const weekData = item[weekKey] as {
					plan: number;
					actual: number;
					variance: number;
				};
				return sum + weekData.actual;
			}, 0);
		});

		return {
			planData,
			actualData,
			weeks: weeks.map((w) => w.label),
		};
	}, [data, weeks]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<WeeklyProductionPlan>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'productCode',
				header: '제품코드',
				size: 140,
				align: 'left' as const,
			},

			...weeks.map((week) => ({
				accessorKey: week.key as keyof WeeklyProductionPlan,
				header: week.label,
				size: 100,
				align: 'left' as const,
				accessorFn: (row: WeeklyProductionPlan) => {
					const weekKey = week.key as keyof WeeklyProductionPlan;
					const weekData = row[weekKey] as {
						plan: number;
						actual: number;
						variance: number;
					};
					return weekData.plan;
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as WeeklyProductionPlan;
					const weekKey = week.key as keyof WeeklyProductionPlan;
					const weekData = item[weekKey] as {
						plan: number;
						actual: number;
						variance: number;
					};
					return (
						<div className="text-sm">
							<div className="font-medium">
								{weekData.plan.toLocaleString()}
							</div>
							<div className="text-xs text-gray-500">
								실제: {weekData.actual.toLocaleString()}
							</div>
							<div
								className={`text-xs ${weekData.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}
							>
								{weekData.variance >= 0 ? '+' : ''}
								{weekData.variance.toLocaleString()}
							</div>
						</div>
					);
				},
			})),
			{
				accessorKey: 'totalPlan',
				header: '총 계획',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.totalPlan.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 140,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}
					>
						{getPriorityText(row.original.priority)}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 140,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
		],
		[weeks]
	);

	const processedColumns = useDataTableColumns(columns);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		data.length, // totalElements
		undefined // onPageChange
	);

	const chartOption = {
		title: {
			text:
				chartData.weeks.length > 0
					? '주간 생산 계획 vs 실제'
					: '데이터가 없습니다',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['계획', '실제'],
			top: 30,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data:
				chartData.weeks.length > 0 ? chartData.weeks : ['데이터 없음'],
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'bar',
				data: chartData.planData.length > 0 ? chartData.planData : [0],
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: '실제',
				type: 'bar',
				data:
					chartData.actualData.length > 0
						? chartData.actualData
						: [0],
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Factory className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
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
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 실제 수량
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data
									.reduce(
										(sum, item) => sum + item.totalActual,
										0
									)
									.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">진행률</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									(data.reduce(
										(sum, item) => sum + item.totalActual,
										0
									) /
										data.reduce(
											(sum, item) => sum + item.totalPlan,
											0
										)) *
										100
								)}
								%
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">고우선순위</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.priority === 'high'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 또는 그리드 */}
			<div className="p-4 rounded-lg border">
				{chartOption && (
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				)}
			</div>

			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="주간 생산 계획 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={true}
				/>
			</div>
		</div>
	);
};

export default WeeklyProductionPlanPage;
