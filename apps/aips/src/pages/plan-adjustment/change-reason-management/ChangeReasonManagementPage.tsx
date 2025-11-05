import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	FileText,
	Activity,
	Eye,
	Trash2,
	Filter,
	Clock,
	MessageSquare,
	Pen,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import {
	RadixIconButton,
	RadixSelect,
	RadixSelectItem,
	DraggableDialog,
} from '@radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns, ColumnConfig } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { toast } from 'sonner';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';

interface ChangeReasonData {
	id: number;
	planCode: string;
	planName: string;
	changeType: 'schedule' | 'quantity' | 'resource' | 'priority' | 'other';
	reason: string;
	description: string;
	impact: 'high' | 'medium' | 'low';
	status: 'pending' | 'approved' | 'rejected' | 'implemented';
	requestedBy: string;
	requestedAt: string;
	approvedBy: string;
	approvedAt: string;
	implementationDate: string;
	notes: string;
	tags: string[];
	attachments: string[];
	createdAt: string;
	updatedAt: string;
}

interface UserLogData {
	id: number;
	changeReasonId: number;
	userId: string;
	userName: string;
	action:
		| 'created'
		| 'updated'
		| 'approved'
		| 'rejected'
		| 'implemented'
		| 'commented';
	comment: string;
	timestamp: string;
}

// Dummy data
const changeReasonData: ChangeReasonData[] = [
	{
		id: 1,
		planCode: 'PLAN-2024-001',
		planName: '2024년 1월 생산계획 A',
		changeType: 'quantity',
		reason: '고객 요청으로 인한 수량 증가',
		description:
			'고객의 긴급 주문으로 인해 생산 수량을 1000개에서 1200개로 증가',
		impact: 'high',
		status: 'implemented',
		requestedBy: '영업팀 김철수',
		requestedAt: '2024-01-15 09:00:00',
		approvedBy: '생산팀장 이영희',
		approvedAt: '2024-01-15 14:30:00',
		implementationDate: '2024-01-16',
		notes: '고객 납기일 준수를 위해 우선 처리',
		tags: ['고객요청', '수량증가', '긴급'],
		attachments: ['고객주문서.pdf', '영업팀요청서.pdf'],
		createdAt: '2024-01-15',
		updatedAt: '2024-01-16',
	},
	{
		id: 2,
		planCode: 'PLAN-2024-002',
		planName: '2024년 1월 생산계획 B',
		changeType: 'schedule',
		reason: '설비 점검으로 인한 일정 조정',
		description: '계획된 설비 점검으로 인해 생산 일정을 2일 앞당김',
		impact: 'medium',
		status: 'approved',
		requestedBy: '설비팀 박지성',
		requestedAt: '2024-01-18 10:15:00',
		approvedBy: '생산팀장 이영희',
		approvedAt: '2024-01-18 16:45:00',
		implementationDate: '',
		notes: '설비 안전성 확보를 위한 필수 점검',
		tags: ['설비점검', '일정조정', '안전'],
		attachments: ['설비점검계획서.pdf'],
		createdAt: '2024-01-18',
		updatedAt: '2024-01-18',
	},
	{
		id: 3,
		planCode: 'PLAN-2024-003',
		planName: '2024년 1월 생산계획 C',
		changeType: 'resource',
		reason: '재료 공급 지연으로 인한 일정 조정',
		description:
			'주요 재료 공급업체의 지연으로 인해 생산 시작일을 5일 연기',
		impact: 'high',
		status: 'pending',
		requestedBy: '구매팀 최민수',
		requestedAt: '2024-01-20 11:20:00',
		approvedBy: '',
		approvedAt: '',
		implementationDate: '',
		notes: '대체 공급업체 검토 중',
		tags: ['재료지연', '공급업체', '일정조정'],
		attachments: ['공급업체통보서.pdf', '재료재고현황.pdf'],
		createdAt: '2024-01-20',
		updatedAt: '2024-01-20',
	},
];

const userLogData: UserLogData[] = [
	{
		id: 1,
		changeReasonId: 1,
		userId: 'user001',
		userName: '영업팀 김철수',
		action: 'created',
		comment: '고객 긴급 주문으로 인한 수량 증가 요청',
		timestamp: '2024-01-15 09:00:00',
	},
	{
		id: 2,
		changeReasonId: 1,
		userId: 'user002',
		userName: '생산팀장 이영희',
		action: 'approved',
		comment: '고객 납기일 준수를 위해 승인',
		timestamp: '2024-01-15 14:30:00',
	},
	{
		id: 3,
		changeReasonId: 1,
		userId: 'user003',
		userName: '생산팀 김철수',
		action: 'implemented',
		comment: '계획 수정 완료',
		timestamp: '2024-01-16 10:00:00',
	},
	{
		id: 4,
		changeReasonId: 2,
		userId: 'user004',
		userName: '설비팀 박지성',
		action: 'created',
		comment: '설비 안전성 확보를 위한 점검 일정 조정 요청',
		timestamp: '2024-01-18 10:15:00',
	},
	{
		id: 5,
		changeReasonId: 2,
		userId: 'user002',
		userName: '생산팀장 이영희',
		action: 'approved',
		comment: '설비 안전성 확보를 위해 승인',
		timestamp: '2024-01-18 16:45:00',
	},
];

const ChangeReasonManagementPage = () => {
	const { t } = useTranslation('common');
	const [data, setData] = useState<ChangeReasonData[]>(changeReasonData);
	const [userLogs, setUserLogs] = useState<UserLogData[]>(userLogData);
	const [selectedReason, setSelectedReason] =
		useState<ChangeReasonData | null>(null);
	const [showUserLogs, setShowUserLogs] = useState<boolean>(false);
	const [filterData, setFilterData] = useState({
		planCode: '',
		changeType: 'all',
		impact: 'all',
		status: 'all',
	});
	const [editingReason, setEditingReason] = useState<ChangeReasonData | null>(
		null
	);
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [userLogsReason, setUserLogsReason] =
		useState<ChangeReasonData | null>(null);

	// Change type color function
	const getChangeTypeColor = (changeType: string) => {
		switch (changeType) {
			case 'schedule':
				return 'bg-blue-100 text-blue-800';
			case 'quantity':
				return 'bg-green-100 text-green-800';
			case 'resource':
				return 'bg-yellow-100 text-yellow-800';
			case 'priority':
				return 'bg-purple-100 text-purple-800';
			case 'other':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Impact color function
	const getImpactColor = (impact: string) => {
		switch (impact) {
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
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'implemented':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Change type text function
	const getChangeTypeText = (changeType: string) => {
		switch (changeType) {
			case 'schedule':
				return '일정';
			case 'quantity':
				return '수량';
			case 'resource':
				return '자원';
			case 'priority':
				return '우선순위';
			case 'other':
				return '기타';
			default:
				return changeType;
		}
	};

	// Impact text function
	const getImpactText = (impact: string) => {
		switch (impact) {
			case 'high':
				return '높음';
			case 'medium':
				return '보통';
			case 'low':
				return '낮음';
			default:
				return impact;
		}
	};

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return '대기중';
			case 'approved':
				return '승인됨';
			case 'rejected':
				return '거부됨';
			case 'implemented':
				return '구현됨';
			default:
				return status;
		}
	};

	// Filter data
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			if (
				filterData.planCode &&
				!item.planCode.includes(filterData.planCode)
			)
				return false;
			if (
				filterData.changeType !== 'all' &&
				item.changeType !== filterData.changeType
			)
				return false;
			if (
				filterData.impact !== 'all' &&
				item.impact !== filterData.impact
			)
				return false;
			if (
				filterData.status !== 'all' &&
				item.status !== filterData.status
			)
				return false;
			return true;
		});
	}, [data, filterData]);

	// Chart options
	const changeTypeChartOption = useMemo(
		() => ({
			title: {
				text: '변경 유형별 현황',
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
					name: '변경 사유 수',
					type: 'pie',
					radius: '50%',
					data: [
						{
							value: data.filter(
								(item) => item.changeType === 'schedule'
							).length,
							name: '일정',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'quantity'
							).length,
							name: '수량',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'resource'
							).length,
							name: '자원',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'priority'
							).length,
							name: '우선순위',
						},
						{
							value: data.filter(
								(item) => item.changeType === 'other'
							).length,
							name: '기타',
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

	const statusChartOption = useMemo(
		() => ({
			title: {
				text: '변경 사유 상태별 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: ['대기중', '승인됨', '거부됨', '구현됨'],
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					name: '사유 수',
					type: 'bar',
					data: [
						data.filter((item) => item.status === 'pending').length,
						data.filter((item) => item.status === 'approved')
							.length,
						data.filter((item) => item.status === 'rejected')
							.length,
						data.filter((item) => item.status === 'implemented')
							.length,
					],
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
				accessorKey: 'changeType',
				header: '변경 유형',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(row.original.changeType)}`}
					>
						{getChangeTypeText(row.original.changeType)}
					</span>
				),
			},
			{
				accessorKey: 'reason',
				header: '변경 사유',
				size: 200,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">{row.original.reason}</div>
				),
			},
			{
				accessorKey: 'impact',
				header: '영향도',
				size: 100,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(row.original.impact)}`}
					>
						{getImpactText(row.original.impact)}
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
				accessorKey: 'requestedBy',
				header: '요청자',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.requestedBy}</div>
				),
			},
			{
				accessorKey: 'requestedAt',
				header: '요청일시',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="text-sm">{row.original.requestedAt}</div>
				),
			},
			{
				accessorKey: 'actions',
				header: '작업',
				size: 200,
				align: 'center' as const,
				cell: ({ row }: { row: any }) => (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => setSelectedReason(row.original)}
							className="p-1 text-blue-600 hover:bg-blue-50 rounded"
							title="상세 보기"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleUserLogs(row.original)}
							className="p-1 text-purple-600 hover:bg-purple-50 rounded"
							title="사용자 로그"
						>
							<MessageSquare size={16} />
						</button>
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
		filteredData,
		processedColumns,
		30, // defaultPageSize
		0, // pageCount
		0, // page
		filteredData.length, // totalElements
		undefined // onPageChange
	);

	// Automatically update editingReason when selectedRows changes (ProductMasterPage pattern)
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: ChangeReasonData = filteredData[rowIndex];
			setEditingReason(currentRow);
		} else {
			setEditingReason(null);
		}
	}, [selectedRows, filteredData]);

	// Handle edit
	const handleEdit = () => {
		if (editingReason) {
			setOpenModal(true);
		} else {
			toast.warning('수정하실 변경 사유를 선택해주세요.');
		}
	};

	// Handle delete
	const handleDelete = () => {
		if (editingReason) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 변경 사유를 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		const selectedIds = Array.from(selectedRows);
		setData(data.filter((item) => !selectedIds.includes(String(item.id))));
		setOpenDeleteDialog(false);
		toast.success('선택된 변경 사유가 삭제되었습니다.');
	};

	// Handle user logs
	const handleUserLogs = (reason: ChangeReasonData) => {
		setUserLogsReason(reason);
		setShowUserLogs(true);
	};

	// Handle filter change
	const handleFilterChange = (field: string, value: string) => {
		setFilterData((prev) => ({ ...prev, [field]: value }));
	};

	const AddButton = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Pen size={16} />
					{t('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Trash2 size={16} />
					{t('delete')}
				</RadixIconButton>
			</>
		);
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editingReason ? '변경 사유 수정' : '변경 사유 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editingReason
								? '변경 사유 정보를 수정합니다.'
								: '새로운 변경 사유를 등록합니다.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setOpenModal(false)}
								className="px-4 py-2 border rounded-lg"
							>
								닫기
							</RadixIconButton>
						</div>
					</div>
				}
			/>

			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				isDeleting={false}
				title="변경 사유 삭제"
				description={`선택한 변경 사유 '${editingReason?.planCode || editingReason?.planName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<div className="space-y-4">
				{/* 통계 카드 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<FileText className="h-8 w-8 text-blue-600" />
							<div>
								<p className="text-sm text-gray-600">
									총 변경 사유
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{data.length}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border">
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
					<div className="bg-white p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<Activity className="h-8 w-8 text-green-600" />
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
					<div className="bg-white p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<MessageSquare className="h-8 w-8 text-purple-600" />
							<div>
								<p className="text-sm text-gray-600">총 로그</p>
								<p className="text-2xl font-bold text-gray-900">
									{userLogs.length}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 필터 섹션 */}
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center gap-4 mb-4">
						<Filter className="h-5 w-5 text-gray-500" />
						<h3 className="text-lg font-semibold">필터</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								변경 유형
							</label>
							<RadixSelect
								value={filterData.changeType}
								onValueChange={(value) =>
									handleFilterChange('changeType', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="schedule">
									일정
								</RadixSelectItem>
								<RadixSelectItem value="quantity">
									수량
								</RadixSelectItem>
								<RadixSelectItem value="resource">
									자원
								</RadixSelectItem>
								<RadixSelectItem value="priority">
									우선순위
								</RadixSelectItem>
								<RadixSelectItem value="other">
									기타
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								영향도
							</label>
							<RadixSelect
								value={filterData.impact}
								onValueChange={(value) =>
									handleFilterChange('impact', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="high">
									높음
								</RadixSelectItem>
								<RadixSelectItem value="medium">
									보통
								</RadixSelectItem>
								<RadixSelectItem value="low">
									낮음
								</RadixSelectItem>
							</RadixSelect>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								상태
							</label>
							<RadixSelect
								value={filterData.status}
								onValueChange={(value) =>
									handleFilterChange('status', value)
								}
								className="w-full"
							>
								<RadixSelectItem value="all">
									전체
								</RadixSelectItem>
								<RadixSelectItem value="pending">
									대기중
								</RadixSelectItem>
								<RadixSelectItem value="approved">
									승인됨
								</RadixSelectItem>
								<RadixSelectItem value="rejected">
									거부됨
								</RadixSelectItem>
								<RadixSelectItem value="implemented">
									구현됨
								</RadixSelectItem>
							</RadixSelect>
						</div>
					</div>
				</div>

				{/* 차트 섹션 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white p-4 rounded-lg border">
						<EchartComponent
							options={changeTypeChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
					<div className="bg-white p-4 rounded-lg border">
						<EchartComponent
							options={statusChartOption}
							styles={{ height: '400px' }}
						/>
					</div>
				</div>

				{/* 변경 사유 테이블 */}
				<div className="rounded-lg border">
					<DatatableComponent
						data={filteredData}
						table={table}
						columns={columns}
						tableTitle="변경 사유 현황"
						rowCount={filteredData.length}
						useSearch={true}
						usePageNation={true}
						toggleRowSelection={toggleRowSelection}
						selectedRows={selectedRows}
						useEditable={false}
						searchSlot={
							<SearchSlotComponent endSlot={<AddButton />} />
						}
					/>
				</div>

				<DraggableDialog
					open={!!selectedReason}
					onOpenChange={(open) => !open && setSelectedReason(null)}
					title="변경 사유 상세 정보"
					content={
						selectedReason && (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											계획 코드
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{selectedReason.planCode}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											계획명
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{selectedReason.planName}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											변경 유형
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{getChangeTypeText(
												selectedReason.changeType
											)}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											영향도
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{getImpactText(
												selectedReason.impact
											)}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											상태
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{getStatusText(
												selectedReason.status
											)}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											요청자
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{selectedReason.requestedBy}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											요청일시
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{selectedReason.requestedAt}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											승인자
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{selectedReason.approvedBy || '-'}
										</p>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										변경 사유
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedReason.reason}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										상세 설명
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedReason.description}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										비고
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{selectedReason.notes}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										태그
									</label>
									<div className="flex flex-wrap gap-1 mt-1">
										{selectedReason.tags.map(
											(tag, index) => (
												<span
													key={index}
													className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
												>
													{tag}
												</span>
											)
										)}
									</div>
								</div>
								{selectedReason.attachments.length > 0 && (
									<div>
										<label className="block text-sm font-medium text-gray-700">
											첨부파일
										</label>
										<div className="flex flex-wrap gap-2 mt-1">
											{selectedReason.attachments.map(
												(file, index) => (
													<span
														key={index}
														className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full cursor-pointer hover:bg-blue-200"
													>
														{file}
													</span>
												)
											)}
										</div>
									</div>
								)}
							</div>
						)
					}
				/>

				<DraggableDialog
					open={showUserLogs}
					onOpenChange={(open) => {
						if (!open) {
							setShowUserLogs(false);
							setUserLogsReason(null);
						}
					}}
					title={
						userLogsReason
							? `${userLogsReason.planCode} - 사용자 로그`
							: '사용자 로그'
					}
					content={
						userLogsReason && (
							<div className="space-y-4">
								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-medium mb-2">
										변경 사유 요약
									</h4>
									<p className="text-sm text-gray-700">
										<strong>사유:</strong>{' '}
										{userLogsReason.reason}
									</p>
									<p className="text-sm text-gray-700">
										<strong>상태:</strong>{' '}
										{getStatusText(userLogsReason.status)}
									</p>
								</div>
								<div className="max-h-96 overflow-y-auto">
									<div className="space-y-3">
										{userLogs
											.filter(
												(log) =>
													log.changeReasonId ===
													userLogsReason.id
											)
											.sort(
												(a, b) =>
													new Date(
														b.timestamp
													).getTime() -
													new Date(
														a.timestamp
													).getTime()
											)
											.map((log) => (
												<div
													key={log.id}
													className="border-l-4 border-blue-500 pl-4 py-2"
												>
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium text-sm">
															{log.userName}
														</span>
														<span className="text-xs text-gray-500">
															{log.timestamp}
														</span>
														<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
															{log.action}
														</span>
													</div>
													<p className="text-sm text-gray-700">
														{log.comment}
													</p>
												</div>
											))}
									</div>
								</div>
							</div>
						)
					}
				/>
			</div>
		</>
	);
};

export default ChangeReasonManagementPage;
