import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
// import { useWorkCalendar } from '@primes/hooks';
import { useDataTable } from '@radix-ui/hook';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';

interface ProductionWorkCalendarListData {
	id: number;
	name?: string;
	code?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export const ProductionWorkCalendarListPage: React.FC = () => {
	const [page, setPage] = useState<number>(0);
	const [data, setData] = useState<ProductionWorkCalendarListData[]>([]);
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
			accessorKey: 'accountMon',
			header: 'accountMon',
			size: 150,
		},
		{
			accessorKey: 'workDt',
			header: 'workDt',
			size: 120,
		},
		{
			accessorKey: 'workDayHour',
			header: 'workDayHour',
			size: 150,
		},
		{
			accessorKey: 'workNightHour',
			header: 'workNightHour',
			size: 150,
		},
		{
			accessorKey: 'memo',
			header: 'memo',
			size: 200,
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
	// } = useWorkCalendar({
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
				tableTitle="work-calendar 관리 목록"
				rowCount={totalElements}
				useSearch={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={<SearchSlotComponent />}
			/>
		</PageTemplate>
	);
};

export default ProductionWorkCalendarListPage;
