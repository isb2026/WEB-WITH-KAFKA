import { PageTemplate } from '@primes/templates';
import { useEffect, useState } from 'react';
import { useDataTable } from '@radix-ui/hook';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { StatementDetail } from '@primes/types/sales/statementDetail';
import { useStatementDetailListQuery } from '@primes/hooks/sales/statementDetail/useStatementDetailListQuery';
import { RadixButton } from '@radix-ui/components';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';

export const SalesStatementListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [page, setPage] = useState(0);
	const [data, setData] = useState<StatementDetail[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	const SalesStatementDetailTableColumns = [
		{
			accessorKey: 'statementCode',
			header: t('columns.statementCode'),
			size: 100,
			cell: ({ row }: any) => {
				const value = row.original.statementMaster?.statementCode;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 80,
			cell: ({ row }: any) => {
				const value = row.original.statementMaster?.requestDate;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{
			accessorKey: 'vendorName',
			header: t('columns.vendorName'),
			size: 100,
			cell: ({ row }: any) => {
				const value = row.original.statementMaster?.vendorName;
				return value ? value : '';
			},
		},
		{
			accessorKey: 'itemName',
			header: t('columns.itemName'),
			size: 120,
		},
		{
			accessorKey: 'statementNumber',
			header: t('columns.statementQuantity'),
			size: 80,
			enableSummary: true,
			cell: ({ getValue }: any) => {
				const value = getValue();
				return value ? value.toLocaleString() : '';
			},
		},
		{
			accessorKey: 'statementUnit',
			header: t('columns.statementUnit'),
			size: 80,
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
			accessorKey: 'netPrice',
			header: t('columns.netPrice'),
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
			size: 80,
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

	// For statement detail
	const list = useStatementDetailListQuery({
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
		SalesStatementDetailTableColumns,
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
	}, [list.data]); // list 전체가 아닌 list.data만 의존성으로 사용

	// 📌 컴포넌트 마운트 시 데이터 초기화 및 강제 리페치
	useEffect(() => {
		// 페이지 진입 시 항상 최신 데이터를 가져오도록 refetch 호출
		if (list.refetch) {
			list.refetch();
		}
	}, []); // 컴포넌트 마운트 시에만 실행

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
				columns={SalesStatementDetailTableColumns}
				data={data}
				tableTitle={tCommon('pages.statement.list')}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedMasterRows}
				toggleRowSelection={toggleMasterRowSelection}
				searchSlot={<SearchSlot />}
			/>
		</PageTemplate>
	);
};

export default SalesStatementListPage;
