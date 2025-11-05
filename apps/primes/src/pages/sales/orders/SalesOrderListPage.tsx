import { PageTemplate } from '@primes/templates';
import { useEffect, useState } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { OrderDetail } from '@primes/types/sales';
import { useOrderDetailListQuery } from '@primes/hooks/sales/orderDetail/useOrderDetailListQuery';
import { RadixButton } from '@radix-ui/components';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
// import { Search } from 'lucide-react';
// import { SearchSlot } from '@primes/components/common/search/SearchSlot';

export const SalesOrderListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [masterPage, setMasterPage] = useState(0);
	const [masterData, setMasterData] = useState<OrderDetail[]>([]);
	const [masterTotalElements, setMasterTotalElements] = useState(0);
	const [masterPageCount, setMasterPageCount] = useState(0);

	const SalesOrderDetailTableColumns = [
		{
			accessorKey: 'orderCode',
			header: t('columns.orderCode'),
			size: 100,
			cell: ({ row }: any) => {
				const value = row.original.orderMaster.orderCode;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'orderDate',
			header: t('columns.orderDate'),
			size: 100,
			cell: ({ row }: any) => {
				const value = row.original.orderMaster.orderDate;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 80,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 100,
			cell: ({ row }: any) => {
				const value = row.original.orderMaster.vendorName;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{ 
			accessorKey: 'itemName', 
			header: t('columns.itemName'), 
			size: 120 

		},
		{
			accessorKey: 'orderNumber',
			header: t('columns.orderNumber'),
			size: 80,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 80,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.grossPrice'),
			size: 80,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? Number(value).toLocaleString() : '';
			},
		},
		{ accessorKey: 'isProdCmd', header: t('columns.isProdCmd'), size: 120 },
	];

	// 📌 master 테이블 페이지 변경
	const onMasterPageChange = (pagination: { pageIndex: number }) => {
		setMasterPage(pagination.pageIndex);
	};

	// For order detail
	const list = useOrderDetailListQuery({
		page: masterPage,
		size: PAGE_SIZE,
	});

	// 📌 master 테이블용 useDataTable
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		masterData,
		SalesOrderDetailTableColumns,
		PAGE_SIZE,
		masterPageCount,
		masterPage,
		masterTotalElements,
		onMasterPageChange
	);

	// 📌 API 결과 반영 - Master
	useEffect(() => {
		if (list.data?.content) {
			setMasterData(list.data.content);
			setMasterTotalElements(list.data.totalElements);
			setMasterPageCount(list.data.totalPages);
		}
	}, [list]);

	const SearchSlot = () => {
		return (
			<div className="flex content-between flex-1 ">
				<div className="flex gap-2">
					{/* <RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border  "
					>
						{tCommon('search_actions.filters.all')}
					</RadixButton>
					<RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border "
					>
						{tCommon('search_actions.filters.oneWeekAgo')}
					</RadixButton>
					<RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border "
					>
						{tCommon('search_actions.filters.oneMonthAgo')}
					</RadixButton>
					<RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border "
					>
						{tCommon('search_actions.filters.sixMonthsAgo')}
					</RadixButton> */}
				</div>
				<div className="flex ml-auto gap-2">
					<div className="flex items-center w-48 h-8 pl-2 text-sm border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-Colors-Brand-500">
						<Search className="text-gray-500 mr-2 w-4" />
						<input
							type="text"
							placeholder={tCommon('table.search.keywordSearch')}
							// value={searchQuery}
							// onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-full px-2 text-sm border-none outline-none placeholder-gray-500 focus:ring-0"
						/>
						<RadixButton className="border-l px-2 text-gray-500">
							FC
						</RadixButton>
					</div>
					<RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-700 text-white"
					>
						<Search
							size={16}
							className="text-muted-foreground text-white"
						/>
						{tCommon('table.search.searchF3')}
					</RadixButton>
					<RadixButton
						variant="outline"
						className="flex gap-1 px-2.5 py-1.5 rounded-lg text-sm items-center border "
					>
						<Download
							size={16}
							className="text-muted-foreground "
						/>
						{tCommon('search_actions.actions.download')}
					</RadixButton>
				</div>
			</div>
		);
	};
	// 	const handleSearchResults = (results: any[]) => {
	// 		console.log('Search results:', results);
	// 		alert(`검색 결과: ${results.length}개 항목 발견\n${JSON.stringify(results, null, 2)}`);
	// 	};

	// 	// Configure search form fields for this page
	// 	const searchFormFields = [
	// 		{
	// 			name: 'itemName',
	// 			label: '품명/규격',
	// 			type: 'text' as const,
	// 			placeholder: '품명을 입력하세요'
	// 		},
	// 		{
	// 			name: 'itemNumber',
	// 			label: '품번',
	// 			type: 'text' as const,
	// 			placeholder: '품번을 입력하세요'
	// 		},
	// 		{
	// 			name: 'orderNumber',
	// 			label: '수주량',
	// 			type: 'text' as const,
	// 			placeholder: '수주량을 입력하세요'
	// 		},
	// 		{
	// 			name: 'unitPrice',
	// 			label: '단가',
	// 			type: 'text' as const,
	// 			placeholder: '단가를 입력하세요'
	// 		},
	// 		{
	// 			name: 'requestDate',
	// 			label: '납기일자',
	// 			type: 'dateRange' as const
	// 		},

	// 	];

	// 	return (
	// 		<PageTemplate className="border rounded-lg">
	// 			<DatatableComponent
	// 				table={masterTable}
	// 				columns={SalesOrderDetailTableColumns}
	// 				data={masterData}
	// 				tableTitle="주문 목록"
	// 				rowCount={masterData.length}
	// 				useSearch={true}
	// 				selectedRows={selectedMasterRows}
	// 				toggleRowSelection={toggleMasterRowSelection}
	// 				searchSlot={
	// 					<SearchSlot
	// 						data={masterData}
	// 						searchFields={['itemNumber', 'itemName', 'orderNumber', 'unitPrice', 'requestDate']}
	// 						formFields={searchFormFields}
	// 						onSearchResults={handleSearchResults}
	// 					/>
	// 				}
	// 				headerOffset="345px"
	// 			/>
	// 		</PageTemplate>
	// 	);

	return (
		<PageTemplate className="border rounded-lg">
			<DatatableComponent
				table={masterTable}
				columns={SalesOrderDetailTableColumns}
				data={masterData}
				tableTitle={tCommon('pages.titles.orderList')}
				rowCount={masterData.length}
				useSearch={true}
				selectedRows={selectedMasterRows}
				toggleRowSelection={toggleMasterRowSelection}
				searchSlot={<SearchSlot />}
			/>
		</PageTemplate>
	);
};
