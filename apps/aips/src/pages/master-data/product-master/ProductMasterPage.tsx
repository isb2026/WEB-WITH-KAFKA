import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2, Plus } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { productMasterData } from '../dummy-data/productMasterData';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

export const ProductMasterPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<Item[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [editItemData, setEditingItemData] = useState<Item | null>(null);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'itemNumber',
			header: '제품코드',
			size: 120,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Item };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/product-master/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemName',
			header: '제품명',
			size: 200,
			cell: ({
				getValue,
				row,
			}: {
				getValue: () => string;
				row: { original: Item };
			}) => {
				const value = getValue();
				const id = row.original.id;
				return (
					<Link
						className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:underline"
						to={`/aips/master-data/product-master/${id}`}
					>
						{value || '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemSpec',
			header: '제품규격',
			size: 150,
		},
		{
			accessorKey: 'itemModel',
			header: '모델명',
			size: 120,
		},
		{
			accessorKey: 'itemUnit',
			header: '단위',
			size: 80,
			align: 'center',
		},
		{
			accessorKey: 'lotSize',
			header: '로트크기',
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'optimalInventoryQty',
			header: '적정재고',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'safetyInventoryQty',
			header: '안전재고',
			size: 100,
			align: 'center',
			cell: ({ getValue }: { getValue: () => number }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 더미 remove 함수
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete product with id:', id);
			toast.success('제품이 삭제되었습니다.');
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
			toast.warning('수정하실 제품을 선택해주세요.');
		}
	};

	const handleDelete = () => {
		if (editItemData) {
			setOpenDeleteDialog(true);
		} else {
			toast.warning('삭제하실 제품을 선택해주세요.');
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
		setData(productMasterData);
		setTotalElements(productMasterData.length);
		setPageCount(Math.ceil(productMasterData.length / DEFAULT_PAGE_SIZE));
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
			const currentRow: Item = data[rowIndex];
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
				title={editItemData ? '제품 수정' : '제품 등록'}
				content={
					<div className="p-6">
						<p className="text-gray-600">
							{editItemData
								? '제품 정보를 수정합니다.'
								: '새로운 제품을 등록합니다.'}
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
				title="제품 삭제"
				description={`선택한 제품 '${editItemData?.itemName || editItemData?.itemNumber}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			{/* 테이블 섹션 */}
			<div className="space-y-4 border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle="제품 마스터"
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

export default ProductMasterPage;
