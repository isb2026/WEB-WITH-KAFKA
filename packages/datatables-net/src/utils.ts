import { Column } from './components/DataTable';

/**
 * Creates a column configuration for DataTable
 */
export const createColumn = (
	title: string,
	data: string | null,
	options: Partial<Column> = {}
): Column => {
	return {
		title,
		data,
		...options,
	};
};

/**
 * Creates a pinned column (left or right)
 */
export const createPinnedColumn = (
	title: string,
	data: string | null,
	side: 'left' | 'right',
	options: Partial<Column> = {}
): Column => {
	return createColumn(title, data, {
		...options,
		pinned: side,
	});
};

/**
 * Creates an action column (typically pinned right)
 */
export const createActionColumn = (
	title: string = 'Actions',
	renderFn: (data: any, type: string, row: any) => string | JSX.Element,
	options: Partial<Column> = {}
): Column => {
	return createColumn(title, null, {
		render: renderFn,
		orderable: false,
		searchable: false,
		pinned: 'right',
		...options,
	});
};

/**
 * Creates a formatter for currency values
 */
export const currencyFormatter = (
	currency: string = 'KRW',
	locale: string = 'ko-KR'
) => {
	return (data: number) => {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			minimumFractionDigits: 0,
		}).format(data);
	};
};

/**
 * Creates a formatter for date values
 */
export const dateFormatter = (
	locale: string = 'ko-KR',
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}
) => {
	return (data: string) => {
		if (!data) return '';
		const date = new Date(data);
		return new Intl.DateTimeFormat(locale, options).format(date);
	};
};
