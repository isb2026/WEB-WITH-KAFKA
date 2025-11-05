import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface WorkStatus {
	id: number;
	workOrderId: string;
	productName: string;
	productCode: string;
	lineName: string;
	machineName: string;
	operatorName: string;
	status: 'running' | 'paused' | 'completed' | 'delayed' | 'setup';
	progress: number;
	plannedStartTime: string;
	plannedEndTime: string;
	actualStartTime: string;
	estimatedEndTime: string;
	quantity: number;
	completedQuantity: number;
	remainingQuantity: number;
	priority: 'high' | 'medium' | 'low';
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const workStatusData: WorkStatus[] = [
	{
		id: 1,
		workOrderId: 'WO-2024-001',
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		machineName: '설비 A-01',
		operatorName: '김철수',
		status: 'running',
		progress: 75,
		plannedStartTime: '2024-01-15 08:00:00',
		plannedEndTime: '2024-01-15 16:00:00',
		actualStartTime: '2024-01-15 08:15:00',
		estimatedEndTime: '2024-01-15 16:30:00',
		quantity: 1000,
		completedQuantity: 750,
		remainingQuantity: 250,
		priority: 'high',
		createdAt: '2024-01-15 08:00:00',
		updatedAt: '2024-01-15 12:00:00',
	},
	{
		id: 2,
		workOrderId: 'WO-2024-002',
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		machineName: '설비 B-01',
		operatorName: '이영희',
		status: 'paused',
		progress: 45,
		plannedStartTime: '2024-01-15 09:00:00',
		plannedEndTime: '2024-01-15 17:00:00',
		actualStartTime: '2024-01-15 09:00:00',
		estimatedEndTime: '2024-01-15 18:00:00',
		quantity: 800,
		completedQuantity: 360,
		remainingQuantity: 440,
		priority: 'medium',
		createdAt: '2024-01-15 09:00:00',
		updatedAt: '2024-01-15 11:30:00',
	},
	{
		id: 3,
		workOrderId: 'WO-2024-003',
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 1',
		machineName: '설비 A-02',
		operatorName: '박민수',
		status: 'completed',
		progress: 100,
		plannedStartTime: '2024-01-15 06:00:00',
		plannedEndTime: '2024-01-15 14:00:00',
		actualStartTime: '2024-01-15 06:00:00',
		estimatedEndTime: '2024-01-15 13:45:00',
		quantity: 500,
		completedQuantity: 500,
		remainingQuantity: 0,
		priority: 'low',
		createdAt: '2024-01-15 06:00:00',
		updatedAt: '2024-01-15 13:45:00',
	},
	{
		id: 4,
		workOrderId: 'WO-2024-004',
		productName: '제품 D',
		productCode: 'PROD-004',
		lineName: '라인 3',
		machineName: '설비 C-01',
		operatorName: '최지영',
		status: 'delayed',
		progress: 30,
		plannedStartTime: '2024-01-15 07:00:00',
		plannedEndTime: '2024-01-15 15:00:00',
		actualStartTime: '2024-01-15 07:30:00',
		estimatedEndTime: '2024-01-15 16:30:00',
		quantity: 1200,
		completedQuantity: 360,
		remainingQuantity: 840,
		priority: 'high',
		createdAt: '2024-01-15 07:00:00',
		updatedAt: '2024-01-15 11:00:00',
	},
	{
		id: 5,
		workOrderId: 'WO-2024-005',
		productName: '제품 E',
		productCode: 'PROD-005',
		lineName: '라인 2',
		machineName: '설비 B-02',
		operatorName: '정수진',
		status: 'setup',
		progress: 0,
		plannedStartTime: '2024-01-15 10:00:00',
		plannedEndTime: '2024-01-15 18:00:00',
		actualStartTime: '2024-01-15 10:00:00',
		estimatedEndTime: '2024-01-15 18:00:00',
		quantity: 600,
		completedQuantity: 0,
		remainingQuantity: 600,
		priority: 'medium',
		createdAt: '2024-01-15 10:00:00',
		updatedAt: '2024-01-15 10:00:00',
	},
];

const RealTimeWorkStatusPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<WorkStatus[]>([]);

	useEffect(() => {
		setData(workStatusData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'running':
				return 'text-green-600 bg-green-100';
			case 'paused':
				return 'text-yellow-600 bg-yellow-100';
			case 'completed':
				return 'text-blue-600 bg-blue-100';
			case 'delayed':
				return 'text-red-600 bg-red-100';
			case 'setup':
				return 'text-purple-600 bg-purple-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'running':
				return '작업중';
			case 'paused':
				return '일시정지';
			case 'completed':
				return '완료';
			case 'delayed':
				return '지연';
			case 'setup':
				return '설정중';
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
				statusData: [],
				progressData: [],
				labels: [],
			};
		}

		const statusCounts = data.reduce(
			(acc, item) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const progressRanges = [
			{ range: '0-25%', count: 0 },
			{ range: '26-50%', count: 0 },
			{ range: '51-75%', count: 0 },
			{ range: '76-100%', count: 0 },
		];

		data.forEach((item) => {
			if (item.progress <= 25) progressRanges[0].count++;
			else if (item.progress <= 50) progressRanges[1].count++;
			else if (item.progress <= 75) progressRanges[2].count++;
			else progressRanges[3].count++;
		});

		return {
			statusData: Object.values(statusCounts),
			progressData: progressRanges.map((r) => r.count),
			labels: Object.keys(statusCounts),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<WorkStatus>[]>(
		() => [
			{
				accessorKey: 'workOrderId',
				header: '작업지시번호',
				size: 140,
				align: 'left' as const,
			},
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
				accessorKey: 'machineName',
				header: '설비명',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'operatorName',
				header: '작업자',
				size: 100,
				align: 'left' as const,
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
			{
				accessorKey: 'progress',
				header: '진행률',
				size: 150,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="w-full">
						<div className="flex justify-between text-xs mb-1">
							<span>{row.original.progress}%</span>
							<span>
								{row.original.completedQuantity}/
								{row.original.quantity}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${row.original.progress}%` }}
							></div>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}
					>
						{getPriorityText(row.original.priority)}
					</span>
				),
			},
			{
				accessorKey: 'plannedStartTime',
				header: '계획 시작시간',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">
						{new Date(
							row.original.plannedStartTime
						).toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'estimatedEndTime',
				header: '예상 완료시간',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">
						{new Date(
							row.original.estimatedEndTime
						).toLocaleString()}
					</div>
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

	const statusChartOption = {
		title: {
			text: '작업 상태별 현황',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [
			{
				name: '작업 상태',
				type: 'pie',
				radius: '50%',
				data: chartData.labels.map((label, index) => ({
					value: chartData.statusData[index],
					name: getStatusText(label),
				})),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};

	const progressChartOption = {
		title: {
			text: '진행률별 작업 현황',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: ['0-25%', '26-50%', '51-75%', '76-100%'],
		},
		yAxis: {
			type: 'value',
			name: '작업 수',
		},
		series: [
			{
				name: '작업 수',
				type: 'bar',
				data: chartData.progressData,
				itemStyle: {
					color: '#3B82F6',
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
						<Activity className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">작업중</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'running'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">일시정지</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'paused'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">완료</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'completed'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">지연</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'delayed'
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
						options={statusChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={progressChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* 실시간 작업 현황 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="실시간 작업 현황"
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

export default RealTimeWorkStatusPage;
