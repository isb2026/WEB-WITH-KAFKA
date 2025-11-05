import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Calendar,
	BarChart3,
	TrendingUp,
	Target,
	Factory,
	Package,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface MonthlyProductionPlan {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	january: { plan: number; actual: number; variance: number };
	february: { plan: number; actual: number; variance: number };
	march: { plan: number; actual: number; variance: number };
	april: { plan: number; actual: number; variance: number };
	may: { plan: number; actual: number; variance: number };
	june: { plan: number; actual: number; variance: number };
	july: { plan: number; actual: number; variance: number };
	august: { plan: number; actual: number; variance: number };
	september: { plan: number; actual: number; variance: number };
	october: { plan: number; actual: number; variance: number };
	november: { plan: number; actual: number; variance: number };
	december: { plan: number; actual: number; variance: number };
	totalPlan: number;
	totalActual: number;
	totalVariance: number;
	status: 'planned' | 'in-progress' | 'completed' | 'delayed';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// 더미 데이터
const monthlyProductionPlanData: MonthlyProductionPlan[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		january: { plan: 1000, actual: 950, variance: -50 },
		february: { plan: 1100, actual: 0, variance: -1100 },
		march: { plan: 1200, actual: 0, variance: -1200 },
		april: { plan: 1300, actual: 0, variance: -1300 },
		may: { plan: 1400, actual: 0, variance: -1400 },
		june: { plan: 1500, actual: 0, variance: -1500 },
		july: { plan: 1600, actual: 0, variance: -1600 },
		august: { plan: 1700, actual: 0, variance: -1700 },
		september: { plan: 1800, actual: 0, variance: -1800 },
		october: { plan: 1900, actual: 0, variance: -1900 },
		november: { plan: 2000, actual: 0, variance: -2000 },
		december: { plan: 2100, actual: 0, variance: -2100 },
		totalPlan: 18600,
		totalActual: 950,
		totalVariance: -17650,
		status: 'in-progress',
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
		january: { plan: 800, actual: 780, variance: -20 },
		february: { plan: 900, actual: 0, variance: -900 },
		march: { plan: 1000, actual: 0, variance: -1000 },
		april: { plan: 1100, actual: 0, variance: -1100 },
		may: { plan: 1200, actual: 0, variance: -1200 },
		june: { plan: 1300, actual: 0, variance: -1300 },
		july: { plan: 1400, actual: 0, variance: -1400 },
		august: { plan: 1500, actual: 0, variance: -1500 },
		september: { plan: 1600, actual: 0, variance: -1600 },
		october: { plan: 1700, actual: 0, variance: -1700 },
		november: { plan: 1800, actual: 0, variance: -1800 },
		december: { plan: 1900, actual: 0, variance: -1900 },
		totalPlan: 15300,
		totalActual: 780,
		totalVariance: -14520,
		status: 'planned',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-01-31',
	},
];

const MonthlyProductionPlanPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<MonthlyProductionPlan[]>([]);

	useEffect(() => {
		setData(monthlyProductionPlanData);
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

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				planData: [],
				actualData: [],
				months: [],
			};
		}

		const planData = months.map((month) => {
			const monthKey = month.key as keyof MonthlyProductionPlan;
			return data.reduce((sum, item) => {
				const monthData = item[monthKey] as {
					plan: number;
					actual: number;
					variance: number;
				};
				return sum + monthData.plan;
			}, 0);
		});

		const actualData = months.map((month) => {
			const monthKey = month.key as keyof MonthlyProductionPlan;
			return data.reduce((sum, item) => {
				const monthData = item[monthKey] as {
					plan: number;
					actual: number;
					variance: number;
				};
				return sum + monthData.actual;
			}, 0);
		});

		return {
			planData,
			actualData,
			months: months.map((m) => m.label),
		};
	}, [data, months]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<MonthlyProductionPlan>[]>(
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
				size: 160,
				align: 'left' as const,
			},
			...months.map((month) => ({
				accessorKey: month.key as keyof MonthlyProductionPlan,
				header: month.label,
				size: 100,
				align: 'left' as const,
				accessorFn: (row: MonthlyProductionPlan) => {
					const monthKey = month.key as keyof MonthlyProductionPlan;
					const monthData = row[monthKey] as {
						plan: number;
						actual: number;
						variance: number;
					};
					return monthData.plan;
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as MonthlyProductionPlan;
					const monthKey = month.key as keyof MonthlyProductionPlan;
					const monthData = item[monthKey] as {
						plan: number;
						actual: number;
						variance: number;
					};
					return (
						<div className="text-sm">
							<div className="font-medium">
								{monthData.plan.toLocaleString()}
							</div>
							<div className="text-xs text-gray-500">
								실제: {monthData.actual.toLocaleString()}
							</div>
							<div
								className={`text-xs ${monthData.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}
							>
								{monthData.variance >= 0 ? '+' : ''}
								{monthData.variance.toLocaleString()}
							</div>
						</div>
					);
				},
			})),
			{
				accessorKey: 'totalPlan',
				header: '총 계획',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.totalPlan.toLocaleString()}
					</div>
				),
			},

			{
				accessorKey: 'status',
				header: '상태',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
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
		undefined // onPageChange
	);

	const chartOption = {
		title: {
			text:
				chartData.months.length > 0
					? '월간 생산 계획 vs 실제'
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
				chartData.months.length > 0
					? chartData.months
					: ['데이터 없음'],
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
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Factory className="h-8 w-8 text-blue-600" />
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
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
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
				<div className="p-4 rounded-lg border">
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
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">활성 제품</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'in-progress'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 또는 그리드 */}
			<div className="bg-white p-6 rounded-lg border">
				{chartOption && (
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				)}
			</div>

			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="월간 생산 계획 데이터"
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

export default MonthlyProductionPlanPage;
