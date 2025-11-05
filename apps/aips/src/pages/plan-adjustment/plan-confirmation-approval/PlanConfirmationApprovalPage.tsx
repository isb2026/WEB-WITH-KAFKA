import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import { CheckCircle, Clock, FileText, Activity, Eye } from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';

interface PlanApprovalData {
	id: number;
	planCode: string;
	planName: string;
	productName: string;
	productCode: string;
	requestedBy: string;
	requestedDate: string;
	priority: 'high' | 'medium' | 'low';
	status:
		| 'draft'
		| 'pending'
		| 'under-review'
		| 'approved'
		| 'rejected'
		| 'completed';
	currentStep: string;
	approver: string;
	approvalDate: string;
	comments: string;
	workflowStep: number;
	totalSteps: number;
	createdAt: string;
	updatedAt: string;
}

// Dummy data
const planApprovalData: PlanApprovalData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		productName: '제품 A',
		productCode: 'PROD-001',
		requestedBy: '생산팀 김철수',
		requestedDate: '2024-01-15',
		priority: 'high',
		status: 'under-review',
		currentStep: '생산팀장 검토',
		approver: '생산팀장 이영희',
		approvalDate: '',
		comments: '고객 요청으로 인한 수량 증가 검토 필요',
		workflowStep: 2,
		totalSteps: 3,
		createdAt: '2024-01-15',
		updatedAt: '2024-01-16',
	},
	{
		id: 2,
		planCode: 'PLAN-2024-002',
		planName: '2024년 1월 생산계획 B',
		productName: '제품 B',
		productCode: 'PROD-002',
		requestedBy: '생산팀 박지성',
		requestedDate: '2024-01-18',
		priority: 'medium',
		status: 'approved',
		currentStep: '완료',
		approver: '생산팀장 이영희',
		approvalDate: '2024-01-19',
		comments: '설비 점검 일정 조정 승인',
		workflowStep: 3,
		totalSteps: 3,
		createdAt: '2024-01-18',
		updatedAt: '2024-01-19',
	},
	{
		id: 3,
		planCode: 'PLAN-2024-003',
		planName: '2024년 1월 생산계획 C',
		productName: '제품 C',
		productCode: 'PROD-003',
		requestedBy: '생산팀 최민수',
		requestedDate: '2024-01-20',
		priority: 'low',
		status: 'pending',
		currentStep: '대기중',
		approver: '',
		approvalDate: '',
		comments: '재료 공급 지연으로 인한 일정 조정',
		workflowStep: 1,
		totalSteps: 3,
		createdAt: '2024-01-20',
		updatedAt: '2024-01-20',
	},
];

const PlanConfirmationApprovalPage = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<PlanApprovalData[]>(planApprovalData);
	const [selectedPlan, setSelectedPlan] = useState<PlanApprovalData | null>(
		null
	);
	const [showApprovalForm, setShowApprovalForm] = useState<boolean>(false);
	const [approvalData, setApprovalData] = useState({
		action: 'approve',
		comments: '',
		nextApprover: '',
	});

	// Priority color function
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Status color function
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'under-review':
				return 'bg-blue-100 text-blue-800';
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'completed':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'draft':
				return '초안';
			case 'pending':
				return '대기중';
			case 'under-review':
				return '검토중';
			case 'approved':
				return '승인됨';
			case 'rejected':
				return '거부됨';
			case 'completed':
				return '완료됨';
			default:
				return status;
		}
	};

	// Priority text function
	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return priority;
		}
	};

	// Workflow progress function
	const getWorkflowProgress = (currentStep: number, totalSteps: number) => {
		return Math.round((currentStep / totalSteps) * 100);
	};

	// Chart options
	const statusChartOption = useMemo(
		() => ({
			title: {
				text: '계획 승인 상태별 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'item',
			},
			legend: {
				orient: 'vertical',
				left: 'left',
			},
			series: [
				{
					name: '계획 수',
					type: 'pie',
					radius: '50%',
					data: [
						{
							value: data.filter(
								(item) => item.status === 'draft'
							).length,
							name: '초안',
						},
						{
							value: data.filter(
								(item) => item.status === 'pending'
							).length,
							name: '대기중',
						},
						{
							value: data.filter(
								(item) => item.status === 'under-review'
							).length,
							name: '검토중',
						},
						{
							value: data.filter(
								(item) => item.status === 'approved'
							).length,
							name: '승인됨',
						},
						{
							value: data.filter(
								(item) => item.status === 'rejected'
							).length,
							name: '거부됨',
						},
						{
							value: data.filter(
								(item) => item.status === 'completed'
							).length,
							name: '완료됨',
						},
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
			],
		}),
		[data]
	);

	const workflowChartOption = useMemo(
		() => ({
			title: {
				text: '워크플로우 진행률',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: data.map((item) => item.planCode),
			},
			yAxis: {
				type: 'value',
				max: 100,
				name: '진행률 (%)',
			},
			series: [
				{
					name: '진행률',
					type: 'bar',
					data: data.map((item) =>
						getWorkflowProgress(item.workflowStep, item.totalSteps)
					),
					itemStyle: { color: '#3B82F6' },
				},
			],
		}),
		[data]
	);

	// Table columns
	const columns = useMemo(
		() => [
			{
				accessorKey: 'planCode',
				header: '계획 코드',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-blue-600">
						{row.original.planCode}
					</div>
				),
			},
			{
				accessorKey: 'planName',
				header: '계획명',
				size: 200,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">{row.original.planName}</div>
				),
			},
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.productName}</div>
				),
			},
			{
				accessorKey: 'requestedBy',
				header: '요청자',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.requestedBy}</div>
				),
			},
			{
				accessorKey: 'priority',
				header: '우선순위',
				size: 100,
				align: 'center' as const,
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
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}
					>
						{getStatusText(row.original.status)}
					</span>
				),
			},
			{
				accessorKey: 'currentStep',
				header: '현재 단계',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">{row.original.currentStep}</div>
				),
			},
			{
				accessorKey: 'workflowProgress',
				header: '진행률',
				size: 120,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex items-center gap-2">
						<div className="w-16 bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full"
								style={{
									width: `${getWorkflowProgress(row.original.workflowStep, row.original.totalSteps)}%`,
								}}
							></div>
						</div>
						<span className="text-xs text-gray-600">
							{getWorkflowProgress(
								row.original.workflowStep,
								row.original.totalSteps
							)}
							%
						</span>
					</div>
				),
			},
		],
		[]
	);

	// Process columns using useDataTableColumns
	const processedColumns = useDataTableColumns(columns);

	// Use useDataTable with all required parameters
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		data.length, // totalElements
		undefined // onPageChange
	);

	// Handle approval
	const handleApproval = (plan: PlanApprovalData) => {
		setSelectedPlan(plan);
		setShowApprovalForm(true);
	};

	// Handle workflow status
	const handleWorkflowStatus = (plan: PlanApprovalData) => {
		toast.info(`${plan.planCode}의 워크플로우 현황을 확인합니다.`);
	};

	// Handle approval submit
	const handleApprovalSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedPlan) {
			const updatedPlan = { ...selectedPlan };
			if (approvalData.action === 'approve') {
				if (updatedPlan.workflowStep < updatedPlan.totalSteps) {
					updatedPlan.workflowStep += 1;
					updatedPlan.status = 'under-review';
					updatedPlan.currentStep = '다음 단계 진행';
				} else {
					updatedPlan.status = 'approved';
					updatedPlan.currentStep = '완료';
				}
				toast.success(
					`${selectedPlan.planCode} 계획이 승인되었습니다.`
				);
			} else {
				updatedPlan.status = 'rejected';
				updatedPlan.currentStep = '거부됨';
				toast.error(`${selectedPlan.planCode} 계획이 거부되었습니다.`);
			}
			updatedPlan.approvalDate = new Date().toISOString().split('T')[0];
			updatedPlan.comments = approvalData.comments;
			updatedPlan.updatedAt = new Date().toISOString().split('T')[0];

			setData(
				data.map((item) =>
					item.id === selectedPlan.id ? updatedPlan : item
				)
			);
			setShowApprovalForm(false);
			setSelectedPlan(null);
			setApprovalData({
				action: 'approve',
				comments: '',
				nextApprover: '',
			});
		}
	};

	return (
		<div className="space-y-4">
			{/* 통계 카드 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<FileText className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">총 계획</p>
							<p className="text-2xl font-bold text-gray-900">
								{data.length}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">대기중</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'pending'
									).length
								}
							</p>
						</div>
					</div>
				</div>
				<div className="p-4 rounded-lg border">
					<div className="flex items-center gap-3">
						<Activity className="h-8 w-8 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">검토중</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'under-review'
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
							<p className="text-sm text-gray-600">승인됨</p>
							<p className="text-2xl font-bold text-gray-900">
								{
									data.filter(
										(item) => item.status === 'approved'
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="p-4 rounded-lg border">
					<EchartComponent
						options={statusChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
				<div className="p-4 rounded-lg border">
					<EchartComponent
						options={workflowChartOption}
						styles={{ height: '400px' }}
					/>
				</div>
			</div>

			{/* 계획 승인 테이블 */}
			<div className="rounded-lg border">
				<DatatableComponent
					data={data}
					table={table}
					columns={columns}
					tableTitle="계획 승인 현황"
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

export default PlanConfirmationApprovalPage;
