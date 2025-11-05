import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	AlertTriangle,
	Clock,
	AlertCircle,
	CheckCircle,
	XCircle,
	Package,
	Calendar,
	TrendingDown,
	Info,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface DeliveryDelayAlert {
	id: number;
	workOrderId: string;
	productName: string;
	productCode: string;
	customerName: string;
	orderNumber: string;
	plannedDeliveryDate: string;
	actualDeliveryDate: string;
	delayDays: number;
	priority: 'critical' | 'high' | 'medium' | 'low';
	status: 'active' | 'resolved' | 'escalated';
	reason: string;
	impact: 'high' | 'medium' | 'low';
	assignedTo: string;
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const deliveryDelayData: DeliveryDelayAlert[] = [
	{
		id: 1,
		workOrderId: 'WO-2024-001',
		productName: '제품 A',
		productCode: 'PROD-001',
		customerName: '고객사 A',
		orderNumber: 'ORD-2024-001',
		plannedDeliveryDate: '2024-01-20',
		actualDeliveryDate: '2024-01-25',
		delayDays: 5,
		priority: 'critical',
		status: 'active',
		reason: '설비 고장으로 인한 생산 지연',
		impact: 'high',
		assignedTo: '김철수',
		createdAt: '2024-01-15 08:00:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		workOrderId: 'WO-2024-002',
		productName: '제품 B',
		productCode: 'PROD-002',
		customerName: '고객사 B',
		orderNumber: 'ORD-2024-002',
		plannedDeliveryDate: '2024-01-18',
		actualDeliveryDate: '2024-01-22',
		delayDays: 4,
		priority: 'high',
		status: 'active',
		reason: '원자재 부족으로 인한 생산 지연',
		impact: 'medium',
		assignedTo: '이영희',
		createdAt: '2024-01-15 09:00:00',
		updatedAt: '2024-01-15 15:00:00',
	},
	{
		id: 3,
		workOrderId: 'WO-2024-003',
		productName: '제품 C',
		productCode: 'PROD-003',
		customerName: '고객사 C',
		orderNumber: 'ORD-2024-003',
		plannedDeliveryDate: '2024-01-16',
		actualDeliveryDate: '2024-01-17',
		delayDays: 1,
		priority: 'medium',
		status: 'resolved',
		reason: '품질 검사 지연',
		impact: 'low',
		assignedTo: '박민수',
		createdAt: '2024-01-15 06:00:00',
		updatedAt: '2024-01-15 17:00:00',
	},
	{
		id: 4,
		workOrderId: 'WO-2024-004',
		productName: '제품 D',
		productCode: 'PROD-004',
		customerName: '고객사 D',
		orderNumber: 'ORD-2024-004',
		plannedDeliveryDate: '2024-01-19',
		actualDeliveryDate: '2024-01-23',
		delayDays: 4,
		priority: 'high',
		status: 'escalated',
		reason: '운송업체 배송 지연',
		impact: 'high',
		assignedTo: '최지영',
		createdAt: '2024-01-15 07:00:00',
		updatedAt: '2024-01-15 14:00:00',
	},
	{
		id: 5,
		workOrderId: 'WO-2024-005',
		productName: '제품 E',
		productCode: 'PROD-005',
		customerName: '고객사 E',
		orderNumber: 'ORD-2024-005',
		plannedDeliveryDate: '2024-01-21',
		actualDeliveryDate: '2024-01-21',
		delayDays: 0,
		priority: 'low',
		status: 'resolved',
		reason: '정상 배송',
		impact: 'low',
		assignedTo: '정수진',
		createdAt: '2024-01-15 10:00:00',
		updatedAt: '2024-01-15 21:00:00',
	},
];

const DeliveryDelayAlertsPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<DeliveryDelayAlert[]>([]);

	useEffect(() => {
		setData(deliveryDelayData);
	}, []);

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'critical':
				return 'text-red-600 bg-red-100';
			case 'high':
				return 'text-orange-600 bg-orange-100';
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
			case 'critical':
				return '긴급';
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'text-red-600 bg-red-100';
			case 'resolved':
				return 'text-green-600 bg-green-100';
			case 'escalated':
				return 'text-orange-600 bg-orange-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return '활성';
			case 'resolved':
				return '해결됨';
			case 'escalated':
				return '에스컬레이션';
			default:
				return '알 수 없음';
		}
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
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

	const getImpactText = (impact: string) => {
		switch (impact) {
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
				priorityData: [],
				statusData: [],
				impactData: [],
				labels: [],
			};
		}

		const priorityCounts = data.reduce(
			(acc, item) => {
				acc[item.priority] = (acc[item.priority] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const statusCounts = data.reduce(
			(acc, item) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const impactCounts = data.reduce(
			(acc, item) => {
				acc[item.impact] = (acc[item.impact] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			priorityData: Object.values(priorityCounts),
			statusData: Object.values(statusCounts),
			impactData: Object.values(impactCounts),
			labels: Object.keys(priorityCounts),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<DeliveryDelayAlert>[]>(
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
				accessorKey: 'customerName',
				header: '고객사',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'orderNumber',
				header: '주문번호',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'plannedDeliveryDate',
				header: '계획 납기일',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'actualDeliveryDate',
				header: '실제 납기일',
				size: 120,
				align: 'left' as const,
			},
			{
				accessorKey: 'delayDays',
				header: '지연일수',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-center font-medium ${row.original.delayDays > 0 ? 'text-red-600' : 'text-green-600'}`}
					>
						{row.original.delayDays > 0
							? `+${row.original.delayDays}일`
							: '정시'}
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
				accessorKey: 'impact',
				header: '영향도',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(row.original.impact)}`}
					>
						{getImpactText(row.original.impact)}
					</span>
				),
			},
			{
				accessorKey: 'assignedTo',
				header: '담당자',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'reason',
				header: '지연 사유',
				size: 200,
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

	const priorityChartOption = {
		title: {
			text: '우선순위별 지연 현황',
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
				name: '우선순위',
				type: 'pie',
				radius: '50%',
				data: chartData.labels.map((label, index) => ({
					value: chartData.priorityData[index],
					name: getPriorityText(label),
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

	const statusChartOption = {
		title: {
			text: '상태별 지연 현황',
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
			data: ['활성', '해결됨', '에스컬레이션'],
		},
		yAxis: {
			type: 'value',
			name: '건수',
		},
		series: [
			{
				name: '건수',
				type: 'bar',
				data: chartData.statusData,
				itemStyle: {
					color: '#EF4444',
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
						<AlertTriangle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">
								총 지연 건수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter((item) => item.delayDays > 0)
										.length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-8 w-8 text-orange-600" />
						<div>
							<p className="text-sm text-gray-600">활성 알림</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'active'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">해결된 알림</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'resolved'
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
							<p className="text-sm text-gray-600">
								평균 지연일수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data
										.filter((item) => item.delayDays > 0)
										.reduce(
											(sum, item) => sum + item.delayDays,
											0
										) /
										data.filter(
											(item) => item.delayDays > 0
										).length
								) || 0}
								일
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={priorityChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
				<div className="bg-white p-6 rounded-lg border">
					<EchartComponent
						options={statusChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* 납기 지연 알림 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="납기 지연 알림"
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

export default DeliveryDelayAlertsPage;
