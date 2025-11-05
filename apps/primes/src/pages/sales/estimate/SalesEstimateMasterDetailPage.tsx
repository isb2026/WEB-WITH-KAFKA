import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect } from 'react';
import { useEstimateMaster } from '@primes/hooks/sales/estimateMaster/useEstimateMaster';
import { useEstimateDetail } from '@primes/hooks/sales/estimateDetail/useEstimateDetail';
import { EstimateDetail } from '@primes/types/sales/estimateDetail';
import { EstimateMaster } from '@primes/types/sales/estimateMaster';
import { EstimateMasterActions } from '@primes/pages/sales/components/EstimateMasterActions';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { SalesCommentBlock } from '@primes/pages/sales/components';
import { SplitterComponent } from '@primes/components/common/Splitter';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

const PAGE_SIZE = 30;

export const SalesEstimateMasterDetailPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const SalesEstimateMasterTableColumns = [
		{
			accessorKey: 'taxDate',
			header: t('columns.estimateDate'),
			size: 120,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 120,
		},
		{
			accessorKey: 'estimateCode',
			header: t('columns.estimateCode'),
			size: 140,
		},
	];

	const SalesEstimateDetailTableColumns = [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{ accessorKey: 'itemName', header: t('columns.itemName'), size: 120 },
		{
			accessorKey: 'number',
			header: t('columns.estimateQuantity'),
			size: 120,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'unit',
			header: t('columns.estimateUnit'),
			size: 100,
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalEstimateAmount'),
			size: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 100,
		},
	];

	const InfoGridKeys = [
		{ key: 'estimateCode', label: t('columns.estimateCode') },
		{ key: 'vendorName', label: t('columns.vendorName') },
		{ key: 'taxDate', label: t('columns.estimateDate') },
		// { key: 'vendorNo', label: t('columns.vendorNo') },
		{
			key: 'systemInfo',
			label: '등록 정보',
			template: '[{createdBy}] {createdAt}',
		},
		{
			key: 'updateInfo',
			label: '수정 정보',
			template: '[{updatedBy}] {updatedAt}',
		},
	];

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<EstimateMaster[]>([]);
	// ✅ 컴포넌트 마운트 시 선택된 masterId 복원
	const [selectedMasterData, setSelectedMasterData] =
		useState<EstimateMaster | null>(null);

	// Detail Table State
	const [detailData, setDetailData] = useState<EstimateDetail[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// API hooks
	const { list, remove } = useEstimateMaster({
		page: masterPage,
		size: PAGE_SIZE,
	});

	// Detail 쿼리 - selectedMasterRowId가 null이 아닐 때만 실행
	const { listByMasterId } = useEstimateDetail({
		estimateMasterId: selectedMasterRowId,
		page: 0,
		size: PAGE_SIZE,
	});

	// Master table pagination handler
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		SalesEstimateMasterTableColumns,
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
		SalesEstimateDetailTableColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Update master data when API response changes
	useEffect(() => {
		if (list.data?.content) {
			setMasterData(list.data.content);
			setMasterTotalElements(list.data.totalElements);
			setMasterPageCount(list.data.totalPages);
		}
	}, [list]);

	// Update detail data when API response changes
	useEffect(() => {
		if (listByMasterId.data?.content) {
			setDetailData(listByMasterId.data.content);
		} else if (!selectedMasterRowId) {
			setDetailData([]);
		}
	}, [listByMasterId.data, selectedMasterRowId]);

	// ✅ 컴포넌트 마운트 시 로컬 스토리지에서 선택된 masterId 복원
	useEffect(() => {
		const selectedMasterId = localStorage.getItem('selectedEstimateMasterId');
		if (selectedMasterId && masterData.length > 0) {
			const masterId = parseInt(selectedMasterId);
			// masterData에서 해당 ID를 가진 행을 찾아서 선택
			const foundMaster = masterData.find(master => master.id === masterId);
			if (foundMaster) {
				setSelectedMasterRowId(masterId);
				setSelectedMasterData(foundMaster);
				
				// ✅ 테이블에서 해당 행을 선택 상태로 설정
				const rowIndex = masterData.findIndex(master => master.id === masterId);
				if (rowIndex !== -1) {
					// 현재 선택된 행이 있다면 먼저 해제
					if (selectedMasterRows.size > 0) {
						const currentSelected = Array.from(selectedMasterRows)[0];
						toggleMasterRowSelection(currentSelected);
					}
					// 해당 행 선택
					toggleMasterRowSelection(rowIndex.toString());
					localStorage.setItem('selectedEstimateMasterId', '0');
				}
			}
		}
	}, [masterData, toggleMasterRowSelection, selectedMasterRows]); // ✅ 의존성 추가

	// ✅ 마스터 행 선택 시 로컬 스토리지 업데이트
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
					columns={SalesEstimateMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.estimate.masterDetail')}
					rowCount={masterTotalElements}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					actionButtons={
						<EstimateMasterActions
							selectedRows={selectedMasterRows}
							masterData={masterData}
							removeMaster={remove}
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
									{tCommon('tabs.labels.status')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									key="comment"
									value="comment"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{tCommon('tabs.labels.comment')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									key="files"
									value="files"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{tCommon('tabs.labels.attachments')}
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
										systemFields={['systemInfo', 'updateInfo']}
										systemColumns="grid-cols-2"
									/>
								</RadixTabsContent>
								<RadixTabsContent
									key="comment"
									value="comment"
									className="h-full p-4"
								>
									<div className="h-full overflow-y-auto">
										{selectedMasterData ? (
											<SalesCommentBlock
												entityId={
													selectedMasterData.estimateCode ||
													selectedMasterData.id?.toString() ||
													'N/A'
												}
												entityType="estimate"
											/>
										) : (
											<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
												Please select an estimate to
												view comments
											</div>
										)}
									</div>
								</RadixTabsContent>
								<RadixTabsContent
									key="files"
									value="files"
									className="h-full p-4"
								>
									<div className="min-h-[120px]">
										{tCommon('tabs.labels.attachments')}
									</div>
								</RadixTabsContent>
							</div>
						</RadixTabsRoot>
					</div>

					{/* Detail List */}
					<div className="border rounded-lg h-full overflow-hidden">
						<DatatableComponent
							table={detailTable}
							columns={SalesEstimateDetailTableColumns}
							data={detailData}
							tableTitle={tCommon('pages.estimate.detailDetail')}
							rowCount={detailData.length}
							useSearch={false}
							usePageNation={false}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
							useSummary={true}
							headerOffset="325px"
						/>
					</div>
				</SplitterComponent>
			</div>
		</PageTemplate>
	);
};

export default SalesEstimateMasterDetailPage;
