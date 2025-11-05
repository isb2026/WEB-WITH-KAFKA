import { PageNationContainer } from './../../../toasto/src/components/common/ToastoGridStyled';
// hooks/useDataTable.ts
import { useState, useEffect } from 'react';
import * as ReactTable from '@tanstack/react-table';
const getCoreRowModel = (ReactTable as any).getCoreRowModel || (() => {});
const getSortedRowModel = (ReactTable as any).getSortedRowModel || (() => {});
const useReactTable = (ReactTable as any).useReactTable || (() => {});
type SortingState = any;
type ColumnPinningState = any;
type PaginationState = any;
import { ProcessedColumnDef } from './useDataTableColumns';

/**
 * DataTable 전용 훅
 * @param data 테이블에 표시할 데이터 배열
 * @param columns 테이블 컬럼 정의
 * @param defaultPageSize 기본 페이지 크기 (기본값: 30)
 */
export function useDataTable<TData, TValue>(
	data: TData[],
	columns: ProcessedColumnDef<TData, TValue>[],
	defaultPageSize = 30,
	pageCount = 0,
	page = 0,
	totalElements: number = 0,
	onPageChange?: (page: PaginationState) => void
) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
		left: [],
		right: [],
	});
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [editingCell, setEditingCell] = useState<{
		rowIndex: number;
		columnId: string;
	} | null>(null);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: page,
		pageSize: defaultPageSize,
	});

	useEffect(() => {
		setPagination((p: any) => ({
			...p,
			pageIndex: page,
			pageSize: defaultPageSize,
		}));
	}, [page, defaultPageSize]);

	const table = useReactTable({
		data: data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnPinning,
			pagination,
		},
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnPinningChange: setColumnPinning,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater: any) => {
			setPagination((current: any) => {
				const newPagination =
					typeof updater === 'function' ? updater(current) : updater;
				if (onPageChange) {
					onPageChange(newPagination);
				}
				return newPagination;
			});
		},
		// getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: 'onChange',
		enableColumnResizing: true,
		manualPagination: true,
		enableSorting: true,
		rowCount: totalElements,
		pageCount: pageCount,
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

	return {
		table,
		searchQuery,
		setSearchQuery,
		editingCell,
		setEditingCell,
		selectedRows,
		toggleRowSelection,
	};
}
