import React from 'react';
import { Table } from '@tanstack/react-table';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

export interface TablePaginationProps<TData> {
	table: Table<TData>;
	selectedRows?: Set<string>;
	onPageChange?: (pageIndex: number) => void;
}

export const TablePagination = <TData,>({
	table,
	selectedRows,
	onPageChange,
}: TablePaginationProps<TData>) => {
	return (
		<div className="flex items-center justify-between p-3 border-t bg-gray-50">
			<div className="flex items-center gap-2 text-sm text-gray-700">
				<span>
					{table.getState().pagination.pageIndex + 1} /{' '}
					{table.getPageCount()}
				</span>
				<span>페이지</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					onClick={() => {
						table.setPageIndex(0);
						onPageChange?.(0);
					}}
					disabled={!table.getCanPreviousPage()}
					className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
				>
					<ChevronsLeft size={16} />
				</button>
				<button
					onClick={() => {
						table.previousPage();
						onPageChange?.(
							table.getState().pagination.pageIndex - 1
						);
					}}
					disabled={!table.getCanPreviousPage()}
					className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
				>
					<ChevronLeft size={16} />
				</button>
				<button
					onClick={() => {
						table.nextPage();
						onPageChange?.(
							table.getState().pagination.pageIndex + 1
						);
					}}
					disabled={!table.getCanNextPage()}
					className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
				>
					<ChevronRight size={16} />
				</button>
				<button
					onClick={() => {
						const lastPage = table.getPageCount() - 1;
						table.setPageIndex(lastPage);
						onPageChange?.(lastPage);
					}}
					disabled={!table.getCanNextPage()}
					className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
				>
					<ChevronsRight size={16} />
				</button>
			</div>
			<div className="flex items-center gap-2">
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}
					className="px-2 py-1 border rounded text-sm"
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							{pageSize}개씩
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default TablePagination;
