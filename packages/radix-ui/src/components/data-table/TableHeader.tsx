import * as React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
	Check,
	ChevronDownIcon,
	ChevronUpIcon,
	ChevronsUpDown,
	EyeOff,
	RotateCcw,
	PinOff,
	MoveLeft,
	MoveRight,
} from 'lucide-react';
import * as ReactTable from '@tanstack/react-table';
const flexRender = (ReactTable as any).flexRender || (() => null);
import { ProcessedColumnDef } from './../../hook/useDataTableColumns';

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
}

const getLeftOffset = (headers: any[], currentIndex: number) => {
	let offset = 112; // 순번(64px) + 체크박스(48px)
	const leftPinnedHeaders = headers
		.slice(0, currentIndex)
		.filter((header) => header.column.getIsPinned() === 'left');

	leftPinnedHeaders.forEach((header) => {
		const columnWidth =
			header.column.columnDef.size ||
			header.column.columnDef.minSize ||
			150;
		offset += columnWidth;
	});

	return offset;
};

const getRightOffset = (headers: any[], currentIndex: number) => {
	let offset = 0;
	const rightPinnedHeaders = headers
		.slice(currentIndex + 1)
		.filter((header) => header.column.getIsPinned() === 'right');

	rightPinnedHeaders.forEach((header) => {
		const columnWidth =
			header.column.columnDef.size ||
			header.column.columnDef.minSize ||
			150;
		offset += columnWidth;
	});

	return offset;
};

const CheckboxHeaderCell: React.FC<{
	allRows: any[];
	selectedRows: Set<string>;
	toggleRowSelection: (id: string) => void;
	className?: string;
}> = ({ allRows, selectedRows, toggleRowSelection, className }) => {
	const allSelected =
		selectedRows.size === allRows.length && allRows.length > 0;
	return (
		<th
			className={className}
			style={{
				position: 'sticky',
				top: 0,
				left: 64, // 순번 컬럼 너비만큼 오프셋
				zIndex: 20,
				backgroundColor: 'rgba(249, 250, 251, 0.8)',
				boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
				backgroundImage:
					'linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(247, 248, 250, 0.8))',
				width: '48px',
				minWidth: '48px',
				maxWidth: '48px',
			}}
		>
			<input
				type="checkbox"
				checked={allSelected}
				onChange={() => {
					allRows.forEach((row) => {
						const id = row.id;
						const has = selectedRows.has(id);
						toggleRowSelection(id);
					});
				}}
				className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
			/>
		</th>
	);
};

export function TableHeader<TData, TValue>({
	table,
	selectedRows,
	toggleRowSelection,
	classNames,
}: TableHeaderProps<TData, TValue>) {
	return (
		<thead className={classNames?.thead ?? 'bg-gray-50 dark:bg-gray-800'}>
			{table.getHeaderGroups().map((headerGroup: any) => (
				<tr
					key={headerGroup.id}
					className="border-b border-gray-200 zIndex-[100]"
				>
					{/* 순번 Header */}
					<th
						className="w-16 border-b px-4 py-2 text-center text-sm font-medium text-gray-500"
						style={{
							position: 'sticky',
							top: 0,
							left: 0,
							zIndex: 20,
							backgroundColor: 'rgba(249, 250, 251, 0.8)',
							boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
							backgroundImage:
								'linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(247, 248, 250, 0.8))',
							width: '64px',
							minWidth: '64px',
							maxWidth: '64px',
						}}
					>
						순번
					</th>
					<CheckboxHeaderCell
						allRows={table.getRowModel().rows}
						selectedRows={selectedRows}
						toggleRowSelection={toggleRowSelection}
						className={
							classNames?.thCheckbox ??
							'w-12 border-b px-4 py-2 text-left text-sm font-medium text-gray-500'
						}
					/>
					{headerGroup.headers.map((header: any, index: number) => {
						const isPinned = header.column.getIsPinned();
						const isLeftPinned = isPinned === 'left';
						const isRightPinned = isPinned === 'right';
						const columnWidth =
							header.column.columnDef.size ||
							header.column.columnDef.minSize ||
							150;
						let stickyStyles: React.CSSProperties = {
							position: 'sticky',
							top: 0,
							zIndex: 19,
							backgroundColor: 'rgba(250, 251, 253, 0.96)',
							width: `${columnWidth}px`,
							minWidth: `${columnWidth}px`,
							maxWidth: `${columnWidth}px`,
						};
						if (isLeftPinned) {
							stickyStyles = {
								...stickyStyles,
								left: getLeftOffset(headerGroup.headers, index),
								zIndex: 20,
								backgroundColor: 'rgba(249, 250, 251, 0.8)',
								boxShadow: '2px 0 4px rgba(0, 0, 0, 0.06)',
								backgroundImage:
									'linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(247, 248, 250, 0.8))',
							};
						} else if (isRightPinned) {
							stickyStyles = {
								...stickyStyles,
								right: getRightOffset(
									headerGroup.headers,
									index
								),
								zIndex: 20,
								backgroundColor: 'rgba(249, 250, 251, 0.8)',
								boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.06)',
								backgroundImage:
									'linear-gradient(to left, rgba(249, 250, 251, 0.8), rgba(247, 248, 250, 0.8))',
							};
						}

						return (
							<th
								key={header.id}
								className={`
                  ${classNames?.thBase ?? 'px-6 border-b py-2 text-left text-sm font-medium text-gray-500'}
                  ${isPinned ? (classNames?.thPinned ?? 'shadow-sm border-0 transition-all duration-200 hover:bg-gray-100') : ''}
                  overflow-hidden whitespace-nowrap
                `}
								style={stickyStyles}
							>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div className="flex items-center cursor-pointer">
											{flexRender(
												(
													header.column
														.columnDef as ProcessedColumnDef<
														TData,
														TValue
													>
												).headerContent ??
													header.column.columnDef
														.header,
												header.getContext()
											)}
											{header.column.getCanSort() &&
												(header.column.getIsSorted() ===
												'asc' ? (
													<ChevronUpIcon className="ml-2 h-4 w-4" />
												) : header.column.getIsSorted() ===
												  'desc' ? (
													<ChevronDownIcon className="ml-2 h-4 w-4" />
												) : (
													<ChevronsUpDown className="ml-2 h-4 w-4" />
												))}
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										sideOffset={10}
										className="bg-white border border-gray-300 shadow-md rounded-md p-2 z-[9999] min-w-40"
									>
										<DropdownMenuItem
											onSelect={() =>
												header.column.toggleSorting(
													false
												)
											}
											className={classNames?.dropdownItem}
										>
											<ChevronUpIcon className="h-4 w-4" />{' '}
											Asc
											{header.column.getIsSorted() ===
												'asc' && (
												<Check className="h-4 w-4 ml-auto" />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() =>
												header.column.toggleSorting(
													true
												)
											}
											className={classNames?.dropdownItem}
										>
											<ChevronDownIcon className="h-4 w-4" />{' '}
											Desc
											{header.column.getIsSorted() ===
												'desc' && (
												<Check className="h-4 w-4 ml-auto" />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() =>
												header.column.toggleVisibility?.(
													false
												)
											}
											className={classNames?.dropdownItem}
										>
											<EyeOff className="h-4 w-4" /> Hide
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() =>
												header.column.pin('left')
											}
											disabled={isLeftPinned}
											className={classNames?.dropdownItem}
										>
											<MoveLeft className="h-4 w-4" /> Pin
											Left
											{isLeftPinned && (
												<Check className="h-4 w-4 ml-auto" />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() =>
												header.column.pin('right')
											}
											disabled={isRightPinned}
											className={classNames?.dropdownItem}
										>
											<MoveRight className="h-4 w-4" />{' '}
											Pin Right
											{isRightPinned && (
												<Check className="h-4 w-4 ml-auto" />
											)}
										</DropdownMenuItem>
										{isPinned && (
											<DropdownMenuItem
												onSelect={() =>
													header.column.pin(false)
												}
												className={
													classNames?.dropdownItem
												}
											>
												<PinOff className="h-4 w-4" />{' '}
												Unpin
											</DropdownMenuItem>
										)}
										{header.column.getIsSorted() && (
											<DropdownMenuItem
												onSelect={() =>
													header.column.clearSorting()
												}
												className={
													classNames?.dropdownItem
												}
											>
												<RotateCcw className="h-4 w-4" />{' '}
												Reset
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
}
