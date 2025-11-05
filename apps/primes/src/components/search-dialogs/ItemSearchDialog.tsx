import React, { useMemo, useState, useCallback } from 'react';
import { useItem } from '@primes/hooks/init/item/useItem';
import { ItemSearchRequest, ItemDto } from '@primes/types/item';
import { RadixButton } from '@radix-ui/components/Button';
import { Search } from 'lucide-react';

interface ItemSearchDialogProps {
	searchTerm: string;
	columnId: string;
	rowData: Record<string, string | number>;
	onItemSelect: (item: ItemDto) => void;
	onClose: () => void;
}

interface ItemColumn {
	accessorKey: keyof ItemDto | 'itemNo';
	header: string;
	size: number;
}

type QuickField = 'itemNumber' | 'itemName';

export const ItemSearchDialog: React.FC<ItemSearchDialogProps> = ({
	searchTerm,
	columnId,
	rowData,
	onItemSelect,
	onClose,
}) => {
	// Selected rows (feedback)
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(
		new Set()
	);

	// Quick search UI state
	const [quickTerm, setQuickTerm] = useState<string>(searchTerm ?? '');
	const [quickField, setQuickField] = useState<QuickField>('itemNumber');

	// Flag to show overlay spinner specifically for a Quick Search refetch
	const [isQuickRefetching, setIsQuickRefetching] = useState(false);

	/**
	 * rowData/columnId → ItemSearchRequest mapping
	 * NOTE: never normalize itemNo to itemNumber.
	 */
	const fieldToSearchMap: Record<string, keyof ItemSearchRequest> = {
		itemNumber: 'itemNumber',
		itemName: 'itemName',
		itemSpec: 'itemSpec',
		itemModel: 'itemModel',
		itemUnit: 'itemUnit',
		orderUnit: 'itemUnit',
		lotSize: 'lotSizeCode',
		itemType1Code: 'itemType1Code',
		itemType2Code: 'itemType2Code',
		itemType3Code: 'itemType3Code',
		lotSizeCode: 'lotSizeCode',
	};

	const buildBaseRequest = useCallback((): ItemSearchRequest => {
		const req: ItemSearchRequest = { isUse: true };

		Object.entries(rowData).forEach(([fieldName, fieldValue]) => {
			if (
				fieldValue !== undefined &&
				fieldValue !== '' &&
				fieldToSearchMap[fieldName]
			) {
				const searchField = fieldToSearchMap[fieldName];
				// Type-safe assignment
				switch (searchField) {
					case 'itemNumber':
						req.itemNumber = String(fieldValue);
						break;
					case 'itemName':
						req.itemName = String(fieldValue);
						break;
					case 'itemSpec':
						req.itemSpec = String(fieldValue);
						break;
					case 'itemModel':
						req.itemModel = String(fieldValue);
						break;
					case 'itemUnit':
						req.itemUnit = String(fieldValue);
						break;
					case 'lotSizeCode':
						req.lotSizeCode = String(fieldValue);
						break;
					case 'itemType1Code':
						req.itemType1Code = String(fieldValue);
						break;
					case 'itemType2Code':
						req.itemType2Code = String(fieldValue);
						break;
					case 'itemType3Code':
						req.itemType3Code = String(fieldValue);
						break;
				}
			}
		});

		// If nothing mapped, fall back to columnId
		if (Object.keys(req).length === 1) {
			const fallbackField = fieldToSearchMap[columnId];
			if (fallbackField) {
				const fallbackValue = searchTerm ?? '';
				switch (fallbackField) {
					case 'itemNumber':
						req.itemNumber = fallbackValue;
						break;
					case 'itemName':
						req.itemName = fallbackValue;
						break;
					case 'itemSpec':
						req.itemSpec = fallbackValue;
						break;
					case 'itemModel':
						req.itemModel = fallbackValue;
						break;
					case 'itemUnit':
						req.itemUnit = fallbackValue;
						break;
					case 'lotSizeCode':
						req.lotSizeCode = fallbackValue;
						break;
					case 'itemType1Code':
						req.itemType1Code = fallbackValue;
						break;
					case 'itemType2Code':
						req.itemType2Code = fallbackValue;
						break;
					case 'itemType3Code':
						req.itemType3Code = fallbackValue;
						break;
				}
			}
		}

		return req;
	}, [rowData, columnId, searchTerm]);

	// Search request actually sent to the hook
	const [searchRequest, setSearchRequest] = useState<ItemSearchRequest>(() =>
		buildBaseRequest()
	);

	const triggerQuickSearch = useCallback(() => {
		setIsQuickRefetching(true); // turn on overlay spinner for this quick search
		const term = quickTerm.trim();

		// If empty → send "all data" request (only isUse)
		if (term === '') {
			setSearchRequest({ isUse: true });
			return;
		}

		// Build base, but strip BOTH quick fields so only the chosen one remains
		const base = buildBaseRequest();

		const { itemNumber: _ignoreNum, itemName: _ignoreName, ...rest } = base;

		const req: ItemSearchRequest = { ...rest, isUse: true };
		if (quickField === 'itemNumber') req.itemNumber = term;
		else req.itemName = term;

		setSearchRequest(req);
	}, [quickTerm, quickField, buildBaseRequest]);

	// Data hook
	const { list } = useItem({ searchRequest, page: 0, size: 20 });
	const { data: response, isLoading, error } = list;

	// React Query fetchStatus: 'fetching' | 'paused' | 'idle'
	const fetchStatus = (
		list as { fetchStatus?: 'fetching' | 'paused' | 'idle' }
	)?.fetchStatus;

	// Stop the "quick refetch" overlay once the network settles
	React.useEffect(() => {
		if (isQuickRefetching && fetchStatus !== 'fetching') {
			setIsQuickRefetching(false);
		}
	}, [fetchStatus, isQuickRefetching]);

	/**
	 * Spinner rules (same place):
	 *  - Show spinner if:
	 *    A) initial/cold load with no data yet, OR
	 *    B) a Quick Search was triggered AND the network is currently fetching.
	 */
	const showSpinner =
		((isLoading || fetchStatus === 'fetching') && !response) ||
		(isQuickRefetching && fetchStatus === 'fetching');

	// Shape response
	const items = useMemo((): ItemDto[] => {
		if (!response) return [];
		if (Array.isArray(response)) return response;

		// Check if response has content property (ItemListResponse type)
		const responseWithContent = response as { content?: ItemDto[] };
		if (
			responseWithContent.content &&
			Array.isArray(responseWithContent.content)
		) {
			return responseWithContent.content;
		}

		return [];
	}, [response]);

	const itemColumns: ItemColumn[] = [
		{
			accessorKey: 'itemNo' as keyof ItemDto,
			header: '품목번호',
			size: 100,
		},
		{ accessorKey: 'itemNumber', header: '품번', size: 150 },
		{ accessorKey: 'itemName', header: '품명', size: 200 },
		{ accessorKey: 'itemSpec', header: '규격', size: 150 },
		{ accessorKey: 'itemUnit', header: '단위', size: 100 },
		{ accessorKey: 'itemModel', header: '모델명', size: 120 },
	];

	const getItemValue = (
		item: ItemDto,
		key: keyof ItemDto | 'itemNo'
	): string => {
		// Handle itemNo special case
		if (key === 'itemNo') {
			return String(item.itemNo);
		}

		const value = item[key as keyof ItemDto];
		if (value === null || value === undefined) return '-';
		if (typeof value === 'string' || typeof value === 'number')
			return String(value);
		if (Array.isArray(value))
			return value.length > 0 ? `${value.length}개` : '-';
		return String(value);
	};

	// Table layout helpers
	const TBODY_BASE = 'block h-80 overflow-auto';
	const TR_TABLE_ROW = 'table w-full table-fixed';
	const CENTER_CELL = 'h-80 w-full grid place-items-center';

	return (
		// Fix draggable cursor bleed: force normal cursor within this dialog content.
		<div
			aria-busy={showSpinner}
			className="cursor-auto"
			style={{ cursor: 'auto' }}
		>
			{/* Quick Search */}
			<div className="mb-2 flex items-center gap-2">
				<div className="flex items-center w-full h-9 pl-2 text-sm border border-gray-300 rounded-md bg-white ">
					<button
						type="button"
						aria-label="Search"
						className="mr-2 inline-flex items-center justify-center cursor-pointer"
						onClick={triggerQuickSearch}
					>
						<Search className="text-gray-500 w-4 h-4" />
					</button>

					<input
						type="text"
						placeholder="Keyword search (default: Item No.)"
						className="w-full h-full px-2 text-sm border-none outline-none placeholder-gray-500 focus:ring-0 bg-transparent"
						value={quickTerm}
						onChange={(e) => setQuickTerm(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') triggerQuickSearch();
						}}
					/>

					{/* Native select for field choice */}
					<div className="border-l w-24 h-9 inline-flex items-center gap-2">
						<select
							id="quickField"
							className="h-8 w-full rounded text-sm px-2 focus:outline-none"
							value={quickField}
							onChange={(e) =>
								setQuickField(e.target.value as QuickField)
							}
						>
							<option value="itemNumber">품번</option>
							<option value="itemName">품명</option>
						</select>
					</div>
				</div>

				{/* Ensure pointer cursor on the Search button even if a parent sets cursor:move */}
				<RadixButton
					type="button"
					className="h-9 min-w-max px-6 rounded-md text-sm items-center border"
					onClick={triggerQuickSearch}
					aria-label="검색"
					style={{ cursor: 'pointer' }}
				>
					검색
				</RadixButton>
			</div>

			{/* Result Table */}
			<div className="border rounded-lg overflow-hidden">
				<table className="w-full border-collapse">
					{/* Header */}
					<thead className="table w-full table-fixed bg-gray-50 z-10">
						<tr className={TR_TABLE_ROW}>
							{itemColumns.map((column) => (
								<th
									key={column.accessorKey as string}
									className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b bg-gray-50"
									style={{ width: column.size }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>

					{(showSpinner ||
						error ||
						(!showSpinner && !error && items.length === 0)) && (
						<tbody className={TBODY_BASE}>
							<tr className={TR_TABLE_ROW}>
								<td
									colSpan={itemColumns.length}
									className="p-0"
								>
									<div className={CENTER_CELL}>
										{showSpinner ? (
											<div className="flex items-center justify-center">
												<div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500" />
											</div>
										) : error ? (
											<div className="text-sm text-red-500">
												An error occurred during search.
											</div>
										) : (
											<div className="text-sm text-gray-500">
												No results.
											</div>
										)}
									</div>
								</td>
							</tr>
						</tbody>
					)}

					{!showSpinner && !error && items.length > 0 && (
						<tbody className={TBODY_BASE}>
							{items.map((item: ItemDto, index: number) => {
								const rowKey = item.id ?? index;
								const isSelected = selectedRowIds.has(rowKey);
								return (
									<tr
										key={rowKey}
										className={`${TR_TABLE_ROW} ${
											isSelected
												? 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-600'
												: 'bg-white hover:bg-gray-50'
										} cursor-pointer border-b`}
										onClick={() => {
											onItemSelect(item);
											setSelectedRowIds((prev) => {
												const next = new Set(prev);
												next.add(rowKey);
												return next;
											});
										}}
									>
										{itemColumns.map((column) => (
											<td
												key={
													column.accessorKey as string
												}
												className={`px-3 py-2 text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}
												style={{ width: column.size }}
											>
												<span
													className={`${
														isSelected
															? 'text-white hover:border-b hover:border-white'
															: 'hover:text-blue-600 hover:border-b hover:border-blue-600'
													} cursor-pointer`}
													onClick={(e) => {
														e.stopPropagation();
														onItemSelect(item);
														onClose();
													}}
												>
													{getItemValue(
														item,
														column.accessorKey
													)}
												</span>
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					)}
				</table>
			</div>

			{/* Close */}
			<div className="flex justify-end pt-3">
				<RadixButton
					type="button"
					className="px-4 py-1.5 rounded-lg text-sm items-center border"
					onClick={onClose}
					style={{ cursor: 'pointer' }}
				>
					확인
				</RadixButton>
			</div>
		</div>
	);
};
