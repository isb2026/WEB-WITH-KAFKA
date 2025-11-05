import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	Calendar,
	BarChart3,
	TrendingUp,
	Target,
	Factory,
	Package,
	Download,
	FileText,
	Activity,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';

interface PlanVsActualAnalysis {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	period: string;
	plannedQuantity: number;
	actualQuantity: number;
	variance: number;
	variancePercentage: number;
	plannedHours: number;
	actualHours: number;
	timeVariance: number;
	efficiency: number;
	status: 'on-track' | 'behind' | 'ahead' | 'critical';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const planVsActualAnalysisData: PlanVsActualAnalysis[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		period: '2024-05',
		plannedQuantity: 1000,
		actualQuantity: 950,
		variance: -50,
		variancePercentage: -5.0,
		plannedHours: 160,
		actualHours: 168,
		timeVariance: 8,
		efficiency: 95.2,
		status: 'behind',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		period: '2024-05',
		plannedQuantity: 800,
		actualQuantity: 820,
		variance: 20,
		variancePercentage: 2.5,
		plannedHours: 120,
		actualHours: 118,
		timeVariance: -2,
		efficiency: 102.5,
		status: 'ahead',
		createdBy: '사용자2',
		createdAt: '2024-05-31',
		updatedBy: '사용자2',
		updatedAt: '2024-05-31',
	},
	{
		id: 3,
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 3',
		plantName: '공장 C',
		period: '2024-05',
		plannedQuantity: 1200,
		actualQuantity: 1180,
		variance: -20,
		variancePercentage: -1.7,
		plannedHours: 180,
		actualHours: 182,
		timeVariance: 2,
		efficiency: 98.3,
		status: 'on-track',
		createdBy: '사용자3',
		createdAt: '2024-05-31',
		updatedBy: '사용자3',
		updatedAt: '2024-05-31',
	},
	{
		id: 4,
		productName: '제품 D',
		productCode: 'PROD-004',
		lineName: '라인 1',
		plantName: '공장 A',
		period: '2024-05',
		plannedQuantity: 600,
		actualQuantity: 550,
		variance: -50,
		variancePercentage: -8.3,
		plannedHours: 90,
		actualHours: 95,
		timeVariance: 5,
		efficiency: 91.7,
		status: 'critical',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
];

const PlanVsActualAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<PlanVsActualAnalysis[]>(planVsActualAnalysisData);

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

	const columns = useMemo<ColumnConfig<PlanVsActualAnalysis>[]>(
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
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'period',
				header: '기간',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'plannedQuantity',
				header: '계획 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.plannedQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'actualQuantity',
				header: '실제 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.actualQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'variance',
				header: '수량 차이',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-medium ${
							row.original.variance >= 0
								? 'text-green-600'
								: 'text-red-600'
						}`}
					>
						{row.original.variance >= 0 ? '+' : ''}
						{row.original.variance.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'variancePercentage',
				header: '차이율(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-medium ${
							row.original.variancePercentage >= 0
								? 'text-green-600'
								: 'text-red-600'
						}`}
					>
						{row.original.variancePercentage >= 0 ? '+' : ''}
						{row.original.variancePercentage.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'efficiency',
				header: '효율성(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium text-blue-600">
						{row.original.efficiency.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 120,
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
		[]
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

	// Chart data preparation for trend analysis
	const trendChartData = useMemo(() => {
		const periods = data.map((item) => item.period);
		const plannedData = data.map((item) => item.plannedQuantity);
		const actualData = data.map((item) => item.actualQuantity);
		const efficiencyData = data.map((item) => item.efficiency);

		return { periods, plannedData, actualData, efficiencyData };
	}, [data]);

	// Bar comparison chart
	const barChartOption = {
		title: {
			text: '계획 vs 실제 수량 비교',
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
			data: trendChartData.periods,
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'bar',
				data: trendChartData.plannedData,
				itemStyle: {
					color: '#3b82f6',
				},
			},
			{
				name: '실제',
				type: 'bar',
				data: trendChartData.actualData,
				itemStyle: {
					color: '#10b981',
				},
			},
		],
	};

	// Trend line chart for efficiency
	const trendLineChartOption = {
		title: {
			text: '효율성 트렌드 분석',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['효율성'],
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
			data: trendChartData.periods,
		},
		yAxis: {
			type: 'value',
			name: '효율성(%)',
			min: 80,
			max: 110,
		},
		series: [
			{
				name: '효율성',
				type: 'line',
				data: trendChartData.efficiencyData,
				smooth: true,
				itemStyle: {
					color: '#f59e0b',
				},
				lineStyle: {
					width: 3,
				},
				markPoint: {
					data: [
						{ type: 'max', name: '최고값' },
						{ type: 'min', name: '최저값' },
					],
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
										(sum, item) =>
											sum + item.plannedQuantity,
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
										(sum, item) =>
											sum + item.actualQuantity,
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
										(sum, item) => sum + item.efficiency,
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
						<Activity className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">정상 진행</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'on-track'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="p-6 rounded-lg border">
					{barChartOption && (
						<EchartComponent
							options={barChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{trendLineChartOption && (
						<EchartComponent
							options={trendLineChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
			</div>

			{/* Data table */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="계획 vs 실제 분석 데이터"
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

export default PlanVsActualAnalysisPage;
