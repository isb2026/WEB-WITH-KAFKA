import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
// import { useWorkingBuffer } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface ProductionWorkingBufferListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const ProductionWorkingBufferListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionWorkingBufferListData[]>([]);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	const DEFAULT_PAGE_SIZE = 30;

	const tableColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'commandNo',
			header: 'commandNo',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'warehouseMasterId',
			header: 'warehouseMasterId',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'lotNo',
			header: 'lotNo',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'itemNo',
			header: 'itemNo',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'lineNo',
			header: 'lineNo',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'progNo',
			header: 'progNo',
			size: 100,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'inputNum',
			header: 'inputNum',
			size: 100,
		},
		{
			accessorKey: 'usedNum',
			header: 'usedNum',
			size: 100,
		},
		{
			accessorKey: 'restNum',
			header: 'restNum',
			size: 100,
		},
		{
			accessorKey: 'returnNum',
			header: 'returnNum',
			size: 100,
		},
		{
			accessorKey: 'returnDt',
			header: 'returnDt',
			size: 120,
		},
		{
			accessorKey: 'unit',
			header: 'unit',
			size: 150,
		},
		{
			accessorKey: 'inputDt',
			header: 'inputDt',
			size: 120,
		},
		{
			accessorKey: 'inputorName',
			header: 'inputorName',
			size: 150,
		},
		{
			accessorKey: 'isExhaust',
			header: 'isExhaust',
			size: 150,
		},
	];

	const onPageChange = (pagination: { pageIndex: number }) => {
		setPage(pagination.pageIndex);
	};

	// API 호출
	// const {
	// 	data: apiData,
	// 	isLoading,
	// 	error,
	// } = useWorkingBuffer({
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
				tableTitle="working-buffer 관리 목록"
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default ProductionWorkingBufferListPage;
