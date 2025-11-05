import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect, useCallback } from 'react';
import {
	useWorkingMaster,
	useWorkingDetail,
	useDeleteWorking,
	useUpdateWorking,
} from '@primes/hooks/production';
import { useStartWork } from '@primes/hooks/production/useStartWork';
import { useFinishWork } from '@primes/hooks/production/useFinishWork';
import { useUsers } from '@primes/hooks/users/useUsers';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
	RadixIconButton,
} from '@repo/radix-ui/components';
import { ProductionCommentBlock } from '@primes/pages/production/components/ProductionCommentBlock';
import { SplitterComponent } from '@primes/components/common/Splitter';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import {
	getWorkingMasterColumns,
	getWorkingDetailColumns,
	getInfoGridKeys,
	WorkingMaster,
} from '@primes/schemas/production/workingMasterDetailSchemas';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { ProductionWorkingMasterForm } from './ProductionWorkingMasterForm';
import { toast } from 'sonner';
import { Play, Square } from 'lucide-react';

const PAGE_SIZE = 30;

interface ProductionWorkingMasterDetailPageProps {
	onEditClick?: (item: WorkingMaster) => void;
}

export const ProductionWorkingMasterDetailPage: React.FC<
	ProductionWorkingMasterDetailPageProps
> = ({ onEditClick }) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	// State
	const [masterPage, setMasterPage] = useState<number>(0);
	const [selectedMasterId, setSelectedMasterId] = useState<
		number | undefined
	>();
	const [selectedMasterData, setSelectedMasterData] =
		useState<WorkingMaster | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const { masterList, deleteMaster } = useWorkingMaster({
		searchRequest: {},
		page: masterPage,
		size: PAGE_SIZE,
	});

	const { detailList } = useWorkingDetail(selectedMasterId);

	// 사용자 데이터 가져오기 (workBy 변환용)
	const { list: userList } = useUsers({ page: 0, size: 1000 });
	const users = userList.data?.content || userList.data || [];

	const masterColumns = getWorkingMasterColumns(users);
	const detailColumns = getWorkingDetailColumns();
	const infoGridKeys = getInfoGridKeys(t);
	const deleteMutation = useDeleteWorking();
	const startWorkMutation = useStartWork();
	const finishWorkMutation = useFinishWork();

	// workBy를 사용자 이름으로 변환한 데이터
	const transformedMasterData = selectedMasterData
		? {
				...selectedMasterData,
				workBy: (() => {
					const userId = selectedMasterData.workBy;
					if (!userId) return '-';
					const user = Array.isArray(users)
						? users.find(
								(u: any) =>
									u.id?.toString() === userId?.toString()
							)
						: null;
					return user?.name || userId;
				})(),
			}
		: null;

	// Edit handler
	const handleEdit = () => {
		if (!selectedMasterData) {
			toast.warning('작업지시를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	// Delete button click handler
	const handleRemove = () => {
		if (!selectedMasterData) {
			toast.warning('삭제할 작업지시를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	// Delete confirmation handler
	const confirmDelete = () => {
		if (!selectedMasterData) return;

		deleteMutation.mutate([selectedMasterData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedMasterData(null);
				toast.success('삭제되었습니다.');
			},
			onError: (error) => {
				console.error('삭제 실패:', error);
				setShowDeleteDialog(false);
				toast.error('삭제 중 오류가 발생했습니다.');
			},
		});
	};

	// 작업시작 핸들러
	const handleStartWork = () => {
		if (!selectedMasterData) {
			toast.warning('작업을 시작할 항목을 선택해주세요.');
			return;
		}

		if (selectedMasterData.startTime) {
			toast.warning('이미 시작된 작업입니다.');
			return;
		}

		startWorkMutation.mutate(selectedMasterData.id, {
			onSuccess: (result) => {
				const startTime = result?.startTime || new Date().toISOString();
				toast.success(`작업이 성공적으로 시작되었습니다.`);
				setSelectedMasterData((prev) =>
					prev ? { ...prev, startTime } : null
				);
			},
			onError: (error) => {
				console.error('작업시작 실패:', error);
				toast.error('작업시작 중 오류가 발생했습니다.');
			},
		});
	};

	// 작업종료 핸들러
	const handleEndWork = () => {
		if (!selectedMasterData) {
			toast.warning('작업을 종료할 항목을 선택해주세요.');
			return;
		}

		if (selectedMasterData.endTime) {
			toast.warning('이미 종료된 작업입니다.');
			return;
		}

		if (!selectedMasterData.startTime) {
			toast.warning('작업을 시작하지 않은 작업입니다.');
			return;
		}

		finishWorkMutation.mutate(selectedMasterData.id, {
			onSuccess: (result) => {
				const endTime = result?.endTime || new Date().toISOString();
				toast.success(`작업이 성공적으로 종료되었습니다.`);
				setSelectedMasterData((prev) =>
					prev ? { ...prev, endTime } : null
				);
			},
			onError: (error) => {
				console.error('작업종료 실패:', error);
				toast.error('작업종료 중 오류가 발생했습니다.');
			},
		});
	};

	// Master table pagination handler
	const onMasterPageChange = useCallback(
		(pagination: { pageIndex: number }) => {
			setMasterPage(pagination.pageIndex);
		},
		[]
	);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterList.data?.content || [],
		masterColumns,
		PAGE_SIZE,
		masterList.data?.totalPages || 0,
		masterPage,
		masterList.data?.totalElements || 0,
		onMasterPageChange
	);

	// Detail table data table hook
	const {
		table: detailTable,
		toggleRowSelection: toggleDetailRowSelection,
		selectedRows: selectedDetailRows,
	} = useDataTable(
		detailList.data || [],
		detailColumns,
		0,
		1,
		0,
		detailList.data?.length || 0,
		() => {}
	);

	// Handle master row selection to load details
	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex as string);
			const masterData = masterList.data?.content || [];

			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < masterData.length
			) {
				const selectedRow = masterData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedMasterData(selectedRow);
					setSelectedMasterId(selectedRow.id);
				}
			}
		} else {
			setSelectedMasterData(null);
			setSelectedMasterId(undefined);
		}
	}, [selectedMasterRows, masterList.data]);

	return (
		<PageTemplate
			firstChildWidth="30%"
			splitterSizes={[30, 70]}
			splitterMinSize={[430, 800]}
			splitterGutterSize={6}
		>
			<div className="border rounded-lg">
				<DatatableComponent
					table={masterTable}
					columns={masterColumns}
					data={masterList.data?.content || []}
					tableTitle={tCommon('pages.titles.workingMaster')}
					rowCount={masterList.data?.totalElements || 0}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					enableSingleSelect
					actionButtons={
						<ActionButtonsComponent
							useEdit={true}
							useRemove={true}
							edit={handleEdit}
							remove={handleRemove}
							visibleText={false}
							topNodes={
								<div className="flex gap-2">
									<RadixIconButton
										onClick={handleStartWork}
										className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200"
									>
										<Play size={16} />
										{/* {tCommon('pages.working.start')} */}
									</RadixIconButton>
									<RadixIconButton
										onClick={handleEndWork}
										className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200"
									>
										<Square size={16} />
										{/* {tCommon('pages.working.finish')} */}
									</RadixIconButton>
								</div>
							}
						/>
					}
				/>
				{/* 편집 다이얼로그 */}
				{showEditModal && (
					<>
						<DraggableDialog
							open={showEditModal}
							onOpenChange={setShowEditModal}
							title={`${tCommon('pages.working.edit')}`}
							content={
								<ProductionWorkingMasterForm
									mode="update"
									masterData={selectedMasterData}
									onClose={() => setShowEditModal(false)}
								/>
							}
						/>
					</>
				)}

				<DeleteConfirmDialog
					isOpen={showDeleteDialog}
					onOpenChange={setShowDeleteDialog}
					onConfirm={confirmDelete}
					isDeleting={deleteMutation.isPending}
					title={tCommon('delete')}
					description={`선택한 작업코드 "${selectedMasterData?.workCode}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
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
									value="info"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{tCommon('tabs.labels.info')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									value="comment"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{tCommon('tabs.labels.comment')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									value="files"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{tCommon('tabs.labels.attachments')}
								</RadixTabsTrigger>
							</RadixTabsList>
							<div className="flex-1 overflow-hidden">
								<RadixTabsContent
									value="info"
									className="h-full p-2 overflow-y-auto"
								>
									<InfoGrid
										columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
										classNames={{
											container: 'rounded',
											item: 'py-1 px-2',
											label: 'text-gray-700 text-sm font-medium',
											value: 'text-sm',
										}}
										data={transformedMasterData || {}}
										keys={infoGridKeys}
									/>
								</RadixTabsContent>
								<RadixTabsContent
									value="comment"
									className="h-full p-4"
								>
									<div className="h-full overflow-y-auto">
										{selectedMasterData ? (
											<ProductionCommentBlock
												entityId={
													selectedMasterData.workCode ||
													selectedMasterData.id?.toString() ||
													'N/A'
												}
												entityType="production-working"
											/>
										) : (
											<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
												Please select a working record
												to view comments
											</div>
										)}
									</div>
								</RadixTabsContent>
								<RadixTabsContent
									value="files"
									className="h-full p-4"
								>
									<div className="min-h-[120px] text-gray-500">
										{tCommon(
											'tabs.labels.filesPlaceholder'
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
							columns={detailColumns}
							data={detailList.data || []}
							tableTitle={tCommon('pages.titles.workingDetail')}
							rowCount={detailList.data?.length || 0}
							useSearch={false}
							usePageNation={false}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
							useSummary={true}
							headerOffset="460px"
						/>
					</div>
				</SplitterComponent>
			</div>
		</PageTemplate>
	);
};

export default ProductionWorkingMasterDetailPage;
