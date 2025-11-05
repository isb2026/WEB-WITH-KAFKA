import { PageTemplate } from '@primes/templates';
import { useEffect, useState } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ShippingRequestDetail } from '@primes/types/sales/shippingRequestDetail';
import { useShippingRequestDetailListQuery } from '@primes/hooks/sales/shippingRequestDetail/useShippingRequestDetailListQuery';
import { RadixButton } from '@radix-ui/components';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';

export const SalesShippingRequestListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [page, setPage] = useState(0);
	const [data, setData] = useState<ShippingRequestDetail[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	const SalesShippingRequestDetailTableColumns = [
		{
			accessorKey: 'shippingRequestCode',
			header: t('columns.shippingRequestCode'),
			size: 120,
			cell: ({ row }: any) => {
				const value = row.original.shippingRequestMaster.shippingRequestCode;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 120,
			cell: ({ row }: any) => {
				const value = row.original.shippingRequestMaster.requestDate;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 120,
			cell: ({ row }: any) => {
				const value = row.original.shippingRequestMaster.vendorName;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
			minSize: 100,
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 200,
			minSize: 160,
		},
		{
			accessorKey: 'itemSpec',
			header: t('columns.itemSpec'),
			size: 150,
			minSize: 120,
		},
		{
			accessorKey: 'requestNumber',
			header: t('columns.requestQuantity'),
			size: 120,
			minSize: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'requestUnit',
			header: t('columns.requestUnit'),
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 120,
			minSize: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
			size: 120,
			minSize: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.grossPrice'),
			size: 120,
			minSize: 100,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'currencyUnit',
			header: t('columns.currencyUnit'),
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'memo',
			header: t('columns.memo'),
			size: 150,
			minSize: 120,
		},
	];

	// 📌 master 테이블 페이지 변경
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// For shipping request detail
	const list = useShippingRequestDetailListQuery({
		page: page,
		size: PAGE_SIZE,
	});

	// 📌 master 테이블용 useDataTable
	const {
		table: masterTable,
		toggleRowSelection: toggleMasterRowSelection,
		selectedRows: selectedMasterRows,
	} = useDataTable(
		data,
		SalesShippingRequestDetailTableColumns,
		PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	// 📌 API 결과 반영 - Master
	useEffect(() => {
		if (list.data?.content) {
			setData(list.data.content);
			setTotalElements(list.data.totalElements);
			setPageCount(list.data.totalPages);
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

	return (
		<PageTemplate className="border rounded-lg">
			<DatatableComponent
				table={masterTable}
				columns={SalesShippingRequestDetailTableColumns}
				data={data}
				tableTitle={tCommon('pages.shippingRequest.list')}
				rowCount={data.length}
				useSearch={true}
				selectedRows={selectedMasterRows}
				toggleRowSelection={toggleMasterRowSelection}
				searchSlot={<SearchSlot />}
			/>
		</PageTemplate>
	);
};
