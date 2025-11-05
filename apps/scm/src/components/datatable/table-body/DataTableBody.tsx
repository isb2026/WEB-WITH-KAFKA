import React from 'react';
import { Row, flexRender } from '@tanstack/react-table';

export interface DataTableBodyProps<TData> {
	rows: Row<TData>[];
	selectedRows?: Set<string>;
	toggleRowSelection?: (rowId: string) => void;
	enableSingleSelect?: boolean;
	onRowClick?: (row: Row<TData>) => void;
}

export const DataTableBody = <TData,>({
	rows,
	selectedRows,
	toggleRowSelection,
	enableSingleSelect = false,
	onRowClick,
}: DataTableBodyProps<TData>) => {
	const getRowId = (row: Row<TData>) => {
		// 행의 ID를 가져오는 로직 (원본 데이터에서 id 필드 사용)
		const original = row.original as any;
		return String(original?.id || row.id);
	};

	const handleRowClick = (row: Row<TData>) => {
		const rowId = getRowId(row);

		// 단일 선택 모드인 경우 기존 선택을 해제
		if (
			enableSingleSelect &&
			selectedRows &&
			selectedRows.size > 0 &&
			!selectedRows.has(rowId)
		) {
			selectedRows.forEach((id) => toggleRowSelection?.(id));
		}

		toggleRowSelection?.(rowId);
		onRowClick?.(row);
	};

	return (
		<tbody>
			{rows.map((row) => {
				const rowId = getRowId(row);
				const isSelected = selectedRows?.has(rowId) || false;

				return (
					<tr
						key={row.id}
						className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
							isSelected ? 'bg-blue-50' : ''
						}`}
						onClick={() => handleRowClick(row)}
					>
						{row.getVisibleCells().map((cell) => (
							<td
								key={cell.id}
								className="px-3 py-2 text-sm text-gray-900 truncate"
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</td>
						))}
					</tr>
				);
			})}
		</tbody>
	);
};

export default DataTableBody;
