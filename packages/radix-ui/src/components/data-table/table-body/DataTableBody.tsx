import React, { memo, useMemo } from 'react';
import * as ReactTable from '@tanstack/react-table';
const flexRender = (ReactTable as any).flexRender || (() => null);
import {
	Editable,
	EditableArea,
	EditablePreview,
	EditableInput,
} from '@radix-ui/components';
import { BASE_LEFT_OFFSET, CHECKBOX_COL_WIDTH, SEQ_COL_WIDTH } from '..';
import { AddRowFeature } from './AddRowFeature';

export type TableBodyClassNames = {
	tbody?: string;
	tr?: string;
	tdCheckbox?: string;
	tdBase?: string;
	tdPinned?: string;
	empty?: string;
};

interface TableBodyProps<TData> {
	table: any;
	selectedRows: Set<string>;
	toggleRowSelection: (rowId: string) => void;
	useEditable?: boolean;
	editingCell?: { rowIndex: number; columnId: string } | null;
	onCellEdit?: (rowIndex: number, columnId: string) => void;
	onCellSubmit?: (rowIndex: number, columnId: string, value: string) => void;
	onCellCancel?: () => void;
	onTabNavigation?: (
		currentRowIndex: number,
		currentColumnId: string,
		direction: 'next' | 'prev'
	) => void;
	classNames?: TableBodyClassNames;
	useSummary?: boolean;
	rowClassName?: (row: { original: TData }) => string;
	// Add row feature props
	useAddRowFeature?: boolean;
	onAddRow?: (newRow: Partial<TData>) => void;
	triggerAddRow?: boolean;
	onGetAddRowData?: () => Partial<TData>[];
	onAddRowDataChange?: (data: Partial<TData>[]) => void;
	triggerClearAddRow?: boolean;
	defaultRowValues?: Partial<TData>;
	// Column field types for custom input types in AddRowFeature
	columnFieldTypes?: Record<string, {
		type: 'text' | 'select' | 'date' | 'number';
		options?: { label: string; value: string }[];
		align?: 'left' | 'center' | 'right';
	}>;
	// Search dialog component
	searchDialog?: React.ComponentType<any>;
	// Row click functionality
	onRowClick?: (row: TData, rowId: string) => void;
}

// Non-editable columns
const nonEditableColumns = [
	'id',
	'date',
	'created_at',
	'updated_at',
	'createdat',
	'updatedat',
	'createddate',
	'updateddate',
];
const isColumnEditable = (columnId: string) =>
	!nonEditableColumns.includes(columnId.toLowerCase());

// Helper function to calculate left offset (same as header)
const getLeftOffset = (headers: any[], currentIndex: number) => {
	let offset = BASE_LEFT_OFFSET;
	for (let i = 0; i < currentIndex; i++) {
		if (headers[i].column.getIsPinned() === 'left') {
			offset +=
				headers[i].column.columnDef.size ||
				headers[i].column.columnDef.minSize ||
				150;
		}
	}
	return offset;
};

// Helper function to calculate right offset (same as header)
const getRightOffset = (headers: any[], currentIndex: number) => {
	let offset = 0;
	for (let i = currentIndex + 1; i < headers.length; i++) {
		if (headers[i].column.getIsPinned() === 'right') {
			offset +=
				headers[i].column.columnDef.size ||
				headers[i].column.columnDef.minSize ||
				150;
		}
	}
	return offset;
};

const EditableCell = React.memo(
	({
		value,
		rowIndex,
		columnId,
		isEditing,
		children,
		onCellEdit,
		onCellSubmit,
		onCellCancel,
		onTabNavigation,
		useEditable,
	}: any) => {
		const inputRef = React.useRef<HTMLInputElement>(null);
		const committedRef = React.useRef(false);

		const handleCommit = (newValue: string) => {
			if (!committedRef.current) {
				committedRef.current = true;
				onCellSubmit?.(rowIndex, columnId, newValue);
			}
		};

		const handleKeyDown = (
			event: React.KeyboardEvent<HTMLInputElement>
		) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				handleCommit(event.currentTarget.value);
			} else if (event.key === 'Tab') {
				event.preventDefault();
				handleCommit(event.currentTarget.value);
				const direction = event.shiftKey ? 'prev' : 'next';
				onTabNavigation?.(rowIndex, columnId, direction);
			} else if (event.key === 'Escape') {
				committedRef.current = true;
				onCellCancel?.();
			}
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
			handleCommit(e.currentTarget.value);

		const canEdit = useEditable && isColumnEditable(columnId);
		if (!canEdit) return <>{children}</>;

		return (
			<Editable
				defaultValue={value}
				editing={isEditing}
				onEdit={() => {
					committedRef.current = false;
					onCellEdit?.(rowIndex, columnId);
					setTimeout(() => inputRef.current?.focus(), 0);
				}}
				onSubmit={handleCommit}
				onCancel={onCellCancel}
				triggerMode="dblclick"
				className="w-full"
			>
				<EditableArea>
					<EditablePreview className="w-full h-[20px] px-0 py-0 border-transparent flex items-center" />
					<EditableInput
						ref={inputRef}
						className="w-full h-[20px] px-1 text-sm outline-none border-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-600 dark:focus:border-blue-500"
						onKeyDown={handleKeyDown}
						onBlur={handleBlur}
					/>
				</EditableArea>
			</Editable>
		);
	}
);

export const DataTableBody = memo(function DataTableBody<TData>({
	table,
	selectedRows,
	toggleRowSelection,
	useEditable = false,
	editingCell,
	onCellEdit,
	onCellSubmit,
	onCellCancel,
	onTabNavigation,
	classNames,
	useSummary = false,
	rowClassName,
	useAddRowFeature = false,
	onAddRow,
	triggerAddRow = false,
	onGetAddRowData,
	onAddRowDataChange,
	triggerClearAddRow = false,
	defaultRowValues,
	columnFieldTypes,
	searchDialog,
	onRowClick,
}: TableBodyProps<TData>) {
	const rows = table.getRowModel().rows;
	const columns = table.getAllColumns();

	// Add row state
	const [isAddingRow, setIsAddingRow] = React.useState(false);
	const [addRowRows, setAddRowRows] = React.useState<Partial<TData>[]>([]);

	const summary = useSummary
		? useMemo(() => {
			const s: Record<string, number> = {};
			rows.forEach((row: any) => {
				row.getVisibleCells().forEach((cell: any) => {
					const colDef = cell.column.columnDef;
					if (colDef.enableSummary) {
						const key = cell.column.id;
						const val = Number(cell.getValue()) || 0;
						s[key] = (s[key] || 0) + val;
					}
				});
			});
			return s;
		}, [rows])
		: {};

	return (
		<>
			<tbody className={classNames?.tbody ?? 'bg-white dark:bg-gray-900'}>
				{rows.map((row: any, rowIndex: number) => {
					const isSelected = selectedRows.has(row.id);
					const pageSize = table.getState().pagination.pageSize ?? 0;
					const currentPage =
						table.getState().pagination?.pageIndex ?? 0;

					return (
						<tr
							key={row.id}
							className={
								classNames?.tr ??
								`border-b border-gray-300 dark:border-gray-700 ${isSelected
									? 'bg-blue-50 dark:bg-blue-900/20'
									: 'bg-white dark:bg-gray-900'
								} hover:bg-gray-100 dark:hover:bg-gray-800 ${onRowClick ? 'cursor-pointer' : ''
								} ${rowClassName
									? rowClassName({
										original: row.original,
									})
									: ''
								}`
							}
							onClick={() => onRowClick?.(row.original, row.id)}
						>
							{/* Sequence Cell */}
							<td
								style={{
									position: 'sticky',
									left: 0,
									width: `${SEQ_COL_WIDTH}px`,
									minWidth: 'max-content',
									zIndex: 10,
									boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
								}}
								className="py-3 px-2 text-sm font-medium text-center text-gray-900 dark:text-gray-100 bg-muted"
							>
								{pageSize * currentPage + rowIndex + 1}
							</td>

							{/* Checkbox Cell */}
							<td
								style={{
									position: 'sticky',
									left: `${SEQ_COL_WIDTH}px`,
									width: `${CHECKBOX_COL_WIDTH}px`,
									minWidth: `${CHECKBOX_COL_WIDTH}px`,
									maxWidth: `${CHECKBOX_COL_WIDTH}px`,
									zIndex: 10,
									boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
								}}
								className="py-3 text-center bg-muted"
							>
								<input
									type="checkbox"
									checked={isSelected}
									onChange={() => toggleRowSelection(row.id)}
									onClick={(e) => e.stopPropagation()}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
								/>
							</td>

							{row
								.getVisibleCells()
								.map((cell: any, index: number) => {
									const isPinned = cell.column.getIsPinned();
									const isLeftPinned = isPinned === 'left';
									const isRightPinned = isPinned === 'right';
									const align =
										cell.column.columnDef.align ?? 'left';

									// pinned column styles
									let stickyStyles: React.CSSProperties = {
										width: `var(--col-${cell.column.id}-size)`,
										minWidth: `var(--col-${cell.column.id}-size)`,
										maxWidth: `var(--col-${cell.column.id}-size)`,
										textAlign: align,
									};

									if (isLeftPinned) {
										// Find the correct header index for this cell
										const allHeaders =
											table.getHeaderGroups()[0].headers;
										const headerIndex =
											allHeaders.findIndex(
												(header: any) =>
													header.id === cell.column.id
											);
										const leftOffset = getLeftOffset(
											allHeaders,
											headerIndex
										);
										stickyStyles = {
											...stickyStyles,
											position: 'sticky',
											left: leftOffset,
											top: 0,
											zIndex: 10,
											boxShadow:
												'2px 0 4px rgba(0, 0, 0, 0.06)',
										};
									} else if (isRightPinned) {
										// Find the correct header index for this cell
										const allHeaders =
											table.getHeaderGroups()[0].headers;
										const headerIndex =
											allHeaders.findIndex(
												(header: any) =>
													header.id === cell.column.id
											);
										const rightOffset = getRightOffset(
											allHeaders,
											headerIndex
										);
										stickyStyles = {
											...stickyStyles,
											position: 'sticky',
											right: rightOffset,
											top: 0,
											zIndex: 10,
											boxShadow:
												'-2px 0 4px rgba(0, 0, 0, 0.06)',
										};
									}

									const cellValue =
										cell.getValue()?.toString() || '';
									const isEditing =
										editingCell?.rowIndex === rowIndex &&
										editingCell?.columnId ===
										cell.column.id;

									return (
										<td
											key={cell.id}
											className={`${
												classNames?.tdBase ??
												'py-1 px-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 overflow-hidden text-ellipsis border-b border-gray-300 dark:border-gray-700'
											} ${
												isPinned
													? (classNames?.tdPinned ??
														'bg-gray-50 dark:bg-gray-800')
													: ''
												} ${useEditable ? 'cursor-text' : 'cursor-default'}`}
											style={stickyStyles}
										>
											<EditableCell
												value={cellValue}
												rowIndex={rowIndex}
												columnId={cell.column.id}
												isEditing={isEditing}
												onCellEdit={onCellEdit}
												onCellSubmit={onCellSubmit}
												onCellCancel={onCellCancel}
												onTabNavigation={
													onTabNavigation
												}
												useEditable={useEditable}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</EditableCell>
										</td>
									);
								})}
						</tr>
					);
				})}

				{/* Add Row Feature */}
				<AddRowFeature
					table={table}
					columns={columns}
					useAddRowFeature={useAddRowFeature}
					isAddingRow={isAddingRow}
					addRowRows={addRowRows}
					onAddRow={onAddRow}
					triggerAddRow={triggerAddRow}
					triggerClearAddRow={triggerClearAddRow}
					onGetAddRowData={onGetAddRowData}
					onAddRowDataChange={onAddRowDataChange}
					onAddRowModeChange={setIsAddingRow}
					onAddRowRowsChange={setAddRowRows}
					defaultRowValues={defaultRowValues}
					columnFieldTypes={columnFieldTypes}
					searchDialog={searchDialog}
				/>

				{useSummary && (
					<tr
						className="bg-gray-50 dark:bg-gray-800 font-medium"
						style={{
							position: 'sticky',
							bottom: 0,
							zIndex: 20,
						}}
					>
						{/* Sequence cell */}
						<td
							style={{
								position: 'sticky',
								left: 0,
								width: `${SEQ_COL_WIDTH}px`,
							}}
						>
							&nbsp;
						</td>
						{/* Checkbox cell with label */}
						<td
							style={{
								position: 'sticky',
								left: `${SEQ_COL_WIDTH}px`,
								width: `${CHECKBOX_COL_WIDTH}px`,
							}}
						>
							&nbsp;
						</td>

						{/* Data cells - use the same logic as data rows */}
						{rows[0]
							?.getVisibleCells()
							.map((cell: any, index: number) => {
								const align =
									cell.column.columnDef?.align ?? 'left';
								const pinned = cell.column.getIsPinned();
								let style: React.CSSProperties = {
									width: `var(--col-${cell.column.id}-size)`,
									textAlign: align,
								};

								if (pinned === 'left') {
									// Use the same left offset calculation as data rows
									const allHeaders =
										table.getHeaderGroups()[0].headers;
									const headerIndex = allHeaders.findIndex(
										(header: any) =>
											header.id === cell.column.id
									);
									const leftOffset = getLeftOffset(
										allHeaders,
										headerIndex
									);
									style = {
										...style,
										position: 'sticky',
										left: leftOffset,
									};
								} else if (pinned === 'right') {
									// Use the same right offset calculation as data rows
									const allHeaders =
										table.getHeaderGroups()[0].headers;
									const headerIndex = allHeaders.findIndex(
										(header: any) =>
											header.id === cell.column.id
									);
									const rightOffset = getRightOffset(
										allHeaders,
										headerIndex
									);
									style = {
										...style,
										position: 'sticky',
										right: rightOffset,
									};
								}

								return (
									<td
										key={cell.column.id}
										style={style}
										className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100"
									>
										{cell.column.columnDef.enableSummary
											? summary[
												cell.column.id
											]?.toLocaleString()
											: ''}
									</td>
								);
							})}
					</tr>
				)}
			</tbody>
		</>
	);
});
