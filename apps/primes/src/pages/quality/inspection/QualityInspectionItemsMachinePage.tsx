import React, { useState, useEffect, useMemo } from 'react';
import { PageTemplate } from '@primes/templates';
import { useDataTable } from '@repo/radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { MachineListColumns } from '@primes/schemas/machine/MachineInfoSchemas';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { Machine } from '@primes/types/machine';
import { useMachineListQuery } from '@primes/hooks/machine/machine/useMachineListQuery';
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
import { InspectionItemsPatrolTable } from './checkHeadTabs/InspectionIMachineTabs';

const QualityInspectionItemsMachinePage: React.FC = () => {
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;

	// Machine Table State
	const [machinePage, setMachinePage] = useState(0);
	const [machinePageCount, setMachinePageCount] = useState(0);
	const [machineData, setMachineData] = useState<Machine[]>([]);
	const [totalMachineCount, setTotalMachineCount] = useState(0);
	const machineTableColumns = MachineListColumns();
	const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

	// Inspection Table State
	const [inspectionPage, setInspectionPage] = useState(0);
	const [inspectionPageCount, setInspectionPageCount] = useState(0);
	const [inspectionData, setInspectionData] = useState<CheckingSpecData[]>([]);
	const [totalInspectionCount, setTotalInspectionCount] = useState(0);

	// InspectionIMachineTabs State
	const [selectedInspectionRows, setSelectedInspectionRows] = useState<Set<string>>(new Set());
	const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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

	// 검사 항목 데이터 조회 훅 수정
	const { data: checkingData, refetch: refetchCheckingData } = useCheckingSpecListQuery({
		searchRequest: {
			targetId: selectedMachine?.id || 0,
			inspectionType: "MACHINE",
		},
		page: 0,
		size: 10,
	});

	const handleContentChange = (newContent: string) => {
		setEditorContent(newContent);
	};

	// InspectionFormDialog 핸들러
	const handleCreateInspection = () => {
		if (!selectedMachine) {
			toast.error(tCommon('inspection.toast.selectMachineFirst'));
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
		
		if (!isNaN(index) && index >= 0 && inspectionData && index < inspectionData.length) {
			const inspectionItem = inspectionData[index];
			if (inspectionItem) {
				setEditingInspection(inspectionItem);
				setIsDialogOpen(true);
			}
		}
	};

	// Machine을 ItemDto 형태로 변환하는 함수 제거하고 직접 Machine 사용

	// 폼 제출 핸들러 - 등록/수정 로직
	const handleSubmitInspection = async (data: InspectionFormData) => {
		setIsSubmitting(true);
		try {
			if (editingInspection) {
				// 수정 로직
				const updateData = {
					isUse: editingInspection.isUse,
					inspectionType: "MACHINE",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					checkPeriod: data.checkPeriod || 'DAY',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: selectedMachine?.id || editingInspection.targetId,
					targetCode: selectedMachine?.machineCode || editingInspection.targetCode,
					targetName: selectedMachine?.machineName || editingInspection.targetName,
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
					inspectionType: "MACHINE",
					checkingFormulaId: data.checkingFormulaId || 0,
					checkingName: data.checkingName || '',
					orderNo: data.orderNo || 0,
					standard: data.standard || '',
					standardUnit: data.standardUnit || '',
					checkPeriod: data.checkPeriod || 'DAY',
					sampleQuantity: data.sampleQuantity || 0,
					targetId: selectedMachine?.id || (() => {
						throw new Error(tCommon('inspection.toast.selectMachineFirst'));
					})(),
					targetCode: selectedMachine?.machineCode || '',
					targetName: selectedMachine?.machineName || '',
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

	// 삭제 핸들러
	const handleRemoveInspection = async () => {
		try {
			if (selectedInspectionRows.size === 0) {
				toast.warning(tCommon('inspection.toast.selectItemsToDelete'));
				return;
			}
			
			// selectedInspectionRows는 인덱스 기반으로 저장된 값들
			// 인덱스를 실제 데이터의 ID로 변환
			const selectedInspectionIds: number[] = [];
			
			// inspectionData가 있는지 확인
			if (inspectionData) {
				Array.from(selectedInspectionRows).forEach(indexStr => {
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

	// machineList 훅 추가
	const machineList = useMachineListQuery({
		page: machinePage,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: {},
	});

	// Table Hooks State
	const {
		table: machineTable,
		selectedRows: selectedMachineRow,
		toggleRowSelection,
	} = useDataTable(
		machineData,
		machineTableColumns,
		DEFAULT_PAGE_SIZE,
		machinePageCount,
		machinePage,
		totalMachineCount,
		(page) => setMachinePage(page.pageIndex)
	);

	useEffect(() => {
		if (machineList.data?.content) {
			setMachineData(machineList.data.content);
			setTotalMachineCount(machineList.data.totalElements);
			setMachinePageCount(machineList.data.totalPages || 0);
		}
	}, [machineList.data]);

	useEffect(() => {
		console.log('selectedMachineRow changed:', selectedMachineRow);
		if (selectedMachineRow.size > 0) {
			const selectedId = Array.from(selectedMachineRow)[0];
			console.log('selectedId:', selectedId);
			// 인덱스로 직접 접근
			const found = machineData[parseInt(selectedId)];
			console.log('found machine:', found);
			setSelectedMachine((found as Machine) || null);
		} else {
			setSelectedMachine(null);
		}
	}, [selectedMachineRow, machineData]);

	// 검사 항목 데이터 상태 관리
	useEffect(() => {
		if (checkingData?.content) {
			setInspectionData(checkingData.content);
			setTotalInspectionCount(checkingData.totalElements);
			setInspectionPageCount(checkingData.totalPages || 0);
		}
	}, [checkingData]);

	// selectedMachine이 변경될 때 검사 데이터 새로고침
	useEffect(() => {
		if (selectedMachine?.id) {
			console.log('Refetching checking data for machine:', selectedMachine.id);
			refetchCheckingData();
		}
	}, [selectedMachine?.id, refetchCheckingData]);

	// checkingData가 변경될 때 로그 출력
	useEffect(() => {
		console.log('checkingData changed:', checkingData);
		if (checkingData?.content) {
			console.log('checkingData content:', checkingData.content);
			// checkPeriod별로 데이터 분류
			const dailyData = checkingData.content.filter((item: CheckingSpecData) => item.checkPeriod === 'DAY');
			const weeklyData = checkingData.content.filter((item: CheckingSpecData) => item.checkPeriod === 'WEEK');
			const monthlyData = checkingData.content.filter((item: CheckingSpecData) => item.checkPeriod === 'MONTH');
			console.log('Daily data:', dailyData);
			console.log('Weekly data:', weeklyData);
			console.log('Monthly data:', monthlyData);
		}
	}, [checkingData]);

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
						table={machineTable}
						columns={machineTableColumns}
						tableTitle={tCommon('pages.titles.machineList')}
						data={machineData}
						rowCount={totalMachineCount}
						selectedRows={selectedMachineRow}
						toggleRowSelection={toggleRowSelection}
						enableSingleSelect={true}
					/>
				</div>
				<div className="overflow-hidden h-full flex flex-col">
					<div className="flex-1 overflow-hidden border h-3/5 rounded mb-2">
						<div className="flex flex-col h-full">
							<div className="flex-1 flex overflow-y-auto">
								{/* InspectionIMachineTabs 컴포넌트 사용 */}
								<InspectionItemsPatrolTable
									item={selectedMachine}
									onTabValueChange={setActiveTab}
									onCreate={handleCreateInspection}
									onEdit={handleEditInspection}
									inspectionType="MACHINE"
									selectedRows={selectedInspectionRows}
									onSelectionChange={setSelectedInspectionRows}
									onRemove={() => setIsDeleteDialogOpen(true)}
									checkingData={checkingData}
									onDataChange={setInspectionData}
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
					checkPeriod: editingInspection.checkPeriod,
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
				item={selectedMachine || undefined}
				inspectionType="MACHINE"
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

export default QualityInspectionItemsMachinePage;