import React, { useMemo, useState, useCallback } from 'react';
import { RadixButton } from '@radix-ui/components/Button';
import { Search } from 'lucide-react';

interface CommandSearchDialogProps {
	searchTerm: string;
	columnId: string;
	rowData: Record<string, string | number>;
	onCommandSelect: (command: any) => void;
	onClose: () => void;
	searchResults?: any[]; // 외부에서 검색 결과를 전달받을 수 있도록 추가
}

interface CommandColumn {
	accessorKey: string;
	header: string;
	size: number;
}

export const CommandSearchDialog: React.FC<CommandSearchDialogProps> = ({
	searchTerm,
	columnId,
	rowData,
	onCommandSelect,
	onClose,
	searchResults = [],
}) => {
	// Selected rows (feedback)
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(
		new Set()
	);

	// Quick search UI state
	const [quickTerm, setQuickTerm] = useState<string>(searchTerm ?? '');

	// Flag to show overlay spinner specifically for a Quick Search refetch
	const [isQuickRefetching, setIsQuickRefetching] = useState(false);

	// Mock data - 실제로는 API에서 가져올 데이터
	const mockCommands = useMemo(
		() => [
			{
				id: 1,
				commandNumber: 'CMD20240115001',
				productName: '제품 A',
				processName: '가공 공정',
				workUnit: 'EA',
				commandAmount: 100,
				completedAmount: 60,
				remainingAmount: 40,
				startDate: '2024-01-15',
				endDate: '2024-01-20',
				status: 'IN_PROGRESS',
				statusValue: '진행중',
			},
			{
				id: 2,
				commandNumber: 'CMD20240115002',
				productName: '제품 B',
				processName: '조립 공정',
				workUnit: 'EA',
				commandAmount: 50,
				completedAmount: 50,
				remainingAmount: 0,
				startDate: '2024-01-16',
				endDate: '2024-01-21',
				status: 'COMPLETED',
				statusValue: '완료',
			},
			{
				id: 3,
				commandNumber: 'CMD20240115003',
				productName: '제품 A',
				processName: '검사 공정',
				workUnit: 'EA',
				commandAmount: 75,
				completedAmount: 0,
				remainingAmount: 75,
				startDate: '2024-01-17',
				endDate: '2024-01-22',
				status: 'PENDING',
				statusValue: '대기중',
			},
		],
		[]
	);

	// Filter commands based on search term
	const filteredCommands = useMemo(() => {
		// 외부에서 전달받은 검색 결과가 있으면 그것을 사용
		if (searchResults.length > 0) {
			return searchResults;
		}

		// 그렇지 않으면 내부 mock 데이터 사용
		if (!quickTerm.trim()) return mockCommands;

		return mockCommands.filter(
			(command) =>
				command.commandNumber
					.toLowerCase()
					.includes(quickTerm.toLowerCase()) ||
				command.productName
					.toLowerCase()
					.includes(quickTerm.toLowerCase()) ||
				command.processName
					.toLowerCase()
					.includes(quickTerm.toLowerCase())
		);
	}, [searchResults, mockCommands, quickTerm]);

	const triggerQuickSearch = useCallback(() => {
		setIsQuickRefetching(true);
		// Simulate API call delay
		setTimeout(() => {
			setIsQuickRefetching(false);
		}, 500);
	}, []);

	const commandColumns: CommandColumn[] = [
		{
			accessorKey: 'commandNumber',
			header: '작업지시번호',
			size: 150,
		},
		{
			accessorKey: 'productName',
			header: '제품명',
			size: 150,
		},
		{
			accessorKey: 'processName',
			header: '공정명',
			size: 150,
		},
		{
			accessorKey: 'workUnit',
			header: '단위',
			size: 80,
		},
		{
			accessorKey: 'commandAmount',
			header: '지시수량',
			size: 100,
		},
		{
			accessorKey: 'completedAmount',
			header: '완료수량',
			size: 100,
		},
		{
			accessorKey: 'remainingAmount',
			header: '잔량',
			size: 100,
		},
		{
			accessorKey: 'startDate',
			header: '시작일',
			size: 100,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 80,
		},
	];

	const getCommandValue = (command: any, key: string): string => {
		const value = command[key];
		if (value === null || value === undefined) return '-';

		// 수량 관련 컬럼에 콤마 포맷팅 적용
		if (
			['commandAmount', 'completedAmount', 'remainingAmount'].includes(
				key
			)
		) {
			if (typeof value === 'number') {
				return value.toLocaleString('ko-KR');
			}
		}

		// 상태 컬럼은 statusValue 사용
		if (key === 'status') {
			return command.statusValue || command.status || '-';
		}

		if (typeof value === 'string' || typeof value === 'number')
			return String(value);
		return String(value);
	};

	// Table layout helpers
	const TBODY_BASE = 'block h-80 overflow-auto';
	const TR_TABLE_ROW = 'table w-full table-fixed';
	const CENTER_CELL = 'h-80 w-full grid place-items-center';

	const showSpinner = isQuickRefetching;

	return (
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
						placeholder="작업지시번호, 제품명, 공정명으로 검색"
						className="w-full h-full px-2 text-sm border-none outline-none placeholder-gray-500 focus:ring-0 bg-transparent"
						value={quickTerm}
						onChange={(e) => setQuickTerm(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') triggerQuickSearch();
						}}
					/>
				</div>

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
							{commandColumns.map((column) => (
								<th
									key={column.accessorKey}
									className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b bg-gray-50"
									style={{ width: column.size }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>

					{(showSpinner ||
						(!showSpinner && filteredCommands.length === 0)) && (
						<tbody className={TBODY_BASE}>
							<tr className={TR_TABLE_ROW}>
								<td
									colSpan={commandColumns.length}
									className="p-0"
								>
									<div className={CENTER_CELL}>
										{showSpinner ? (
											<div className="flex items-center justify-center">
												<div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500" />
											</div>
										) : (
											<div className="text-sm text-gray-500">
												검색 결과가 없습니다.
											</div>
										)}
									</div>
								</td>
							</tr>
						</tbody>
					)}

					{!showSpinner && filteredCommands.length > 0 && (
						<tbody className={TBODY_BASE}>
							{filteredCommands.map(
								(command: any, index: number) => {
									const rowKey = command.id ?? index;
									const isSelected =
										selectedRowIds.has(rowKey);
									return (
										<tr
											key={rowKey}
											className={`${TR_TABLE_ROW} ${
												isSelected
													? 'bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-600'
													: 'bg-white hover:bg-gray-50'
											} cursor-pointer border-b`}
											onClick={() => {
												onCommandSelect(command);
												setSelectedRowIds((prev) => {
													const next = new Set(prev);
													next.add(rowKey);
													return next;
												});
											}}
										>
											{commandColumns.map((column) => (
												<td
													key={column.accessorKey}
													className={`px-3 py-2 text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}
													style={{
														width: column.size,
													}}
												>
													<span
														className={`${
															isSelected
																? 'text-white hover:border-b hover:border-white'
																: 'hover:text-blue-600 hover:border-b hover:border-blue-600'
														} cursor-pointer`}
														onClick={(e) => {
															e.stopPropagation();
															onCommandSelect(
																command
															);
															onClose();
														}}
													>
														{getCommandValue(
															command,
															column.accessorKey
														)}
													</span>
												</td>
											))}
										</tr>
									);
								}
							)}
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
