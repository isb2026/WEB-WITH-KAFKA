import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2 } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniBomRegisterPage } from './IniBomRegisterPage';
import { Link } from 'react-router-dom';
import DatatableComponent from '@aips/components/datatable/DatatableComponent';
import { dummyData } from '../../dummy-fake-data/dummyData';
import { DeleteConfirmDialog } from '@aips/components/common/DeleteConfirmDialog';
import { toast } from 'sonner';

export const IniBomListPage: React.FC = () => {
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
			header: t('columns.itemNumber'),
			size: 100,
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
						to={`/ini/item-progress/${id}`}
					>
						{value ? value.toLocaleString() : '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
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
						to={`/ini/item-progress/${id}`}
					>
						{value ? value.toLocaleString() : '-'}
					</Link>
				);
			},
			size: 150,
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 150,
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
						to={`/ini/item-progress/${id}`}
					>
						{value ? value.toLocaleString() : '-'}
					</Link>
				);
			},
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
		},
		{
			accessorKey: 'itemUnit',
			header: t('columns.itemUnit'),
			size: 150,
			align: 'center',
		},
		{
			accessorKey: 'lotSize',
			header: t('columns.lotSize'),
			size: 150,
			align: 'center',
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출 (나중에 사용할 예정)
	// const { list: apiData, remove } = useItem({
	// 	page: page,
	// 	size: DEFAULT_PAGE_SIZE,
	// });

	// 더미 remove 함수
	const dummyRemove = {
		mutate: (id: number) => {
			console.log('Delete item with id:', id);
		},
		isPending: false,
	};

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleEdit = () => {
		setOpenModal(true);
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
			// remove.mutate(id);
			dummyRemove.mutate(id);
			setOpenDeleteDialog(false);
		}
	};

	const AddButton = () => {
		return (
			<>
				<RadixIconButton
					onClick={handleEdit}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border `}
				>
					<Pen size={16} />
					{tCommon('edit')}
				</RadixIconButton>
				<RadixIconButton
					onClick={handleDelete}
					className={`flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border `}
				>
					<Trash2 size={16} />
					{tCommon('delete')}
				</RadixIconButton>
			</>
		);
	};

	// API 데이터 처리 (나중에 사용할 예정)
	// useEffect(() => {
	// 	const response = apiData.data;

	// 	if (response?.content) {
	// 		// 페이지네이션 응답 처리 - ItemDto를 Item으로 변환
	// 		const convertedItems: Item[] = response.content.map(
	// 			(item: any) => ({
	// 				...item,
	// 				useState: item.isUse,
	// 				deleteState: item.isDelete,
	// 				accountYear: new Date(item.createdAt).getFullYear(),
	// 			})
	// 		);
	// 		setData(convertedItems);
	// 		setTotalElements(response.totalElements || 0);
	// 		setPageCount(response.totalPages || 0);
	// 	} else if (Array.isArray(response)) {
	// 		// 배열 형태의 응답 처리 - ItemDto를 Item으로 변환
	// 		const convertedItems: Item[] = response.map((item: any) => ({
	// 			...item,
	// 			useState: item.isUse,
	// 			deleteState: item.isDelete,
	// 			accountYear: new Date(item.createdAt).getFullYear(),
	// 		}));
	// 		setData(convertedItems);
	// 		setTotalElements(response.length);
	// 		setPageCount(Math.ceil(response.length / DEFAULT_PAGE_SIZE));
	// 	}
	// }, [apiData.data]);

	// 더미 데이터 설정
	useEffect(() => {
		setData(dummyData);
		setTotalElements(dummyData.length);
		setPageCount(Math.ceil(dummyData.length / DEFAULT_PAGE_SIZE));
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
			const currenrRow: Item = data[rowIndex];
			console.log('currenrRow', currenrRow);
			setEditingItemData(currenrRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '품목 수정' : '품목 등록'}
				content={
					<IniBomRegisterPage
						itemsData={editItemData || undefined}
						onClose={() => {
							setOpenModal(false);
						}}
						onFormReady={handleFormReady}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
				onConfirm={handleDeleteConfirm}
				// isDeleting={remove.isPending}
				isDeleting={dummyRemove.isPending}
				title="품목 삭제"
				description={`선택한 품목 '${editItemData?.itemName || editItemData?.itemNumber}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<PageTemplate firstChildWidth="30%" className="border rounded-lg">
				<DatatableComponent
					table={table}
					columns={tableColumns}
					data={data}
					tableTitle={tCommon('pages.titles.bomList')}
					rowCount={totalElements}
					useSearch={true}
					enableSingleSelect={true}
					selectedRows={selectedRows}
					toggleRowSelection={toggleRowSelection}
					searchSlot={<SearchSlotComponent endSlot={<AddButton />} />}
				/>
			</PageTemplate>
		</>
	);
};

export default IniBomListPage;
