import React from 'react';
import CheckboxHeaderCell from './CheckboxHeaderCell';
import DataTableHeaderContext, {
	HeaderContextAction,
} from './DataTableHeaderContext';
import { BASE_LEFT_OFFSET, SEQ_COL_WIDTH } from '..';

export type TableHeaderClassNames = {
	thead?: string;
	thCheckbox?: string;
	thBase?: string;
	thPinned?: string;
	dropdownItem?: string;
};

interface TableHeaderProps<TData, TValue> {
	table: any;
	selectedRows: Set<string>;
	toggleRowSelection: (rowId: string) => void;
	classNames?: TableHeaderClassNames;
	enabledActions?: HeaderContextAction[];
}

const getLeftOffset = (cells: any[], currentIndex: number) => {
	let offset = BASE_LEFT_OFFSET;
	for (let i = 0; i < currentIndex; i++) {
		if (cells[i].column.getIsPinned() === 'left') {
			offset +=
				cells[i].column.columnDef.size ||
				cells[i].column.columnDef.minSize ||
				150;
		}
	}
	return offset;
};

const getRightOffset = (headers: any[], index: number) => {
	let offset = 0;
	for (let i = headers.length - 1; i > index; i--) {
		const h = headers[i];
		if (h.column.getIsPinned() === 'right') {
			offset +=
				h.column.columnDef.size || h.column.columnDef.minSize || 150;
		}
	}
	return offset;
};

const DataTableHeader = <TData, TValue>({
	table,
	selectedRows,
	toggleRowSelection,
	classNames,
	enabledActions = [
		'sortAsc',
		'sortDesc',
		'hide',
		'pinLeft',
		'pinRight',
		'unpin',
		'reset',
	],
}: TableHeaderProps<TData, TValue>): React.ReactElement => {
	return (
		<thead className={classNames?.thead ?? ''}>
			{table.getHeaderGroups().map((headerGroup: any) => (
				<tr
					key={headerGroup.id}
					className="border-b border-gray-200 dark:border-gray-700 z-[100]"
				>
					{/* Sequence Column */}
					<th
						className={
							classNames?.thBase ??
							'text-center text-gray-500 dark:text-gray-400 px-1 bg-muted'
						}
						style={{
							position: 'sticky',
							top: 0,
							left: 0,
							width: `${SEQ_COL_WIDTH}px`,
							minWidth: `${SEQ_COL_WIDTH}px`,
							maxWidth: `${SEQ_COL_WIDTH}px`,
							zIndex: 21,
							boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
						}}
					>
						#
					</th>

					{/* Checkbox Header */}
					<CheckboxHeaderCell
						allRows={table.getRowModel().rows}
						selectedRows={selectedRows}
						toggleAllRows={(checked) => {
							table
								.getRowModel()
								.rows.forEach((row: { id: string }) => {
									const isSelected: boolean =
										selectedRows.has(row.id);
									if (checked && !isSelected)
										toggleRowSelection(row.id);
									if (!checked && isSelected)
										toggleRowSelection(row.id);
								});
						}}
						className={
							classNames?.thCheckbox ??
							'py-2 text-center text-sm text-gray-500 dark:text-gray-400'
						}
					/>

					{headerGroup.headers.map((header: any, index: number) => {
						const isPinned = header.column.getIsPinned();
						const isLeftPinned = isPinned === 'left';
						const isRightPinned = isPinned === 'right';

						let stickyStyles: React.CSSProperties = {
							position: 'sticky',
							top: 0,
							zIndex: 19,
							width: `var(--header-${header.id}-size)`,
							minWidth: `var(--header-${header.id}-size)`,
							maxWidth: `var(--header-${header.id}-size)`,
						};

						if (isLeftPinned) {
							stickyStyles = {
								...stickyStyles,
								left: getLeftOffset(headerGroup.headers, index),
								zIndex: 20,
								boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
							};
						} else if (isRightPinned) {
							stickyStyles = {
								...stickyStyles,
								right: getRightOffset(
									headerGroup.headers,
									index
								),
								zIndex: 20,
								boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.06)',
							};
						}

						return (
							<th
								key={header.id}
								className={`relative group ${classNames?.thBase ?? 'px-3 border-b border-gray-200 dark:border-gray-700 bg-muted py-2 text-sm font-medium text-gray-500 dark:text-gray-400'} ${
									isPinned
										? (classNames?.thPinned ??
											'bg-gray-100 dark:bg-gray-800')
										: ''
								} overflow-hidden whitespace-nowrap`}
								style={stickyStyles}
							>
								<DataTableHeaderContext
									header={header}
									enabledActions={enabledActions}
									classNames={classNames}
								/>

								{/* Resize Handle (Visible only on hover) */}
								<div
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									onDoubleClick={() =>
										header.column.resetSize()
									}
									className="absolute right-0 top-0 h-full w-1 cursor-col-resize
                    opacity-0 group-hover:opacity-100 bg-blue-400 dark:bg-blue-500 transition"
								/>
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
};

export default DataTableHeader;
