import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
// import { useMachineCheckingData } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface MachineMachineCheckingDataListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const MachineMachineCheckingDataListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<MachineMachineCheckingDataListData[]>([]);
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
			accessorKey: 'machineCode',
			header: 'machineCode',
			size: 120,
		},
		{
			accessorKey: 'machineCheckingHeadId',
			header: 'machineCheckingHeadId',
			size: 80,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value ? value.toLocaleString() : '-';
			},
		},
		{
			accessorKey: 'machineCheckingHead',
			header: 'machineCheckingHead',
			size: 150,
		},
		{
			accessorKey: 'checkValue',
			header: 'checkValue',
			size: 150,
		},
		{
			accessorKey: 'checkBy',
			header: 'checkBy',
			size: 150,
		},
		{
			accessorKey: 'checkDate',
			header: 'checkDate',
			size: 120,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value
					? new Date(value).toLocaleDateString('ko-KR')
					: '-';
			},
		},
		{
			accessorKey: 'machineName',
			header: 'machineName',
			size: 150,
		},
		{
			accessorKey: 'periodType',
			header: 'periodType',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'checkType',
			header: 'checkType',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'upLimit',
			header: 'upLimit',
			size: 150,
		},
		{
			accessorKey: 'downLimit',
			header: 'downLimit',
			size: 150,
		},
		{
			accessorKey: 'valueType',
			header: 'valueType',
			size: 150,
			cell: ({ getValue }: { getValue: () => any }) => {
				const value = getValue();
				return value || '-';
			},
		},
		{
			accessorKey: 'isPass',
			header: 'isPass',
			size: 150,
		},
		{
			accessorKey: 'shift',
			header: 'shift',
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
	// } = useMachineCheckingData({
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
				tableTitle="machine-checking-data 관리 목록"
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default MachineMachineCheckingDataListPage;
