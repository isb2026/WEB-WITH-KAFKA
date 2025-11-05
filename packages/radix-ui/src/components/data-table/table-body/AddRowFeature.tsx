import React from 'react';
import { DraggableDialog } from '@radix-ui/components';
import { Trash2 } from 'lucide-react';

import { BASE_LEFT_OFFSET, CHECKBOX_COL_WIDTH, SEQ_COL_WIDTH } from '..';
import Tooltip from '@primes/components/common/Tooltip';
import { PrimesDatePicker } from '@primes/components/common/PrimesDatePicker';

type RowWithId<T> = Partial<T> & { __rid: string }; // stable id per add-row line

interface AddRowFeatureProps<TData> {
	table: any;
	columns: any[];
	useAddRowFeature: boolean;
	isAddingRow: boolean;
	addRowRows: Partial<TData>[];
	onAddRow?: (newRow: Partial<TData>) => void;
	triggerAddRow: boolean;
	triggerClearAddRow: boolean;
	onGetAddRowData?: () => Partial<TData>[];
	onAddRowDataChange?: (data: Partial<TData>[]) => void;
	onAddRowModeChange: React.Dispatch<React.SetStateAction<boolean>>;
	onAddRowRowsChange: React.Dispatch<React.SetStateAction<Partial<TData>[]>>;
	defaultRowValues?: Partial<TData>;
	// Column field types for custom input types
	columnFieldTypes?: Record<string, {
		type: 'text' | 'select' | 'date' | 'number';
		options?: { label: string; value: string }[];
		align?: 'left' | 'center' | 'right';
	}>;
	searchDialog?: React.ComponentType<any>;
}

export const AddRowFeature = <TData,>({
	table,
	columns,
	useAddRowFeature,
	isAddingRow,
	addRowRows,
	onAddRow,
	triggerAddRow,
	triggerClearAddRow,
	onGetAddRowData,
	onAddRowDataChange,
	onAddRowModeChange,
	onAddRowRowsChange,
	defaultRowValues,
	columnFieldTypes,
	searchDialog,
}: AddRowFeatureProps<TData>) => {
	// ---------- NEW: stable id generator ----------
	const idSeq = React.useRef(0);
	const newRid = React.useCallback(
		() => `rid_${Date.now()}_${idSeq.current++}`,
		[]
	);

	// track focused cell (optional visual)
	const focusedInputRef = React.useRef<{
		rowIndex: number;
		columnId: string;
	} | null>(null);
	const [focusedRowIndex, setFocusedRowIndex] = React.useState<number | null>(
		null
	);

	// Item search dialog state
	const [isItemSearchOpen, setIsItemSearchOpen] = React.useState(false);
	const [itemSearchTerm, setItemSearchTerm] = React.useState('');
	const [currentSearchingRow, setCurrentSearchingRow] = React.useState<{
		rowIndex: number;
		columnId: string;
		rowData: Partial<TData>;
	} | null>(null);

	// Track next insert row index while the item dialog is open
	const nextInsertRowIndexRef = React.useRef<number | null>(null);
	const populatedRowsRef = React.useRef<number[]>([]);
	const lastExpandedRidRef = React.useRef<string | null>(null);

	// Track IME state + a pending "Enter" while composing
	const isComposingRef = React.useRef(false);
	const pendingEnterRef = React.useRef<null | {
		rowIndex: number;
		columnId: string;
		rowData: Partial<TData>;
		value: string;
	}>(null);

	// Small helper to run the search
	const runSearch = React.useCallback(
		(
			value: string,
			rowIndex: number,
			columnId: string,
			rowData: Partial<TData>
		) => {
			// Only show search dialog for specific columns (itemNumber, itemName, itemSpec)
			const searchableColumns = ['itemNumber', 'itemName', 'itemSpec'];
			if (!searchableColumns.includes(columnId)) {
				return;
			}
			
			setItemSearchTerm(value);
			setCurrentSearchingRow({ rowIndex, columnId, rowData });
			nextInsertRowIndexRef.current = rowIndex;
			setIsItemSearchOpen(true);
		},
		[]
	);

	// Notify parent when add row data changes
	React.useEffect(() => {
		if (onAddRowDataChange && addRowRows.length > 0) {
			onAddRowDataChange(addRowRows);
		}
	}, [addRowRows, onAddRowDataChange]);

	// helpers
	const createEmptyRowData = React.useCallback((): Partial<TData> => {
		const emptyData: Partial<TData> = {};
		table.getAllColumns().forEach((column: any) => {
			if (column.id !== 'id' && column.id !== 'seq') {
				// Use default value if provided, otherwise empty string
				(emptyData as any)[column.id] = defaultRowValues?.[column.id as keyof TData] ?? '';
			}
		});
		return emptyData;
	}, [table, defaultRowValues]);

	const withRid = React.useCallback(
		(data: Partial<TData>): RowWithId<TData> => ({
			...(data as any),
			__rid: newRid(),
		}),
		[newRid]
	);

	// Expose API
	const getCurrentAddRowData = () => addRowRows;

	const clearAddRowData = () => {
		// keep number of rows but clear values
		onAddRowRowsChange((prev) => {
			if (prev.length === 0) return prev;
			const emptyData = createEmptyRowData();
			// keep the same rids if present; if not, add them
			return prev.map((row: Partial<TData>) => {
				const rid = (row as any).__rid ?? newRid();
				return { ...(emptyData as any), __rid: rid };
			});
		});
		setFocusedRowIndex(null);
		if (onAddRowDataChange) {
			const emptyRows = addRowRows.map(() => ({}) as Partial<TData>);
			onAddRowDataChange(emptyRows);
		}
	};

	const saveAllAddRows = () => {
		if (onAddRow && addRowRows.length > 0) {
			addRowRows.forEach((r) => {
				const { __rid, ...payload } = r as any;
				onAddRow(payload);
			});
			clearAddRowData();
		}
	};

	const handleAddRow = (count: number = 3) => {
		onAddRowModeChange(true);

		const template = createEmptyRowData();
		const newRows = Array.from({ length: count }, () =>
			withRid({ ...template })
		);

		onAddRowRowsChange((prev) => {
			const newAddRowRows = [
				...prev.map((r: any) =>
					r.__rid ? r : { ...r, __rid: newRid() }
				), // ensure old ones have rid
				...newRows,
			];

			// autofocus first cell of the first new row
			setTimeout(() => {
				const firstEditableColumn = columns.find(
					(col: any) => col.id !== 'id' && col.id !== 'seq'
				);
				if (firstEditableColumn) {
					const firstRowIndex = prev.length;
					const firstInput = document.querySelector(
						`input[data-column-id="${firstEditableColumn.id}"][data-row-index="${firstRowIndex}"]`
					) as HTMLInputElement | null;
					firstInput?.focus();
				}
			}, 0);

			return newAddRowRows;
		});
	};

	const handleNewRowCellChange = (
		rowIndex: number,
		columnId: string,
		value: string
	) => {
		onAddRowRowsChange((prev) => {
			const next = [...prev] as any[];
			if (next[rowIndex]) {
				const updatedRow = { ...next[rowIndex], [columnId]: value };
				
				// Auto calculate netPrice and grossPrice when unitPrice or number changes
				if (columnId === 'unitPrice' || columnId === 'number') {
					const unitPrice = Number(updatedRow.unitPrice || 0) || 0;
					const number = Number(updatedRow.number || 0) || 0;
					const calculatedTotal = unitPrice * number;
					
					updatedRow.netPrice = calculatedTotal.toString();
					updatedRow.grossPrice = calculatedTotal.toString();
				}
				
				next[rowIndex] = updatedRow;
			}
			return next;
		});
	};

	const checkAndAddMoreRows = (rowIndex: number, rowRid?: string) => {
		const currentRowCount = addRowRows.length;
		// only when focusing a cell in the current last row
		if (rowIndex !== currentRowCount - 1 || currentRowCount <= 2) return;

		// already expanded for this specific last row? do nothing
		if (rowRid && lastExpandedRidRef.current === rowRid) return;

		const template = createEmptyRowData();
		const extra1 = withRid({ ...template });
		const extra2 = withRid({ ...template });

		onAddRowRowsChange((prev) => [...prev, extra1, extra2]);

		// remember which last row we expanded for
		if (rowRid) lastExpandedRidRef.current = rowRid;
	};

	const handleCancelNewRow = () => {
		onAddRowModeChange(false);
		onAddRowRowsChange([]);
	};

	const handleItemSelect = (selectedItem: any) => {
		if (currentSearchingRow) {
			const baseIndex =
				nextInsertRowIndexRef.current ?? currentSearchingRow.rowIndex;
			onAddRowRowsChange((prev) => {
				const list = prev.map((r: any) =>
					r.__rid ? r : { ...r, __rid: newRid() }
				) as RowWithId<TData>[];
				while (list.length <= baseIndex) {
					list.push(withRid(createEmptyRowData()));
				}
				const currentRow = { ...(list[baseIndex] as any) };

				// map known fields
				if (selectedItem.id)
					currentRow.itemId = selectedItem.id;
				if (selectedItem.itemNo)
					currentRow.itemNo = selectedItem.itemNo;
				if (selectedItem.itemNumber)
					currentRow.itemNumber = selectedItem.itemNumber;
				if (selectedItem.itemName)
					currentRow.itemName = selectedItem.itemName;
				if (selectedItem.itemSpec)
					currentRow.itemSpec = selectedItem.itemSpec;
				if (selectedItem.compCode)
					currentRow.compCode = selectedItem.compCode;
				if (selectedItem.compName)
					currentRow.compName = selectedItem.compName;
				if (selectedItem.ceoName)
					currentRow.ceoName = selectedItem.ceoName;
				if (selectedItem.telNumber)
					currentRow.telNumber = selectedItem.telNumber;
				if (selectedItem.licenseNo)
					currentRow.licenseNo = selectedItem.licenseNo;

				// generic merge (skip id)
				Object.keys(selectedItem).forEach((k) => {
					if (k !== 'id' && selectedItem[k] != null)
						currentRow[k] = selectedItem[k];
				});

				list[baseIndex] = currentRow;

				if (!populatedRowsRef.current.includes(baseIndex))
					populatedRowsRef.current.push(baseIndex);

				// if last row populated, append two more
				if (baseIndex === list.length - 1) {
					list.push(
						withRid(createEmptyRowData()),
						withRid(createEmptyRowData())
					);
				}
				nextInsertRowIndexRef.current = baseIndex + 1;
				return list;
			});

			// force paint next tick (optional)
			setTimeout(() => onAddRowRowsChange((prev) => [...prev]), 0);
		}
		// leave search open for multi-pick
	};

	// Columns that are keyboard-navigable (same as Tab logic)
	const getTabVisibleColumns = React.useCallback(
		() => columns.filter((c: any) => c.id !== 'id' && c.id !== 'seq'),
		[columns]
	);

	const focusCell = React.useCallback(
		(rowIndex: number, columnId: string) => {
			const el = document.querySelector(
				`input[data-column-id="${columnId}"][data-row-index="${rowIndex}"]`
			) as HTMLInputElement | null;

			if (el) {
				el.focus();
				// place caret at end so ArrowUp can move immediately if desired
				const len = el.value.length;
				try {
					el.setSelectionRange(len, len);
				} catch {}
				// keep scroll nice
				el.scrollIntoView({ block: 'nearest' });
			}
		},
		[]
	);

	// Move horizontally between cells; expands rows when moving right from last col on last row
	const moveFocusHorizontal = React.useCallback(
		(
			dir: 'left' | 'right',
			rowIndex: number,
			columnId: string,
			rowRid?: string
		) => {
			const tabVisibleColumns = getTabVisibleColumns();
			const idx = tabVisibleColumns.findIndex(
				(c: any) => c.id === columnId
			);
			if (idx < 0) return;

			if (dir === 'right') {
				const isLastCol = idx === tabVisibleColumns.length - 1;
				if (isLastCol) {
					const nextRowIndex = rowIndex + 1;
					if (nextRowIndex >= addRowRows.length) {
						// add new rows then move
						checkAndAddMoreRows(rowIndex, rowRid);
						setTimeout(
							() =>
								focusCell(
									nextRowIndex,
									tabVisibleColumns[0].id
								),
							0
						);
					} else {
						focusCell(nextRowIndex, tabVisibleColumns[0].id);
					}
				} else {
					focusCell(rowIndex, tabVisibleColumns[idx + 1].id);
				}
			} else {
				const isFirstCol = idx === 0;
				if (isFirstCol) {
					const prevRowIndex = Math.max(0, rowIndex - 1);
					const lastColId =
						tabVisibleColumns[tabVisibleColumns.length - 1].id;
					focusCell(prevRowIndex, lastColId);
				} else {
					focusCell(rowIndex, tabVisibleColumns[idx - 1].id);
				}
			}
		},
		[
			getTabVisibleColumns,
			addRowRows.length,
			checkAndAddMoreRows,
			focusCell,
		]
	);

	// Is there any actual data in this row (ignore id/seq/__rid)?
	const rowHasData = React.useCallback((row: Partial<TData>) => {
		return Object.keys(row).some((k) => {
			if (k === '__rid' || k === 'id' || k === 'seq') return false;
			const v = (row as any)[k];
			return v !== undefined && v !== null && String(v).trim() !== '';
		});
	}, []);

	// Clear just one row, keep its rid
	const clearRow = React.useCallback(
		(rowIndex: number) => {
			onAddRowRowsChange((prev) => {
				const next = [...prev] as any[];
				const rid = (next[rowIndex] as any)?.__rid ?? newRid();
				const empty = { ...createEmptyRowData(), __rid: rid } as any;
				next[rowIndex] = empty;
				return next;
			});
		},
		[onAddRowRowsChange, createEmptyRowData, newRid]
	);

	React.useEffect(() => {
		if (onGetAddRowData) {
			(window as any).getCurrentAddRowData = getCurrentAddRowData;
			(window as any).clearAddRowData = clearAddRowData;
			(window as any).saveAllAddRows = saveAllAddRows;
		}
	}, [onGetAddRowData, addRowRows]); // keep references fresh

	React.useEffect(() => {
		if (triggerAddRow && useAddRowFeature && !isAddingRow) {
			handleAddRow();
		}
	}, [triggerAddRow, useAddRowFeature, isAddingRow]);

	React.useEffect(() => {
		if (triggerClearAddRow && useAddRowFeature) {
			clearAddRowData();
		}
	}, [triggerClearAddRow, useAddRowFeature]);

	React.useEffect(() => {
		// If any row lacks __rid, fill it once
		const needsRid = addRowRows.some((r) => !(r as any)?.__rid);
		if (!needsRid) return;

		onAddRowRowsChange((prev) =>
			prev.map((r) =>
				(r as any).__rid ? r : { ...(r as any), __rid: newRid() }
			)
		);
	}, [addRowRows, onAddRowRowsChange, newRid]);

	if (!useAddRowFeature || !isAddingRow) return null;

	const rows = table.getRowModel().rows;

	return (
		<>
			{addRowRows.map((rowData, rowIndex) => {
				const pageSize = table.getState().pagination.pageSize ?? 0;
				const currentPage = table.getState().pagination?.pageIndex ?? 0;
				const actualDataCount = pageSize * currentPage + rows.length;
				const addRowSequenceNumber = actualDataCount + rowIndex + 1;

				return (
					<tr
						key={(rowData as any).__rid} // ---------- FIX: stable key ----------
						className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
					>
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
							{addRowSequenceNumber}
						</td>

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
							className="py-2 text-center bg-muted"
						>
							{rowHasData(rowData) && (
								<Tooltip label="Clear row">
									<button
										type="button"
										aria-label="Clear row"
										onClick={() => clearRow(rowIndex)}
										className="inline-flex items-center justify-center w-7 h-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
									>
										<Trash2 className="w-4 h-4 text-gray-700 dark:text-gray-100" />
									</button>
								</Tooltip>
							)}
						</td>

						{columns
							.filter((c: any) => c.id !== 'id' && c.id !== 'seq')
							.map((column: any) => {
								const value = (rowData as any)[column.id] ?? '';
								const fieldType = columnFieldTypes?.[column.id];
								
								// Render select dropdown if column has select type
								if (fieldType?.type === 'select' && fieldType.options) {
									return (
										<td
											key={column.id}
											className="p-1 text-sm border-gray-300 dark:border-gray-600"
										>
											<select
												value={value as string}
												data-column-id={column.id}
												data-row-index={rowIndex}
												onFocus={() => {
													focusedInputRef.current = {
														rowIndex,
														columnId: column.id,
													};
													setFocusedRowIndex(rowIndex);

													// NEW: expand when focusing any cell of the last row (once per row)
													checkAndAddMoreRows(
														rowIndex,
														(rowData as any).__rid
													);
												}}
												onChange={(e) => {
													handleNewRowCellChange(
														rowIndex,
														column.id,
														(e.currentTarget as HTMLSelectElement).value
													);
												}}
												onBlur={() => {
													focusedInputRef.current = null;
													setFocusedRowIndex(null);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Tab') {
														// Handle Tab navigation for select
														e.preventDefault();
														const navColumns = columns.filter(
															(c: any) => c.id !== 'id' && c.id !== 'seq'
														);
														const currentColIndex = navColumns.findIndex(
															(c: any) => c.id === column.id
														);

														if (e.shiftKey) {
															// Previous column or row
															if (currentColIndex > 0) {
																const prevCol = navColumns[currentColIndex - 1];
																focusCell(rowIndex, prevCol.id);
															} else if (rowIndex > 0) {
																const lastCol = navColumns[navColumns.length - 1];
																focusCell(rowIndex - 1, lastCol.id);
															}
														} else {
															// Next column or row
															if (currentColIndex < navColumns.length - 1) {
																const nextCol = navColumns[currentColIndex + 1];
																focusCell(rowIndex, nextCol.id);
															} else {
																const nextRowIndex = rowIndex + 1;
																if (nextRowIndex >= addRowRows.length) {
																	checkAndAddMoreRows(rowIndex, (rowData as any).__rid);
																	setTimeout(() => focusCell(nextRowIndex, navColumns[0].id), 0);
																} else {
																	focusCell(nextRowIndex, navColumns[0].id);
																}
															}
														}
													} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
														// Handle vertical navigation for select
														if (e.key === 'ArrowUp') {
															e.preventDefault();
															const prevIndex = Math.max(0, rowIndex - 1);
															focusCell(prevIndex, column.id);
														} else {
															e.preventDefault();
															const nextIndex = rowIndex + 1;
															if (nextIndex >= addRowRows.length) {
																checkAndAddMoreRows(rowIndex, (rowData as any).__rid);
																setTimeout(() => focusCell(nextIndex, column.id), 0);
															} else {
																focusCell(nextIndex, column.id);
															}
														}
													}
												}}
												className="w-full h-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
											>
												<option value="">선택하세요</option>
												{fieldType.options.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</td>
									);
								}
								
								// Render date input if column has date type
								if (fieldType?.type === 'date') {
									// Set default value to today's date if empty (only when focusing)
									const handleDateFocus = () => {
										focusedInputRef.current = {
											rowIndex,
											columnId: column.id,
										};
										setFocusedRowIndex(rowIndex);

										// Set default value to today's date if empty
										if (!value) {
											const today = new Date();
											const year = today.getFullYear();
											const month = (today.getMonth() + 1)
												.toString()
												.padStart(2, '0');
											const day = today
												.getDate()
												.toString()
												.padStart(2, '0');
											const todayString = `${year}-${month}-${day}`;
											handleNewRowCellChange(
												rowIndex,
												column.id,
												todayString
											);
										}

										// NEW: expand when focusing any cell of the last row (once per row)
										checkAndAddMoreRows(
											rowIndex,
											(rowData as any).__rid
										);
									};
									
									return (
										<td
											key={column.id}
											className="p-1 text-sm border-gray-300 dark:border-gray-600"
										>
											<div 
												data-column-id={column.id}
												data-row-index={rowIndex}
												onFocus={handleDateFocus}
												onBlur={() => {
													focusedInputRef.current = null;
													setFocusedRowIndex(null);
												}}
												className="relative w-full overflow-visible"
											>
												<PrimesDatePicker
													mode="single"
													value={value ? { startDate: new Date(value as string), endDate: new Date(value as string) } : null}
													onChange={(dateValue) => {
														if (dateValue && dateValue.startDate) {
															const formattedDate = new Date(dateValue.startDate).toISOString().slice(0, 10);
															handleNewRowCellChange(
																rowIndex,
																column.id,
																formattedDate
															);
														}
													}}
													placeholder="날짜 선택"
													className="date-picker-table-cell"
												/>
											</div>
										</td>
									);
								}
								
								// Default text input
								const textAlign = fieldType?.align || 'left';
								const alignClass = textAlign === 'right' ? 'text-right' : textAlign === 'center' ? 'text-center' : 'text-left';
								
								return (
									<td
										key={column.id}
										className="p-1 text-sm border-gray-300 dark:border-gray-600"
									>
										<input
											type="text"
											value={value as string}
											placeholder={`Enter ${column.columnDef.header}`}
											data-column-id={column.id}
											data-row-index={rowIndex}
											onFocus={() => {
												focusedInputRef.current = {
													rowIndex,
													columnId: column.id,
												};
												setFocusedRowIndex(rowIndex);

												// NEW: expand when focusing any cell of the last row (once per row)
												checkAndAddMoreRows(
													rowIndex,
													(rowData as any).__rid
												);
											}}
											onChange={(e) => {
												handleNewRowCellChange(
													rowIndex,
													column.id,
													(
														e.currentTarget as HTMLInputElement
													).value
												);
											}}
											onBlur={() => {
												focusedInputRef.current = null;
												setFocusedRowIndex(null);
											}}
											onCompositionStart={() => {
												isComposingRef.current = true;
											}}
											onCompositionEnd={(e) => {
												isComposingRef.current = false;

												// Use currentTarget for the committed final string
												const committed = (
													e.currentTarget as HTMLInputElement
												).value;

												if (pendingEnterRef.current) {
													const {
														rowIndex,
														columnId,
														rowData,
													} = pendingEnterRef.current;
													pendingEnterRef.current =
														null;

													// In controlled inputs, wait a tick so React applies the final value
													setTimeout(
														() =>
															runSearch(
																committed.trim(),
																rowIndex,
																columnId,
																rowData
															),
														0
													);
												}
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													const value = (
														e.currentTarget as HTMLInputElement
													).value;

													// If composing, remember the intent and do it after composition ends
													if (
														isComposingRef.current
													) {
														pendingEnterRef.current =
															{
																rowIndex,
																columnId:
																	column.id,
																rowData,
																value,
															};
														return;
													}

													// Extra safety for browsers that expose native composing flags
													const ne =
														e.nativeEvent as KeyboardEvent & {
															isComposing?: boolean;
														};
													if (
														ne.isComposing ===
															true ||
														(e.key as any) ===
															'Process'
													) {
														pendingEnterRef.current =
															{
																rowIndex,
																columnId:
																	column.id,
																rowData,
																value,
															};
														return;
													}

													// Normal (non-IME) path
													runSearch(
														value,
														rowIndex,
														column.id,
														rowData
													);
													return;
												} else if (
													e.key === 'ArrowUp' ||
													e.key === 'ArrowDown'
												) {
													const ne =
														e.nativeEvent as KeyboardEvent & {
															isComposing?: boolean;
														};
													if (
														isComposingRef.current ||
														ne.isComposing === true
													)
														return;

													const input =
														e.currentTarget as HTMLInputElement;
													const start =
														input.selectionStart ??
														0;
													const end =
														input.selectionEnd ?? 0;
													const caretAtStart =
														start === 0 &&
														end === 0;
													const caretAtEnd =
														start ===
															input.value
																.length &&
														end ===
															input.value.length;

													if (e.key === 'ArrowUp') {
														e.preventDefault();
														const prevIndex =
															Math.max(
																0,
																rowIndex - 1
															);
														focusCell(
															prevIndex,
															column.id
														);
														return;
													} else {
														e.preventDefault();
														const nextIndex =
															rowIndex + 1;

														if (
															nextIndex >=
															addRowRows.length
														) {
															// ensure there is a next row, then focus it
															checkAndAddMoreRows(
																rowIndex,
																(rowData as any)
																	.__rid
															);
															setTimeout(
																() =>
																	focusCell(
																		nextIndex,
																		column.id
																	),
																0
															);
														} else {
															focusCell(
																nextIndex,
																column.id
															);
														}
														return;
													}
												} else if (
													e.key === 'ArrowRight' ||
													e.key === 'ArrowLeft'
												) {
													const ne =
														e.nativeEvent as KeyboardEvent & {
															isComposing?: boolean;
														};
													if (
														isComposingRef.current ||
														ne.isComposing === true
													)
														return;

													const input =
														e.currentTarget as HTMLInputElement;
													const start =
														input.selectionStart ??
														0;
													const end =
														input.selectionEnd ?? 0;
													const len =
														input.value.length;

													const atStart =
														start === 0 &&
														end === 0;
													const atEnd =
														start === len &&
														end === len;

													// Only navigate between cells when caret is at a boundary
													if (
														e.key ===
															'ArrowRight' &&
														atEnd
													) {
														e.preventDefault();
														moveFocusHorizontal(
															'right',
															rowIndex,
															column.id,
															(rowData as any)
																.__rid
														);
														return;
													}
													if (
														e.key === 'ArrowLeft' &&
														atStart
													) {
														e.preventDefault();
														moveFocusHorizontal(
															'left',
															rowIndex,
															column.id,
															(rowData as any)
																.__rid
														);
														return;
													}
												} else if (e.key === 'Tab') {
													e.preventDefault();
													const dir = e.shiftKey
														? 'left'
														: 'right';
													moveFocusHorizontal(
														dir,
														rowIndex,
														column.id,
														(rowData as any).__rid
													);
													return;
												}
											}}
											className={`w-full h-full outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 bg-transparent p-2 ${alignClass} ${
												focusedRowIndex === rowIndex
													? 'border border-Colors-Brand-600 dark:border-Colors-Brand-500 rounded-lg focus:ring-2 focus:ring-Colors-Brand-500/70'
													: 'border-none'
											}`}
										/>
									</td>
								);
							})}
					</tr>
				);
			})}

			{/* Search Dialog */}
			{searchDialog && (
				<DraggableDialog
					title={`Search - ${currentSearchingRow?.columnId || 'All'}`}
					content={React.createElement(searchDialog, {
						searchTerm: itemSearchTerm,
						columnId: currentSearchingRow?.columnId || '',
						rowData: currentSearchingRow?.rowData || {},
						onItemSelect: handleItemSelect,
						onClose: () => {
							setIsItemSearchOpen(false);
							setItemSearchTerm('');
							setCurrentSearchingRow(null);
							if (populatedRowsRef.current.length > 0) {
								setTimeout(() => {
									const lastPopulatedRowIndex = Math.max(
										...populatedRowsRef.current
									);
									const firstEditableColumn = columns.find(
										(col: any) =>
											col.id !== 'id' && col.id !== 'seq'
									);
									if (firstEditableColumn) {
										const firstInput =
											document.querySelector(
												`input[data-column-id="${firstEditableColumn.id}"][data-row-index="${lastPopulatedRowIndex}"]`
											) as HTMLInputElement | null;
										firstInput?.focus();
									}
									populatedRowsRef.current = [];
								}, 200);
							}
						},
					})}
					open={isItemSearchOpen}
					onOpenChange={setIsItemSearchOpen}
					defaultPosition={{ x: 50, y: 50 }}
				/>
			)}
		</>
	);
};
