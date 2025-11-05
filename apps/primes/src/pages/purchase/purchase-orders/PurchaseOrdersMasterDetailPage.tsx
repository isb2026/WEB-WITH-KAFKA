import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect } from 'react';
import { usePurchaseMaster } from '@primes/hooks/purchase/purchaseMaster/usePurchaseMaster';
import { usePurchaseDetail } from '@primes/hooks/purchase/purchaseDetail/usePurchaseDetail';
import { PurchaseDetail } from '@primes/types/purchase/purchaseDetail';
import { PurchaseMaster } from '@primes/types/purchase/purchaseMaster';
import { PurchaseOrdersMasterActions } from '@primes/pages/purchase/components/PurchaseOrdersMasterActions';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { PurchaseCommentBlock } from '@primes/pages/purchase/components/PurchaseCommentBlock';
import { SplitterComponent } from '@primes/components/common/Splitter';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';

const PAGE_SIZE = 30;

export const PurchaseOrdersMasterDetailPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const PurchaseOrdersMasterTableColumns = [
		{
			accessorKey: 'purchaseCode',
			header: t('columns.purchaseCode'),
			size: 140,
		},
		{
			accessorKey: 'purchaseDate',
			header: t('columns.purchaseDate'),
			size: 120,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 140,
		},
	];

	const PurchaseOrdersDetailTableColumns = [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 100,
			align: 'left',
		},
		{ 
			accessorKey: 'itemName', 
			header: t('columns.itemName'), 
			size: 120,
			align: 'left'
		},
		{ 
			accessorKey: 'itemSpec', 
			header: t('columns.itemSpec'), 
			size: 100,
			align: 'left',
		},
		{
			accessorKey: 'number',
			header: t('columns.purchaseNumber'),
			size: 100,
			enableSummary: true,
			align: 'right',
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'unit',
			header: t('columns.purchaseUnit'),
			size: 100,
			align: 'center',
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 100,
			align: 'right',
			enableSummary: true,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
			size: 120,
			align: 'right',
			enableSummary: true,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalOrderAmount'),
			size: 120,
			align: 'right',
			enableSummary: true,
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 100,
			align: 'center',
		},
	];

	const InfoGridKeys = [
		{ key: 'purchaseCode', label: t('columns.purchaseCode') },
		{ key: 'vendorName', label: t('columns.vendorName') },
		{ key: 'purchaseDate', label: t('columns.purchaseDate') },
		{ key: 'deliveryLocation', label: t('columns.deliveryLocation') },
		{ key: 'requestDate', label: t('columns.requestDate') },
		{ key: 'currencyUnit', label: t('columns.currencyUnit') },
		{ key: 'approvalBy', label: t('columns.approvalBy') },
		{ key: 'approvalAt', label: t('columns.approvalAt') },
		{ key: 'closeBy', label: t('columns.closeBy') },
		{ key: 'closeAt', label: t('columns.closeAt') },
	];

	// Master Table State
	const [masterPage, setMasterPage] = useState(0);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);
	const [masterData, setMasterData] = useState<PurchaseMaster[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<PurchaseMaster | null>(null);

	// Detail Table State
	const [detailData, setDetailData] = useState<PurchaseDetail[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// API hooks
	const { list, remove } = usePurchaseMaster({
		page: masterPage,
		size: PAGE_SIZE,
	});

	const { listByMasterId } = usePurchaseDetail({
		purchaseMasterId: selectedMasterRowId,
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
		PurchaseOrdersMasterTableColumns,
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
		PurchaseOrdersDetailTableColumns,
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

	// Handle master row selection to load details
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
					columns={PurchaseOrdersMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.purchaseOrder.masterList')}
					rowCount={masterTotalElements}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					actionButtons={
						<PurchaseOrdersMasterActions
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
						<RadixTabsRoot defaultValue="info" className="h-full flex flex-col">
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
								<RadixTabsContent key="info" value="info" className="h-full p-2 overflow-y-auto">
									<InfoGrid
										columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 h-full"
										classNames={{
											container: 'rounded',
											item: 'flex gap-2 items-center p-2',
											label: 'text-gray-700 text-sm',
											value: 'font-bold text-sm',
										}}
										data={
											selectedMasterData ? selectedMasterData : {}
										}
										keys={InfoGridKeys}
									/>
								</RadixTabsContent>
								<RadixTabsContent key="comment" value="comment" className="h-full p-4">
									<div className="h-full overflow-y-auto">
										{selectedMasterData ? (
											<PurchaseCommentBlock
												entityId={
													selectedMasterData.purchaseCode ||
													selectedMasterData.id?.toString() ||
													'N/A'
												}
												entityType="purchase-order"
											/>
										) : (
											<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
												Please select a purchase order to view
												comments
											</div>
										)}
									</div>
								</RadixTabsContent>
								<RadixTabsContent key="files" value="files" className="h-full p-4">
									<div className="min-h-[120px]">
										{tCommon('tabs.labels.attachments')}
									</div>
								</RadixTabsContent>
							</div>
						</RadixTabsRoot>
					</div>

					{/* Detail List */}
					<div className="border rounded-lg h-full overflow-hidden flex-1">
						<DatatableComponent
							table={detailTable}
							columns={PurchaseOrdersDetailTableColumns}
							data={detailData}
							tableTitle={tCommon('pages.purchaseOrder.detailList')}
							rowCount={detailData.length}
							useSearch={false}
							usePageNation={false}
							selectedRows={selectedDetailRows}
							toggleRowSelection={toggleDetailRowSelection}
							useSummary={true}
							headerOffset="366px"
						/>
					</div>
				</SplitterComponent>
			</div>
		</PageTemplate>
	);
};

export default PurchaseOrdersMasterDetailPage;
