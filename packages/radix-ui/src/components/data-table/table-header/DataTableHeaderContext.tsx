import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { TableHeaderClassNames } from './DataTableHeader';
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
import React from 'react';

export type HeaderContextAction =
	| 'sortAsc'
	| 'sortDesc'
	| 'hide'
	| 'pinLeft'
	| 'pinRight'
	| 'unpin'
	| 'reset';

interface HeaderContextMenuProps {
	header: any;
	className?: string;
	enabledActions: HeaderContextAction[];
	classNames?: TableHeaderClassNames;
}

const DataTableHeaderContext: React.FC<HeaderContextMenuProps> = ({
	header,
	enabledActions,
	className,
	classNames,
}) => {
	const isPinned = header.column.getIsPinned();
	const isLeftPinned = isPinned === 'left';
	const isRightPinned = isPinned === 'right';
	const align = header.column.columnDef.align || 'left';

	const actionMap: Record<HeaderContextAction, JSX.Element | null> = {
		sortAsc: (
			<DropdownMenuItem
				onSelect={() => {
					header.column.toggleSorting(false);
				}}
				className="flex gap-2 items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-300"
			>
				<ChevronUpIcon className="h-4 w-4" />
				<span className="flex-1 text-start">Asc</span>
				{header.column.getIsSorted() === 'asc' && (
					<Check className="h-4 w-4" />
				)}
			</DropdownMenuItem>
		),
		sortDesc: (
			<DropdownMenuItem
				onSelect={() => {
					header.column.toggleSorting(true);
				}}
				className="flex gap-2 items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-300"
			>
				<ChevronDownIcon className="h-4 w-4" />
				<span className="flex-1 text-start">Desc</span>
				{header.column.getIsSorted() === 'desc' && (
					<Check className="h-4 w-4" />
				)}
			</DropdownMenuItem>
		),
		hide: (
			<DropdownMenuItem
				onSelect={() => header.column.toggleVisibility?.(false)}
				className="flex gap-2 items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-300"
			>
				<EyeOff className="h-4 w-4" />
				<span className="flex-1 text-start">Hide</span>
			</DropdownMenuItem>
		),
		pinLeft: (
			<DropdownMenuItem
				onSelect={() => header.column.pin('left')}
				disabled={isLeftPinned}
				className="flex gap-2 items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none disabled:opacity-50 text-gray-700 dark:text-gray-300"
			>
				<MoveLeft className="h-4 w-4" />
				<span className="flex-1 text-start">Pin Left</span>
				{isLeftPinned && <Check className="h-4 w-4" />}
			</DropdownMenuItem>
		),
		pinRight: (
			<DropdownMenuItem
				onSelect={() => header.column.pin('right')}
				disabled={isRightPinned}
				className="flex gap-2 items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none disabled:opacity-50 text-gray-700 dark:text-gray-300"
			>
				<MoveRight className="h-4 w-4" />
				<span className="flex-1 text-start">Pin Right</span>
				{isRightPinned && <Check className="h-4 w-4" />}
			</DropdownMenuItem>
		),
		unpin: isPinned ? (
			<DropdownMenuItem
				onSelect={() => header.column.pin(false)}
				className="flex items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-300"
			>
				<PinOff className="mr-2 h-4 w-4" />
				<span className="flex-1 text-start">Unpin</span>
			</DropdownMenuItem>
		) : null,
		reset: header.column.getIsSorted() ? (
			<DropdownMenuItem
				onSelect={() => header.column.clearSorting()}
				className="flex items-center cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-300"
			>
				<RotateCcw className="mr-2 h-4 w-4" />
				<span className="flex-1 text-start">Reset</span>
			</DropdownMenuItem>
		) : null,
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center cursor-pointer w-full"
					style={{ justifyContent: align }}
				>
					{flexRender(
						(header.column.columnDef as any).headerContent ??
							header.column.columnDef.header,
						header.getContext()
					)}
					{header.column.getCanSort() &&
						(header.column.getIsSorted() === 'asc' ? (
							<ChevronUpIcon className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
						) : header.column.getIsSorted() === 'desc' ? (
							<ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
						) : (
							<ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
						))}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				sideOffset={10}
				className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md rounded-md p-2 z-[9999] min-w-40 ${className}`}
			>
				{enabledActions
					.map((action, index) => {
						const element = actionMap[action];
						return element ? React.cloneElement(element, { key: `${action}-${index}` }) : null;
					})
					.filter(Boolean)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DataTableHeaderContext;
