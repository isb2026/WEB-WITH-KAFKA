import { useState, useEffect } from 'react';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
// import { useMaterialRequest } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { materialRequestSearchFields } from '@primes/schemas/production/materialRequestSchemas';

interface ProductionMaterialRequestListData {
	id: number;
	requestCode?: string;
	planCode?: string;
	itemNo?: number;
	itemNumber?: string;
	itemName?: string;
	itemSpec?: string;
	requestAmt?: number;
	requestUnit?: string;
	requestUnitName?: string;
	requestDate?: string;
	[key: string]: any;
}

export const ProductionMaterialRequestListPage: React.FC = () => {
	const { t } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionMaterialRequestListData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);
	const [searchParams, setSearchParams] = useState<Record<string, any>>({});

	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'requestCode',
			header: tDataTable('columns.requestCode', '요청코드'),
			size: 120,
		},
		{
			accessorKey: 'planCode',
			header: tDataTable('columns.planCode', '계획코드'),
			size: 120,
		},
		{
			accessorKey: 'itemNo',
			header: tDataTable('columns.itemNo', '품목번호'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'itemNumber',
			header: tDataTable('columns.itemNumber', '품번'),
			size: 150,
		},
		{
			accessorKey: 'itemName',
			header: tDataTable('columns.itemName', '품명'),
			size: 150,
		},
		{
			accessorKey: 'itemSpec',
			header: tDataTable('columns.itemSpec', '규격'),
			size: 150,
		},
		{
			accessorKey: 'requestAmt',
			header: tDataTable('columns.requestAmt', '요청수량'),
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'requestUnit',
			header: tDataTable('columns.requestUnit', '요청단위'),
			size: 120,
		},
		{
			accessorKey: 'requestUnitName',
			header: tDataTable('columns.requestUnitName', '요청단위명'),
			size: 120,
		},
		{
			accessorKey: 'requestDate',
			header: tDataTable('columns.requestDate', '요청일자'),
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

	// 검색 핸들러
	const handleSearch = (searchData: Record<string, any>) => {
		setSearchParams(searchData);
		setPage(0); // 검색시 첫 페이지로 리셋
		console.log('자재요청 검색 조건:', searchData);
		// TODO: API 호출에 검색 파라미터 전달
	};

	// 번역된 검색 필드 생성 (dataTable namespace 사용)
	const translatedSearchFields = materialRequestSearchFields.map((field) => ({
		...field,
		label: tDataTable(`columns.${field.label}` as any) || field.label,
		placeholder:
			tDataTable(`columns.${field.placeholder}` as any) ||
			field.placeholder ||
			'',
	}));

	// API 호출
	// const {
	// 	data: apiData,
	// 	isLoading,
	// 	error,
	// } = useMaterialRequest({
	// 	page: page,
	// 	size: DEFAULT_PAGE_SIZE,
	// });

	// useEffect(() => {
	// 	if (apiData) {
	// 		if (apiData.content) {
	// 			// 페이지네이션 응답 처리
	// 			setData(apiData.content);
	// 			setTotalElements(apiData.totalElements || 0);
	// 			setPageCount(apiData.totalPages || 0);
	// 		} else if (Array.isArray(apiData)) {
	// 			// 배열 형태의 응답 처리
	// 			setData(apiData);
	// 			setTotalElements(apiData.length);
	// 			setPageCount(Math.ceil(apiData.length / DEFAULT_PAGE_SIZE));
	// 		}
	// 	}
	// }, [apiData]);

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
				tableTitle="자재요청 관리 목록"
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

export default ProductionMaterialRequestListPage;
