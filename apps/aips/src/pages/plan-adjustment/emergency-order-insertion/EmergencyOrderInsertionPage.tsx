import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@repo/i18n';
import {
	AlertCircle,
	Clock,
	Package,
	Factory,
	Trash2,
	Pen,
} from 'lucide-react';
import { EchartComponent } from '@repo/echart';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { useDataTable } from '@radix-ui/hook';
import { useDataTableColumns } from '@radix-ui/hook';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface EmergencyOrderData {
	id: number;
	orderCode: string;
	productName: string;
	productCode: string;
	quantity: number;
	priority: 'critical' | 'high' | 'medium' | 'low';
	requestedDate: string;
	requiredDate: string;
	insertedDate: string;
	status: 'pending' | 'inserted' | 'completed' | 'cancelled';
	reason: string;
	requestedBy: string;
	approvedBy: string;
	impact: 'high' | 'medium' | 'low';
	createdAt: string;
	updatedAt: string;
}

// Dummy data
const emergencyOrderData: EmergencyOrderData[] = [
	{
		id: 1,
		orderCode: 'EO-2024-001',
		productName: '제품 A',
		productCode: 'PROD-001',
		quantity: 500,
		priority: 'critical',
		requestedDate: '2024-01-15',
		requiredDate: '2024-01-20',
		insertedDate: '2024-01-16',
		status: 'inserted',
		reason: '고객 긴급 요청 - 납기 단축',
		requestedBy: '영업팀 김철수',
		approvedBy: '생산팀장 이영희',
		impact: 'high',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-16',
	},
	{
		id: 2,
		orderCode: 'EO-2024-002',
		productName: '제품 B',
		productCode: 'PROD-002',
		quantity: 300,
		priority: 'high',
		requestedDate: '2024-01-18',
		requiredDate: '2024-01-25',
		insertedDate: '2024-01-19',
		status: 'pending',
		reason: '품질 이슈로 인한 재작업',
		requestedBy: '품질팀 박지성',
		approvedBy: '생산팀장 이영희',
		impact: 'medium',
		createdAt: '2024-01-18',
		updatedAt: '2024-01-19',
	},
	{
		id: 3,
		orderCode: 'EO-2024-003',
		productName: '제품 C',
		productCode: 'PROD-003',
		quantity: 200,
		priority: 'medium',
		requestedDate: '2024-01-20',
		requiredDate: '2024-01-28',
		insertedDate: '',
		status: 'pending',
		reason: '설비 점검 일정 조정',
		requestedBy: '설비팀 최민수',
		approvedBy: '',
		impact: 'low',
		createdAt: '2024-01-20',
		updatedAt: '2024-01-20',
	},
];

const EmergencyOrderInsertionPage = () => {
	const { t } = useTranslation('common');
	const [editingOrder, setEditingOrder] = useState<EmergencyOrderData | null>(
		null
	);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [data, setData] = useState<EmergencyOrderData[]>(emergencyOrderData);

	// Priority color function
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'critical':
				return 'bg-red-100 text-red-800';
			case 'high':
				return 'bg-orange-100 text-orange-800';
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
			case 'inserted':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
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

	// Status text function
	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return '대기중';
			case 'inserted':
				return '삽입됨';
			case 'completed':
				return '완료됨';
			case 'cancelled':
				return '취소됨';
			default:
				return status;
		}
	};

	// Priority text function
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
				return priority;
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

	// Chart options
	const priorityChartOption = useMemo(
		() => ({
			title: {
				text: '긴급 주문 우선순위별 현황',
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
					name: '긴급 주문',
					type: 'pie',
					radius: '50%',
					data: [
						{
							value: data.filter(
								(item) => item.priority === 'critical'
							).length,
							name: '긴급',
						},
						{
							value: data.filter(
								(item) => item.priority === 'high'
							).length,
							name: '높음',
						},
						{
							value: data.filter(
								(item) => item.priority === 'medium'
							).length,
							name: '보통',
						},
						{
							value: data.filter(
								(item) => item.priority === 'low'
							).length,
							name: '낮음',
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
				text: '긴급 주문 상태별 현황',
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: ['대기중', '삽입됨', '완료됨', '취소됨'],
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					name: '주문 수',
					type: 'bar',
					data: [
						data.filter((item) => item.status === 'pending').length,
						data.filter((item) => item.status === 'inserted')
							.length,
						data.filter((item) => item.status === 'completed')
							.length,
						data.filter((item) => item.status === 'cancelled')
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
				accessorKey: 'orderCode',
				header: '주문 코드',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-blue-600">
						{row.original.orderCode}
					</div>
				),
			},
			{
				accessorKey: 'productName',
				header: '제품명',
				size: 150,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium">
						{row.original.productName}
					</div>
				),
			},
			{
				accessorKey: 'quantity',
				header: '수량',
				size: 100,
				align: 'right' as const,
				cell: ({ row }: { row: any }) => (
					<div className="text-right font-medium">
						{row.original.quantity.toLocaleString()}
					</div>
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
				accessorKey: 'requestedDate',
				header: '요청일',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div>{row.original.requestedDate}</div>
				),
			},
			{
				accessorKey: 'requiredDate',
				header: '필요일',
				size: 120,
				cell: ({ row }: { row: any }) => (
					<div className="font-medium text-red-600">
						{row.original.requiredDate}
					</div>
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

	// Handle edit
	const handleEdit = () => {
		if (selectedRows.size === 1) {
			const selectedId = Array.from(selectedRows)[0];
			const selected = data.find(
				(item) => item.id.toString() === selectedId
			);
			if (selected) {
				setEditingOrder(selected);
				setOpenModal(true);
			}
		}
	};

	// Handle delete
	const handleDelete = () => {
		if (selectedRows.size > 0) {
			setOpenDeleteDialog(true);
		}
	};

	// Handle delete confirm
	const handleDeleteConfirm = () => {
		if (selectedRows.size > 0) {
			const selectedIds = Array.from(selectedRows);
			const filteredData = data.filter(
				(item) => !selectedIds.includes(item.id.toString())
			);
			setData(filteredData);
			setOpenDeleteDialog(false);
			toast.success('선택된 긴급 주문이 삭제되었습니다.');
		}
	};

	// Action buttons component
	const ActionButtons = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					disabled={selectedRows.size !== 1}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Pen size={16} />
					{t('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					disabled={selectedRows.size === 0}
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
				title={editingOrder ? '긴급 주문 수정' : '긴급 주문 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editingOrder
								? '긴급 주문 정보를 수정합니다.'
								: '새로운 긴급 주문을 등록합니다.'}
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
				title="긴급 주문 삭제"
				description={`선택한 긴급 주문을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<div className="space-y-4">
				{/* 통계 카드 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<AlertCircle className="h-8 w-8 text-red-600" />
							<div>
								<p className="text-sm text-gray-600">
									총 긴급 주문
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
							<Package className="h-8 w-8 text-blue-600" />
							<div>
								<p className="text-sm text-gray-600">삽입됨</p>
								<p className="text-2xl font-bold text-gray-900">
									{
										data.filter(
											(item) => item.status === 'inserted'
										).length
									}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<Factory className="h-8 w-8 text-green-600" />
							<div>
								<p className="text-sm text-gray-600">완료됨</p>
								<p className="text-2xl font-bold text-gray-900">
									{
										data.filter(
											(item) =>
												item.status === 'completed'
										).length
									}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 차트 섹션 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white p-4 rounded-lg border">
						<EchartComponent
							options={priorityChartOption}
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

				{/* 긴급 주문 테이블 */}
				<div className="bg-white rounded-lg border">
					<DatatableComponent
						data={data}
						table={table}
						columns={columns}
						tableTitle="긴급 주문 현황"
						rowCount={data.length}
						useSearch={true}
						usePageNation={true}
						toggleRowSelection={toggleRowSelection}
						selectedRows={selectedRows}
						useEditable={false}
						actionButtons={<ActionButtons />}
					/>
				</div>
			</div>
		</>
	);
};

export default EmergencyOrderInsertionPage;
