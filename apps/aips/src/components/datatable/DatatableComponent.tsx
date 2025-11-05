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
import { RadixBadge } from '@radix-ui/components';
import { ProcessedColumnDef } from '@repo/radix-ui/hook';
import { toast } from 'sonner';
import { useTranslation } from '@repo/i18n';

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
	headerOffset = '200px',
	onCellUpdate,
	useEditable = false,
	useSummary = false,
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
			{title && <h2 className="text-base font-bold">{title}</h2>}
			<RadixBadge
				color="violet"
				radius="full"
				className="px-4 h-full font-bold"
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
				className={`flex flex-col overflow-hidden relative ${container}`}
				style={{ height: `calc(100vh - ${headerOffset})` }}
			>
				<div className="flex-shrink-0">
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
						<div className="border-y overflow-x-auto">
							{tableTabs}
						</div>
					)}
				</div>
				<div
					className={`relative flex-1 overflow-hidden`}
					style={{
						...columnSizeVars,
					}}
				>
					<div className="relative overflow-x-auto overflow-y-auto h-full">
						<table
							className="min-w-full divide-y divide-gray-200"
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
							/>
						</table>
					</div>
				</div>
				{usePageNation && (
					<TablePagination
						table={table}
						selectedRows={selectedRows}
						onPageChange={(e) => {
							console.log('e', e);
						}}
					/>
				)}
			</div>
		</>
	);
}

export default DatatableComponent;
