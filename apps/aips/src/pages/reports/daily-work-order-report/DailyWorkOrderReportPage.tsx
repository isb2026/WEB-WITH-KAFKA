import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	BarChart3,
	TrendingUp,
	Target,
	Factory,
	Download,
	Printer,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';

interface DailyWorkOrderReport {
	id: number;
	workOrderNo: string;
	productName: string;
	productCode: string;
	lineName: string;
	plantName: string;
	plannedQuantity: number;
	actualQuantity: number;
	variance: number;
	plannedStartTime: string;
	actualStartTime: string;
	plannedEndTime: string;
	actualEndTime: string;
	status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	operator: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const dailyWorkOrderReportData: DailyWorkOrderReport[] = [
	{
		id: 1,
		workOrderNo: 'WO-2024-001',
		productName: '제품 A',
		productCode: 'PROD-001',
		lineName: '라인 1',
		plantName: '공장 A',
		plannedQuantity: 100,
		actualQuantity: 95,
		variance: -5,
		plannedStartTime: '2024-05-31 08:00',
		actualStartTime: '2024-05-31 08:15',
		plannedEndTime: '2024-05-31 16:00',
		actualEndTime: '2024-05-31 16:30',
		status: 'completed',
		priority: 'high',
		operator: '김철수',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
	{
		id: 2,
		workOrderNo: 'WO-2024-002',
		productName: '제품 B',
		productCode: 'PROD-002',
		lineName: '라인 2',
		plantName: '공장 B',
		plannedQuantity: 150,
		actualQuantity: 0,
		variance: -150,
		plannedStartTime: '2024-05-31 09:00',
		actualStartTime: '2024-05-31 09:00',
		plannedEndTime: '2024-05-31 17:00',
		actualEndTime: '',
		status: 'in-progress',
		priority: 'medium',
		operator: '이영희',
		createdBy: '사용자2',
		createdAt: '2024-05-31',
		updatedBy: '사용자2',
		updatedAt: '2024-05-31',
	},
	{
		id: 3,
		workOrderNo: 'WO-2024-003',
		productName: '제품 C',
		productCode: 'PROD-003',
		lineName: '라인 3',
		plantName: '공장 C',
		plannedQuantity: 80,
		actualQuantity: 85,
		variance: 5,
		plannedStartTime: '2024-05-31 10:00',
		actualStartTime: '2024-05-31 09:45',
		plannedEndTime: '2024-05-31 15:00',
		actualEndTime: '2024-05-31 14:30',
		status: 'completed',
		priority: 'low',
		operator: '박민수',
		createdBy: '사용자3',
		createdAt: '2024-05-31',
		updatedBy: '사용자3',
		updatedAt: '2024-05-31',
	},
	{
		id: 4,
		workOrderNo: 'WO-2024-004',
		productName: '제품 D',
		productCode: 'PROD-004',
		lineName: '라인 1',
		plantName: '공장 A',
		plannedQuantity: 120,
		actualQuantity: 0,
		variance: -120,
		plannedStartTime: '2024-05-31 14:00',
		actualStartTime: '',
		plannedEndTime: '2024-05-31 22:00',
		actualEndTime: '',
		status: 'planned',
		priority: 'urgent',
		operator: '정수진',
		createdBy: '사용자1',
		createdAt: '2024-05-31',
		updatedBy: '사용자1',
		updatedAt: '2024-05-31',
	},
];

const DailyWorkOrderReportPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<DailyWorkOrderReport[]>(dailyWorkOrderReportData);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'planned':
				return 'bg-blue-100 text-blue-800';
			case 'in-progress':
				return 'bg-yellow-100 text-yellow-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'delayed':
				return 'bg-red-100 text-red-800';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
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
			case 'cancelled':
				return '취소';
			default:
				return '알 수 없음';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'low':
				return 'bg-gray-100 text-gray-800';
			case 'medium':
				return 'bg-blue-100 text-blue-800';
			case 'high':
				return 'bg-yellow-100 text-yellow-800';
			case 'urgent':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'low':
				return '낮음';
			case 'medium':
				return '보통';
			case 'high':
				return '높음';
			case 'urgent':
				return '긴급';
			default:
				return '알 수 없음';
		}
	};

	const columns = useMemo<ColumnConfig<DailyWorkOrderReport>[]>(
		() => [
			{
				accessorKey: 'workOrderNo',
				header: '작업지시번호',
				size: 160,
				align: 'left' as const,
			},
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
				header: '차이',
				size: 100,
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
				accessorKey: 'plannedStartTime',
				header: '계획 시작시간',
				size: 160,
				align: 'left' as const,
			},
			{
				accessorKey: 'actualStartTime',
				header: '실제 시작시간',
				size: 160,
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
				accessorKey: 'priority',
				header: '우선순위',
				size: 120,
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
				accessorKey: 'operator',
				header: '작업자',
				size: 100,
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

	// Chart data preparation
	const chartData = useMemo(() => {
		const statusCounts = data.reduce(
			(acc, item) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const labels = Object.keys(statusCounts).map((status) =>
			getStatusText(status)
		);
		const values = Object.values(statusCounts);

		return { labels, values };
	}, [data]);

	// Line chart data preparation for work order trends
	const lineChartData = useMemo(() => {
		// Create time-based data for the last 7 days
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - i));
			return date.toISOString().split('T')[0];
		});

		// Generate sample trend data (in real app, this would come from API)
		const plannedData = [12, 15, 18, 14, 16, 19, 17];
		const completedData = [10, 13, 16, 12, 14, 17, 15];
		const inProgressData = [2, 2, 2, 2, 2, 2, 2];

		return {
			dates: last7Days.map((date) => {
				const d = new Date(date);
				return `${d.getMonth() + 1}/${d.getDate()}`;
			}),
			planned: plannedData,
			completed: completedData,
			inProgress: inProgressData,
		};
	}, []);

	const chartOption = {
		title: {
			text: '일일 작업 지시 상태 분포',
			left: 'center',
			top: '20px',
			textStyle: {
				fontSize: '18',
				fontWeight: 'bold',
				color: '#374151',
			},
		},
		tooltip: {
			trigger: 'item',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#e5e7eb',
			borderWidth: 1,
			textStyle: {
				color: '#374151',
			},
			formatter: function (params: any) {
				const total = chartData.values.reduce(
					(sum, val) => sum + val,
					0
				);
				const percentage = ((params.value / total) * 100).toFixed(1);
				return `
					<div style="padding: 8px;">
						<div style="font-weight: bold; margin-bottom: 4px; color: #374151;">
							${params.seriesName}
						</div>
						<div style="margin-bottom: 4px;">
							<span style="color: #6b7280;">상태:</span> 
							<span style="font-weight: 600; color: #374151;">${params.name}</span>
						</div>
						<div style="margin-bottom: 4px;">
							<span style="color: #6b7280;">수량:</span> 
							<span style="font-weight: 600; color: #374151;">${params.value}건</span>
						</div>
						<div>
							<span style="color: #6b7280;">비율:</span> 
							<span style="font-weight: 600; color: #10b981;">${percentage}%</span>
						</div>
					</div>
				`;
			},
		},
		legend: {
			orient: 'vertical',
			left: 'ceenter',
			itemGap: 12,
			textStyle: {
				fontSize: '14',
				color: '#6b7280',
			},
			itemStyle: {
				borderWidth: 0,
			},
		},
		series: [
			{
				name: '작업 지시',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: true,
					position: 'outside',
					formatter: '{b}\n{c}건',
					fontSize: 12,
					fontWeight: '500',
					color: '#374151',
				},
				labelLine: {
					show: true,
					length: 15,
					length2: 10,
					smooth: true,
					lineStyle: {
						color: '#d1d5db',
						width: 1,
					},
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold',
						color: '#111827',
					},
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.3)',
					},
				},
				data: chartData.labels.map((label, index) => {
					// Define colors based on status
					let color;
					switch (label) {
						case '완료':
							color = '#10b981'; // Green
							break;
						case '진행중':
							color = '#f59e0b'; // Yellow
							break;
						case '계획됨':
							color = '#3b82f6'; // Blue
							break;
						case '지연':
							color = '#ef4444'; // Red
							break;
						case '취소':
							color = '#6b7280'; // Gray
							break;
						default:
							color = '#8b5cf6'; // Purple
					}

					return {
						value: chartData.values[index],
						name: label,
						itemStyle: {
							color: color,
						},
					};
				}),
			},
		],
		// Add animation and interaction
		animation: true,
		animationDuration: 1000,
		animationEasing: 'cubicOut',
		animationDelay: function (idx: number) {
			return idx * 200;
		},
	};

	// Line chart option for work order trends
	const lineChartOption = {
		title: {
			text: '작업 지시 트렌드 (최근 7일)',
			left: 'center',
			top: '20px',
			textStyle: {
				fontSize: '16',
				fontWeight: 'bold',
				color: '#374151',
			},
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(255, 255, 255, 0.95)',
			borderColor: '#e5e7eb',
			borderWidth: 1,
			textStyle: {
				color: '#374151',
			},
			formatter: function (params: any) {
				let result = `<div style="padding: 8px;">
					<div style="font-weight: bold; margin-bottom: 8px; color: #374151;">
						${params[0].axisValue}
					</div>`;

				params.forEach((param: any) => {
					const color = param.color;
					const name = param.seriesName;
					const value = param.value;

					result += `
						<div style="display: flex; align-items: center; margin-bottom: 4px;">
							<span style="display: inline-block; width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></span>
							<span style="color: #6b7280; margin-right: 8px;">${name}:</span>
							<span style="font-weight: 600; color: #374151;">${value}건</span>
						</div>
					`;
				});

				result += '</div>';
				return result;
			},
		},
		legend: {
			data: ['계획', '완료', '진행중'],
			top: '50px',
			textStyle: {
				fontSize: '12',
				color: '#6b7280',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top: '25%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: lineChartData.dates,
			axisLine: {
				lineStyle: {
					color: '#d1d5db',
				},
			},
			axisLabel: {
				color: '#6b7280',
				fontSize: 11,
			},
		},
		yAxis: {
			type: 'value',
			name: '작업 지시 수',
			nameTextStyle: {
				color: '#6b7280',
				fontSize: 12,
			},
			axisLine: {
				lineStyle: {
					color: '#d1d5db',
				},
			},
			axisLabel: {
				color: '#6b7280',
				fontSize: 11,
			},
			splitLine: {
				lineStyle: {
					color: '#f3f4f6',
					type: 'dashed',
				},
			},
		},
		series: [
			{
				name: '계획',
				type: 'line',
				data: lineChartData.planned,
				smooth: true,
				lineStyle: {
					width: 3,
					color: '#3b82f6',
				},
				itemStyle: {
					color: '#3b82f6',
					borderColor: '#ffffff',
					borderWidth: 2,
				},
				symbol: 'circle',
				symbolSize: 8,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
							{ offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
						],
					},
				},
			},
			{
				name: '완료',
				type: 'line',
				data: lineChartData.completed,
				smooth: true,
				lineStyle: {
					width: 3,
					color: '#10b981',
				},
				itemStyle: {
					color: '#10b981',
					borderColor: '#ffffff',
					borderWidth: 2,
				},
				symbol: 'circle',
				symbolSize: 8,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
							{ offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
						],
					},
				},
			},
			{
				name: '진행중',
				type: 'line',
				data: lineChartData.inProgress,
				smooth: true,
				lineStyle: {
					width: 3,
					color: '#f59e0b',
				},
				itemStyle: {
					color: '#f59e0b',
					borderColor: '#ffffff',
					borderWidth: 2,
				},
				symbol: 'circle',
				symbolSize: 8,
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
							{ offset: 1, color: 'rgba(245, 158, 11, 0.05)' },
						],
					},
				},
			},
		],
		animation: true,
		animationDuration: 1500,
		animationEasing: 'cubicOut',
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
								총 작업 지시
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">완료된 작업</p>
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
						<TrendingUp className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">
								진행중인 작업
							</p>
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
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">계획 수량</p>
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
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="p-6 rounded-lg border">
					{chartOption && (
						<EchartComponent
							options={chartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{lineChartOption && (
						<EchartComponent
							options={lineChartOption}
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
					tableTitle="일일 작업 지시 보고서 데이터"
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

export default DailyWorkOrderReportPage;
