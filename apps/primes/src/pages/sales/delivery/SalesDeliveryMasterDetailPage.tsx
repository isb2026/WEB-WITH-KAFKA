import { PageTemplate } from '@primes/templates';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useDataTable } from '@radix-ui/hook';
import { useState, useEffect } from 'react';
import { useDeliveryMaster } from '@primes/hooks/sales/deliveryMaster/useDeliveryMaster';
import { useDeliveryDetail } from '@primes/hooks/sales/deliveryDetail/useDeliveryDetail';
import { DeliveryDetail, DeliveryMaster } from '@primes/types/sales';
import { DeliveryMasterActions } from '@primes/pages/sales/components/DeliveryMasterActions';
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

export const SalesDeliveryMasterDetailPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');

	const SalesDeliveryMasterTableColumns = [
		{
			accessorKey: 'deliveryCode',
			header: t('columns.deliveryCode'),
			size: 120,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 120,
		},
		{
			accessorKey: 'deliveryDate',
			header: t('columns.deliveryDate'),
			size: 100,
		},
	];

	const SalesDeliveryDetailTableColumns = [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 180,
		},
		{
			accessorKey: 'itemSpec',
			header: '제품규격',
			size: 120,
		},
		{
			accessorKey: 'deliveryAmount',
			header: '납품수량',
			size: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'deliveryUnit',
			header: '납품단위',
			size: 100,
		},
		{
			accessorKey: 'currencyUnit',
			header: '통화단위',
			size: 100,
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 120,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'netPrice',
			header: '공급가액',
			size: 120,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.grossPrice'),
			size: 120,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'memo',
			header: '메모',
			size: 150,
		},
	];

	const InfoGridKeys = [
		{ key: 'deliveryCode', label: t('columns.deliveryCode') },
		{ key: 'vendorName', label: t('columns.vendorName') },
		{ key: 'deliveryDate', label: t('columns.deliveryDate') },
		// { key: 'requestDate', label: t('columns.requestDate') },
		// { key: 'deliveryLocation', label: t('columns.deliveryLocation') },
		{ key: 'currencyUnit', label: t('columns.currencyUnit') },
		{ key: 'closeBy', label: t('columns.closeBy') },
		{ key: 'isApproval', label: t('columns.isApproval') },
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
	const [masterData, setMasterData] = useState<DeliveryMaster[]>([]);
	const [selectedMasterData, setSelectedMasterData] =
		useState<DeliveryMaster | null>(null);

	// Detail Table State
	const [detailData, setDetailData] = useState<DeliveryDetail[]>([]);
	const [selectedMasterRowId, setSelectedMasterRowId] = useState<number>(0);

	// API hooks
	const { list, remove } = useDeliveryMaster({
		page: masterPage,
		size: PAGE_SIZE,
		searchRequest: {},
	});

	const { listByMasterId } = useDeliveryDetail({
		deliveryMasterId: selectedMasterRowId,
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
		SalesDeliveryMasterTableColumns,
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
		SalesDeliveryDetailTableColumns,
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
		const selectedMasterId = localStorage.getItem('selectedDeliveryMasterId');
		if (selectedMasterId && selectedMasterId !== '0' && masterData.length > 0) {
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
					localStorage.setItem('selectedDeliveryMasterId', '0');
				}
			}
		}
	}, [masterData, toggleMasterRowSelection]); // selectedMasterRows 의존성 제거

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
					columns={SalesDeliveryMasterTableColumns}
					data={masterData}
					tableTitle={tCommon('pages.titles.deliveryList')}
					rowCount={masterTotalElements}
					useSearch={true}
					selectedRows={selectedMasterRows}
					toggleRowSelection={toggleMasterRowSelection}
					actionButtons={
						<DeliveryMasterActions
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
													selectedMasterData.deliveryCode ||
													selectedMasterData.id?.toString() ||
													'N/A'
												}
												entityType="delivery"
											/>
										) : (
											<div className="min-h-[120px] p-4 flex items-center justify-center text-gray-500">
												Please select a delivery to view
												comments
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
							columns={SalesDeliveryDetailTableColumns}
							data={detailData}
							tableTitle={tCommon('pages.titles.deliveryDetail')}
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

export default SalesDeliveryMasterDetailPage;
