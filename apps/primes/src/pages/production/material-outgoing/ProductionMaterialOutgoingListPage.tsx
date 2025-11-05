import { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useWorkingInLot } from '@primes/hooks/production/useWorkingInLot';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { materialOutgoingSearchFields } from '@primes/schemas/production/materialOutgoingSchemas';

interface ProductionMaterialOutgoingListData {
	id: number;
	outgoingCode?: string;
	requestCode?: string;
	planCode?: string;
	itemCode?: string;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	outAmt?: number;
	outUnit?: string;
	outUnitName?: string;
	outDate?: string;
	[key: string]: any;
}

export const ProductionMaterialOutgoingListPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionMaterialOutgoingListData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [searchParams, setSearchParams] = useState<Record<string, any>>({});

	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'lotNo',
			header: tDataTable('columns.lotNo', 'Lot No'),
			size: 150,
		},
		{
			accessorKey: 'inputDate',
			header: tDataTable('columns.outDate', '투입일자'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'itemNumber',
			header: tDataTable('columns.itemNumber', '품번'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'itemName',
			header: tDataTable('columns.itemName', '품명'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'itemSpec',
			header: tDataTable('columns.itemSpec', '규격'),
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'inLotNo',
			header: tDataTable('columns.inLotNo', '투입로트'),
			size: 150,
		},
		{
			accessorKey: 'inItemNumber',
			header: tDataTable('columns.inItemNumber', '투입품번'),
			size: 150,
			cell: ({
				row,
			}: {
				row: { original: { lotMaster?: { itemNumber?: string } } };
			}) => {
				const value = row.original.lotMaster?.itemNumber;
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'inItemName',
			header: tDataTable('columns.inItemName', '투입품명'),
			size: 150,
			cell: ({
				row,
			}: {
				row: { original: { lotMaster?: { itemName?: string } } };
			}) => {
				const value = row.original.lotMaster?.itemName;
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'inItemSpec',
			header: tDataTable('columns.inItemSpec', '투입품규격'),
			size: 150,
			cell: ({
				row,
			}: {
				row: { original: { lotMaster?: { itemSpec?: string } } };
			}) => {
				const value = row.original.lotMaster?.itemSpec;
				return value ? value : '-';
			},
		},
		{
			accessorKey: 'useAmount',
			header: tDataTable('columns.outAmt', '투입수량'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'useWeight',
			header: tDataTable('columns.outWeight', '투입중량'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'lotUnit',
			header: tDataTable('columns.outUnit', '투입단위'),
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// 검색 핸들러
	const handleSearch = (searchData: Record<string, any>) => {
		setSearchParams(searchData);
		setPage(0); // 검색시 첫 페이지로 리셋
		// TODO: API 호출에 검색 파라미터 전달
	};

	// 번역된 검색 필드 생성 (dataTable namespace 사용)
	const translatedSearchFields = materialOutgoingSearchFields.map(
		(field) => ({
			...field,
			label: tDataTable(`columns.${field.label}` as any) || field.label,
			placeholder:
				tDataTable(`columns.${field.placeholder}` as any) ||
				field.placeholder ||
				'',
		})
	);

	// API 호출
	const { list: apiData } = useWorkingInLot({
		page: page,
		size: DEFAULT_PAGE_SIZE,
	});

	useEffect(() => {
		if (apiData.data) {
			if (apiData.data.content) {
				// 페이지네이션 응답 처리
				setData(apiData.data.content);
				setTotalElements(apiData.data.totalElements || 0);
				setPageCount(apiData.data.totalPages || 0);
			} else {
				setData([]);
				setTotalElements(0);
				setPageCount(0);
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
		<PageTemplate firstChildWidth="30%" className="border rounded-lg">
			<DatatableComponent
				table={table}
				columns={tableColumns}
				data={data}
				tableTitle="자재 투입 현황"
				enableSingleSelect={true}
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={
					<SearchSlotComponent
						fields={translatedSearchFields}
						onSearch={handleSearch}
					/>
				}
			/>
		</PageTemplate>
	);
};

export default ProductionMaterialOutgoingListPage;
