import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useItem } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { Item } from '@primes/types/item';
import { useTranslation } from '@repo/i18n';
import { Pen, Trash2 } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { IniItemRegisterPage } from './IniItemRegisterPage';
import { toast } from 'sonner';

import { Images } from '@primes/components/common/Images';
import { getFileUrl } from '@primes/services/common/fileService';
import { IniItemListPagePannel } from './pannel/IniItemListPagePannel';

export const IniItemListPage: React.FC = () => {
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
	const [searchParams, setSearchParams] = useState<any>({});
	const DEFAULT_PAGE_SIZE = 30;

	const [openPannel, setOpenPannel] = useState<boolean>(false);

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	const { list: apiData, remove } = useItem({
		page: page,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: searchParams,
	});

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);
	};

	const handleEdit = () => {
		if (editItemData) {
			setOpenModal(true);
		} else {
			toast.warning('제품을 선택해주세요.');
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
			remove.mutate(id);
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

	// tableColumns를 useMemo로 최적화
	const tableColumns = useMemo(
		() => [
			{
				accessorKey: 'itemNo',
				header: t('columns.itemImage'),
				size: 120,
				cell: ({ row }: { row: { original: Item } }) => {
					const item = row.original;
					// Use primary image from fileUrls if available, otherwise use placeholder
					const primaryImage =
						item.fileUrls?.find((fileUrl) => fileUrl.isPrimary) ||
						item.fileUrls?.[0];
					const imageUrl = primaryImage?.url
						? getFileUrl(
								typeof primaryImage.url === 'string'
									? primaryImage.url
									: String(primaryImage.url || ''),
								'thumb'
							) // Use thumbnail size for list view
						: `https://placehold.co/120x120?text=${item.itemNumber}`;

					return (
						<div className="flex justify-center items-center">
							<Images imageUrl={imageUrl} />
						</div>
					);
				},
			},
			{
				accessorKey: 'itemNumber',
				header: t('columns.itemNumber'),
				size: 200,
				cell: ({
					getValue,
					row,
				}: {
					getValue: () => string;
					row: { original: Item };
				}) => {
					const value = getValue();

					return (
						<div className="cursor-pointer">
							<p
								className="text-Colors-Brand-600 hover:text-Colors-Brand-700 font-medium hover:underline focus:outline-none focus:underline"
								onClick={() => {
									handleOpenPannelRef.current?.(row.original);
								}}
							>
								{value ? value.toLocaleString() : '-'}
							</p>
							<p>{row.original.itemName}</p>
							<p className="text-Colors-Green-light-700 text-sm">
								{row.original.itemSpec}
							</p>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: '',
			// 	header: t('columns.progressInfo'),
			// 	size: 150,
			// 	align: 'center',
			// 	cell: ({ row }: { row: { original: Item } }) => {
			// 		const id = row.original.id;
			// 		return (
			// 			<div className="flex justify-center">
			// 				<Link
			// 					className="text-Colors-Brand-600 hover:text-Colors-Brand-700 font-medium hover:underline focus:outline-none focus:underline"
			// 					to={`/ini/item-progress/${id}`}
			// 				>
			// 					<Route size={16} />
			// 				</Link>
			// 			</div>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'itemModel',
				header: t('columns.itemModel'),
				size: 150,
				align: 'center',
			},
			{
				header: t('columns.itemCategory'),
				size: 150,
				align: 'center',
				cell: ({ row }: { row: { original: Item } }) => {
					const value = row.original.itemType1Value;
					const value2 = row.original.itemType2Value;
					const value3 = row.original.itemType3Value;
					return (
						<div className="flex justify-center">
							{`${value} > ${value2} > ${value3}`}
						</div>
					);
				},
			},
			{
				accessorKey: 'itemUnit',
				header: t('columns.itemUnit'),
				size: 150,
				align: 'center',
			},
			{
				accessorKey: 'isUse',
				header: t('columns.isUse'),
				size: 150,
				align: 'center',
				cell: ({ getValue }: { getValue: () => boolean }) => {
					const value = getValue();
					return value ? (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
							Y
						</span>
					) : (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							N
						</span>
					);
				},
			},
			{
				accessorKey: 'lotSize',
				header: t('columns.lotSize'),
				size: 150,
				align: 'center',
				cell: ({ row }: { row: { original: Item } }) => {
					const value = row.original.lotSizeValue;
					return value || '-';
				},
			},
			{
				accessorKey: 'optimalInventoryQty',
				header: t('columns.optimalInventoryQty'),
				size: 150,
				align: 'center',
				cell: ({ getValue }: { getValue: () => number }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
			{
				accessorKey: 'safetyInventoryQty',
				header: t('columns.safetyInventoryQty'),
				size: 150,
				align: 'center',
				cell: ({ getValue }: { getValue: () => number }) => {
					const value = getValue();
					return value ? value.toLocaleString() : '0';
				},
			},
		],
		[t]
	); // t 함수가 변경될 때만 재생성

	// searchFields를 useMemo로 최적화
	const searchFields = useMemo(
		() => [
			{
				name: 'itemNumber',
				label: t('columns.itemNumber'),
				type: 'text',
				placeholder: '품목 번호로 검색',
			},
			{
				name: 'itemName',
				label: t('columns.itemName'),
				type: 'text',
				placeholder: '품목명으로 검색',
			},
			{
				name: 'itemSpec',
				label: t('columns.itemSpec'),
				type: 'text',
				placeholder: '품목 규격으로 검색',
			},
			{
				name: 'itemModel',
				label: t('columns.itemModel'),
				type: 'text',
				placeholder: '품목 모델로 검색',
			},
			{
				name: 'itemType1',
				label: t('columns.itemType1'),
				type: 'text',
				placeholder: '품목 타입1으로 검색',
			},
			{
				name: 'itemType2',
				label: t('columns.itemType2'),
				type: 'text',
				placeholder: '품목 타입2로 검색',
			},
			{
				name: 'itemType3',
				label: t('columns.itemType3'),
				type: 'text',
				placeholder: '품목 타입3으로 검색',
			},
			{
				name: 'isUse',
				label: t('columns.isUse'),
				type: 'select',
				placeholder: '사용 여부 선택',
				options: [
					{ value: 'true', label: '사용' },
					{ value: 'false', label: '미사용' },
				],
			},
		],
		[t]
	); // t 함수가 변경될 때만 재생성

	useEffect(() => {
		const response = apiData.data;

		if (response?.content) {
			// 페이지네이션 응답 처리 - ItemDto를 Item으로 변환
			const convertedItems: Item[] = response.content.map(
				(item: any) => ({
					...item,
					useState: item.isUse,
					deleteState: item.isDelete,
					accountYear: new Date(item.createdAt).getFullYear(),
				})
			);
			setData(convertedItems);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(response)) {
			// 배열 형태의 응답 처리 - ItemDto를 Item으로 변환
			const convertedItems: Item[] = response.map((item: any) => ({
				...item,
				useState: item.isUse,
				deleteState: item.isDelete,
				accountYear: new Date(item.createdAt).getFullYear(),
			}));
			setData(convertedItems);
			setTotalElements(response.length);
			setPageCount(Math.ceil(response.length / DEFAULT_PAGE_SIZE));
		}
	}, [apiData.data]);

	useEffect(() => {
		if (formMethods && editItemData) {
			formMethods.reset(
				editItemData as unknown as Record<string, unknown>
			);
		}
	}, [formMethods]);

	const handleClosePannelRef = useRef<() => void>();
	const handleOpenPannelRef = useRef<(item: Item) => void>();

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	const handleClosePannel = useCallback(() => {
		setOpenPannel(false);
		setEditingItemData(null);
		// 패널 닫을 때 선택된 행 상태 초기화
		toggleRowSelection('all');
	}, [toggleRowSelection]);

	const handleOpenPannel = useCallback(
		(item: Item) => {
			if (openPannel && editItemData?.id === item.id) {
				handleClosePannel();
			} else {
				setEditingItemData(item);
				setOpenPannel(true);
			}
		},
		[openPannel, editItemData, handleClosePannel]
	);

	// ref에 함수 할당
	handleClosePannelRef.current = handleClosePannel;
	handleOpenPannelRef.current = handleOpenPannel;

	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const currenrRow: Item = data[rowIndex];
			setEditingItemData(currenrRow);
		} else {
			setEditingItemData(null);
		}
	}, [selectedRows, data]);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={editItemData ? '품목 수정' : '품목 등록'}
				content={
					<IniItemRegisterPage
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
				isDeleting={remove.isPending}
				title="품목 삭제"
				description={`선택한 품목 '${editItemData?.itemName || editItemData?.itemNumber}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>

			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[450, 550]}
				splitterGutterSize={8}
			>
				<div className="border rounded-lg overflow-hidden">
					<DatatableComponent
						table={table}
						columns={tableColumns}
						data={data}
						tableTitle={tCommon('tabs.titles.itemList')}
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						searchSlot={
							<SearchSlotComponent
								fields={searchFields}
								endSlot={<AddButton />}
								onSearch={(searchParams) => {
									setSearchParams(searchParams);
									setPage(0); // 검색 시 첫 페이지로 이동
								}}
							/>
						}
					/>
				</div>
				{openPannel && editItemData && (
					<IniItemListPagePannel
						item={editItemData}
						onClose={handleClosePannel}
					/>
				)}
			</PageTemplate>
		</>
	);
};

export default IniItemListPage;
