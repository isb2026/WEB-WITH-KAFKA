import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@repo/i18n';
import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { SplitterComponent } from '@primes/components/common/Splitter';
import { useDataTable } from '@radix-ui/hook';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';

// 새로운 Atomic Hooks 사용
import {
	useNotworkMasterListQuery,
	useNotworkDetailByMasterIdQuery,
	useCreateNotworkMaster,
	useUpdateNotworkMaster,
	useDeleteNotworkMaster,
	useCreateNotworkDetail,
	useUpdateNotworkDetail,
	useDeleteNotworkDetail,
} from '@primes/hooks/production';

// Types
import {
	NotworkMaster,
	NotworkDetail,
	NotworkMasterSearchParams,
	NotworkDetailSearchParams,
} from '@primes/types/production/notwork';

// Schemas
import {
	notworkMasterColumns,
	notworkDetailColumns,
	notworkMasterSearchFields,
	notworkDetailSearchFields,
	notworkMasterFormSchema,
	notworkDetailFormSchema,
	NotworkMasterDataTableType,
	NotworkDetailDataTableType,
} from '@primes/schemas/production';

// Components
import { ProductionNotworkRegisterPage } from './ProductionNotworkRegisterPage';
import { ProductionCommentBlock } from '../components/ProductionCommentBlock';

const PAGE_SIZE = 30;

export const ProductionNotworkMasterDetailPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterSearchParams, setMasterSearchParams] =
		useState<NotworkMasterSearchParams>({});
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<NotworkMaster[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<NotworkMaster | null>(null);

	// Detail Table State
	const [detailData, setDetailData] = useState<NotworkDetail[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// Modal State
	const [openMasterModal, setOpenMasterModal] = useState(false);
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [openDeleteMasterConfirm, setOpenDeleteMasterConfirm] =
		useState(false);
	const [openDeleteDetailConfirm, setOpenDeleteDetailConfirm] =
		useState(false);
	const [editingMaster, setEditingMaster] = useState<NotworkMaster | null>(
		null
	);
	const [editingDetail, setEditingDetail] = useState<NotworkDetail | null>(
		null
	);

	// Form State (onFormReady + reset 패턴)
	const [masterFormMethods, setMasterFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const [detailFormMethods, setDetailFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	// API hooks
	const masterList = useNotworkMasterListQuery({
		...masterSearchParams,
		page: masterPage,
		size: PAGE_SIZE,
	});

	const detailList = useNotworkDetailByMasterIdQuery(
		selectedMasterRowId,
		0,
		PAGE_SIZE,
		!!selectedMasterRowId
	);

	const createMaster = useCreateNotworkMaster();
	const updateMaster = useUpdateNotworkMaster();
	const deleteMaster = useDeleteNotworkMaster();

	const createDetail = useCreateNotworkDetail();
	const updateDetail = useUpdateNotworkDetail();
	const deleteDetail = useDeleteNotworkDetail();

	// Master table pagination handler
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// Update master data when API response changes
	useEffect(() => {
		if (masterList.data?.content) {
			setMasterData(masterList.data.content);
			setMasterTotalElements(masterList.data.totalElements);
			setMasterPageCount(masterList.data.totalPages);
		}
	}, [masterList]);

	// Update detail data when API response changes
	useEffect(() => {
		if (detailList.data?.content) {
			setDetailData(detailList.data.content);
		} else if (!selectedMasterRowId) {
			setDetailData([]);
		}
	}, [detailList.data, selectedMasterRowId]);

	// Form Reset (onFormReady + reset 패턴)
	useEffect(() => {
		if (masterFormMethods && editingMaster) {
			masterFormMethods.reset(
				editingMaster as unknown as Record<string, unknown>
			);
		}
	}, [masterFormMethods, editingMaster]);

	useEffect(() => {
		if (detailFormMethods && editingDetail) {
			detailFormMethods.reset(
				editingDetail as unknown as Record<string, unknown>
			);
		}
	}, [detailFormMethods, editingDetail]);

	// Form Ready Handlers (onFormReady 패턴)
	const handleMasterFormReady = useCallback(
		(methods: UseFormReturn<Record<string, unknown>>) => {
			setMasterFormMethods(methods);
		},
		[]
	);

	const handleDetailFormReady = useCallback(
		(methods: UseFormReturn<Record<string, unknown>>) => {
			setDetailFormMethods(methods);
		},
		[]
	);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		notworkMasterColumns,
		PAGE_SIZE,
		masterPageCount,
		masterPage,
		masterTotalElements,
		onMasterPageChange
	);

	// Detail table data table hook
	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailData,
		notworkDetailColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Handle master row selection to load details (SalesDelivery 패턴)
	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < masterData.length
			) {
				const selectedRow = masterData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedMasterData(selectedRow);
					setSelectedMasterRowId(selectedRow.id);
				}
			}
		}
	}, [selectedMasterRows, masterData]);

	// Search Handler
	const handleMasterSearch = (searchData: Record<string, unknown>) => {
		setMasterSearchParams(searchData as NotworkMasterSearchParams);
		setMasterPage(0);
	};

	// Master CRUD Handlers
	const handleMasterCreate = () => {
		setEditingMaster(null);
		setOpenMasterModal(true);
	};

	const handleMasterEdit = () => {
		if (selectedMasterData) {
			setEditingMaster(selectedMasterData);
			setOpenMasterModal(true);
		}
	};

	const handleMasterSubmit = async (data: Record<string, unknown>) => {
		try {
			if (editingMaster) {
				await updateMaster.mutateAsync({
					id: editingMaster.id,
					data: data as any,
				});
			} else {
				await createMaster.mutateAsync(data as any);
			}
			setOpenMasterModal(false);
			setEditingMaster(null);
		} catch (error) {
			console.error('Master 처리 실패:', error);
		}
	};

	const handleMasterDelete = async () => {
		try {
			const selectedIds = Array.from(selectedMasterRows).map((id) =>
				parseInt(id)
			);
			await deleteMaster.mutateAsync(selectedIds);
			setOpenDeleteMasterConfirm(false);
		} catch (error) {
			console.error('Master 삭제 실패:', error);
		}
	};

	// Detail CRUD Handlers
	const handleDetailCreate = () => {
		if (!selectedMasterData) return;
		setEditingDetail(null);
		setOpenDetailModal(true);
	};

	const handleDetailEdit = () => {
		if (selectedDetailRows.size === 1) {
			const selectedId = Array.from(selectedDetailRows)[0];
			const selected = detailData.find(
				(item) => item.id?.toString() === selectedId
			);
			if (selected) {
				setEditingDetail(selected);
				setOpenDetailModal(true);
			}
		}
	};

	const handleDetailSubmit = async (data: Record<string, unknown>) => {
		try {
			const payload = {
				...data,
				notworkMasterId: selectedMasterData?.id,
			};

			if (editingDetail) {
				await updateDetail.mutateAsync({
					id: editingDetail.id,
					data: payload as any,
				});
			} else {
				await createDetail.mutateAsync(payload as any);
			}
			setOpenDetailModal(false);
			setEditingDetail(null);
		} catch (error) {
			console.error('Detail 처리 실패:', error);
		}
	};

	const handleDetailDelete = async () => {
		try {
			const selectedIds = Array.from(selectedDetailRows).map((id) =>
				parseInt(id)
			);
			await deleteDetail.mutateAsync(selectedIds);
			setOpenDeleteDetailConfirm(false);
		} catch (error) {
			console.error('Detail 삭제 실패:', error);
		}
	};

	// InfoGrid 키 정의
	const InfoGridKeys = [
		{ key: 'workDate', label: tCommon('workDate', '작업일') },
		{ key: 'machineCode', label: tCommon('machineCode', '장비코드') },
		{ key: 'machineName', label: tCommon('machineName', '장비명') },
		{ key: 'jobType', label: tCommon('jobType', '작업유형') },
		{
			key: 'totalNotworkMinute',
			label: tCommon('totalNotworkMinute', '총 비가동시간'),
		},
		{ key: 'description', label: tCommon('description', '설명') },
	];

	// Master Actions Component
	const MasterActions = () => (
		<ActionButtonsComponent
			edit={handleMasterEdit}
			remove={() => setOpenDeleteMasterConfirm(true)}
			useEdit={true}
			useRemove={true}
		/>
	);

	// Detail Actions Component
	const DetailActions = () => (
		<ActionButtonsComponent
			create={handleDetailCreate}
			edit={handleDetailEdit}
			remove={() => setOpenDeleteDetailConfirm(true)}
			useCreate={!!selectedMasterData}
			useEdit={selectedDetailRows.size === 1}
			useRemove={selectedDetailRows.size > 0}
		/>
	);

	return (
		<>
			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[430, 800]}
				splitterGutterSize={6}
			>
				<div className="border rounded-lg">
					<DatatableComponent
						table={masterTable}
						columns={notworkMasterColumns}
						data={masterData}
						tableTitle={tCommon(
							'tabs.titles.notworkMaster',
							'비가동 현황'
						)}
						rowCount={masterTotalElements}
						useSearch={true}
						selectedRows={selectedMasterRows}
						toggleRowSelection={toggleMasterRowSelection}
						searchSlot={
							<SearchSlotComponent
								fields={notworkMasterSearchFields}
								onSearch={handleMasterSearch}
								endSlot={<MasterActions />}
							/>
						}
						enableSingleSelect
					/>
				</div>
				<div className="h-full">
					<SplitterComponent
						direction="vertical"
						sizes={[40, 60]}
						minSize={[200, 300]}
						gutterSize={4}
						height="100%"
					>
						{/* Tabs */}
						<div className="border rounded-lg h-full">
							<RadixTabsRoot
								defaultValue="info"
								className="h-full flex flex-col"
							>
								<RadixTabsList className="inline-flex h-10 items-center w-full justify-start border-b flex-shrink-0">
									<RadixTabsTrigger
										key="info"
										value="info"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon('tabs.labels.status', '현황')}
									</RadixTabsTrigger>
									<RadixTabsTrigger
										key="comment"
										value="comment"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon(
											'tabs.labels.comment',
											'코멘트'
										)}
									</RadixTabsTrigger>
									<RadixTabsTrigger
										key="files"
										value="files"
										className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
									>
										{tCommon(
											'tabs.labels.attachments',
											'첨부파일'
										)}
									</RadixTabsTrigger>
								</RadixTabsList>
								<div className="flex-1 overflow-hidden">
									<RadixTabsContent
										key="info"
										value="info"
										className="h-full p-2 overflow-y-auto"
									>
										<InfoGrid
											columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
											classNames={{
												container: 'rounded',
												item: 'flex gap-2 items-center p-2',
												label: 'text-gray-700 text-sm',
												value: 'font-bold text-sm',
											}}
											data={
												selectedMasterData
													? selectedMasterData
													: {}
											}
											keys={InfoGridKeys}
										/>
									</RadixTabsContent>
									<RadixTabsContent
										key="comment"
										value="comment"
										className="h-full p-4"
									>
										<div className="h-full overflow-y-auto">
											{selectedMasterData ? (
												<ProductionCommentBlock
													entityId={
														selectedMasterData.id?.toString() ||
														'N/A'
													}
													entityType="production-notwork"
												/>
											) : (
												<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
													{tCommon(
														'tabs.labels.comment',
														'코멘트'
													)}
												</div>
											)}
										</div>
									</RadixTabsContent>
									<RadixTabsContent
										key="files"
										value="files"
										className="h-full p-4"
									>
										<div className="min-h-[120px] text-gray-500">
											{tCommon(
												'tabs.labels.attachments',
												'첨부파일'
											)}
										</div>
									</RadixTabsContent>
								</div>
							</RadixTabsRoot>
						</div>

						{/* Detail List */}
						<div className="border rounded-lg h-full overflow-hidden flex-1">
							<DatatableComponent
								table={detailTable}
								columns={notworkDetailColumns}
								data={detailData}
								tableTitle={tCommon(
									'tabs.titles.notworkDetail',
									'비가동 Detail'
								)}
								rowCount={detailData.length}
								useSearch={false}
								usePageNation={false}
								selectedRows={selectedDetailRows}
								toggleRowSelection={toggleDetailRowSelection}
								actionButtons={<DetailActions />}
								headerOffset="366px"
								useSummary={true}
							/>
						</div>
					</SplitterComponent>
				</div>
			</PageTemplate>

			{/* Master 등록/수정 모달 */}
			<DraggableDialog
				open={openMasterModal}
				onOpenChange={setOpenMasterModal}
				title={
					editingMaster
						? tCommon('edit', '수정')
						: tCommon('register', '등록')
				}
				content={
					<ProductionNotworkRegisterPage
						mode={editingMaster ? 'edit' : 'create'}
						type="master"
						data={editingMaster}
						onSubmit={handleMasterSubmit}
						onClose={() => setOpenMasterModal(false)}
						onFormReady={handleMasterFormReady}
					/>
				}
			/>

			{/* Detail 등록/수정 모달 */}
			<DraggableDialog
				open={openDetailModal}
				onOpenChange={setOpenDetailModal}
				title={
					editingDetail
						? tCommon('edit', '수정')
						: tCommon('register', '등록')
				}
				content={
					<ProductionNotworkRegisterPage
						mode={editingDetail ? 'edit' : 'create'}
						type="detail"
						data={editingDetail}
						masterId={selectedMasterData?.id}
						onSubmit={handleDetailSubmit}
						onClose={() => setOpenDetailModal(false)}
						onFormReady={handleDetailFormReady}
					/>
				}
			/>

			{/* Master 삭제 확인 */}
			<DeleteConfirmDialog
				isOpen={openDeleteMasterConfirm}
				onOpenChange={setOpenDeleteMasterConfirm}
				onConfirm={handleMasterDelete}
				title={tCommon('delete.master', 'Master 삭제')}
				description={tCommon(
					'delete.masterConfirm',
					'Master를 삭제하시겠습니까?'
				)}
			/>

			{/* Detail 삭제 확인 */}
			<DeleteConfirmDialog
				isOpen={openDeleteDetailConfirm}
				onOpenChange={setOpenDeleteDetailConfirm}
				onConfirm={handleDetailDelete}
				title={tCommon('delete.detail', 'Detail 삭제')}
				description={tCommon(
					'delete.detailConfirm',
					'Detail을 삭제하시겠습니까?'
				)}
			/>
		</>
	);
};
