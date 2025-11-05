import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { salesOrderData } from '../dummy-data/salesOrderData';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

interface SalesOrder {
	id: number;
	orderNumber: string;
	customerName: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	totalAmount: number;
	orderDate: string;
	dueDate: string;
	status:
		| 'pending'
		| 'confirmed'
		| 'in_production'
		| 'completed'
		| 'cancelled';
	priority: 'low' | 'medium' | 'high';
	notes?: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}

export const SalesOrderManagementPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<SalesOrder[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<SalesOrder | null>(
		null
	);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800';
			case 'in_production':
				return 'bg-purple-100 text-purple-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return '대기중';
			case 'confirmed':
				return '확정됨';
			case 'in_production':
				return '생산중';
			case 'completed':
				return '완료됨';
			case 'cancelled':
				return '취소됨';
			default:
				return status;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'low':
				return 'bg-gray-100 text-gray-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'high':
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
			default:
				return priority;
		}
	};

	const tableColumns = [
		{
			accessorKey: 'orderNumber',
			header: '주문번호',
			size: 150,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: SalesOrder };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/demand/sales-order-management/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'customerName',
			header: '고객명',
			size: 150,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 200,
		},
		{
			accessorKey: 'quantity',
			header: '수량',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'unitPrice',
			header: '단가',
			size: 120,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `₩${value.toLocaleString()}` : '-';
			},
		},
		{
			accessorKey: 'totalAmount',
			header: '총액',
			size: 140,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? `₩${value.toLocaleString()}` : '-';
			},
		},
		{
			accessorKey: 'orderDate',
			header: '주문일',
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'dueDate',
			header: '납기일',
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}
					>
						{getStatusText(value)}
					</span>
				);
			},
		},
		{
			accessorKey: 'priority',
			header: '우선순위',
			size: 120,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(value)}`}
					>
						{getPriorityText(value)}
					</span>
				);
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 더미 remove 함수
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete sales order with id:', id);
			toast.success('주문이 삭제되었습니다.');
		},
		isPending: false,
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleAdd = () => {
		setEditingItemData(null);
		setOpenModal(true);
	};

	const handleEdit = () => {
		if (editItemData) {
			setOpenModal(true);
		} else {
			toast.warning('수정하실 주문을 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editItemData) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 주문을 선택해주세요.');
		}
	};

	const handleDeleteConfirm = () => {
		if (editItemData) {
			const id = editItemData.id;
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
					<Pen size={16} />
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

	// 더미 데이터 설정
	useEffect(() => {
		setData(salesOrderData);
		setTotalElements(salesOrderData.length);
		setPageCount(Math.ceil(salesOrderData.length / DEFAULT_PAGE_SIZE));
	}, []);

	useEffect(() => {
		if (formMethods && editItemData) {
			formMethods.reset(
				editItemData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currentRow: SalesOrder = data[rowIndex];
			setEditingItemData(currentRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '주문 수정' : '주문 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '주문 정보를 수정합니다.'
								: '새로운 주문을 등록합니다.'}
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
				isDeleting={dummyRemove.isPending}
				title="주문 삭제"
				description={`선택한 주문 '${editItemData?.orderNumber || editItemData?.productName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 테이블 섹션 */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="주문 관리"
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={<SearchSlotComponent endSlot={<AddButton />} />}
				/>
			</div>
		</>
	);
};

export default SalesOrderManagementPage;
