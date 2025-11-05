import React from 'react';
import {
	DataTableHeader,
	DataTableBody,
	TableControls,
	TablePagination,
} from '@repo/radix-ui/components/data-table';
import {
	DataTableType,
	DataTableColumnType,
} from '@repo/radix-ui/components/data-table';
import { RadixBadge } from '@repo/radix-ui/components';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';
import { ItemSearchDialog } from '@primes/components/search-dialogs';
import { ItemDto } from '@primes/types/item';
import {Printer} from "lucide-react"

// Search dialog props interface
interface SearchDialogProps {
	searchTerm: string;
	columnId: string;
	rowData: Record<string, string | number>;
	onItemSelect: (item: ItemDto) => void;
	onClose: () => void;
}

interface PrimesDataTableProps<TData, TValue> {
	data: TData[];
	table: DataTableType<TData>;
	columns: ProcessedColumnDef<TData, TValue>[];
	defaultPageSize?: number;
	tableTitle?: string;
	rowCount?: number;
	actionButtons?: React.ReactNode;
	tableTabs?: React.ReactNode;
	useSearch?: boolean;
	usePageNation?: boolean;
	toggleRowSelection: (rowId: string) => void;
	selectedRows: Set<string>;
	enableSingleSelect?: boolean;
	controlsChildren?: React.ReactNode;
	controlsClassName?: string;
	tableClassName?: string;
	classNames?: DataTableClassNames;
	searchSlot?: React.ReactNode;
	topNodes?: React.ReactNode;
	headerOffset?: string;
	onCellUpdate?: (id: number, field: string, value: string) => void;
	useEditable?: boolean;
	useSummary?: boolean;
	rowClassName?: (row: { original: unknown }) => string;
	useAddRowFeature?: boolean;
	onAddRow?: (newRow: Partial<TData>) => void;
	triggerAddRow?: boolean;
	triggerClearAddRow?: boolean;
	onGetAddRowData?: () => Partial<TData>[];
	onAddRowDataChange?: (data: Partial<TData>[]) => void;
	defaultRowValues?: Partial<TData>;
	// Column field types for custom input types in AddRowFeature
	columnFieldTypes?: Record<string, {
		type: 'text' | 'select' | 'date' | 'number';
		options?: { label: string; value: string }[];
		align?: 'left' | 'center' | 'right';
	}>;
	// Search dialog component with proper typing
	searchDialog?: React.ComponentType<SearchDialogProps>;
	// Row click functionality
	onRowClick?: (row: TData, rowId: string) => void;
}
interface DataTableClassNames {
	container?: string;
	controls?: string;
	tableWrapper?: string;
	table?: string;
	header?: string;
	body?: string;
	pagination?: string;
}

export function DatatableComponent<TData, TValue>({
	table,
	toggleRowSelection,
	selectedRows,
	tableTitle = '',
	rowCount = 0,
	actionButtons,
	tableTabs,
	useSearch = false,
	searchSlot,
	enableSingleSelect = false,
	controlsChildren,
	classNames = {},
	topNodes,
	usePageNation = true,
	onCellUpdate,
	useEditable = false,
	useSummary = false,
	rowClassName,
	useAddRowFeature = false,
	onAddRow,
	triggerAddRow = false,
	triggerClearAddRow = false,
	onGetAddRowData,
	onAddRowDataChange,
	defaultRowValues,
	columnFieldTypes,
	searchDialog = ItemSearchDialog,
	onRowClick,
}: PrimesDataTableProps<TData, TValue>) {
	const { container = '' } = classNames;
	const { t } = useTranslation('common');

	// Editable state
	const [editingCell, setEditingCell] = React.useState<{
		rowIndex: number;
		columnId: string;
	} | null>(null);

	const columnSizeVars = React.useMemo(() => {
		const headers = table.getFlatHeaders();
		const colSizes: { [key: string]: string } = {};
		headers.forEach((header: DataTableColumnType<TData>) => {
			colSizes[`--header-${header.id}-size`] = `${header.getSize()}px`;
			colSizes[`--col-${header.column.id}-size`] =
				`${header.column.getSize()}px`;
		});
		return colSizes;
	}, [table.getState().columnSizing, table.getState().columnSizingInfo]);

	const handleCellEdit = (rowIndex: number, columnId: string) => {
		setEditingCell({ rowIndex, columnId });
	};

	const handleCellSubmit = async (
		rowIndex: number,
		columnId: string,
		value: string
	) => {
		const row = table.getRowModel().rows[rowIndex];
		const rowId = row?.original?.id;

		if (!rowId) {
			toast.warning('행에 고유 ID가 없습니다.');
			setEditingCell(null);
			return;
		}

		// Optimistic update
		const prevValue = row.getValue(columnId);

		// ✅ If value has not changed, do nothing
		if (value === prevValue) {
			setEditingCell(null);
			return;
		}

		table.options.meta?.updateData?.(rowIndex, columnId, value);

		try {
			if (onCellUpdate) onCellUpdate(rowId, columnId, value);
		} catch (error) {
			table.options.meta?.updateData?.(rowIndex, columnId, prevValue);
		}

		setEditingCell(null);
	};

	const handleCellCancel = () => setEditingCell(null);

	const handleTabNavigation = (
		rowIndex: number,
		columnId: string,
		direction: 'next' | 'prev'
	) => {
		const flatColumns: DataTableColumnType<unknown>[] = table
			.getAllLeafColumns()
			.filter((col: DataTableColumnType<unknown>) => col.getIsVisible());

		const currentIndex = flatColumns.findIndex((c) => c.id === columnId);

		const nextIndex =
			direction === 'next'
				? (currentIndex + 1) % flatColumns.length
				: (currentIndex - 1 + flatColumns.length) % flatColumns.length;

		setEditingCell({ rowIndex, columnId: flatColumns[nextIndex].id });
	};

	const SearchSlotEl: React.FC<{ title: string; rowCount: number }> = ({
		title,
		rowCount,
	}) => (
		<div className="flex gap-2 items-center flex-1">
			{title && (
				<h2 className="text-base font-bold flex-shrink-0 line-clamp-1">
					{title}
				</h2>
			)}
			<RadixBadge
				color="violet"
				radius="full"
				className="h-full font-bold"
				size="3"
			>
				{rowCount} {t('table.rowCount')}
			</RadixBadge>
			{searchSlot}
		</div>
	);

	return (
		<>
			{topNodes}
			<div
				className={`flex flex-col overflow-hidden relative h-full ${container}`}
			// style={{ height: `calc(100vh - ${headerOffset})` }}
			>
				{/* TableControls를 독립적인 컨테이너로 분리 */}
				<div className="w-full">
					<TableControls
						table={table}
						searchSlot={
							<SearchSlotEl
								title={tableTitle}
								rowCount={rowCount}
								
							/>
						}
						actionButtons={actionButtons}
						useSearch={useSearch}
						
					>
						
						{controlsChildren}
						

						
					</TableControls>
					{/* Table Tabs - displayed below controls */}
					{tableTabs && (
						<div className="border-y overflow-x-auto w-full">
							{tableTabs}
						</div>
					)}
				</div>

				{/* 테이블 영역을 독립적으로 설정 */}
				<div
					className={`relative flex-1 overflow-hidden w-full`}
					style={{
						...columnSizeVars,
					}}
				>
					<div className="relative overflow-x-auto overflow-y-auto h-full w-full">
						<table
							className="min-w-full divide-y divide-gray-200 w-full"
							style={{ ...columnSizeVars }}
						>
							<DataTableHeader
								table={table}
								toggleRowSelection={toggleRowSelection}
								selectedRows={selectedRows}
							/>
							<DataTableBody
								table={table}
								toggleRowSelection={(rowId) => {
									if (
										enableSingleSelect &&
										selectedRows.size > 0 &&
										!selectedRows.has(rowId)
									) {
										selectedRows.forEach((id) =>
											toggleRowSelection(id)
										);
									}
									toggleRowSelection(rowId);
								}}
								selectedRows={selectedRows}
								useEditable={useEditable}
								editingCell={editingCell}
								onCellEdit={handleCellEdit}
								onCellSubmit={handleCellSubmit}
								onCellCancel={handleCellCancel}
								onTabNavigation={handleTabNavigation}
								useSummary={useSummary}
								rowClassName={rowClassName}
								useAddRowFeature={useAddRowFeature}
								onAddRow={onAddRow}
								triggerAddRow={triggerAddRow}
								triggerClearAddRow={triggerClearAddRow}
								onGetAddRowData={onGetAddRowData}
								onAddRowDataChange={onAddRowDataChange}
								defaultRowValues={defaultRowValues}
								columnFieldTypes={columnFieldTypes}
								searchDialog={searchDialog}
								onRowClick={onRowClick as any}
							/>
						</table>
					</div>
				</div>

				{/* 페이지네이션도 독립적으로 설정 */}
				{usePageNation && (
					<div className="w-full">
						<TablePagination
							table={table}
							selectedRows={selectedRows}
							onPageChange={(e) => {
								console.log('e', e);
							}}
						/>
					</div>
				)}
			</div>
		</>
	);
}

export default DatatableComponent;
