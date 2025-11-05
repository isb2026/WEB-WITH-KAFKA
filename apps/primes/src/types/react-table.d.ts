/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (
			rowIndex: number,
			columnId: string,
			value: unknown
		) => void;
	}
}
/* eslint-enable @typescript-eslint/no-unused-vars */
