import * as React from 'react';
import { Button } from '@radix-ui/themes';
import {
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuTriggerIcon,
} from '@repo/radix-ui/components';
import {
	Check,
	Settings2,
	MoveLeft,
	MoveRight,
	PinOff,
	Search,
} from 'lucide-react';
import * as ReactTable from '@tanstack/react-table';
const flexRender = (ReactTable as any).flexRender || (() => null);
import { Tooltip } from './../../../../../apps/primes/src/components/common/Tooltip';
import { useTranslation } from '@repo/i18n';

interface TableControlsProps<TData> {
	table: any;
	// onSearchChange: (query: string) => void;
	// searchQuery: string;
	// selectedRows: Set<string>;
	actionButtons?: React.ReactNode;
	children?: React.ReactNode;
	searchSlot?: React.ReactNode;
	useSearch?: boolean;
}

export function TableControls<TData>({
	table,
	// searchQuery,
	// onSearchChange,
	// selectedRows,
	actionButtons,
	children,
	searchSlot,
	useSearch = false,
}: TableControlsProps<TData>) {
	const { t } = useTranslation('common');
	const [columnSearchQuery, setColumnSearchQuery] = React.useState('');

	const leftPinnedColumns = table.getLeftVisibleLeafColumns();
	const rightPinnedColumns = table.getRightVisibleLeafColumns();

	const filteredColumns = table
		.getAllLeafColumns()
		.filter((col: any) => col.id !== '_selector')
		.filter((column: any) => {
			const header = String(column.columnDef.header ?? '').toLowerCase();
			return header.includes(columnSearchQuery.toLowerCase());
		})
		.sort((a: any, b: any) =>
			String(a.columnDef.header).localeCompare(String(b.columnDef.header))
		);

	return (
		<div className="flex flex-col gap-2 rounded-t-md my-2">
			{/* 상단 컨트롤 (검색 + 우측 버튼) */}
			{children}
			<div className="flex justify-between items-center w-full px-2 gap-2">
				{/* 🔍 검색창 */}
				<div className="flex items-center gap-2 flex-1">
					{searchSlot ? (
						searchSlot
					) : (
						<>
							<input
								type="text"
								placeholder={t('table.controls.search')}
								// value={searchQuery}
								// onChange={(e) => onSearchChange(e.target.value)}
								className="w-48 h-8 px-3 text-sm border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
							{/* {searchQuery && (
								<Button
									variant="outline"
									onClick={() => onSearchChange('')}
									className="p-1 h-8"
								>
									<X className="h-4 w-4" />
								</Button>
							)} */}
						</>
					)}
				</div>
				{/* 💡 사용자 정의 버튼 영역 */}
				{actionButtons}

				{/* 우측 기능 버튼 */}
				<div className="flex items-center mr-1">
					{/* Settings Menu */}
					<DropdownMenuRoot>
						<Tooltip label="컨트롤 테이블 내용" side="bottom">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									radius="full"
									className="flex items-center gap-1"
								>
									<Settings2 size={16} color="gray" />
								</Button>
							</DropdownMenuTrigger>
						</Tooltip>
						<DropdownMenuContent
							align="end"
							sideOffset={4}
							className="bg-white border border-gray-300 shadow-md rounded-md p-2 z-[100] min-w-52"
						>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger className="flex items-center justify-between p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									{t('table.controls.columnView')}
									<DropdownMenuTriggerIcon />
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="bg-white border border-gray-300 shadow-md rounded-md min-w-64 max-h-60 overflow-auto">
									<div className="sticky top-0 bg-background">
										<div className="relative w-full min-w-64">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<input
												type="text"
												autoFocus
												placeholder={t(
													'table.controls.searchColumns'
												)}
												value={columnSearchQuery}
												onChange={(e) =>
													setColumnSearchQuery(
														e.target.value
													)
												}
												onKeyDown={(e) =>
													e.stopPropagation()
												}
												onClick={(e) =>
													e.stopPropagation()
												}
												className="w-full h-8 pl-9 pr-3 py-5 text-sm border-0 border-b border-gray-200 placeholder-gray-500 focus:outline-none bg-white"
											/>
										</div>
									</div>
									<div className="overflow-auto max-h-48 p-2">
										{filteredColumns.length > 0 ? (
											filteredColumns.map(
												(column: any) => (
													<div
														key={column.id}
														className="flex items-center justify-between p-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
														onClick={(e) => {
															e.stopPropagation();
															// 현재 상태를 반전시켜 토글
															const currentVisibility =
																column.getIsVisible();
															if (
																column.toggleVisibility
															) {
																column.toggleVisibility(
																	!currentVisibility
																);
															}
														}}
													>
														<span className="flex-1">
															{flexRender(
																column.columnDef
																	.header,
																{} as any
															)}
														</span>
														{column.getIsVisible() && (
															<Check className="h-4 w-4 text-blue-600" />
														)}
													</div>
												)
											)
										) : (
											<div className="p-1 text-sm text-gray-500 text-center">
												{t(
													'table.controls.noColumnsFound'
												)}
											</div>
										)}
									</div>
								</DropdownMenuSubContent>
							</DropdownMenuSub>

							<DropdownMenuSub>
								<DropdownMenuSubTrigger className="flex items-center justify-between p-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
									{t('table.controls.pinnedColumns')}
									<DropdownMenuTriggerIcon />
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="bg-white border border-gray-300 shadow-md rounded-md p-2 min-w-64 max-h-72 overflow-auto">
									{leftPinnedColumns.length > 0 && (
										<>
											<div className="text-xs text-gray-600 px-2 py-1 font-medium">
												{t('table.controls.leftPinned')}
											</div>
											{leftPinnedColumns.map(
												(column: any) => (
													<div
														key={`left-${column.id}`}
														className="flex items-center justify-between p-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<span className="flex items-center gap-2">
															<MoveLeft className="h-4 w-4" />
															{flexRender(
																column.columnDef
																	.header,
																{} as any
															)}
														</span>
														<button
															onClick={(e) => {
																e.stopPropagation();
																column.pin(
																	false
																);
															}}
															className="p-1 hover:bg-gray-200 rounded"
														>
															<PinOff className="h-4 w-4 text-gray-400" />
														</button>
													</div>
												)
											)}
										</>
									)}
									{rightPinnedColumns.length > 0 && (
										<>
											{leftPinnedColumns.length > 0 && (
												<DropdownMenuSeparator className="my-1" />
											)}
											<div className="text-xs text-gray-600 px-2 py-1 font-medium">
												{t(
													'table.controls.rightPinned'
												)}
											</div>
											{rightPinnedColumns.map(
												(column: any) => (
													<div
														key={`right-${column.id}`}
														className="flex items-center justify-between p-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<span className="flex items-center gap-2">
															<MoveRight className="h-4 w-4" />
															{flexRender(
																column.columnDef
																	.header,
																{} as any
															)}
														</span>
														<button
															onClick={(e) => {
																e.stopPropagation();
																column.pin(
																	false
																);
															}}
															className="p-1 hover:bg-gray-2 rounded"
														>
															<PinOff className="h-4 w-4 text-gray-400" />
														</button>
													</div>
												)
											)}
										</>
									)}
									{(leftPinnedColumns.length > 0 ||
										rightPinnedColumns.length > 0) && (
										<>
											<DropdownMenuSeparator className="my-1" />
											<button
												onClick={(e) => {
													e.stopPropagation();
													table.resetColumnPinning();
												}}
												className="flex items-center w-full p-2 text-sm hover:bg-gray-100 rounded cursor-pointer text-red-600"
											>
												<PinOff className="mr-2 h-4 w-4" />
												{t('table.controls.unpinAll')}
											</button>
										</>
									)}
									{leftPinnedColumns.length === 0 &&
										rightPinnedColumns.length === 0 && (
											<div className="p-2 text-sm text-gray-500 text-center">
												{t(
													'table.controls.noPinnedColumns'
												)}
											</div>
										)}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuContent>
					</DropdownMenuRoot>
				</div>
			</div>
			{/* Tabs might come area */}
		</div>
	);
}
