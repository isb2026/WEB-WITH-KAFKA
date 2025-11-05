import React, { useState, useRef, useEffect } from 'react';
import {
	RadixIconButton,
	RadixSelect,
	RadixTextInput,
	DraggableDialog,
} from '@radix-ui/components';
import { ClipboardList, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { DatatableComponent } from '@aips/components/datatable/DatatableComponent';
import { useDataTable } from '@repo/radix-ui/hook';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface ProcessInputPlan {
	id: string;
	date: string;
	processCode: string;
	processName: string;
	materialCode: string;
	materialName: string;
	requiredQuantity: number;
	availableQuantity: number;
	shortageQuantity: number;
	status: 'ready' | 'shortage' | 'excess';
	notes?: string;
}

const ProcessInputPlanPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tCommon } = useTranslation('common');
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editingItem, setEditingItem] = useState<ProcessInputPlan | null>(
		null
	);
	const [formData, setFormData] = useState<Partial<ProcessInputPlan>>({
		date: new Date().toISOString().split('T')[0],
		processCode: '',
		processName: '',
		materialCode: '',
		materialName: '',
		requiredQuantity: 0,
		availableQuantity: 0,
		notes: '',
	});

	// Mock data
	const mockData: ProcessInputPlan[] = [
		{
			id: '1',
			date: '2024-01-15',
			processCode: 'P001',
			processName: '조립 공정',
			materialCode: 'M001',
			materialName: '부품 A',
			requiredQuantity: 100,
			availableQuantity: 120,
			shortageQuantity: 0,
			status: 'excess',
			notes: '충분한 재고 확보',
		},
		{
			id: '2',
			date: '2024-01-15',
			processCode: 'P001',
			processName: '조립 공정',
			materialCode: 'M002',
			materialName: '부품 B',
			requiredQuantity: 80,
			availableQuantity: 75,
			shortageQuantity: 5,
			status: 'shortage',
			notes: '부족 수량 발주 필요',
		},
		{
			id: '3',
			date: '2024-01-15',
			processCode: 'P002',
			processName: '도장 공정',
			materialCode: 'M003',
			materialName: '도료 C',
			requiredQuantity: 50,
			availableQuantity: 50,
			shortageQuantity: 0,
			status: 'ready',
			notes: '정확한 수량',
		},
		{
			id: '4',
			date: '2024-01-16',
			processCode: 'P003',
			processName: '검사 공정',
			materialCode: 'M004',
			materialName: '검사 도구',
			requiredQuantity: 10,
			availableQuantity: 8,
			shortageQuantity: 2,
			status: 'shortage',
			notes: '검사 도구 추가 구매 필요',
		},
	];

	const columns: ProcessedColumnDef<ProcessInputPlan, any>[] = [
		{
			accessorKey: 'date',
			header: '날짜',
			size: 120,
		},
		{
			accessorKey: 'processCode',
			header: '공정 코드',
			size: 120,
		},
		{
			accessorKey: 'processName',
			header: '공정명',
			size: 150,
		},
		{
			accessorKey: 'materialCode',
			header: '자재 코드',
			size: 120,
		},
		{
			accessorKey: 'materialName',
			header: '자재명',
			size: 150,
		},
		{
			accessorKey: 'requiredQuantity',
			header: '필요 수량',
			size: 120,
		},
		{
			accessorKey: 'availableQuantity',
			header: '가용 수량',
			size: 120,
		},
		{
			accessorKey: 'shortageQuantity',
			header: '부족 수량',
			size: 120,
			cell: ({ row }: any) => (
				<span
					className={
						row.original.shortageQuantity > 0
							? 'text-red-600 font-medium'
							: 'text-green-600'
					}
				>
					{row.original.shortageQuantity}
				</span>
			),
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			cell: ({ row }: any) => {
				const status = row.original.status;
				const statusConfig = {
					ready: {
						label: '준비완료',
						className: 'bg-green-100 text-green-800',
					},
					shortage: {
						label: '부족',
						className: 'bg-red-100 text-red-800',
					},
					excess: {
						label: '과잉',
						className: 'bg-blue-100 text-blue-800',
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
			accessorKey: 'notes',
			header: '비고',
			size: 200,
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
			console.log('Delete process input plan with id:', id);
			toast.success('공정 투입 계획이 삭제되었습니다.');
		},
		isPending: false,
	};

	const handleAdd = () => {
		setEditingItem(null);
		setIsFormOpen(true);
	};

	const handleEdit = () => {
		if (editingItem) {
			setIsFormOpen(true);
		} else {
			toast.warning('수정하실 공정 투입 계획을 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editingItem) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 공정 투입 계획을 선택해주세요.');
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

	const openNewForm = () => {
		setEditingItem(null);
		setIsFormOpen(true);
	};

	// Handle selected rows changes
	useEffect(() => {
		if (tableSelectedRows.size > 0) {
			const selectedRowIndex = Array.from(tableSelectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: ProcessInputPlan = mockData[rowIndex];
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
				title={
					editingItem ? '공정 투입 계획 수정' : '공정 투입 계획 등록'
				}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editingItem
								? '공정 투입 계획 정보를 수정합니다.'
								: '새로운 공정 투입 계획을 등록합니다.'}
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
				title="공정 투입 계획 삭제"
				description={`선택한 공정 투입 계획 '${editingItem?.processName || editingItem?.materialName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* Data Table */}
			<div className="bg-white rounded-lg border">
				<DatatableComponent
					table={table}
					columns={columns}
					data={mockData}
					toggleRowSelection={toggleRowSelection}
					selectedRows={tableSelectedRows}
					tableTitle="공정 투입 계획"
					rowCount={mockData.length}
					useSearch={true}
					enableSingleSelect={true}
					searchSlot={<SearchSlotComponent endSlot={<AddButton />} />}
				/>
			</div>
		</>
	);
};

export default ProcessInputPlanPage;
