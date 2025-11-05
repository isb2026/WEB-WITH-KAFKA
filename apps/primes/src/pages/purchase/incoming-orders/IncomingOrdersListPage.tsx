import { PageTemplate } from '@primes/templates';
import { useEffect, useState } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { IncomingDetail } from '@primes/types/purchase/incomingDetail';
import { useIncomingDetailListQuery } from '@primes/hooks/purchase/incomingDetail/useIncomingDetailListQuery';
import { RadixButton } from '@radix-ui/components';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { commaNumber } from '@repo/utils';

export const IncomingOrdersListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [page, setPage] = useState(0);
	const [data, setData] = useState<IncomingDetail[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	const IncomingOrdersDetailTableColumns = [
		{
			accessorKey: 'incomingCode',
			header: t('columns.incomingCode'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				return <div>{row.original.incomingMaster.incomingCode}</div>;
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
			size: 100,
		},
		{
			accessorKey: 'lotNo',
			header: t('columns.lotNo'),
			size: 100,
		},
		{
			accessorKey: 'number',
			header: t('columns.incomingQuantity'),
			size: 120,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.number)}</div>;
			},
		},
		{
			accessorKey: 'unitPrice',
			header: t('columns.unitPrice'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.unitPrice)}</div>;
			},
		},
		{
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
			size: 100,
			cell: ({ row }: { row: any }) => {
				return <div>{commaNumber(row.original.netPrice)}</div>;
			},
		},
		{
			accessorKey: 'grossPrice',
			header: t('columns.totalIncomingAmount'),
			size: 100,
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
		{
			accessorKey: 'memo',
			header: t('columns.memo'),
			size: 160,
		},
	];

	// 📌 master 테이블 페이지 변경
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// For incoming detail
	const list = useIncomingDetailListQuery({
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
		IncomingOrdersDetailTableColumns,
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
				{/* <div className="flex gap-2">
					<RadixButton
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
					</RadixButton>
				</div> */}
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
				columns={IncomingOrdersDetailTableColumns}
				data={data}
				tableTitle={tCommon('pages.incoming.list')}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedMasterRows}
				toggleRowSelection={toggleMasterRowSelection}
				searchSlot={<SearchSlot />}
			/>
		</PageTemplate>
	);
};

export default IncomingOrdersListPage;
