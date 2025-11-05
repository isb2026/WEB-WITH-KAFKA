import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { BarChart3, TrendingUp, Target, Factory } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface MonthlyProductionReport {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	january: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	february: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	march: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	april: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	may: { plan: number; actual: number; variance: number; efficiency: number };
	june: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	july: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	august: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	september: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	october: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	november: {
		plan: number;
		actual: number;
		variance: number;
		efficiency: number;
	};
	december: {
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
const monthlyProductionReportData: MonthlyProductionReport[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		january: { plan: 1000, actual: 950, variance: -50, efficiency: 95.0 },
		february: { plan: 1100, actual: 1050, variance: -50, efficiency: 95.5 },
		march: { plan: 1200, actual: 1180, variance: -20, efficiency: 98.3 },
		april: { plan: 1300, actual: 1250, variance: -50, efficiency: 96.2 },
		may: { plan: 1400, actual: 1380, variance: -20, efficiency: 98.6 },
		june: { plan: 1500, actual: 1420, variance: -80, efficiency: 94.7 },
		july: { plan: 1600, actual: 1520, variance: -80, efficiency: 95.0 },
		august: { plan: 1700, actual: 1580, variance: -120, efficiency: 92.9 },
		september: {
			plan: 1800,
			actual: 1680,
			variance: -120,
			efficiency: 93.3,
		},
		october: { plan: 1900, actual: 1780, variance: -120, efficiency: 93.7 },
		november: {
			plan: 2000,
			actual: 1880,
			variance: -120,
			efficiency: 94.0,
		},
		december: {
			plan: 2100,
			actual: 1980,
			variance: -120,
			efficiency: 94.3,
		},
		totalPlan: 18600,
		totalActual: 17200,
		totalVariance: -1400,
		averageEfficiency: 94.8,
		status: 'behind',
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
		january: { plan: 800, actual: 780, variance: -20, efficiency: 97.5 },
		february: { plan: 900, actual: 870, variance: -30, efficiency: 96.7 },
		march: { plan: 1000, actual: 980, variance: -20, efficiency: 98.0 },
		april: { plan: 1100, actual: 1080, variance: -20, efficiency: 98.2 },
		may: { plan: 1200, actual: 1190, variance: -10, efficiency: 99.2 },
		june: { plan: 1300, actual: 1250, variance: -50, efficiency: 96.2 },
		july: { plan: 1400, actual: 1320, variance: -80, efficiency: 94.3 },
		august: { plan: 1500, actual: 1380, variance: -120, efficiency: 92.0 },
		september: {
			plan: 1600,
			actual: 1450,
			variance: -150,
			efficiency: 90.6,
		},
		october: { plan: 1700, actual: 1520, variance: -180, efficiency: 89.4 },
		november: {
			plan: 1800,
			actual: 1580,
			variance: -220,
			efficiency: 87.8,
		},
		december: {
			plan: 1900,
			actual: 1650,
			variance: -250,
			efficiency: 86.8,
		},
		totalPlan: 15300,
		totalActual: 13300,
		totalVariance: -2000,
		averageEfficiency: 93.5,
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
		january: { plan: 1200, actual: 1250, variance: 50, efficiency: 104.2 },
		february: { plan: 1300, actual: 1350, variance: 50, efficiency: 103.8 },
		march: { plan: 1400, actual: 1420, variance: 20, efficiency: 101.4 },
		april: { plan: 1500, actual: 1480, variance: -20, efficiency: 98.7 },
		may: { plan: 1600, actual: 1620, variance: 20, efficiency: 101.3 },
		june: { plan: 1700, actual: 1680, variance: -20, efficiency: 98.8 },
		july: { plan: 1800, actual: 1750, variance: -50, efficiency: 97.2 },
		august: { plan: 1900, actual: 1820, variance: -80, efficiency: 95.8 },
		september: {
			plan: 2000,
			actual: 1880,
			variance: -120,
			efficiency: 94.0,
		},
		october: { plan: 2100, actual: 1950, variance: -150, efficiency: 92.9 },
		november: {
			plan: 2200,
			actual: 2020,
			variance: -180,
			efficiency: 91.8,
		},
		december: {
			plan: 2300,
			actual: 2080,
			variance: -220,
			efficiency: 90.4,
		},
		totalPlan: 20000,
		totalActual: 18870,
		totalVariance: -1130,
		averageEfficiency: 97.8,
		status: 'ahead',
		createdBy: '사용자3',
		createdAt: '2024-01-01',
		updatedBy: '사용자3',
		updatedAt: '2024-05-31',
	},
];

const MonthlyProductionReportPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<MonthlyProductionReport[]>(
		monthlyProductionReportData
	);

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

	const columns = useMemo<ColumnConfig<MonthlyProductionReport>[]>(
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
			...months.map((month) => ({
				accessorKey: month.key as keyof MonthlyProductionReport,
				header: month.label,
				size: 120,
				align: 'left' as const,
				accessorFn: (row: MonthlyProductionReport) => {
					const monthKey = month.key as keyof MonthlyProductionReport;
					const monthData = row[monthKey] as {
						plan: number;
						actual: number;
						variance: number;
						efficiency: number;
					};
					return monthData.plan;
				},
				cell: ({ row }: { row: any }) => {
					const item = row.original as MonthlyProductionReport;
					const monthKey = month.key as keyof MonthlyProductionReport;
					const monthData = item[monthKey] as {
						plan: number;
						actual: number;
						variance: number;
						efficiency: number;
					};
					return (
						<div className="text-sm">
							<div className="font-medium">
								계획: {monthData.plan.toLocaleString()}
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
							<div className="text-xs text-blue-600">
								효율: {monthData.efficiency.toFixed(1)}%
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

	// Chart data preparation
	const chartData = useMemo(() => {
		const months = [
			'1월',
			'2월',
			'3월',
			'4월',
			'5월',
			'6월',
			'7월',
			'8월',
			'9월',
			'10월',
			'11월',
			'12월',
		];

		// Direct mapping to month properties
		const monthKeys = [
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december',
		];

		const planData = monthKeys.map((monthKey) => {
			return data.reduce((sum, item) => {
				const monthData = item[
					monthKey as keyof MonthlyProductionReport
				] as any;
				return sum + (monthData?.plan || 0);
			}, 0);
		});

		const actualData = monthKeys.map((monthKey) => {
			return data.reduce((sum, item) => {
				const monthData = item[
					monthKey as keyof MonthlyProductionReport
				] as any;
				return sum + (monthData?.actual || 0);
			}, 0);
		});

		return { months, planData, actualData };
	}, [data]);

	const chartOption = {
		title: {
			text: '월간 생산 계획 vs 실제 비교',
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
			data: chartData.months,
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'line',
				data: chartData.planData,
				itemStyle: {
					color: '#3b82f6',
				},
			},
			{
				name: '실제',
				type: 'line',
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
					tableTitle="월간 생산 보고서 데이터"
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

export default MonthlyProductionReportPage;
