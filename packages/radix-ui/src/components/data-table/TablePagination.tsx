import * as React from 'react';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
} from 'lucide-react';
import { RadixIconButton } from '../IconButton';
import { useTranslation } from '@repo/i18n';

interface TablePaginationProps<TData> {
	table: any;
	selectedRows: Set<string>;
	onPageChange: (page: number) => void;
}

export function TablePagination<TData>({
	table,
	selectedRows,
	onPageChange,
}: TablePaginationProps<TData>) {
	const { t } = useTranslation('common');
	const currentPage = table.getState().pagination.pageIndex + 1;
	const pageSize = table.getState().pagination.pageSize;

	const totalRows = table.options?.rowCount ?? 0;
	const totalPages = table.getPageCount();

	const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const endRow = Math.min(currentPage * pageSize, totalRows);

	const pageNumbers = generatePageNumbers(currentPage, totalPages);

	return (
		<div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700">
			<div className="flex items-center space-x-2 w-full">
				{/* First Page */}
				<RadixIconButton
					variant="outline"
					size="2"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
					className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<ChevronsLeft className="h-5 w-5" />
				</RadixIconButton>

				{/* Prev Page */}
				<RadixIconButton
					variant="outline"
					size="2"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					className="px-3 py-1.5 flex items-center border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<ChevronLeft className="h-5 w-5" />
					{/* {t('table.pagination.prev')} */}
				</RadixIconButton>

				{/* Page Numbers */}
				<div className="flex items-center space-x-1 flex-1 justify-center">
					{pageNumbers.map((page, index) => (
						<React.Fragment key={index}>
							{page === '...' ? (
								<span className="px-3 py-1.5 text-gray-400 dark:text-gray-500">
									<MoreHorizontal className="h-5 w-5" />
								</span>
							) : (
								<RadixIconButton
									variant={
										currentPage === page
											? 'solid'
											: 'outline'
									}
									size="2"
									onClick={() =>
										table.setPageIndex(Number(page) - 1)
									}
									className={`px-3 py-1.5 text-sm font-medium rounded-md ${
										currentPage === page
											? 'bg-Colors-Brand-700 text-white'
											: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
									}`}
								>
									{page}
								</RadixIconButton>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Next Page */}
				<RadixIconButton
					variant="outline"
					size="2"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					className="px-3 py-1.5 flex items-center border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{/* {t('table.pagination.next')} */}
					<ChevronRight className="h-5 w-5" />
				</RadixIconButton>

				{/* Last Page */}
				<RadixIconButton
					variant="outline"
					size="2"
					onClick={() => table.setPageIndex(totalPages - 1)}
					disabled={!table.getCanNextPage()}
					className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<ChevronsRight className="h-5 w-5" />
				</RadixIconButton>
			</div>
		</div>
	);
}

// 내부 유틸 함수 분리
function generatePageNumbers(
	currentPage: number,
	totalPages: number
): (number | string)[] {
	const pages: (number | string)[] = [];
	const maxVisible = 5;

	if (totalPages <= maxVisible) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
		pages.push(1);

		if (currentPage > 3) pages.push('...');

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) pages.push('...');
		pages.push(totalPages);
	}

	return pages;
}
