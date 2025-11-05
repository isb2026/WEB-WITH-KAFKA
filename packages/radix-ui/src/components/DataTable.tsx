import * as React from 'react';
import * as ReactTable from '@tanstack/react-table';
const getCoreRowModel = (ReactTable as any).getCoreRowModel || (() => {});
const getPaginationRowModel = (ReactTable as any).getPaginationRowModel || (() => {});
const getSortedRowModel = (ReactTable as any).getSortedRowModel || (() => {});
const useReactTable = (ReactTable as any).useReactTable || (() => {});
type SortingState = any;
type ColumnPinningState = any;
import { ProcessedColumnDef } from './../hook/useDataTableColumns';
import { TableControls } from './data-table/TableControls';
import { TableHeader } from './data-table/TableHeader';
import { TableBody } from './data-table/TableBody';
import { TablePagination } from './data-table/TablePagination';

interface DataTableProps<TData, TValue> {
	columns: ProcessedColumnDef<TData, TValue>[];
	data: TData[];
	useEditable?: boolean;
	onCellValueChange?: (
		rowIndex: number,
		columnId: string,
		value: string
	) => void;
	actionButtons?: React.ReactNode;
	tableTitle?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	useEditable = true,
	onCellValueChange,
	actionButtons,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [columnPinning, setColumnPinning] =
		React.useState<ColumnPinningState>({
			left: [],
			right: [],
		});
	const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
		new Set()
	);
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [editingCell, setEditingCell] = React.useState<{
		rowIndex: number;
		columnId: string;
	} | null>(null);

	// Filter data based on search query
	const filteredData = React.useMemo(() => {
		if (!searchQuery) return data;
		return data.filter((row: any) => {
			const nameValue = row['name'];
			return nameValue
				?.toString()
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
		});
	}, [data, searchQuery]);

	const table = useReactTable({
		data: filteredData,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnPinning,
		},
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 30,
			},
		},
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnPinningChange: setColumnPinning,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: 'onChange',
		enableColumnResizing: false,
		enableSorting: true,
		defaultColumn: {
			size: 150,
			minSize: 100,
			maxSize: 400,
			enableSorting: true,
		},
	});

	// Handle row selection
	const toggleRowSelection = (rowId: string) => {
		setSelectedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(rowId)) {
				newSet.delete(rowId);
			} else {
				newSet.add(rowId);
			}
			return newSet;
		});
	};

	// Handle cell editing
	const handleCellEdit = (rowIndex: number, columnId: string) => {
		if (!useEditable) return;
		setEditingCell({ rowIndex, columnId });
	};

	const handleCellSubmit = (
		rowIndex: number,
		columnId: string,
		value: string
	) => {
		onCellValueChange?.(rowIndex, columnId, value);
		setEditingCell(null);
	};

	const handleCellCancel = () => {
		setEditingCell(null);
	};

	// Handle Tab navigation between cells
	const handleTabNavigation = (
		currentRowIndex: number,
		currentColumnId: string,
		direction: 'next' | 'prev'
	) => {
		const visibleColumns = table.getVisibleFlatColumns();
		const currentColumnIndex = visibleColumns.findIndex(
			(col: any) => col.id === currentColumnId
		);

		let nextRowIndex = currentRowIndex;
		let nextColumnIndex = currentColumnIndex;

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

		const maxRows = table.getRowModel().rows.length;
		const maxColumns = visibleColumns.length;

		// Find next editable cell
		do {
			if (direction === 'next') {
				nextColumnIndex++;
				// Only move to next row if we've gone through all columns
				if (nextColumnIndex >= maxColumns) {
					nextColumnIndex = 0;
					nextRowIndex++;
				}
			} else {
				nextColumnIndex--;
				// Only move to previous row if we've gone before all columns
				if (nextColumnIndex < 0) {
					nextColumnIndex = maxColumns - 1;
					nextRowIndex--;
				}
			}

			// Check if we've reached the boundaries
			if (nextRowIndex < 0 || nextRowIndex >= maxRows) {
				break;
			}

			const nextColumnId = visibleColumns[nextColumnIndex]?.id;
			if (nextColumnId && isColumnEditable(nextColumnId)) {
				setEditingCell({
					rowIndex: nextRowIndex,
					columnId: nextColumnId,
				});
				break;
			}
		} while (true);
	};

	return (
		<div className="space-y-4 flex flex-col w-full">
			<TableControls
				table={table}
				// onSearchChange={setSearchQuery}
				// searchQuery={searchQuery}
				// selectedRows={selectedRows}
				// searchSlot={}
				actionButtons={actionButtons}
			/>
			<div className="relative border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
				<div className="overflow-auto max-h-[600px]">
					<table
						className="w-full text-sm border-separate border-spacing-0"
						style={{ tableLayout: 'fixed' }}
					>
						<TableHeader
							table={table}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
						/>
						<TableBody
							table={table}
							selectedRows={selectedRows}
							toggleRowSelection={toggleRowSelection}
							useEditable={useEditable}
							editingCell={editingCell}
							onCellEdit={handleCellEdit}
							onCellSubmit={handleCellSubmit}
							onCellCancel={handleCellCancel}
							onTabNavigation={handleTabNavigation}
						/>
					</table>
				</div>
			</div>
			<TablePagination
				table={table}
				selectedRows={selectedRows}
				onPageChange={(e) => {}}
			/>
		</div>
	);
}
