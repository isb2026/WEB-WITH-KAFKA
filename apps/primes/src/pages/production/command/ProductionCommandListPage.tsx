import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useCommand } from '@primes/hooks/production';
import { useLotListQuery } from '@primes/hooks/production';
import { useWorkingListQuery } from '@primes/hooks/production';
import { useMoldInstanceListQuery } from '@primes/hooks/mold/mold-instance';
import { Command } from '@primes/types/production/command';
import { Lot } from '@primes/types/production/lot';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog, RadixIconButton } from '@repo/radix-ui/components';
import { ProductionCommandRegisterPage } from '@primes/pages/production/command/ProductionCommandRegisterPage';
// import { ProductionWorkingMasterForm } from '../working/ProductionWorkingMasterForm';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { useCommandColumns, commandSearchFields } from '@primes/schemas/production';
import { toast } from 'sonner';
import { ProductionCommandListPagePannel } from '@primes/pages/production/command/pannel/ProductionCommandListPagePannel';
// import { Plus } from 'lucide-react';

interface ProductionCommandListData {
	id: number;
	planId?: number;
	planCode?: string;
	accountMon?: string;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	itemNo?: number;
	itemName?: string;
	itemNumber?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	progressOrder?: number;
	isOutsourcing?: boolean;
	commandAmount?: number;
	commandWeight?: number;
	unit?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	endTime?: string;
	status?: string;
	name?: string;
	code?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

interface ProductionWorkingListData {
	id: number;
	commandId?: number;
	commandNo?: string;
	commandGroupNo?: string;
	commandProgressSeq?: string;
	workDate?: string;
	shift?: string;
	lotNo?: string;
	itemId?: number;
	itemNo?: number;
	itemName?: string;
	itemNumber?: string;
	itemSpec?: string;
	progressId?: number;
	progressTypeCode?: string;
	progressName?: string;
	machineId?: number;
	machineCode?: string;
	machineName?: string;
	lineNo?: string;
	workAmount?: number;
	workWeight?: number;
	workUnit?: string;
	startTime?: string;
	endTime?: string;
	boxAmt?: number;
	isClose?: boolean;
	isOutsourcing?: boolean;
	outsourcingVendorId?: number;
	outsourcingVendorName?: string;
	jobType?: string;
	badStatusCode?: string;
	badReasonCode?: string;
	workBy?: string;
	inOut?: boolean;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

export const ProductionCommandListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionCommandListData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	// const [showWorkingModal, setShowWorkingModal] = useState<boolean>(false);
	const [selectedCommandData, setSelectedCommandData] =
		useState<ProductionCommandListData | null>(null);
	const [openPannel, setOpenPannel] = useState<boolean>(false);
	const [selectedCommandId, setSelectedCommandId] = useState<number | null>(null);
	const { t: tCommon } = useTranslation('common');
	const DEFAULT_PAGE_SIZE = 30;
	const columns = useCommandColumns();
	const searchFields = commandSearchFields();
	const [searchParams, setSearchParams] = useState<any>({});

	const { t } = useTranslation('dataTable');

	// 커스텀 컬럼 정의 (commandNo에 클릭 이벤트 추가)
	const customColumns = useMemo(() => {
		const baseColumns = columns;
		return baseColumns.map((column) => {
			if (column.accessorKey === 'commandNo') {
				return {
					...column,
					cell: ({ getValue, row }: { getValue: () => string; row: { original: ProductionCommandListData } }) => {
						const value = getValue();
						return (
							<div className="cursor-pointer">
								<p
									className="text-Colors-Brand-600 hover:text-Colors-Brand-700 font-medium hover:underline focus:outline-none focus:underline"
									onClick={() => {
										handleOpenPannelRef.current?.(row.original);
									}}
								>
									{value || '-'}
								</p>
							</div>
						);
					},
				};
			}
			return column;
		});
	}, [columns]);

	const { list: apiData, remove } = useCommand({
		page: page,
		size: DEFAULT_PAGE_SIZE,
		searchRequest: searchParams,
	});

	// LOT 데이터 조회 (선택된 Command ID로 필터링)
	const { data: lotList } = useLotListQuery({
		page: 0,
		size: 1000,
		searchRequest: selectedCommandId ? { commandId: selectedCommandId } : { commandId: 0 },
	});

	// Working 데이터 조회 (선택된 Command ID로 필터링)
	const { data: workingList } = useWorkingListQuery({
		page: 0,
		size: 1000,
		searchRequest: selectedCommandId ? { commandId: selectedCommandId } : { commandId: 0 },
	});

	// Mold 데이터 조회 (선택된 Command ID로 필터링)
	const { data: moldList } = useMoldInstanceListQuery({
		page: 0,
		size: 1000,
		searchRequest: selectedCommandId ? { inputCommandId: selectedCommandId } : { inputCommandId: 0 },
	});

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	const handleEdit = () => {
		if (!selectedCommandData) {
			toast.warning('작업지시를 선택해주세요.');
			return;
		}

		setShowEditModal(true);
	};

	const handleRemove = () => {
		if (!selectedCommandData) {
			toast.warning('삭제할 작업지시를 선택해주세요.');
			return;
		}
		setShowDeleteDialog(true);
	};

	// const handleStartWork = () => {
	// 	if (!selectedCommandData) {
	// 		toast.warning('작업을 시작할 작업지시를 선택해주세요.');
	// 		return;
	// 	}
	// 	setShowWorkingModal(true);
	// };

	const confirmDelete = () => {
		if (!selectedCommandData) return;

		remove.mutate([selectedCommandData.id], {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setSelectedCommandData(null);
				toast.success('삭제가 정상적으로 완료되었습니다.');
			},
			onError: (error) => {
				console.error('삭제 실패:', error);
				setShowDeleteDialog(false);
				toast.error('삭제 중 오류가 발생했습니다.');
			},
		});
	};

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		customColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	const handleClosePannelRef = useRef<() => void>();
	const handleOpenPannelRef = useRef<(command: ProductionCommandListData) => void>();

	const handleClosePannel = useCallback(() => {
		setOpenPannel(false);
		setSelectedCommandData(null);
		setSelectedCommandId(null);
		// 패널 닫을 때 선택된 행 상태 초기화
		toggleRowSelection('all');
	}, [toggleRowSelection]);

	const handleOpenPannel = useCallback(
		(command: ProductionCommandListData) => {
			if (openPannel && selectedCommandData?.id === command.id) {
				handleClosePannel();
			} else {
				setSelectedCommandData(command);
				setSelectedCommandId(command.id);
				setOpenPannel(true);
			}
		},
		[openPannel, selectedCommandData, handleClosePannel]
	);

	// ref에 함수 할당
	handleClosePannelRef.current = handleClosePannel;
	handleOpenPannelRef.current = handleOpenPannel;

	// selectedRows 변경 감지하여 선택된 데이터 저장
	useEffect(() => {
		if (selectedRows.size > 0) {
			const selectedRowIndex = Array.from(selectedRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedCommand: ProductionCommandListData = data[rowIndex];

			setSelectedCommandData(selectedCommand || null);
		} else {
			setSelectedCommandData(null);
		}
	}, [selectedRows, data]);

	useEffect(() => {
		const response = apiData.data;

		if (response?.data?.content) {
			setData(response.data.content);
			setTotalElements(response.data.totalElements || 0);
			setPageCount(response.data.totalPages || 0);
		} else if (response?.content) {
			setData(response.content);
			setTotalElements(response.totalElements || 0);
			setPageCount(response.totalPages || 0);
		} else if (Array.isArray(response?.data)) {
			setData(response.data);
			setTotalElements(response.data.length);
			setPageCount(Math.ceil(response.data.length / DEFAULT_PAGE_SIZE));
		}
	}, [apiData.data, apiData.isLoading, apiData.error]);

	return (
		<>
			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[450, 550]}
				splitterGutterSize={8}
			>
				<div className="border rounded-lg overflow-hidden">
					<DatatableComponent
						table={table}
						columns={customColumns}
						data={data}
						tableTitle={tCommon('pages.command.list')}
						rowCount={totalElements}
						useSearch={true}
						enableSingleSelect={true}
						usePageNation={true}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						searchSlot={
							<SearchSlotComponent
								fields={searchFields}
								endSlot={
									<ActionButtonsComponent
										useRemove={true}
										useEdit={true}
										edit={handleEdit}
										remove={handleRemove}
										// topNodes={
										// 	<RadixIconButton
										// 		onClick={handleStartWork}
										// 		className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200"
										// 	>
										// 		<Plus size={16} />
										// 		{tCommon('pages.working.register')}
										// 	</RadixIconButton>
										// }
									/>
								}
								onSearch={(searchParams) => {
									setSearchParams(searchParams);
									setPage(0);
								}}
							/>
						}
					/>
				</div>
				{openPannel && selectedCommandData && (
					<ProductionCommandListPagePannel
						command={selectedCommandData as unknown as Command}
						lots={lotList?.content || []}
						workings={workingList?.content || []}
						molds={moldList?.data?.content || []}
						onClose={handleClosePannel}
					/>
				)}
			</PageTemplate>

			{/* 편집 다이얼로그 */}
			<DraggableDialog
				open={showEditModal}
				onOpenChange={setShowEditModal}
				title={`${tCommon('tabs.titles.command')} ${tCommon('edit')}`}
				content={
					<ProductionCommandRegisterPage
						mode="edit"
						data={selectedCommandData || undefined}
						onClose={() => setShowEditModal(false)}
					/>
				}
			/>

			{/* 작업시작 (WorkingMaster 생성) 다이얼로그 */}
			{/* <DraggableDialog
				open={showWorkingModal}
				onOpenChange={setShowWorkingModal}
				title={`${tCommon('pages.working.register')} - ${selectedCommandData?.commandNo || ''}`}
				content={
					<ProductionWorkingMasterForm
						mode="create"
						onClose={() => setShowWorkingModal(false)}
						masterData={selectedCommandData}
					/>
				}
			/> */}

			{/* 삭제 확인 다이얼로그 */}
			<DeleteConfirmDialog
				isOpen={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isDeleting={remove.isPending}
				title={tCommon('delete') || '삭제'}
				description={`선택한 작업지시 "${selectedCommandData?.commandNo || '항목'}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
			/>
		</>
	);
};

export default ProductionCommandListPage;
