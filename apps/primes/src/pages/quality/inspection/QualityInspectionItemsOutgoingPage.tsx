import React, { useState, useEffect, useMemo } from 'react';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { InspectionItemPatrolColumns } from '@primes/schemas/quality/inspectionItemPatrolScheme';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ItemDto } from '@primes/types/item';
import { useItemListQuery } from '@primes/hooks/init/item/useItemListQuery';
import { FloraEditor } from '@repo/flora-editor';
import { ImageGallery } from '@repo/swiper';
import InspectionFormDialog, { InspectionFormData } from './InspectionFormDialog';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useCheckingSpecs } from '@primes/hooks/qms/checkingSpec/useCheckingSpecs';
import { useCheckingSpecListQuery } from '@primes/hooks/qms/checkingSpec/useCheckingSpecListQuery';
import { CheckingSpecType } from '@primes/types/qms/checkingSpec';
import { CheckingSpecData } from '@primes/types/qms/checkingSpec';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { useInspectionTableColumns } from './inspectionTableColumns';

const QualityInspectionItemsOutgoingPage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;

	// Item Table State
	const [itemPage, setItemPage] = useState(0);
	const [itemPageCount, setItemPageCount] = useState(0);
	const [itemData, setItemData] = useState<ItemDto[]>([]);
	const [totalItemCount, setTotalItemCount] = useState(0);
	const itemTableColumns = InspectionItemPatrolColumns();
	const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);

	// Inspection Table State
	const [inspectionPage, setInspectionPage] = useState(0);
	const [inspectionPageCount, setInspectionPageCount] = useState(0);
	const [inspectionData, setInspectionData] = useState<CheckingSpecData[]>([]);
	const [totalInspectionCount, setTotalInspectionCount] = useState(0);

	// Inspection Table Columns
	const inspectionTableColumns = useInspectionTableColumns();

	const [content, setEditorContent] = useState('');
	const [isDesktop] = useState(false);
	const [editorTheme] = useState<'light' | 'dark' | 'auto'>('light');

	// InspectionFormDialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingInspection, setEditingInspection] = useState<any>(null);

	// 삭제 관련 상태 추가
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// API 훅 추가
	const { create, update, remove } = useCheckingSpecs({});

	// 검사 항목 데이터 조회 훅 추가
	const { data: checkingData, refetch: refetchCheckingData } = useCheckingSpecListQuery({
		searchRequest: {
			targetId: selectedItem?.id || 0,
			inspectionType: "OUTGOING",
		},
		page: 0,
		size: 10,
	});

	const handleContentChange = (newContent: string) => {
		setEditorContent(newContent);
	};

	// InspectionFormDialog 핸들러
	const handleCreateInspection = () => {
		if (!selectedItem) {
			toast.error(tCommon('inspection.toast.selectItemFirst'));
			return;
		}
		setEditingInspection(null);
		setIsDialogOpen(true);
	};

	// 수정 핸들러
	const handleEditInspection = () => {
		if (selectedInspectionRowsTable.size === 0) {
			toast.warning(tCommon('inspection.toast.selectItemsToEdit'));
			return;
		}

		const selectedIndex = Array.from(selectedInspectionRowsTable)[0];
		const index = parseInt(String(selectedIndex));
		
		if (!isNaN(index) && index >= 0 && inspectionData && index < inspectionData.length) {
			const inspectionItem = inspectionData[index];
			if (inspectionItem) {
				setEditingInspection(inspectionItem);
				setIsDialogOpen(true);
			}
		}
	};

	// 폼 제출 핸들러 - 등록/수정 로직
	const handleSubmitInspection = async (data: InspectionFormData) => {
		setIsSubmitting(true);
		try {
			if (editingInspection) {
				// 수정 로직
				const updateData = {
					isUse: editingInspection.isUse,
					inspectionType: "OUTGOING",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: selectedItem?.id || editingInspection.targetId,
					targetCode: selectedItem?.itemNumber || editingInspection.targetCode,
					targetName: selectedItem?.itemName || editingInspection.targetName,
					meta: JSON.stringify(data.meta || {}),
					specType: data.CheckingSpecType as CheckingSpecType,
				};

				const result = await update.mutateAsync({
					id: editingInspection.id,
					data: updateData
				});
				
				if (result && typeof result === 'object' && 'error' in result && result.error) {
					const error = result.error as { message?: string };
					throw new Error(error.message || tCommon('inspection.toast.unknownError'));
				}
				
				toast.success(tCommon('inspection.toast.inspectionItemUpdated'));
			} else {
				// 등록 로직
				const apiData = {
					inspectionType: "OUTGOING",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: selectedItem?.id || (() => {
						throw new Error(tCommon('inspection.toast.selectItemFirst'));
					})(),
					targetCode: selectedItem?.itemNumber || '',
					targetName: selectedItem?.itemName || '',
					meta: JSON.stringify(data.meta || {}),
					specType: data.CheckingSpecType as CheckingSpecType,
				};

				const result = await create.mutateAsync([apiData]);
				
				if (result && typeof result === 'object' && 'error' in result && result.error) {
					const error = result.error as { message?: string };
					throw new Error(error.message || tCommon('inspection.toast.unknownError'));
				}
				
				toast.success(tCommon('inspection.toast.inspectionItemAdded'));
			}
			
			setIsDialogOpen(false);
			setEditingInspection(null);
			
			// 테이블 새로고침
			if (refetchCheckingData) {
				refetchCheckingData();
			}
			
			// 페이지 상태 초기화
			setInspectionPage(0);
			setInspectionPageCount(0);
			
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : tCommon('inspection.toast.unknownError');
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	// 삭제 핸들러 - InspectionItemsPatrolTabs에서 이동
	const handleRemoveInspection = async () => {
		try {
			console.log('selectedInspectionRowsTable', selectedInspectionRowsTable);
			if (selectedInspectionRowsTable.size === 0) {
				toast.warning(tCommon('inspection.toast.selectItemsToDelete'));
				return;
			}
			
			// selectedInspectionRowsTable은 인덱스 기반으로 저장된 값들
			// 인덱스를 실제 데이터의 ID로 변환
			const selectedInspectionIds: number[] = [];
			
			// inspectionData가 있는지 확인
			if (inspectionData) {
				Array.from(selectedInspectionRowsTable).forEach(indexStr => {
					const index = parseInt(indexStr);
					if (!isNaN(index) && index >= 0 && index < inspectionData.length) {
						const inspectionItem = inspectionData[index];
						if (inspectionItem && inspectionItem.id) {
							selectedInspectionIds.push(inspectionItem.id);
						}
					}
				});
			}

			if (selectedInspectionIds.length === 0) {
				toast.warning(tCommon('inspection.toast.noItemsToDelete'));
				setIsDeleteDialogOpen(false);
				return;
			}

			await remove.mutateAsync(selectedInspectionIds);
			
			toast.success(tCommon('inspection.toast.inspectionItemDeleted'));
			setIsDeleteDialogOpen(false);
			
			// 테이블 새로고침
			if (refetchCheckingData) {
				refetchCheckingData();
			}
			
		} catch (error) {
			toast.error(tCommon('inspection.toast.deleteError'));
			setIsDeleteDialogOpen(false);
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setEditingInspection(null);
	};

	// itemList 훅 추가 (삭제된 부분 복구)
	const itemList = useItemListQuery({
		page: itemPage,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: {},
	});

	// Table Hooks State
	const {
		table: itemTable,
		selectedRows: selectedItemsRow,
		toggleRowSelection,
	} = useDataTable(
		itemData,
		itemTableColumns,
		DEFAULT_PAGE_SIZE,
		itemPageCount,
		itemPage,
		totalItemCount,
		(page) => setItemPage(page.pageIndex)
	);

	// Inspection Table Hooks State
	const {
		table: inspectionTable,
		selectedRows: selectedInspectionRowsTable,
		toggleRowSelection: toggleInspectionRowSelection,
	} = useDataTable(
		inspectionData,
		inspectionTableColumns,
		10, // 페이지 크기
		inspectionPageCount,
		inspectionPage,
		totalInspectionCount,
		(page) => setInspectionPage(page.pageIndex)
	);

	// Inspection Row Selection Handler
	const handleInspectionRowSelection = (rowId: string) => {
		toggleInspectionRowSelection(rowId);
	};

	useEffect(() => {
		if (itemList.data?.content) {
			setItemData(itemList.data.content);
			setTotalItemCount(itemList.data.totalElements);
			setItemPageCount(itemList.data.totalPages || 0);
		}
	}, [itemList.data]);

	useEffect(() => {
		if (selectedItemsRow.size > 0) {
			const selectedId = Array.from(selectedItemsRow)[0];
			const found = itemData.find((row) => String((row as any).id) === String(selectedId));
			setSelectedItem((found as ItemDto) || null);
		} else {
			setSelectedItem(null);
		}
	}, [selectedItemsRow, itemData]);

	// 검사 항목 데이터 상태 관리
	useEffect(() => {
		if (checkingData?.content) {
			setInspectionData(checkingData.content);
			setTotalInspectionCount(checkingData.totalElements);
			setInspectionPageCount(checkingData.totalPages || 0);
		}
	}, [checkingData]);

	// 검사 항목 페이지 변경 시 API 재호출
	useEffect(() => {
		if (selectedItem?.id && inspectionPage > 0) {
			refetchCheckingData();
		}
	}, [inspectionPage, selectedItem?.id, refetchCheckingData]);

	// 컴포넌트 언마운트 시 상태 정리
	useEffect(() => {
		return () => {
			setInspectionData([]);
			setInspectionPage(0);
		};
	}, []);

	return (
		<>
			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterGutterSize={8}
				splitterMinSize={[340, 530]}
			>
				<div className="overflow-hidden h-full border rounded">
					<DatatableComponent
						table={itemTable}
						columns={itemTableColumns}
						tableTitle={tCommon('pages.titles.itemList')}
						data={itemData}
						rowCount={totalItemCount}
						selectedRows={selectedItemsRow}
						toggleRowSelection={toggleRowSelection}
						enableSingleSelect={true}
					/>
				</div>
				<div className="overflow-hidden h-full flex flex-col">
					<div className="flex-1 overflow-hidden border h-3/5 rounded mb-2">
						<div className="flex flex-col h-full">
							<div className="flex-1 flex overflow-y-auto">
								{/* 검사 항목 테이블이 여기에 들어갈 예정 */}
								<DatatableComponent
									table={inspectionTable}
									columns={inspectionTableColumns}
									tableTitle={tCommon('inspection.inspectionItems.tableTitle')}
									data={inspectionData}
									rowCount={totalInspectionCount}
									selectedRows={selectedInspectionRowsTable}
									toggleRowSelection={handleInspectionRowSelection}
									enableSingleSelect={true}
									usePageNation={true}
									searchSlot={
										<div className="flex w-full justify-end">
											<ActionButtonsComponent
												create={handleCreateInspection}
												edit={handleEditInspection}
												remove={() => setIsDeleteDialogOpen(true)}
												useCreate={true}
												useEdit={true}
												useRemove={true}
												visibleText={false}
											/>
										</div>
									}
									useSearch={true}
								/>
							</div>
						</div>
					</div>
					<div className="flex-1 overflow-hidden h-2/5">
						<div className="flex h-full gap-2">
							<div className="w-1/2 h-full border rounded flex flex-col">
								<div className="text-base font-bold border-b p-2 flex-shrink-0">
									{tCommon('tabs.actions.progressImageViewer')}
								</div>
								<div className="flex-1 overflow-hidden">
									<ImageGallery images={[]} />
								</div>
							</div>
							<div className="w-1/2 h-full rounded border flex flex-col">
								<div className="text-base font-bold border-b p-2 flex-shrink-0">
									{tCommon('tabs.actions.formulaEditor')}
								</div>
								<div className="flex-1 overflow-hidden">
									<FloraEditor
										value={content}
										onChange={handleContentChange}
										isDesktop={isDesktop}
										theme={editorTheme}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageTemplate>

			{/* 검사 항목 생성/수정 다이얼로그 */}
			<InspectionFormDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSubmit={handleSubmitInspection}
				isLoading={isSubmitting}
				initialData={editingInspection ? {
					checkingName: editingInspection.checkingName,
					orderNo: editingInspection.orderNo,
					standard: editingInspection.standard,
					standardUnit: editingInspection.standardUnit,
					sampleQuantity: editingInspection.sampleQuantity,
					checkingFormulaId: editingInspection.checkingFormulaId,
					CheckingSpecType: editingInspection.specType,
					// ONE_SIDED 타입의 경우 limitDirection과 limitValue로 변환
					...(String(editingInspection.specType) === 'ONE_SIDED' && editingInspection.meta ? {
						limitDirection: editingInspection.meta.maxValue != null ? 'MAX' : 'MIN',
						limitValue: editingInspection.meta.maxValue ?? editingInspection.meta.minValue
					} : {}),
					// 다른 타입들의 meta 데이터
					...(editingInspection.meta && String(editingInspection.specType) !== 'ONE_SIDED' ? {
						maxValue: editingInspection.meta.maxValue?.toString(),
						minValue: editingInspection.meta.minValue?.toString(),
						tolerance: editingInspection.meta.tolerance,
						referenceNote: editingInspection.meta.referenceNote
					} : {})
				} : {}}
				item={selectedItem || undefined}
				inspectionType="OUTGOING"
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title={tCommon('inspection.delete.inspectionItemsTitle', { count: selectedInspectionRowsTable.size })}
				description={tCommon('inspection.delete.inspectionItemsDescription', { count: selectedInspectionRowsTable.size })}
				onConfirm={handleRemoveInspection}
			/>
		</>
	);
};

export default QualityInspectionItemsOutgoingPage;