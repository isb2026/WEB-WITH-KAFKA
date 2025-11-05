import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect } from 'react';
import { useIncomingMaster } from '@primes/hooks/purchase/incomingMaster/useIncomingMaster';
import { useIncomingDetail } from '@primes/hooks/purchase/incomingDetail/useIncomingDetail';
import { IncomingDetail } from '@primes/types/purchase/incomingDetail';
import {
	IncomingMaster,
	MovePaperMaster,
} from '@primes/types/purchase/incomingMaster';
import { IncomingOrdersMasterActions } from '@primes/pages/purchase/components/IncomingOrdersMasterActions';
import { InfoGrid } from '@primes/components/common/InfoGrid';
import { PurchaseCommentBlock } from '@primes/pages/purchase/components/PurchaseCommentBlock';
import { SplitterComponent } from '@primes/components/common/Splitter';
import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
	RadixIconButton,
	DraggableDialog,
} from '@repo/radix-ui/components';
import { Printer, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { IncomingOrdersMovePaper } from '../components/IncomingOrdersMovePaper';
import { commaNumber } from '@repo/utils';
import { printPNG } from '@primes/utils/print';
import { downloadPNG } from '@primes/utils/download';

const PAGE_SIZE = 30;

export const IncomingOrdersMasterDetailPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const IncomingOrdersMasterTableColumns = [
		{
			accessorKey: 'incomingDate',
			header: t('columns.incomingDate'),
			size: 120,
		},
		{
			accessorKey: 'incomingCode',
			header: t('columns.incomingCode'),
			size: 140,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 140,
		},
	];

	const IncomingOrdersDetailTableColumns = [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 120,
		},
		{
			accessorKey: 'lotNo',
			header: t('columns.lotNo'),
			size: 120,
		},
		{
			accessorKey: 'number',
			header: t('columns.incomingQuantity'),
			size: 120,
			enableSummary: true,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.number)}</div>;
			},
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 100,
			enableSummary: true,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.unitPrice)}</div>;
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalIncomingAmount'),
			size: 100,
			enableSummary: true,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.grossPrice)}</div>;
			},
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 100,
		},
		{
			accessorKey: 'unit',
			header: t('columns.incomingUnit'),
			size: 100,
		},
	];

	const InfoGridKeys = [
		{ key: 'incomingCode', label: t('columns.incomingCode') },
		{ key: 'vendorName', label: t('columns.vendorName') },
		{ key: 'incomingDate', label: t('columns.incomingDate') },
		{ key: 'vendorName', label: t('columns.vendorName') },
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
	const [masterData, setMasterData] = useState<IncomingMaster[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<IncomingMaster | null>(null);

	// Detail Table State
	const [detailData, setDetailData] = useState<IncomingDetail[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// Detail data (single)
	const [selectedDetailRowId, setSelectedDetailRowId] = useState<number>(0);
	const [selectedDetailData, setSelectedDetailData] =
		useState<IncomingDetail | null>(null);
	const [movePaper, setMovePaper] = useState<MovePaperMaster | null>(null);

	//Move paper modal
	const [openModal, setOpenModal] = useState<boolean>(false);

	// API hooks
	const { list, remove } = useIncomingMaster({
		page: masterPage,
		size: PAGE_SIZE,
	});

	const { listByMasterId } = useIncomingDetail({
		incomingMasterId: selectedMasterRowId,
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
		IncomingOrdersMasterTableColumns,
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
		IncomingOrdersDetailTableColumns,
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

	// Handle detail row selection
	useEffect(() => {
		if (selectedDetailRows.size > 0) {
			const selectedRowIndex = Array.from(selectedDetailRows)[0];
			const rowIndex = parseInt(selectedRowIndex);
			if (
				!isNaN(rowIndex) &&
				rowIndex >= 0 &&
				rowIndex < detailData.length
			) {
				const selectedRow = detailData[rowIndex];
				if (selectedRow && selectedRow.id) {
					setSelectedDetailData(selectedRow);
					setSelectedDetailRowId(selectedRow.id);
				}
			}
		} else {
			setSelectedDetailData(null);
			setSelectedDetailRowId(0);
		}
	}, [selectedDetailRows, detailData]);

	const handleOpenModal = (detailData: IncomingDetail) => {
		setOpenModal(true);
		detailToMovePaper(detailData);
		console.log('Print detail data:', detailData);
	};

	const handlePrint = async () => {
		try {
			const doc = document.getElementById('incoming-move-paper');
			if (doc) {
				await printPNG(doc, 'Incoming Move Paper');
			}
		} catch (error) {
			console.error('Error printing PNG:', error);
		}
	};

	const handleDownload = async () => {
		try {
			const doc = document.getElementById('incoming-move-paper');
			if (doc) {
				const filename = `incoming-move-paper-${new Date().toISOString().split('T')[0]}.png`;
				await downloadPNG(doc, filename);
			}
		} catch (error) {
			console.error('Error downloading PNG:', error);
		}
	};

	const detailToMovePaper = (detailData: IncomingDetail): void => {
		setMovePaper({
			id: 1,
			workOrderNo: '2509-001-001', // 작업지시번호
			lotNo: '1', // LOT 번호
			boxNo: '1', // BOX 번호
			issueTime: new Date().toLocaleDateString(),
			material: detailData.itemName,
			dateRecieved: new Date(),
			quantity: detailData.number,
			unit: detailData.unit,
			vendorName: selectedMasterData?.vendorName,
		});
	};

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={(open: boolean) => {
					setOpenModal(open);
				}}
				title="Incoming Move Paper"
				content={
					movePaper && (
						<div className="space-y-4">
							{/* Move Paper Content */}
							<div id="incoming-move-paper">
								<IncomingOrdersMovePaper movePaper={movePaper} />
							</div>
							{/* Action Buttons */}
							<div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
								<RadixIconButton
									className="bg-Colors-Brand-700 hover:bg-Colors-Brand-800 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center transition-colors"
									onClick={handlePrint}
									title="Print this page"
								>
									<Printer size={16} />
									Print
								</RadixIconButton>
								<RadixIconButton
									className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center transition-colors"
									onClick={handleDownload}
									title="Download as PNG"
								>
									<Download size={16} />
									Download
								</RadixIconButton>
							</div>
							
							
						</div>
					)
				}
			/>

			<PageTemplate
				firstChildWidth="30%"
				splitterSizes={[30, 70]}
				splitterMinSize={[430, 800]}
				splitterGutterSize={6}
			>
				<div className="border rounded-lg">
					<DatatableComponent
						table={masterTable}
						columns={IncomingOrdersMasterTableColumns}
						data={masterData}
						tableTitle={tCommon(
							'pages.purchase.incomingMasterDetail'
						)}
						rowCount={masterTotalElements}
						useSearch={true}
						selectedRows={selectedMasterRows}
						toggleRowSelection={toggleMasterRowSelection}
						actionButtons={
							<IncomingOrdersMasterActions
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
										/>
									</RadixTabsContent>
									<RadixTabsContent
										key="comment"
										value="comment"
										className="h-full p-4"
									>
										<div className="h-full overflow-y-auto">
											{selectedMasterData ? (
												<PurchaseCommentBlock
													entityId={
														selectedMasterData.incomingCode ||
														selectedMasterData.id?.toString() ||
														'N/A'
													}
													entityType="incoming-order"
												/>
											) : (
												<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
													Please select an incoming
													order to view comments
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
						<div className="border rounded-lg h-full overflow-hidden flex-1">
							<DatatableComponent
								table={detailTable}
								columns={IncomingOrdersDetailTableColumns}
								data={detailData}
								tableTitle={tCommon(
									'pages.purchase.incomingDetailDetail'
								)}
								rowCount={detailData.length}
								useSearch={false}
								usePageNation={false}
								selectedRows={selectedDetailRows}
								toggleRowSelection={toggleDetailRowSelection}
								useSummary={true}
								headerOffset="366px"
								actionButtons={
									<RadixIconButton
										className="bg-Colors-Brand-700 hover:bg-Colors-Brand-800 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center transition-colors"
										onClick={() => handleOpenModal(selectedDetailData!)}
										disabled={!selectedDetailData}
									>
										<Printer size={16} />
										Generate Paper
									</RadixIconButton>
								}
								enableSingleSelect
							/>
						</div>
					</SplitterComponent>
				</div>
			</PageTemplate>
		</>
	);
};

export default IncomingOrdersMasterDetailPage;
