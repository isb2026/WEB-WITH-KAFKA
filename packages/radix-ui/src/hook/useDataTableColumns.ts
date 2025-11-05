// Temporary fix for @tanstack/react-table import issues
type CellContext<T = any, V = any> = any;
type ColumnDef<T = any, V = any> = any;
import { ReactNode } from 'react';

// Utility type for processed column definitions
export type ProcessedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
	headerContent?: ReactNode;
	align?: 'left' | 'center' | 'right';
};

// Assuming ColumnConfig is defined in dataTableConfig.ts or imported here
export type ColumnConfig<T> = {
	accessorKey: keyof T;
	header: string;
	size?: number;
	minSize?: number;
	align?: 'left' | 'center' | 'right';
	enableSummary?: boolean;
	cell?: (props: CellContext<T, unknown>) => JSX.Element | string | number;
};

// Utility type for processed column definitions
export type ProcessedColumnConfig<T> = ColumnConfig<T> & {
	headerContent?: ReactNode;
	align?: 'left' | 'center' | 'right';
};

// Hook to process column definitions
export function useDataTableColumns<T>(
	columns: ColumnConfig<T>[]
): ProcessedColumnConfig<T>[] {
	return columns.map((column) => ({
		...column,
		headerContent: column.header,
		header: column.header,
		size: column.size,
		minSize: column.minSize,
		align: column.align || 'left',
	}));
}
