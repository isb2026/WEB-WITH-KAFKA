import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect, useCallback } from 'react';
// import { useMoldOrderMaster } from '@primes/hooks';
// import { useMoldOrderDetail } from '@primes/hooks';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { useTranslation } from '@repo/i18n';
import { MoldCommentBlock } from '@primes/pages/mold/components/MoldCommentBlock';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SplitterComponent } from '@primes/components/common/Splitter';
import { MoldOrderDetailDto } from '@primes/types/mold';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';

interface MoldOrderMasterData {
	id: number;
	[key: string]: any;
}

interface MoldOrderDetailData extends MoldOrderDetailDto {}

const PAGE_SIZE = 30;

export const MoldOrderMasterDetailPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const MoldOrderMasterDetailPageDetailTableColumns = [
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 150,
		},
		{
			accessorKey: 'orderMonth',
			header: t('columns.orderMonth'),
			size: 150,
		},
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 150,
		},
		// {
		// 	accessorKey: 'itemId',
		// 		header: t('columns.itemId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		{
			accessorKey: 'inDate',
			header: t('columns.inDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		// {
		// 	accessorKey: 'moldOrderMasterId',
		// 		header: t('columns.moldOrderMasterId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		// {
		// 	accessorKey: 'moldOrderMaster',
		// 		header: t('columns.moldOrderMaster'),
		// 	size: 150,
		// },
		// {
		// 	accessorKey: 'moldId',
		// 		header: t('columns.moldId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		// {
		// 	accessorKey: 'progressId',
		// 		header: t('columns.progressId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		{
			accessorKey: 'inMonth',
			header: t('columns.inMonth'),
			size: 150,
		},
		{
			accessorKey: 'moldMasterId',
			header: t('columns.moldMaster'),
			size: 150,
		},
		{
			accessorKey: 'num',
			header: t('columns.num'),
			size: 100,
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
			size: 100,
		},
		{
			accessorKey: 'orderPrice',
			header: t('columns.orderPrice'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inPrice',
			header: t('columns.inPrice'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isIn',
			header: t('columns.isIn'),
			size: 150,
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
			accessorKey: 'inAmount',
			header: t('columns.inAmount'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		// {
		// 	accessorKey: 'ownVendorId',
		// 		header: t('columns.ownVendorId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		{
			accessorKey: 'isDev',
			header: t('columns.isDev'),
			size: 150,
		},
		{
			accessorKey: 'isChange',
			header: t('columns.isChange'),
			size: 150,
		},
		{
			accessorKey: 'moldOrderIngoings',
			header: t('columns.moldOrderIngoings'),
			size: 150,
		},
	];

	const InfoGridKeys = [
		// {
		// 	key: 'id',
		// 		label: t('columns.id'),
		// },
		{
			key: 'isUse',
			label: t('columns.isUse'),
		},
		{
			key: 'orderCode',
			label: t('columns.orderCode'),
		},
		{
			key: 'accountMonth',
			label: t('columns.accountMonth'),
		},
		{
			key: 'orderDate',
			label: t('columns.orderDate'),
		},
		// {
		// 	key: 'itemId',
		// 		label: t('columns.itemId'),
		// },
		// {
		// 	key: 'progressId',
		// 		label: t('columns.progressId'),
		// },
		{
			key: 'progressName',
			label: t('columns.progressName'),
		},
	];

	const MoldOrderMasterDetailPageMasterTableColumns = [
		// {
		// 	accessorKey: 'id',
		// 	header: t('columns.id'),
		// 	size: 80,
		// 	minSize: 60,
		// },
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 150,
		},
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 120,
		},
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 150,
		},
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
		// {
		// 	accessorKey: 'itemId',
		// 	header: t('columns.itemId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		// {
		// 	accessorKey: 'progressId',
		// 	header: t('columns.progressId'),
		// 	size: 80,
		// 	cell: ({ getValue }: { getValue: () => any }) => {
		// 		const value = getValue();
		// 		return value ? value.toLocaleString() : '-';
		// 	},
		// },
		{
			accessorKey: 'progressName',
			header: t('columns.progressName'),
			size: 150,
		},
		{
			accessorKey: 'inRequestDate',
			header: t('columns.inRequestDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'moldVendorId',
			header: t('columns.moldVendorId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'isDev',
			header: t('columns.isDev'),
			size: 150,
		},
		{
			accessorKey: 'isChange',
			header: t('columns.isChange'),
			size: 150,
		},
		{
			accessorKey: 'isEnd',
			header: t('columns.isEnd'),
			size: 150,
		},
		{
			accessorKey: 'endDate',
			header: t('columns.endDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'isClose',
			header: t('columns.isClose'),
			size: 150,
		},
		{
			accessorKey: 'closeName',
			header: t('columns.closeName'),
			size: 150,
		},
		{
			accessorKey: 'closeTime',
			header: t('columns.closeTime'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'isAdmit',
			header: t('columns.isAdmit'),
			size: 150,
		},
		{
			accessorKey: 'admitName',
			header: t('columns.admitName'),
			size: 150,
		},
		{
			accessorKey: 'admitTime',
			header: t('columns.admitTime'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},

		{
			accessorKey: 'inType',
			header: t('columns.inType'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'moldOrderDetails',
			header: t('columns.moldOrderDetails'),
			size: 150,
		},
	];
	// Master Table State
	const [masterPage, setMasterPage] = useState<number>(0);
	const [masterTotalElements, setMasterTotalElements] = useState<number>(0);
	const [masterPageCount, setMasterPageCount] = useState<number>(0);
	const [masterData, setMasterData] = useState<MoldOrderMasterData[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<MoldOrderMasterData | null>(null);
	const [masterLoading, setMasterLoading] = useState<boolean>(false);

	// Detail Table State
	const [detailData, setDetailData] = useState<MoldOrderDetailData[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);
	const [detailLoading, setDetailLoading] = useState<boolean>(false);

	// API hooks
	// const { list: masterList } = useMoldOrderMaster({
	// 	page: masterPage,
	// 	size: PAGE_SIZE,
	// });

	// const { listByMasterId: detailList } = useMoldOrderDetail({
	// 	masterId: selectedMasterRowId,
	// 	page: 0,
	// 	size: PAGE_SIZE,
	// });

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
		masterData,
		MoldOrderMasterDetailPageMasterTableColumns,
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
		MoldOrderMasterDetailPageDetailTableColumns,
		0,
		1,
		0,
		detailData.length,
		() => {}
	);

	// Update master data when API response changes
	// useEffect(() => {
	// 	if (masterList) {
	// 		setMasterLoading(masterList.isLoading || false);

	// 		if (masterList.data && masterList.data.content) {
	// 			setMasterData(masterList.data.content);
	// 			setMasterTotalElements(masterList.data.totalElements || 0);
	// 			setMasterPageCount(masterList.data.totalPages || 0);
	// 		} else if (masterList.data && Array.isArray(masterList.data)) {
	// 			setMasterData(masterList.data);
	// 			setMasterTotalElements(masterList.data.length);
	// 			setMasterPageCount(
	// 				Math.ceil(masterList.data.length / PAGE_SIZE)
	// 			);
	// 		}
	// 	}
	// }, [masterList]);

	// Update detail data when API response changes
	// useEffect(() => {
	// 	if (detailList) {
	// 		setDetailLoading(detailList.isLoading || false);

	// 		if (detailList.data && detailList.data.content) {
	// 			setDetailData(detailList.data.content);
	// 		} else if (detailList.data && Array.isArray(detailList.data)) {
	// 			setDetailData(detailList.data);
	// 		} else if (!selectedMasterRowId) {
	// 			setDetailData([]);
	// 		}
	// 	}
	// }, [detailList, selectedMasterRowId]);

	// Handle master row selection to load details
	useEffect(() => {
		if (selectedMasterRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterRows)[0];
			const rowIndex = parseInt(selectedRowIndex as string);

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
		} else {
			setSelectedMasterData(null);
			setSelectedMasterRowId(0);
		}
	}, [selectedMasterRows, masterData]);

	return (
		<PageTemplate
			firstChildWidth="30%"
			splitterSizes={[30, 70]}
			splitterMinSize={[430, 800]}
			splitterGutterSize={6}
		>
			<div className="border rounded-lg h-full">
				<DatatableComponent
					table={masterTable}
					columns={MoldOrderMasterDetailPageMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.mold.orders.detail')}
					rowCount={masterTotalElements}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
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
									value="info"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{t('tabs.status')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									value="comment"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:data-[state=active]:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{t('tabs.comment')}
								</RadixTabsTrigger>
								<RadixTabsTrigger
									value="files"
									className="inline-flex h-full gap-2 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-foreground data-[state=active]:bg-[#F5F5F5] dark:hover:bg-[#22262F] hover:bg-[#F5F5F5] dark:hover:bg-[#22262F]"
								>
									{t('tabs.attachments')}
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
											item: 'flex gap-2 items-center p-2',
											label: 'text-gray-700 text-sm',
											value: 'font-bold text-sm',
										}}
										data={selectedMasterData || {}}
										keys={InfoGridKeys}
									/>
								</RadixTabsContent>
								<RadixTabsContent
									value="comment"
									className="h-full p-4"
								>
									<div className="h-full overflow-y-auto">
										{selectedMasterData ? (
											<MoldCommentBlock
												entityId={
													selectedMasterData.moldOrderCode ||
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
									value="files"
									className="h-full p-4"
								>
									<div className="min-h-[120px] text-gray-500">
										{t('columns.attachmentsComingSoon')}
									</div>
								</RadixTabsContent>
							</div>
						</RadixTabsRoot>
					</div>

					{/* Detail List */}
					<div className="border rounded-lg h-full overflow-hidden flex-1">
						<DatatableComponent
							table={detailTable}
							columns={
								MoldOrderMasterDetailPageDetailTableColumns
							}
							data={detailData}
							tableTitle={tCommon(
								'pages.mold.orders.detail.detail'
							)}
							rowCount={detailData.length}
							useSearch={false}
							usePageNation={false}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
							useSummary={true}
							actionButtons={
								<ActionButtonsComponent
									topNodes={
										<button
											onClick={() => {
												if (selectedDetailRows.size > 0) {
													const selectedRowIndex = parseInt(Array.from(selectedDetailRows)[0]);
													const selectedDetail = detailData[selectedRowIndex];
													if (selectedDetail) {
														// Open incoming modal logic here
														console.log('Incoming for detail:', selectedDetail);
														// You can implement the modal opening logic here
													}
												}
											}}
											disabled={selectedDetailRows.size === 0}
											className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white border-Colors-Brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
											title={selectedDetailRows.size === 0 ? '입고할 항목을 선택해주세요' : '입고 등록'}
										>
											📦 입고등록
										</button>
									}
								/>
							}
						/>
					</div>
				</SplitterComponent>
			</div>
		</PageTemplate>
	);
};

export default MoldOrderMasterDetailPage;
