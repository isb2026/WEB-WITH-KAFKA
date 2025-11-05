import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { InspectionItemPatrolColumns } from '@primes/schemas/quality/inspectionItemPatrolScheme';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ItemDto } from '@primes/types/item';
import { useItemListQuery } from '@primes/hooks/init/item/useItemListQuery';
import { InspectionItemsPatrolTable } from './checkHeadTabs/InspectionItemsPatrolTabs';
import { FloraEditor } from '@repo/flora-editor';
import { ImageGallery } from '@repo/swiper';
import { useQueryClient } from '@tanstack/react-query';
import { progressKeys } from '@primes/hooks/init/progress/keys';
import { ProgressList } from '@primes/hooks/init/progress/useProgressListQuery';
import InspectionFormDialog, { InspectionFormData } from './InspectionFormDialog';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useCheckingSpecs } from '@primes/hooks/qms/checkingSpec/useCheckingSpecs';
import { useCheckingSpecListQuery } from '@primes/hooks/qms/checkingSpec/useCheckingSpecListQuery';
import { CheckingSpecType } from '@primes/types/qms/checkingSpec';
import { ItemProgressDto } from '@primes/types/progress';

const QualityInspectionItemsPatrolPage: React.FC = () => {
	const qc = useQueryClient();
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;

	// Item Table State
	const [itemPage, setItemPage] = useState(0);
	const [itemPageCount, setItemPageCount] = useState(0);
	const [itemData, setItemData] = useState<ItemDto[]>([]);
	const [totalItemCount, setTotalItemCount] = useState(0);
	const itemTableColumns = InspectionItemPatrolColumns();
	const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);

	const [content, setEditorContent] = useState('');
	const [isDesktop] = useState(false);
	const [editorTheme] = useState<'light' | 'dark' | 'auto'>('light');
	const [currentProgress, setCurrentProgress] = useState<ItemProgressDto | null>(null);

	// InspectionFormDialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 삭제 관련 상태 추가
	const [selectedInspectionRows, setSelectedInspectionRows] = useState<Set<string>>(new Set());
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// API 훅 추가
	const { create, update, remove } = useCheckingSpecs({});
	const [editingInspection, setEditingInspection] = useState<any>(null);

	// 검사 항목 데이터 조회 훅 추가
	const [currentProgressId, setCurrentProgressId] = useState<number | null>(null);
	const { data: checkingData, refetch: refetchCheckingData } = useCheckingSpecListQuery({
		searchRequest: {
			targetId: currentProgressId || 0,
			inspectionType: "PATROL",
		},
		page: 0,
		size: 10,
	}, {
		staleTime: 0, 
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
		if (selectedInspectionRows.size === 0) {
			toast.warning(tCommon('inspection.toast.selectItemsToEdit'));
			return;
		}

		const selectedIndex = Array.from(selectedInspectionRows)[0];
		const index = parseInt(String(selectedIndex));
		
		if (!isNaN(index) && index >= 0 && checkingData?.content && index < checkingData.content.length) {
			const inspectionItem = checkingData.content[index];
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
					inspectionType: "PATROL",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: currentProgress?.id || editingInspection.targetId,
					targetCode: currentProgress?.progressTypeCode || editingInspection.targetCode,
					targetName: currentProgress?.progressName || editingInspection.targetName,
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
					inspectionType: "PATROL",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: currentProgress?.id || (() => {
						throw new Error(tCommon('inspection.toast.progressRequired'));
					})(),
					targetCode: currentProgress?.progressTypeCode || '',
					targetName: currentProgress?.progressName || '',
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
			console.log('selectedInspectionRows', selectedInspectionRows);
			if (selectedInspectionRows.size === 0) {
				toast.warning(tCommon('inspection.toast.selectItemsToDelete'));
				return;
			}
			
			// selectedInspectionRows는 인덱스 기반으로 저장된 값들
			// 인덱스를 실제 데이터의 ID로 변환
			const selectedInspectionIds: number[] = [];
			
			// checkingData가 있는지 확인
			if (checkingData?.content) {
				Array.from(selectedInspectionRows).forEach(indexStr => {
					const index = parseInt(indexStr);
					if (!isNaN(index) && index >= 0 && index < checkingData.content.length) {
						const inspectionItem = checkingData.content[index];
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
			setSelectedInspectionRows(new Set());
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

	// 공정 변경 시 currentProgressId 업데이트
	useEffect(() => {
		if (currentProgress?.id) {
			setCurrentProgressId(currentProgress.id);
		}
	}, [currentProgress]);

	const findProgress = (progressId: number) => {
		if (!selectedItem) return;
		const progressCache: ProgressList | undefined = qc.getQueryData(
			progressKeys.latest(Number(selectedItem.id))
		);
		if (!progressCache) return;
		const progress: any = progressCache?.content?.find(
			(progress: any) => progress.id === Number(progressId)
		);
		setCurrentProgress(progress);
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
			// selectedId는 배열 인덱스 (0, 1, 2, ...)
			const rowIndex = parseInt(selectedId);
			
			if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < itemData.length) {
				const found = itemData[rowIndex];
				setSelectedItem(found || null);
			} else {
				setSelectedItem(null);
			}
		} else {
			setSelectedItem(null);
		}
	}, [selectedItemsRow, itemData]);

	useEffect(() => {
		if (currentProgress) {
			setEditorContent(currentProgress.keyManagementContents ?? '');
		} else {
			setEditorContent('');
		}
	}, [currentProgress]);

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
								<InspectionItemsPatrolTable
									item={selectedItem}
									onTabValueChange={(progressId) => {
										findProgress(progressId);
									}}
									onCreate={handleCreateInspection}
									onEdit={handleEditInspection}
									inspectionType="PATROL"
									selectedRows={selectedInspectionRows}
									onSelectionChange={setSelectedInspectionRows}
									onRemove={() => setIsDeleteDialogOpen(true)}
									checkingData={checkingData}
									onDataChange={(data) => {
									}}
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
				currentProgress={currentProgress || undefined}
				inspectionType="PATROL"
			/>

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title={tCommon('inspection.delete.inspectionItemsTitle', { count: selectedInspectionRows.size })}
				description={tCommon('inspection.delete.inspectionItemsDescription', { count: selectedInspectionRows.size })}
				onConfirm={handleRemoveInspection}
			/>
		</>
	);
};

export default QualityInspectionItemsPatrolPage;
