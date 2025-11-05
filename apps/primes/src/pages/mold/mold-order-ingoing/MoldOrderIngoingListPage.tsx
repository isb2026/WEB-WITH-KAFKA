import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useMoldOrderIngoing } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { useTranslation } from '@repo/i18n';
import { MoldOrderIngoingDto } from '@primes/types/mold';

export const MoldOrderIngoingListPage: React.FC = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MoldOrderIngoingDto[]>([]);
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
			accessorKey: 'moldOrderDetailId',
			header: t('columns.moldOrderDetailId'),
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'accountMonth',
			header: t('columns.accountMonth'),
			size: 150,
		},
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
		{
			accessorKey: 'inMonth',
			header: t('columns.inMonth'),
			size: 150,
		},
		{
			accessorKey: 'inNum',
			header: t('columns.inNum'),
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
			accessorKey: 'inAmount',
			header: t('columns.inAmount'),
			size: 120,
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
			accessorKey: 'auditBy',
			header: t('columns.auditBy'),
			size: 150,
		},
		{
			accessorKey: 'auditDate',
			header: t('columns.auditDate'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'isPass',
			header: t('columns.isPass'),
			size: 150,
		},
		{
			accessorKey: 'moldSheetImg',
			header: t('columns.moldSheetImg'),
			size: 200,
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
	} = useMoldOrderIngoing({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData) {
			if (apiData.data) {
				// CommonResponseListMoldOrderIngoingDto 응답 처리
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
				tableTitle={tCommon('pages.mold.orderIngoing.list')}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default MoldOrderIngoingListPage;
