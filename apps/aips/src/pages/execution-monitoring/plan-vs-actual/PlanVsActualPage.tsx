import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	BarChart3,
	TrendingUp,
	Target,
	CheckCircle,
	AlertTriangle,
	Clock,
	Factory,
	Calendar,
	TrendingDown,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface PlanVsActual {
	id: number;
	productName: string;
	productCode: string;
	lineName: string;
	date: string;
	plannedQuantity: number;
	actualQuantity: number;
	variance: number;
	variancePercentage: number;
	plannedStartTime: string;
	plannedEndTime: string;
	actualStartTime: string;
	actualEndTime: string;
	status: 'on-track' | 'behind' | 'ahead' | 'delayed';
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const planVsActualData: PlanVsActual[] = [
	{
		id: 1,
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		date: '2024-01-15',
		plannedQuantity: 1000,
		actualQuantity: 950,
		variance: -50,
		variancePercentage: -5.0,
		plannedStartTime: '08:00:00',
		plannedEndTime: '16:00:00',
		actualStartTime: '08:15:00',
		actualEndTime: '16:30:00',
		status: 'behind',
		createdAt: '2024-01-15 08:00:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		date: '2024-01-15',
		plannedQuantity: 800,
		actualQuantity: 820,
		variance: 20,
		variancePercentage: 2.5,
		plannedStartTime: '09:00:00',
		plannedEndTime: '17:00:00',
		actualStartTime: '08:45:00',
		actualEndTime: '16:45:00',
		status: 'ahead',
		createdAt: '2024-01-15 09:00:00',
		updatedAt: '2024-01-15 16:45:00',
	},
	{
		id: 3,
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 1',
		date: '2024-01-15',
		plannedQuantity: 500,
		actualQuantity: 500,
		variance: 0,
		variancePercentage: 0.0,
		plannedStartTime: '06:00:00',
		plannedEndTime: '14:00:00',
		actualStartTime: '06:00:00',
		actualEndTime: '13:45:00',
		status: 'on-track',
		createdAt: '2024-01-15 06:00:00',
		updatedAt: '2024-01-15 13:45:00',
	},
	{
		id: 4,
		productName: '제품 D',
		productCode: 'PROD-004',
		lineName: '라인 3',
		date: '2024-01-15',
		plannedQuantity: 1200,
		actualQuantity: 900,
		variance: -300,
		variancePercentage: -25.0,
		plannedStartTime: '07:00:00',
		plannedEndTime: '15:00:00',
		actualStartTime: '07:30:00',
		actualEndTime: '16:30:00',
		status: 'delayed',
		createdAt: '2024-01-15 07:00:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 5,
		productName: '제품 E',
		productCode: 'PROD-005',
		lineName: '라인 2',
		date: '2024-01-15',
		plannedQuantity: 600,
		actualQuantity: 0,
		variance: -600,
		variancePercentage: -100.0,
		plannedStartTime: '10:00:00',
		plannedEndTime: '18:00:00',
		actualStartTime: '10:00:00',
		actualEndTime: '18:00:00',
		status: 'delayed',
		createdAt: '2024-01-15 10:00:00',
		updatedAt: '2024-01-15 10:00:00',
	},
];

const PlanVsActualPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<PlanVsActual[]>([]);

	useEffect(() => {
		setData(planVsActualData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'on-track':
				return 'text-green-600 bg-green-100';
			case 'behind':
				return 'text-yellow-600 bg-yellow-100';
			case 'ahead':
				return 'text-blue-600 bg-blue-100';
			case 'delayed':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'on-track':
				return '정상';
			case 'behind':
				return '지연';
			case 'ahead':
				return '앞섬';
			case 'delayed':
				return '대기';
			default:
				return '알 수 없음';
		}
	};

	// 차트 데이터
	const chartData = useMemo(() => {
		if (!data || data.length === 0) {
			return {
				plannedData: [],
				actualData: [],
				varianceData: [],
				labels: [],
			};
		}

		return {
			plannedData: data.map((item) => item.plannedQuantity),
			actualData: data.map((item) => item.actualQuantity),
			varianceData: data.map((item) => item.variance),
			labels: data.map((item) => item.productName),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<PlanVsActual>[]>(
		() => [
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'lineName',
				header: '라인명',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'date',
				header: '날짜',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'plannedQuantity',
				header: '계획 수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
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
					<div className="font-medium">
						{row.original.actualQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'variance',
				header: '차이',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`font-medium ${row.original.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}
					>
						{row.original.variance >= 0 ? '+' : ''}
						{row.original.variance.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'variancePercentage',
				header: '차이율',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`font-medium ${row.original.variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}
					>
						{row.original.variancePercentage >= 0 ? '+' : ''}
						{row.original.variancePercentage.toFixed(1)}%
					</div>
				),
			},
			{
				accessorKey: 'status',
				header: '상태',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
			{
				accessorKey: 'plannedStartTime',
				header: '계획 시작시간',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'plannedEndTime',
				header: '계획 종료시간',
				size: 120,
				align: 'left' as const,
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

	const barChartOption = {
		title: {
			text: '계획 vs 실제 생산량 비교',
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
			data: chartData.labels,
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'bar',
				data: chartData.plannedData,
				itemStyle: {
					color: '#3B82F6',
				},
			},
			{
				name: '실제',
				type: 'bar',
				data: chartData.actualData,
				itemStyle: {
					color: '#10B981',
				},
			},
		],
	};

	const lineChartOption = {
		title: {
			text: '계획 vs 실제 추이',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['계획', '실제', '차이'],
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
			data: chartData.labels,
		},
		yAxis: {
			type: 'value',
			name: '수량',
		},
		series: [
			{
				name: '계획',
				type: 'line',
				data: chartData.plannedData,
				itemStyle: {
					color: '#3B82F6',
				},
				smooth: true,
			},
			{
				name: '실제',
				type: 'line',
				data: chartData.actualData,
				itemStyle: {
					color: '#10B981',
				},
				smooth: true,
			},
			{
				name: '차이',
				type: 'line',
				data: chartData.varianceData,
				itemStyle: {
					color: '#EF4444',
				},
				smooth: true,
			},
		],
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-blue-600" />
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
						<CheckCircle className="h-8 w-8 text-green-600" />
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
							<p className="text-sm text-gray-600">달성률</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									(data.reduce(
										(sum, item) =>
											sum + item.actualQuantity,
										0
									) /
										data.reduce(
											(sum, item) =>
												sum + item.plannedQuantity,
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
						<AlertTriangle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">지연 작업</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) =>
											item.status === 'delayed' ||
											item.status === 'behind'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={barChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={lineChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* 계획 vs 실제 성과 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="계획 vs 실제 성과"
					rowCount={data.length}
					useSearch={true}
					usePageNation={true}
					toggleRowSelection={toggleRowSelection}
					selectedRows={selectedRows}
					useEditable={false}
				/>
			</div>
		</div>
	);
};

export default PlanVsActualPage;
