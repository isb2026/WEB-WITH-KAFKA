import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldPriceChangeHistory } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldPriceChangeHistoryDto } from '@primes/types/mold';

export const MoldPriceChangeHistoryListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldPriceChangeHistoryDto[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'isUse',
			header: t('columns.isUse'),
			size: 150,
		},
		{
			accessorKey: 'moldMasterId',
			header: t('columns.moldId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'vendorId',
			header: t('columns.vendorId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'itemId',
			header: t('columns.itemId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'progressId',
			header: t('columns.progressId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'moldPrice',
			header: t('columns.moldPrice'),
			size: 100,
		},
		{
			accessorKey: 'applyDate',
			header: t('columns.applyDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'createdBy',
			header: t('columns.createdBy'),
			size: 120,
		},
		{
			accessorKey: 'createdAt',
			header: t('columns.createdAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'updatedBy',
			header: t('columns.updatedBy'),
			size: 120,
		},
		{
			accessorKey: 'updatedAt',
			header: t('columns.updatedAt'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	const {
		list: { data: apiData, isLoading, error },
	} = useMoldPriceChangeHistory({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data) {
				// CommonResponseListMoldPriceChangeHistoryDto 응답 처리
				setData(apiData.data);
				setTotalElements(apiData.data.length);
				setPageCount(
					Math.ceil(apiData.data.length / DEFAULT_PAGE_SIZE)
				);
			} else if (Array.isArray(apiData)) {
				// 배열 형태의 응답 처리
				setData(apiData);
				setTotalElements(apiData.length);
				setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
			}
		}
	}, [apiData]);

	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		tableColumns,
		DEFAULT_PAGE_SIZE,
		pageCount,
		page,
		totalElements,
		onPageChange
	);

	return (
		<PageTemplate
			firstChildWidth="30%"
			className="border rounded-lg h-full"
		>
			<DatatableComponent
				table={table}
				columns={tableColumns}
				data={data}
				tableTitle={tCommon('pages.mold.priceChange.list')}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default MoldPriceChangeHistoryListPage;
