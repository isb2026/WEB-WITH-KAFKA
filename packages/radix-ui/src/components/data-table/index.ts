export * from './table-body';
export * from './table-header';
export * from './TablePagination';
export * from './TableControls';
// Temporary fix for @tanstack/react-table type issues
export type DataTableType<TData = any> = any;
export type DataTableRowType<TData = any> = any;
export type DataTableColumnType<TData = any> = any;

export const SEQ_COL_WIDTH = 28; // 순번 column width
export const CHECKBOX_COL_WIDTH = 28; // checkbox column width
export const BASE_LEFT_OFFSET = SEQ_COL_WIDTH + CHECKBOX_COL_WIDTH;
