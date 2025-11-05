import { PageTemplate } from '@primes/templates';
import { useEffect, useState } from 'react';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PurchaseDetail } from '@primes/types/purchase/purchaseDetail';
import { usePurchaseDetailListQuery } from '@primes/hooks/purchase/purchaseDetail/usePurchaseDetailListQuery';
import { RadixButton } from '@radix-ui/components';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@repo/i18n';
import { PurchaseMasterSearchFields } from '@primes/schemas/purchase/purchaseMasterSchemas';

export const PurchaseOrdersListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [page, setPage] = useState(0);
	const [data, setData] = useState<PurchaseDetail[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const searchFields = PurchaseMasterSearchFields();

	const PurchaseOrdersDetailTableColumns = [
		{
			accessorKey: 'itemNumber',
			header: t('columns.itemNumber'),
			size: 120,
		},
		{ 
			accessorKey: 'itemName', 
			header: t('columns.itemName'), 
			size: 150 
		},
		{ 
			accessorKey: 'itemSpec', 
			header: t('columns.itemSpec'), 
			size: 100 
		},
		{
			accessorKey: 'requestDate',
			header: t('columns.requestDate'),
			size: 160,
			align: 'center',
		},
		{
			accessorKey: 'number',
			header: t('columns.purchaseNumber'),
			size: 100,
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
			cell: ({ getValue }: { getValue: () => number | null }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{ 
			accessorKey: 'netPrice', 
			header: t('columns.netPrice'), 
			size: 100,
			align: 'right',
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

	// 📌 master 테이블 페이지 변경
	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// For purchase detail
	const list = usePurchaseDetailListQuery({
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
		PurchaseOrdersDetailTableColumns,
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
				columns={PurchaseOrdersDetailTableColumns}
				data={data}
				tableTitle={tCommon('pages.purchaseOrder.list')}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedMasterRows}
				toggleRowSelection={toggleMasterRowSelection}
				searchSlot={
					<SearchSlotComponent
						fields={searchFields}
						endSlot={
							<ActionButtonsComponent
								useRemove={true}
								useEdit={true}
							/>
						}
					/>
				}
		/>
		</PageTemplate>
	);
};

export default PurchaseOrdersListPage;
