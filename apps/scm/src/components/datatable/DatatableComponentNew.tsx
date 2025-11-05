import React, { useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	ColumnDef,
	Row,
	SortingState,
	PaginationState,
} from '@tanstack/react-table';
import { DataTableHeader } from './table-header';
import { DataTableBody } from './table-body';
import { TableControls } from './table-controls';
import { TablePagination } from './table-pagination';

interface DatatableComponentProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	tableTitle?: string;
	rowCount?: number;
	useSearch?: boolean;
	selectedRows?: Set<string>;
	toggleRowSelection?: (rowId: string) => void;
	actionButtons?: React.ReactNode;
	searchSlot?: React.ReactNode;
	defaultPageSize?: number;
	headerOffset?: string;
	enableSingleSelect?: boolean;
}

export const DatatableComponent = <T extends Record<string, any>>({
	data,
	columns,
	tableTitle,
	rowCount = 0,
	useSearch = false,
	selectedRows,
	toggleRowSelection,
	actionButtons,
	searchSlot,
	defaultPageSize = 10,
	headerOffset = '200px',
	enableSingleSelect = false,
}: DatatableComponentProps<T>) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: defaultPageSize,
	});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			pagination,
		},
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const handleRowClick = (row: Row<T>) => {
		// DataTableBody에서 처리됨
	};

	return (
		<div
			className="flex flex-col overflow-hidden relative w-full"
			style={{ height: `calc(100vh - ${headerOffset})` }}
		>
			{/* 테이블 컨트롤 */}
			<div className="flex-shrink-0">
				<TableControls
					tableTitle={tableTitle}
					rowCount={rowCount}
					actionButtons={actionButtons}
					searchSlot={searchSlot}
					useSearch={useSearch}
				/>
			</div>

			{/* 테이블 */}
			<div className="relative flex-1 overflow-hidden w-full">
				<div className="relative overflow-x-auto overflow-y-auto h-full w-full">
					<table className="w-full divide-y divide-gray-200">
						<DataTableHeader
							headerGroups={table.getHeaderGroups()}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							enableSorting={true}
						/>
						<DataTableBody
							rows={table.getRowModel().rows}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							enableSingleSelect={enableSingleSelect}
							onRowClick={handleRowClick}
						/>
					</table>
				</div>
			</div>

			{/* 페이지네이션 */}
			<TablePagination
				table={table}
				selectedRows={selectedRows}
				onPageChange={(pageIndex) => {
					// 페이지 변경 시 추가 로직이 필요하면 여기에 구현
				}}
			/>
		</div>
	);
};

export default DatatableComponent;
