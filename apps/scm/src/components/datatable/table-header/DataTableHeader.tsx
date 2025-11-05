import React from 'react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';

export interface DataTableHeaderProps<TData> {
	headerGroups: HeaderGroup<TData>[];
	selectedRows?: Set<string>;
	toggleRowSelection?: (rowId: string) => void;
	enableSorting?: boolean;
}

export const DataTableHeader = <TData,>({
	headerGroups,
	selectedRows,
	toggleRowSelection,
	enableSorting = true,
}: DataTableHeaderProps<TData>) => {
	return (
		<thead className="bg-gray-100 sticky top-0 z-10">
			{headerGroups.map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<th
							key={header.id}
							className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200"
							style={{
								width: header.getSize()
									? `${header.getSize()}px`
									: 'auto',
							}}
						>
							{header.isPlaceholder ? null : (
								<div
									className={`flex items-center gap-1 ${
										enableSorting &&
										header.column.getCanSort()
											? 'cursor-pointer select-none'
											: ''
									}`}
									onClick={
										enableSorting
											? header.column.getToggleSortingHandler()
											: undefined
									}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
									{enableSorting && (
										<span className="text-xs">
											{{
												asc: ' 🔼',
												desc: ' 🔽',
											}[
												header.column.getIsSorted() as string
											] ?? null}
										</span>
									)}
								</div>
							)}
						</th>
					))}
				</tr>
			))}
		</thead>
	);
};

export default DataTableHeader;
