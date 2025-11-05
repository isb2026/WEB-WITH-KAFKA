import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
const flexRender = (ReactTable as any).flexRender || (() => null);
import {
	Editable,
	EditableArea,
	EditablePreview,
	EditableInput,
} from '../Editable';

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
}

// Helper function to calculate sticky left position - improved version
const getLeftOffset = (cells: any[], currentIndex: number) => {
	let offset = 112; // 순번(64px) + 체크박스(48px)

	// Get all left-pinned columns before current index
	const leftPinnedCells = cells
		.slice(0, currentIndex)
		.filter((cell) => cell.column.getIsPinned() === 'left');

	// Calculate total width of left-pinned columns
	leftPinnedCells.forEach((cell) => {
		// Use a more accurate width calculation
		const columnWidth =
			cell.column.columnDef.size || cell.column.columnDef.minSize || 150; // Default width
		offset += columnWidth;
	});

	return offset;
};

// Helper function to calculate sticky right position - improved version
const getRightOffset = (cells: any[], currentIndex: number) => {
	let offset = 0;

	// Get all right-pinned columns after current index
	const rightPinnedCells = cells
		.slice(currentIndex + 1)
		.filter((cell) => cell.column.getIsPinned() === 'right');

	// Calculate total width of right-pinned columns
	rightPinnedCells.forEach((cell) => {
		// Use a more accurate width calculation
		const columnWidth =
			cell.column.columnDef.size || cell.column.columnDef.minSize || 150; // Default width
		offset += columnWidth;
	});

	return offset;
};

// Helper function to check if column is editable
const isColumnEditable = (columnId: string): boolean => {
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
	return !nonEditableColumns.includes(columnId.toLowerCase());
};

export function TableBody<TData>({
	table,
	selectedRows,
	toggleRowSelection,
	useEditable = false,
	editingCell,
	onCellEdit,
	onCellSubmit,
	onCellCancel,
	onTabNavigation,
}: TableBodyProps<TData>) {
	const EditableCell: React.FC<{
		value: string;
		rowIndex: number;
		columnId: string;
		isEditing: boolean;
		children: React.ReactNode;
	}> = ({ value, rowIndex, columnId, isEditing, children }) => {
		const handleInputKeyDown = (
			event: React.KeyboardEvent<HTMLInputElement>
		) => {
			if (event.key === 'Tab') {
				event.preventDefault();
				const direction = event.shiftKey ? 'prev' : 'next';
				onTabNavigation?.(rowIndex, columnId, direction);
			}
		};

		const canEdit = useEditable && isColumnEditable(columnId);

		if (!canEdit) {
			return <>{children}</>;
		}

		return (
			<Editable
				defaultValue={value}
				editing={isEditing}
				onEdit={() => onCellEdit?.(rowIndex, columnId)}
				onSubmit={(newValue) =>
					onCellSubmit?.(rowIndex, columnId, newValue)
				}
				onCancel={onCellCancel}
				triggerMode="dblclick"
				className="w-full"
			>
				<EditableArea>
					<EditablePreview className="w-full h-[20px] px-0 py-0 border-transparent flex items-center" />
					<EditableInput
						className="w-full h-[20px] px-1 text-sm outline-none border-none"
						onKeyDown={handleInputKeyDown}
					/>
				</EditableArea>
			</Editable>
		);
	};

	return (
		<tbody className="bg-white">
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row: any, rowIndex: number) => {
					const isSelected = selectedRows.has(row.id);
					const rowBgColor = isSelected
						? 'rgba(239, 246, 255, 0.8)'
						: 'rgba(255, 255, 255, 0.8)';

					return (
						<tr
							key={row.id}
							className={`border-b border-gray-300 ${
								isSelected ? 'bg-blue-50' : 'bg-white'
							} hover:bg-gray-100 transition-colors duration-150`}
						>
							{/* 순번 Cell */}
							<td
								className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium"
								style={{
									position: 'sticky',
									left: 0,
									zIndex: 10,
									backgroundColor: rowBgColor,
									boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
									backgroundImage: isSelected
										? 'linear-gradient(to right, rgba(239, 246, 255, 0.8), rgba(233, 243, 255, 0.8))'
										: 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.8))',
									width: '64px',
									minWidth: '64px',
									maxWidth: '64px',
								}}
							>
								{rowIndex + 1}
							</td>
							<td
								className="px-4 border-b py-3 whitespace-nowrap text-sm text-gray-900 transition-all duration-200"
								style={{
									position: 'sticky',
									left: 64,
									zIndex: 10,
									backgroundColor: rowBgColor,
									boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
									backgroundImage: isSelected
										? 'linear-gradient(to right, rgba(239, 246, 255, 0.8), rgba(233, 243, 255, 0.8))'
										: 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.8))',
									width: '48px',
									minWidth: '48px',
									maxWidth: '48px',
								}}
							>
								<input
									type="checkbox"
									checked={selectedRows.has(row.id)}
									onChange={() => toggleRowSelection(row.id)}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
								/>
							</td>
							{row
								.getVisibleCells()
								.map((cell: any, index: number) => {
									const isPinned = cell.column.getIsPinned();
									const isLeftPinned = isPinned === 'left';
									const isRightPinned = isPinned === 'right';

									// Calculate column width
									const columnWidth =
										cell.column.columnDef.size ||
										cell.column.columnDef.minSize ||
										150; // Default width

									let stickyStyles: React.CSSProperties = {
										width: `${columnWidth}px`,
										minWidth: `${columnWidth}px`,
										maxWidth: `${columnWidth}px`,
									};

									if (isLeftPinned) {
										const leftOffset = getLeftOffset(
											row.getVisibleCells(),
											index
										);
										stickyStyles = {
											...stickyStyles,
											position: 'sticky',
											left: leftOffset,
											zIndex: 10,
											backgroundColor: rowBgColor,
											boxShadow:
												'2px 0 4px rgba(0, 0, 0, 0.06)',
											backgroundImage: isSelected
												? 'linear-gradient(to right, rgba(239, 246, 255, 0.8), rgba(233, 243, 255, 0.6))'
												: 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.6))',
										};
									} else if (isRightPinned) {
										const rightOffset = getRightOffset(
											row.getVisibleCells(),
											index
										);
										stickyStyles = {
											...stickyStyles,
											position: 'sticky',
											right: rightOffset,
											zIndex: 10,
											backgroundColor: rowBgColor,
											boxShadow:
												'-2px 0 4px rgba(0, 0, 0, 0.06)',
											backgroundImage: isSelected
												? 'linear-gradient(to left, rgba(239, 246, 255, 0.8), rgba(233, 243, 255, 0.6))'
												: 'linear-gradient(to left, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.6))',
										};
									}

									const cellValue =
										cell.getValue()?.toString() || '';
									const isEditing =
										editingCell?.rowIndex === rowIndex &&
										editingCell?.columnId ===
											cell.column.id;

									const canEdit =
										useEditable &&
										isColumnEditable(cell.column.id);

									return (
										<td
											key={cell.id}
											className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 overflow-hidden text-ellipsis border-b ${
												cell.column.id === 'id'
													? 'font-medium'
													: ''
											} ${isPinned ? 'shadow-sm border-0 transition-all duration-200' : ''} ${
												canEdit
													? 'cursor-text'
													: 'cursor-default'
											}`}
											style={stickyStyles}
										>
											<EditableCell
												value={cellValue}
												rowIndex={rowIndex}
												columnId={cell.column.id}
												isEditing={isEditing}
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
				})
			) : (
				<tr>
					<td
						colSpan={table.getAllColumns().length + 2}
						className="h-24 text-center text-gray-500"
					>
						No results.
					</td>
				</tr>
			)}
		</tbody>
	);
}
