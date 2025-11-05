import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { BarChart3, TrendingUp, Target, Factory, Download } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface WeeklyProductionReport {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	week1: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	week2: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	week3: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	week4: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	week5: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	totalPlan: number;
	totalActual: number;
	totalVariance: number;
	averageEfficiency: number;
	status: 'on-track' | 'behind' | 'ahead' | 'critical';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const weeklyProductionReportData: WeeklyProductionReport[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		week1: { plan: 250, actual: 240, variance: -10, efficiency: 96.0 },
		week2: { plan: 260, actual: 255, variance: -5, efficiency: 98.1 },
		week3: { plan: 270, actual: 265, variance: -5, efficiency: 98.1 },
		week4: { plan: 280, actual: 275, variance: -5, efficiency: 98.2 },
		week5: { plan: 290, actual: 0, variance: -290, efficiency: 0 },
		totalPlan: 1350,
		totalActual: 1035,
		totalVariance: -315,
		averageEfficiency: 97.6,
		status: 'on-track',
		createdBy: '사용자1',
		createdAt: '2024-01-01',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		week1: { plan: 200, actual: 195, variance: -5, efficiency: 97.5 },
		week2: { plan: 210, actual: 205, variance: -5, efficiency: 97.6 },
		week3: { plan: 220, actual: 218, variance: -2, efficiency: 99.1 },
		week4: { plan: 230, actual: 225, variance: -5, efficiency: 97.8 },
		week5: { plan: 240, actual: 0, variance: -240, efficiency: 0 },
		totalPlan: 1100,
		totalActual: 843,
		totalVariance: -257,
		averageEfficiency: 98.0,
		status: 'on-track',
		createdBy: '사용자2',
		createdAt: '2024-01-01',
		updatedBy: '사용자2',
		updatedAt: '2024-05-31',
	},
	{
		id: 3,
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 3',
		plantName: '공장 C',
		week1: { plan: 300, actual: 310, variance: 10, efficiency: 103.3 },
		week2: { plan: 310, actual: 315, variance: 5, efficiency: 101.6 },
		week3: { plan: 320, actual: 318, variance: -2, efficiency: 99.4 },
		week4: { plan: 330, actual: 335, variance: 5, efficiency: 101.5 },
		week5: { plan: 340, actual: 0, variance: -340, efficiency: 0 },
		totalPlan: 1600,
		totalActual: 1278,
		totalVariance: -322,
		averageEfficiency: 101.5,
		status: 'ahead',
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-05-31',
	},
];

const WeeklyProductionReportPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<WeeklyProductionReport[]>(
		weeklyProductionReportData
	);

	const weeks = [
		{ key: 'week1', label: '1주차' },
		{ key: 'week2', label: '2주차' },
		{ key: 'week3', label: '3주차' },
		{ key: 'week4', label: '4주차' },
		{ key: 'week5', label: '5주차' },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'on-track':
				return 'bg-green-100 text-green-800';
			case 'behind':
				return 'bg-yellow-100 text-yellow-800';
			case 'ahead':
				return 'bg-blue-100 text-blue-800';
			case 'critical':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'on-track':
				return '정상';
			case 'behind':
				return '지연';
			case 'ahead':
				return '진행';
			case 'critical':
				return '위험';
			default:
				return '알 수 없음';
		}
	};

	const columns = useMemo<ColumnConfig<WeeklyProductionReport>[]>(
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
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 100,
				align: 'left' as const,
			},
			...weeks.map((week) => ({
				accessorKey: week.key as keyof WeeklyProductionReport,
				header: week.label,
				size: 120,
				align: 'left' as const,
				accessorFn: (row: WeeklyProductionReport) => {
					const weekKey = week.key as keyof WeeklyProductionReport;
					const weekData = row[weekKey] as {
						plan: number;
						actual: number;
						variance: number;
						efficiency: number;
					};
					return weekData.plan;
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as WeeklyProductionReport;
					const weekKey = week.key as keyof WeeklyProductionReport;
					const weekData = item[weekKey] as {
						plan: number;
						actual: number;
						variance: number;
						efficiency: number;
					};
					return (
						<div className="text-sm">
							<div className="font-medium">
								계획: {weekData.plan.toLocaleString()}
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
							<div className="text-xs text-blue-600">
								효율: {weekData.efficiency.toFixed(1)}%
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
				accessorKey: 'totalActual',
				header: '총 실제',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.totalActual.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'averageEfficiency',
				header: '평균 효율',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-blue-600">
						{row.original.averageEfficiency.toFixed(1)}%
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
		[weeks]
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

	// Chart data preparation
	const chartData = useMemo(() => {
		const weekLabels = ['1주차', '2주차', '3주차', '4주차', '5주차'];
		const planData = weekLabels.map((_, index) => {
			const weekKey = `week${index + 1}` as keyof WeeklyProductionReport;
			return data.reduce((sum, item) => {
				const weekData = item[weekKey] as any;
				return sum + (weekData?.plan || 0);
			}, 0);
		});
		const actualData = weekLabels.map((_, index) => {
			const weekKey = `week${index + 1}` as keyof WeeklyProductionReport;
			return data.reduce((sum, item) => {
				const weekData = item[weekKey] as any;
				return sum + (weekData?.actual || 0);
			}, 0);
		});

		return { weekLabels, planData, actualData };
	}, [data]);

	const chartOption = {
		title: {
			text: '주간 생산 계획 vs 실제 비교',
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
			top: '30px',
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: chartData.weekLabels,
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'bar',
				data: chartData.planData,
				itemStyle: {
					color: '#3b82f6',
				},
			},
			{
				name: '실제',
				type: 'bar',
				data: chartData.actualData,
				itemStyle: {
					color: '#10b981',
				},
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* Statistics cards */}
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
							<p className="text-sm text-gray-600">평균 효율성</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data.reduce(
										(sum, item) =>
											sum + item.averageEfficiency,
										0
									) / data.length
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
			</div>

			{/* Chart */}
			<div className="p-6 rounded-lg border">
				{chartOption && (
					<EchartComponent
						options={chartOption}
						styles={{ height: '400px' }}
					/>
				)}
			</div>

			{/* Data table */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="주간 생산 보고서 데이터"
					rowCount={data.length}
					useSearch={false}
					usePageNation={false}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>
		</div>
	);
};

export default WeeklyProductionReportPage;
