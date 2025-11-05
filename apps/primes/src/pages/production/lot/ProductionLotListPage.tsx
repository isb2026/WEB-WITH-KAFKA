// import { useState, useEffect, useRef, useCallback } from 'react';
// import { UseFormReturn } from 'react-hook-form';
// import { PageTemplate } from '@primes/templates';
// import DatatableComponent from '@primes/components/datatable/DatatableComponent';
// import { useDataTable } from '@radix-ui/hook';
// import { useTranslation } from '@repo/i18n';
// import { useLot } from '@primes/hooks/production';
// import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
// import { DraggableDialog } from '@repo/radix-ui/components';
// import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
// import { ProductionLotRegisterPage } from './ProductionLotRegisterPage';
// import { toast } from 'sonner';
// import { LotMaster } from '@primes/types/production';
// import {
// 	lotColumns,
// 	lotSearchFields,
// 	LotDataTableType,
// } from '@primes/schemas/production';

// const PAGE_SIZE = 30;

// export const ProductionLotListPage: React.FC = () => {
// 	const { t: tCommon } = useTranslation('common');

// 	const formMethodsRef = useRef<UseFormReturn<
// 		Record<string, unknown>
// 	> | null>(null);
// 	const [page, setPage] = useState(0);
// 	const [data, setData] = useState<LotMaster[]>([]);
// 	const [totalElements, setTotalElements] = useState(0);
// 	const [pageCount, setPageCount] = useState(0);
// 	const [searchRequest, setSearchRequest] = useState({});
// 	const [openModal, setOpenModal] = useState(false);
// 	const [editingLot, setEditingLot] = useState<LotMaster | null>(null);
// 	const [formMethods, setFormMethods] = useState<UseFormReturn<
// 		Record<string, unknown>
// 	> | null>(null);

// 	// API Hook 사용
// 	const { list } = useLot({
// 		searchRequest,
// 		page,
// 		size: PAGE_SIZE,
// 	});

// 	// 컬럼 정의 (schema에서 import)
// 	const columns = lotColumns;

// 	// 페이지 변경 핸들러
// 	const onPageChange = useCallback((pagination: { pageIndex: number }) => {
// 		setPage(pagination.pageIndex);
// 	}, []);

// 	// 검색 핸들러
// 	const handleSearch = useCallback((filters: Record<string, unknown>) => {
// 		setSearchRequest(filters);
// 		setPage(0); // 검색 시 첫 페이지로 이동
// 	}, []);

// 	// 데이터 업데이트 useEffect
// 	useEffect(() => {
// 		if (list.data?.content) {
// 			setData(list.data.content);
// 			setTotalElements(list.data.totalElements);
// 			setPageCount(list.data.totalPages);
// 		}
// 	}, [list]);

// 	// 폼 리셋 useEffect
// 	useEffect(() => {
// 		if (formMethods && editingLot) {
// 			formMethods.reset(editingLot as unknown as Record<string, unknown>);
// 		}
// 	}, [formMethods, editingLot]);

// 	// 폼 준비 핸들러
// 	const handleFormReady = (
// 		methods: UseFormReturn<Record<string, unknown>>
// 	) => {
// 		formMethodsRef.current = methods;
// 		setFormMethods(methods);
// 	};

// 	// 등록/수정 핸들러
// 	const handleEdit = () => {
// 		if (editingLot) {
// 			setOpenModal(true);
// 		} else {
// 			toast.error('수정할 LOT를 선택해주세요.');
// 		}
// 	};

// 	// 삭제 핸들러
// 	// const handleDelete = () => {
// 	// 	if (editingLot) {
// 	// 		const id = editingLot.id;
// 	// 		remove.mutate([id]);
// 	// 	} else {
// 	// 		toast.error('삭제할 LOT를 선택해주세요.');
// 	// 	}
// 	// };

// 	// 데이터 테이블 Hook
// 	const { table, selectedRows, toggleRowSelection } = useDataTable(
// 		data,
// 		columns,
// 		PAGE_SIZE,
// 		pageCount,
// 		page,
// 		totalElements,
// 		onPageChange
// 	);

// 	// 선택된 행 처리 useEffect
// 	useEffect(() => {
// 		if (selectedRows.size > 0) {
// 			const selectedRowIndex = Array.from(selectedRows)[0];
// 			const rowIndex: number = parseInt(selectedRowIndex as string);
// 			const currentRow: LotMaster = data[rowIndex];
// 			setEditingLot(currentRow);
// 		} else {
// 			setEditingLot(null);
// 		}
// 	}, [selectedRows, data]);

// 	return (
// 		<>
// 			<DraggableDialog
// 				open={openModal}
// 				onOpenChange={setOpenModal}
// 				title={editingLot ? 'LOT 수정' : 'LOT 등록'}
// 				content={
// 					<ProductionLotRegisterPage
// 						data={editingLot || undefined}
// 						onClose={() => setOpenModal(false)}
// 						onFormReady={handleFormReady}
// 					/>
// 				}
// 			/>

// 			<PageTemplate className="border rounded-lg">
// 				<DatatableComponent
// 					table={table}
// 					columns={columns}
// 					data={data}
// 					tableTitle={tCommon('pages.titles.lotList')}
// 					rowCount={totalElements}
// 					useSearch={true}
// 					selectedRows={selectedRows}
// 					toggleRowSelection={toggleRowSelection}
// 					searchSlot={
// 						<SearchSlotComponent
// 							onSearch={handleSearch}
// 							fields={lotSearchFields}
// 							endSlot={
// 								<ActionButtonsComponent
// 									useEdit={true}
// 									useRemove={true}
// 									edit={handleEdit}
// 									// remove={handleDelete}
// 								/>
// 							}
// 						/>
// 					}
// 				/>
// 			</PageTemplate>
// 		</>
// 	);
// };

// export default ProductionLotListPage;
