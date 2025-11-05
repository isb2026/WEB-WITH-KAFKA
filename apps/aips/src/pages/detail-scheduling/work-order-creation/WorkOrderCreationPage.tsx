import React, { useState, useRef, useEffect } from 'react';
import {
	RadixIconButton,
	RadixSelect,
	DraggableDialog,
} from '@radix-ui/components';
import {
	FileText,
	Plus,
	Edit,
	Trash2,
	Save,
	X,
	Download,
	Eye,
} from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface WorkOrder {
	id: string;
	orderNumber: string;
	productCode: string;
	productName: string;
	quantity: number;
	priority: 'high' | 'medium' | 'low';
	status:
		| 'draft'
		| 'approved'
		| 'released'
		| 'in-progress'
		| 'completed'
		| 'cancelled';
	startDate: string;
	endDate: string;
	machineCode: string;
	machineName: string;
	processCode: string;
	processName: string;
	createdBy: string;
	createdDate: string;
	notes?: string;
}

const WorkOrderCreationPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tCommon } = useTranslation('common');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editingItem, setEditingItem] = useState<WorkOrder | null>(null);

	// Mock data
	const mockData: WorkOrder[] = [
		{
			id: '1',
			orderNumber: 'WO-2024-001',
			productCode: 'P001',
			productName: '제품 A',
			quantity: 100,
			priority: 'high',
			status: 'released',
			startDate: '2024-01-15',
			endDate: '2024-01-20',
			machineCode: 'M001',
			machineName: '조립 설비 A',
			processCode: 'P001',
			processName: '조립 공정',
			createdBy: '김철수',
			createdDate: '2024-01-14',
			notes: '긴급 주문',
		},
		{
			id: '2',
			orderNumber: 'WO-2024-002',
			productCode: 'P002',
			productName: '제품 B',
			quantity: 80,
			priority: 'medium',
			status: 'approved',
			startDate: '2024-01-16',
			endDate: '2024-01-22',
			machineCode: 'M002',
			machineName: '도장 설비 B',
			processCode: 'P002',
			processName: '도장 공정',
			createdBy: '이영희',
			createdDate: '2024-01-14',
			notes: '일반 주문',
		},
		{
			id: '3',
			orderNumber: 'WO-2024-003',
			productCode: 'P003',
			productName: '제품 C',
			quantity: 120,
			priority: 'low',
			status: 'draft',
			startDate: '2024-01-18',
			endDate: '2024-01-25',
			machineCode: 'M003',
			machineName: '검사 설비 C',
			processCode: 'P003',
			processName: '검사 공정',
			createdBy: '박민수',
			createdDate: '2024-01-14',
			notes: '검토 필요',
		},
		{
			id: '4',
			orderNumber: 'WO-2024-004',
			productCode: 'P004',
			productName: '제품 D',
			quantity: 150,
			priority: 'high',
			status: 'in-progress',
			startDate: '2024-01-15',
			endDate: '2024-01-18',
			machineCode: 'M004',
			machineName: '포장 설비 D',
			processCode: 'P004',
			processName: '포장 공정',
			createdBy: '김철수',
			createdDate: '2024-01-13',
			notes: '진행 중',
		},
	];

	const columns: ProcessedColumnDef<WorkOrder, any>[] = [
		{
			accessorKey: 'orderNumber',
			header: '작업지시 번호',
			size: 150,
		},
		{
			accessorKey: 'productCode',
			header: '제품 코드',
			size: 120,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 150,
		},
		{
			accessorKey: 'quantity',
			header: '수량',
			size: 100,
		},
		{
			accessorKey: 'priority',
			header: '우선순위',
			size: 120,
			cell: ({ row }: any) => {
				const priority = row.original.priority;
				const priorityConfig = {
					high: {
						label: '높음',
						className: 'bg-red-100 text-red-800',
					},
					medium: {
						label: '보통',
						className: 'bg-yellow-100 text-yellow-800',
					},
					low: {
						label: '낮음',
						className: 'bg-green-100 text-green-800',
					},
				};

				// @ts-ignore
				const config = priorityConfig[priority];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.original.status;
				const statusConfig = {
					draft: {
						label: '초안',
						className: 'bg-gray-100 text-gray-800',
					},
					approved: {
						label: '승인',
						className: 'bg-blue-100 text-blue-800',
					},
					released: {
						label: '해제',
						className: 'bg-green-100 text-green-800',
					},
					'in-progress': {
						label: '진행중',
						className: 'bg-yellow-100 text-yellow-800',
					},
					completed: {
						label: '완료',
						className: 'bg-green-100 text-green-800',
					},
					cancelled: {
						label: '취소',
						className: 'bg-red-100 text-red-800',
					},
				};
				// @ts-ignore
				const config = statusConfig[status];
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
					>
						{config.label}
					</span>
				);
			},
		},
		{
			accessorKey: 'startDate',
			header: '시작일',
			size: 120,
		},
		{
			accessorKey: 'endDate',
			header: '완료일',
			size: 120,
		},
		{
			accessorKey: 'machineName',
			header: '설비명',
			size: 150,
		},
		{
			accessorKey: 'createdBy',
			header: '작성자',
			size: 120,
		},
	];

	const DEFAULT_PAGE_SIZE = 30;
	const pageCount = Math.ceil(mockData.length / DEFAULT_PAGE_SIZE);

	const {
		table,
		selectedRows: tableSelectedRows,
		toggleRowSelection,
	} = useDataTable(
		mockData,
		columns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		0,
		mockData.length,
		() => {}
	);

	// Dummy remove function
	const dummyRemove = {
		mutate: (id: string) => {
			console.log('Delete work order with id:', id);
			toast.success('작업지시가 삭제되었습니다.');
		},
		isPending: false,
	};

	const handleEdit = () => {
		if (editingItem) {
			setIsFormOpen(true);
		} else {
			toast.warning('수정하실 작업지시를 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editingItem) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 작업지시를 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		if (editingItem) {
			const id = editingItem.id;
			dummyRemove.mutate(id);
			setOpenDeleteDialog(false);
		}
	};

	const AddButton = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Edit size={16} />
					{tCommon('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border"
				>
					<Trash2 size={16} />
					{tCommon('delete')}
				</RadixIconButton>
			</>
		);
	};

	// Handle selected rows changes
	useEffect(() => {
		if (tableSelectedRows.size > 0) {
			const selectedRowIndex = Array.from(tableSelectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: WorkOrder = mockData[rowIndex];
			setEditingItem(currentRow);
		} else {
			setEditingItem(null);
		}
	}, [tableSelectedRows]);

	return (
		<>
			<DraggableDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				title={editingItem ? '작업지시 수정' : '작업지시 생성'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editingItem
								? '작업지시 정보를 수정합니다.'
								: '새로운 작업지시를 생성합니다.'}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<RadixIconButton
								onClick={() => setIsFormOpen(false)}
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
				isDeleting={dummyRemove.isPending}
				title="작업지시 삭제"
				description={`선택한 작업지시 '${editingItem?.orderNumber || editingItem?.productName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* Data Table */}
			<div className="rounded-lg border">
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData}
					toggleRowSelection={toggleRowSelection}
					selectedRows={tableSelectedRows}
					tableTitle="작업지시 목록"
					rowCount={mockData.length}
					useSearch={true}
					enableSingleSelect={true}
					searchSlot={<SearchSlotComponent endSlot={<AddButton />} />}
				/>
			</div>
		</>
	);
};

export default WorkOrderCreationPage;
