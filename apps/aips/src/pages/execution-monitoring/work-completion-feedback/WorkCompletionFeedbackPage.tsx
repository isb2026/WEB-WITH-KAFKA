import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { CheckCircle, Clock, ThumbsUp, Star } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	useDataTableColumns,
	ColumnConfig,
	useDataTable,
} from '@repo/radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';

interface WorkCompletionFeedback {
	id: number;
	workOrderId: string;
	productName: string;
	operatorName: string;
	completionDate: string;
	status: 'completed' | 'in-progress' | 'delayed' | 'cancelled';
	qualityScore: number;
	feedback: string;
	feedbackType: 'positive' | 'negative' | 'neutral';
	assignedTo: string;
	priority: 'high' | 'medium' | 'low';
	createdAt: string;
	updatedAt: string;
}

// 더미 데이터
const workCompletionData: WorkCompletionFeedback[] = [
	{
		id: 1,
		workOrderId: 'WO-2024-001',
		productName: '제품 A',
		operatorName: '김철수',
		completionDate: '2024-01-15 16:30:00',
		status: 'completed',
		qualityScore: 95,
		feedback: '품질이 우수하고 작업이 정확하게 완료되었습니다.',
		feedbackType: 'positive',
		assignedTo: '이영희',
		priority: 'high',
		createdAt: '2024-01-15 16:30:00',
		updatedAt: '2024-01-15 16:30:00',
	},
	{
		id: 2,
		workOrderId: 'WO-2024-002',
		productName: '제품 B',
		operatorName: '이영희',
		completionDate: '2024-01-15 17:00:00',
		status: 'completed',
		qualityScore: 88,
		feedback: '일반적인 품질로 작업이 완료되었습니다.',
		feedbackType: 'neutral',
		assignedTo: '박민수',
		priority: 'medium',
		createdAt: '2024-01-15 17:00:00',
		updatedAt: '2024-01-15 17:00:00',
	},
	{
		id: 3,
		workOrderId: 'WO-2024-003',
		productName: '제품 C',
		operatorName: '박민수',
		completionDate: '2024-01-15 15:45:00',
		status: 'completed',
		qualityScore: 92,
		feedback: '품질이 좋고 작업이 효율적으로 완료되었습니다.',
		feedbackType: 'positive',
		assignedTo: '최지영',
		priority: 'low',
		createdAt: '2024-01-15 15:45:00',
		updatedAt: '2024-01-15 15:45:00',
	},
	{
		id: 4,
		workOrderId: 'WO-2024-004',
		productName: '제품 D',
		operatorName: '최지영',
		completionDate: '2024-01-15 18:00:00',
		status: 'in-progress',
		qualityScore: 0,
		feedback: '작업 진행 중입니다.',
		feedbackType: 'neutral',
		assignedTo: '정수진',
		priority: 'high',
		createdAt: '2024-01-15 18:00:00',
		updatedAt: '2024-01-15 18:00:00',
	},
	{
		id: 5,
		workOrderId: 'WO-2024-005',
		productName: '제품 E',
		operatorName: '정수진',
		completionDate: '2024-01-15 14:30:00',
		status: 'completed',
		qualityScore: 78,
		feedback: '품질에 개선이 필요합니다.',
		feedbackType: 'negative',
		assignedTo: '김철수',
		priority: 'medium',
		createdAt: '2024-01-15 14:30:00',
		updatedAt: '2024-01-15 14:30:00',
	},
];

const WorkCompletionFeedbackPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<WorkCompletionFeedback[]>([]);

	useEffect(() => {
		setData(workCompletionData);
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'in-progress':
				return 'text-yellow-600 bg-yellow-100';
			case 'delayed':
				return 'text-orange-600 bg-orange-100';
			case 'cancelled':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'completed':
				return '완료';
			case 'in-progress':
				return '진행중';
			case 'delayed':
				return '지연';
			case 'cancelled':
				return '취소';
			default:
				return '알 수 없음';
		}
	};

	const getFeedbackTypeColor = (type: string) => {
		switch (type) {
			case 'positive':
				return 'text-green-600 bg-green-100';
			case 'negative':
				return 'text-red-600 bg-red-100';
			case 'neutral':
				return 'text-gray-600 bg-gray-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getFeedbackTypeText = (type: string) => {
		switch (type) {
			case 'positive':
				return '긍정적';
			case 'negative':
				return '부정적';
			case 'neutral':
				return '중립적';
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
				feedbackTypeData: [],
				qualityScoreData: [],
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

		const feedbackTypeCounts = data.reduce(
			(acc, item) => {
				acc[item.feedbackType] = (acc[item.feedbackType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			statusData: Object.values(statusCounts),
			feedbackTypeData: Object.values(feedbackTypeCounts),
			qualityScoreData: data
				.filter((item) => item.qualityScore > 0)
				.map((item) => item.qualityScore),
			labels: Object.keys(statusCounts),
		};
	}, [data]);

	// DataTable columns configuration
	const columns = useMemo<ColumnConfig<WorkCompletionFeedback>[]>(
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
				accessorKey: 'operatorName',
				header: '작업자',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'completionDate',
				header: '완료일시',
				size: 140,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">
						{new Date(row.original.completionDate).toLocaleString()}
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
				accessorKey: 'qualityScore',
				header: '품질점수',
				size: 100,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<div
						className={`text-center font-medium ${row.original.qualityScore >= 90 ? 'text-green-600' : row.original.qualityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}
					>
						{row.original.qualityScore > 0
							? `${row.original.qualityScore}점`
							: '-'}
					</div>
				),
			},
			{
				accessorKey: 'feedbackType',
				header: '피드백 유형',
				size: 120,
				align: 'left' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedbackTypeColor(row.original.feedbackType)}`}
					>
						{getFeedbackTypeText(row.original.feedbackType)}
					</span>
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
				accessorKey: 'assignedTo',
				header: '담당자',
				size: 100,
				align: 'left' as const,
			},
			{
				accessorKey: 'feedback',
				header: '피드백',
				size: 250,
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

	const statusChartOption = {
		title: {
			text: '작업 완료 상태별 현황',
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

	const feedbackChartOption = {
		title: {
			text: '피드백 유형별 현황',
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
			data: ['긍정적', '부정적', '중립적'],
		},
		yAxis: {
			type: 'value',
			name: '건수',
		},
		series: [
			{
				name: '건수',
				type: 'bar',
				data: chartData.feedbackTypeData,
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
						<CheckCircle className="h-8 w-8 text-green-600" />
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
						<Clock className="h-8 w-8 text-yellow-600" />
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
						<Star className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								평균 품질점수
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{Math.round(
									data
										.filter((item) => item.qualityScore > 0)
										.reduce(
											(sum, item) =>
												sum + item.qualityScore,
											0
										) /
										data.filter(
											(item) => item.qualityScore > 0
										).length
								) || 0}
								점
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<ThumbsUp className="h-8 w-8 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								긍정적 피드백
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) =>
											item.feedbackType === 'positive'
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
						options={feedbackChartOption}
						styles={{ height: '300px' }}
					/>
				</div>
			</div>

			{/* 작업 완료 피드백 테이블 */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="작업 완료 피드백"
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

export default WorkCompletionFeedbackPage;
