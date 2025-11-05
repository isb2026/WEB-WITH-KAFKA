import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
// import { useWorkingInLot } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface ProductionWorkingInLotListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const ProductionWorkingInLotListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionWorkingInLotListData[]>([]);
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
			accessorKey: 'workingDetailId',
			header: 'workingDetailId',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workingDetail',
			header: 'workingDetail',
			size: 150,
		},
		{
			accessorKey: 'workingBufferId',
			header: 'workingBufferId',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'workingBuffer',
			header: 'workingBuffer',
			size: 150,
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
			accessorKey: 'itemId',
			header: 'itemId',
			size: 80,
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
			accessorKey: 'inLotNo',
			header: 'inLotNo',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'jobType',
			header: 'jobType',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'lotNum',
			header: 'lotNum',
			size: 100,
		},
		{
			accessorKey: 'useNum',
			header: 'useNum',
			size: 100,
		},
		{
			accessorKey: 'restNum',
			header: 'restNum',
			size: 100,
		},
		{
			accessorKey: 'inputDt',
			header: 'inputDt',
			size: 120,
		},
		{
			accessorKey: 'lotUnit',
			header: 'lotUnit',
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
	// } = useWorkingInLot({
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
				tableTitle="working-in-lot 관리 목록"
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default ProductionWorkingInLotListPage;
