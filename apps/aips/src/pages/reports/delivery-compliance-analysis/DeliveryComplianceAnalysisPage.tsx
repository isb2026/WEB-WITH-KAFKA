import { useState, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { Target, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface DeliveryComplianceAnalysis {
	id: number;
	orderNumber: string;
	customerName: string;
	productName: string;
	productCode: string;
	orderQuantity: number;
	deliveredQuantity: number;
	orderDate: string;
	requestedDeliveryDate: string;
	actualDeliveryDate: string;
	deliveryStatus: 'on-time' | 'early' | 'late' | 'cancelled';
	daysEarly: number;
	daysLate: number;
	complianceScore: number;
	priority: 'low' | 'medium' | 'high' | 'urgent';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

// Dummy data
const deliveryComplianceAnalysisData: DeliveryComplianceAnalysis[] = [
	{
		id: 1,
		orderNumber: 'ORD-2024-001',
		customerName: '고객사 A',
		productName: '제품 A',
		productCode: 'PROD-001',
		orderQuantity: 1000,
		deliveredQuantity: 1000,
		orderDate: '2024-05-01',
		requestedDeliveryDate: '2024-05-31',
		actualDeliveryDate: '2024-05-30',
		deliveryStatus: 'early',
		daysEarly: 1,
		daysLate: 0,
		complianceScore: 100,
		priority: 'high',
		createdBy: '사용자1',
		createdAt: '2024-05-01',
		updatedBy: '사용자1',
		updatedAt: '2024-05-30',
	},
	{
		id: 2,
		orderNumber: 'ORD-2024-002',
		customerName: '고객사 B',
		productName: '제품 B',
		productCode: 'PROD-002',
		orderQuantity: 800,
		deliveredQuantity: 800,
		orderDate: '2024-05-05',
		requestedDeliveryDate: '2024-05-28',
		actualDeliveryDate: '2024-05-28',
		deliveryStatus: 'on-time',
		daysEarly: 0,
		daysLate: 0,
		complianceScore: 100,
		priority: 'medium',
		createdBy: '사용자2',
		createdAt: '2024-05-05',
		updatedBy: '사용자2',
		updatedAt: '2024-05-28',
	},
	{
		id: 3,
		orderNumber: 'ORD-2024-003',
		customerName: '고객사 C',
		productName: '제품 C',
		productCode: 'PROD-003',
		orderQuantity: 1200,
		deliveredQuantity: 1200,
		orderDate: '2024-05-10',
		requestedDeliveryDate: '2024-05-25',
		actualDeliveryDate: '2024-05-27',
		deliveryStatus: 'late',
		daysEarly: 0,
		daysLate: 2,
		complianceScore: 92,
		priority: 'urgent',
		createdBy: '사용자3',
		createdAt: '2024-05-10',
		updatedBy: '사용자3',
		updatedAt: '2024-05-27',
	},
	{
		id: 4,
		orderNumber: 'ORD-2024-004',
		customerName: '고객사 D',
		productName: '제품 D',
		productCode: 'PROD-004',
		orderQuantity: 600,
		deliveredQuantity: 600,
		orderDate: '2024-05-15',
		requestedDeliveryDate: '2024-05-22',
		actualDeliveryDate: '2024-05-20',
		deliveryStatus: 'early',
		daysEarly: 2,
		daysLate: 0,
		complianceScore: 100,
		priority: 'low',
		createdBy: '사용자1',
		createdAt: '2024-05-15',
		updatedBy: '사용자1',
		updatedAt: '2024-05-20',
	},
	{
		id: 5,
		orderNumber: 'ORD-2024-005',
		customerName: '고객사 E',
		productName: '제품 E',
		productCode: 'PROD-005',
		orderQuantity: 1500,
		deliveredQuantity: 1500,
		orderDate: '2024-05-20',
		requestedDeliveryDate: '2024-05-18',
		actualDeliveryDate: '2024-05-21',
		deliveryStatus: 'late',
		daysEarly: 0,
		daysLate: 3,
		complianceScore: 85,
		priority: 'urgent',
		createdBy: '사용자2',
		createdAt: '2024-05-20',
		updatedBy: '사용자2',
		updatedAt: '2024-05-21',
	},
];

const DeliveryComplianceAnalysisPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data] = useState<DeliveryComplianceAnalysis[]>(
		deliveryComplianceAnalysisData
	);

	const getDeliveryStatusColor = (status: string) => {
		switch (status) {
			case 'on-time':
				return 'bg-green-100 text-green-800';
			case 'early':
				return 'bg-blue-100 text-blue-800';
			case 'late':
				return 'bg-red-100 text-red-800';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getDeliveryStatusText = (status: string) => {
		switch (status) {
			case 'on-time':
				return '정시';
			case 'early':
				return '조기';
			case 'late':
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

	const getComplianceScoreColor = (score: number) => {
		if (score >= 95) return 'text-green-600';
		if (score >= 85) return 'text-yellow-600';
		if (score >= 75) return 'text-orange-600';
		return 'text-red-600';
	};

	const columns = useMemo<ColumnConfig<DeliveryComplianceAnalysis>[]>(
		() => [
			{
				accessorKey: 'orderNumber',
				header: '주문번호',
				size: 160,
				align: 'left' as const,
			},
			{
				accessorKey: 'customerName',
				header: '고객사명',
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
				accessorKey: 'orderQuantity',
				header: '주문수량',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.orderQuantity.toLocaleString()}
					</div>
				),
			},
			{
				accessorKey: 'requestedDeliveryDate',
				header: '요청납기일',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'actualDeliveryDate',
				header: '실제납기일',
				size: 140,
				align: 'left' as const,
			},
			{
				accessorKey: 'deliveryStatus',
				header: '납기상태',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(row.original.deliveryStatus)}`}
					>
						{getDeliveryStatusText(row.original.deliveryStatus)}
					</span>
				),
			},
			{
				accessorKey: 'daysLate',
				header: '지연일수',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-medium ${
							row.original.daysLate > 0
								? 'text-red-600'
								: 'text-green-600'
						}`}
					>
						{row.original.daysLate > 0
							? `+${row.original.daysLate}일`
							: '0일'}
					</div>
				),
			},
			{
				accessorKey: 'complianceScore',
				header: '준수도(%)',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-right font-bold text-lg ${getComplianceScoreColor(row.original.complianceScore)}`}
					>
						{row.original.complianceScore}%
					</div>
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
		const deliveryStatusCounts = data.reduce(
			(acc, item) => {
				acc[item.deliveryStatus] = (acc[item.deliveryStatus] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const customerNames = [
			...new Set(data.map((item) => item.customerName)),
		];
		const complianceScores = customerNames.map((customer) => {
			const customerOrders = data.filter(
				(item) => item.customerName === customer
			);
			return (
				customerOrders.reduce(
					(sum, order) => sum + order.complianceScore,
					0
				) / customerOrders.length
			);
		});

		return { deliveryStatusCounts, customerNames, complianceScores };
	}, [data]);

	// Delivery Status Distribution Chart
	const deliveryStatusChartOption = {
		title: {
			text: '납기 상태 분포',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			top: 'middle',
		},
		series: [
			{
				name: '납기 상태',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '18',
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: false,
				},
				data: [
					{
						value: chartData.deliveryStatusCounts['on-time'] || 0,
						name: '정시',
						itemStyle: { color: '#10b981' },
					},
					{
						value: chartData.deliveryStatusCounts['early'] || 0,
						name: '조기',
						itemStyle: { color: '#3b82f6' },
					},
					{
						value: chartData.deliveryStatusCounts['late'] || 0,
						name: '지연',
						itemStyle: { color: '#ef4444' },
					},
					{
						value: chartData.deliveryStatusCounts['cancelled'] || 0,
						name: '취소',
						itemStyle: { color: '#6b7280' },
					},
				],
			},
		],
	};

	// Customer Compliance Score Chart
	const customerComplianceChartOption = {
		title: {
			text: '고객사별 납기 준수도',
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
			data: chartData.customerNames,
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: 'value',
			name: '준수도(%)',
			min: 0,
			max: 100,
		},
		series: [
			{
				name: '준수도',
				type: 'bar',
				data: chartData.complianceScores,
				itemStyle: {
					color: function (params: any) {
						const value = params.value;
						if (value >= 95) return '#10b981';
						if (value >= 85) return '#f59e0b';
						if (value >= 75) return '#f97316';
						return '#ef4444';
					},
				},
			},
		],
	};

	// Calculate KPIs
	const kpis = useMemo(() => {
		const totalOrders = data.length;
		const onTimeDeliveries = data.filter(
			(item) => item.deliveryStatus === 'on-time'
		).length;
		const earlyDeliveries = data.filter(
			(item) => item.deliveryStatus === 'early'
		).length;
		const lateDeliveries = data.filter(
			(item) => item.deliveryStatus === 'late'
		).length;
		const averageComplianceScore = Math.round(
			data.reduce((sum, item) => sum + item.complianceScore, 0) /
				data.length
		);

		return {
			totalOrders,
			onTimeDeliveries,
			earlyDeliveries,
			lateDeliveries,
			averageComplianceScore,
		};
	}, [data]);

	return (
		<div className="space-y-4">
			{/* KPI Scorecards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Package className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 주문</p>
							<p className="text-2xl font-bold text-blue-900">
								{kpis.totalOrders}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100">
					<div className="flex items-center gap-3">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">정시 납기</p>
							<p className="text-2xl font-bold text-green-900">
								{kpis.onTimeDeliveries}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">조기 납기</p>
							<p className="text-2xl font-bold text-blue-900">
								{kpis.earlyDeliveries}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-red-100">
					<div className="flex items-center gap-3">
						<XCircle className="h-8 w-8 text-red-600" />
						<div>
							<p className="text-sm text-gray-600">지연 납기</p>
							<p className="text-2xl font-bold text-red-900">
								{kpis.lateDeliveries}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100">
					<div className="flex items-center gap-3">
						<Target className="h-8 w-8 text-purple-600" />
						<div>
							<p className="text-sm text-gray-600">평균 준수도</p>
							<p className="text-2xl font-bold text-purple-900">
								{kpis.averageComplianceScore}%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="p-6 rounded-lg border">
					{deliveryStatusChartOption && (
						<EchartComponent
							options={deliveryStatusChartOption}
							styles={{ height: '400px' }}
						/>
					)}
				</div>
				<div className="p-6 rounded-lg border">
					{customerComplianceChartOption && (
						<EchartComponent
							options={customerComplianceChartOption}
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
					tableTitle="납기 준수도 분석 데이터"
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

export default DeliveryComplianceAnalysisPage;
