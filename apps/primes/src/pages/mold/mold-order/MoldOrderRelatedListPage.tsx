import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect, useCallback } from 'react';
import { useMoldOrderMaster } from '@primes/hooks';
import { useMoldOrderDetailByMasterId } from '@primes/hooks/mold/mold-order/useMoldOrderDetailByMasterId';
import {
	MoldOrderMasterDto,
	MoldOrderDetailDto,
	MoldOrderMasterSearchRequest,
} from '@primes/types/mold';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { MoldCommentBlock } from '@primes/pages/mold/components/MoldCommentBlock';
import { SplitterComponent } from '@primes/components/common/Splitter';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
	RadixIconButton,
} from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { MoldOrderMasterActions } from '@primes/pages/mold/components/MoldOrderMasterActions';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { moldOrderSearchFields } from '@primes/schemas/mold';
import { QuickSearchField } from '@primes/components/common/search/QuickSearch';

const PAGE_SIZE = 30;

// Quick search fields for common searches
const quickSearchFields: QuickSearchField[] = [
	{ key: 'orderCode', value: '주문 코드', active: true },
];

interface MoldOrderRelatedListPageProps {
	onEditClick?: (item: MoldOrderMasterDto) => void;
}

export const MoldOrderRelatedListPage: React.FC<
	MoldOrderRelatedListPageProps
> = ({ onEditClick }) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const MoldOrderMasterTableColumns = [
		{
			accessorKey: 'orderDate',
			header: t('columns.orderDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 140,
		},
		{
			accessorKey: 'moldType',
			header: t('columns.moldType'),
			size: 120,
		},
		{
			accessorKey: 'inType',
			header: t('columns.inType'),
			size: 120,
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '완료' : '진행중';
			},
		},
	];

	const MoldOrderDetailTableColumns = [
		{
			accessorKey: 'moldMaster.moldCode',
			header: t('columns.moldCode'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				return row.original.moldMaster?.moldCode || '-';
			},
		},
		{
			accessorKey: 'moldMaster.moldName',
			header: t('columns.moldName'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				return row.original.moldMaster?.moldName || '-';
			},
		},
		{
			accessorKey: 'moldMaster.moldStandard',
			header: t('columns.moldStandard'),
			size: 150,
			cell: ({ row }: { row: any }) => {
				return row.original.moldMaster?.moldStandard || '-';
			},
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendor'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'num',
			header: t('columns.num'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'orderPrice',
			header: t('columns.orderPrice'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'orderAmount',
			header: t('columns.orderAmount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isIn',
			header: t('columns.isIn'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? '입고완료' : '미입고';
			},
		},
	];

	const InfoGridKeys = [
		{ key: 'orderCode', label: t('columns.orderCode') },
		{ key: 'orderDate', label: t('columns.orderDate') },
		{ key: 'accountMonth', label: t('columns.accountMonth') },
		{ key: 'moldType', label: t('columns.moldType') },
		{ key: 'inType', label: t('columns.inType') },
		{ key: 'inRequestDate', label: t('columns.inRequestDate') },
		{ key: 'isEnd', label: t('columns.isEnd') },
		{ key: 'isClose', label: t('columns.isClose') },
		{ key: 'isAdmit', label: t('columns.isAdmit') },
	];

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<MoldOrderMasterDto[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<MoldOrderMasterDto | null>(null);

	// Search State
	const [searchRequest, setSearchRequest] =
		useState<MoldOrderMasterSearchRequest>({});

	// Detail Table State
	const [detailData, setDetailData] = useState<MoldOrderDetailDto[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// API hooks
	const { list, removeMoldOrderMaster } = useMoldOrderMaster({
		searchRequest,
		page: masterPage,
		size: PAGE_SIZE,
	});

	// 페이지별 컨텍스트를 포함한 훅 호출
	const { data: listByMasterId, isLoading: detailLoading } =
		useMoldOrderDetailByMasterId(
			selectedMasterRowId && selectedMasterRowId > 0
				? selectedMasterRowId
				: null,
			0,
			PAGE_SIZE,
			'related-list-page' // 페이지 식별자
		);

	// Master table pagination handler
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// Search handlers
	const handleSearch = useCallback(
		(filters: MoldOrderMasterSearchRequest) => {
			setSearchRequest(filters);
			setMasterPage(0); // Reset to first page when searching
		},
		[]
	);

	// Quick Search 핸들러
	const handleQuickSearch = useCallback((value: string) => {
		// Disabled: Enter key functionality disabled for mold pages
		// QuickSearch will not respond to Enter key presses
		return;
	}, []);

	const handleClearSearch = useCallback(() => {
		setSearchRequest({});
		setMasterPage(0);
	}, []);

	// Master table data table hook
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		MoldOrderMasterTableColumns,
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
		MoldOrderDetailTableColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Update master data when API response changes
	useEffect(() => {
		if (list.data?.data && Array.isArray(list.data.data)) {
			setMasterData(list.data.data);
			setMasterTotalElements(list.data.data.length);
			setMasterPageCount(Math.ceil(list.data.data.length / PAGE_SIZE));
		} else if (Array.isArray(list.data)) {
			setMasterData(list.data);
			setMasterTotalElements(list.data.length);
			setMasterPageCount(Math.ceil(list.data.length / PAGE_SIZE));
		}
	}, [list.data]);

	// Update detail data when API response changes
	useEffect(() => {
		if (listByMasterId?.content) {
			setDetailData(listByMasterId.content);
		} else if (listByMasterId?.data && Array.isArray(listByMasterId.data)) {
			setDetailData(listByMasterId.data);
		} else if (
			listByMasterId?.dataList &&
			Array.isArray(listByMasterId.dataList)
		) {
			setDetailData(listByMasterId.dataList);
		} else if (Array.isArray(listByMasterId)) {
			setDetailData(listByMasterId);
		} else if (!selectedMasterRowId) {
			setDetailData([]);
		}
	}, [listByMasterId, selectedMasterRowId]);

	// Handle master row selection to load details (최적화)
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
				// 동일한 행이 이미 선택된 경우 중복 처리 방지
				if (
					selectedRow &&
					selectedRow.id &&
					selectedRow.id !== selectedMasterRowId
				) {
					setSelectedMasterData(selectedRow);
					setSelectedMasterRowId(selectedRow.id);
				}
			}
		} else {
			// 선택된 행이 없으면 초기화 (이미 초기화된 경우 중복 처리 방지)
			if (selectedMasterRowId !== 0) {
				setSelectedMasterData(null);
				setSelectedMasterRowId(0);
			}
		}
	}, [selectedMasterRows, masterData, selectedMasterRowId]); // selectedMasterRowId 의존성 다시 추가하되 조건부 업데이트로 무한 루프 방지

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
					columns={MoldOrderMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.mold.orderList')}
					rowCount={masterTotalElements}
					useSearch={true}
					searchSlot={
						<SearchSlotComponent
							fields={moldOrderSearchFields}
							onSearch={handleSearch}
							useQuickSearch={false}
							quickSearchField={quickSearchFields}
							onQuickSearch={handleQuickSearch}
						/>
					}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					enableSingleSelect
					actionButtons={
						<MoldOrderMasterActions
							selectedRows={selectedMasterRows}
							masterData={masterData}
							removeMaster={removeMoldOrderMaster}
							onEditClick={onEditClick}
						/>
					}
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
									{tCommon('tabs.labels.status')}
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
											<MoldCommentBlock
												entityId={
													selectedMasterData.orderCode ||
													selectedMasterData.id?.toString() ||
													'N/A'
												}
												entityType="mold-order"
											/>
										) : (
											<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
												Please select a mold order to
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
									<div className="min-h-[120px] text-gray-500">
										{tCommon(
											'tabs.labels.filesPlaceholder',
											'첨부파일 기능이 곧 구현될 예정입니다'
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
							columns={MoldOrderDetailTableColumns}
							data={detailData}
							tableTitle={tCommon('pages.mold.orderDetail')}
							rowCount={detailData.length}
							useSearch={false}
							usePageNation={false}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
							useSummary={true}
						/>
					</div>
				</SplitterComponent>
			</div>
		</PageTemplate>
	);
};

export default MoldOrderRelatedListPage;
