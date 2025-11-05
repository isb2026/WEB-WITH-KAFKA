// types/tui-pagination.d.ts

declare module 'tui-pagination' {
	interface PaginationOptions {
		totalItems: number;
		itemsPerPage?: number;
		visiblePages?: number;
		page?: number;
		centerAlign?: boolean;
	}

	interface PaginationEvent {
		page: number;
	}

	export default class Pagination {
		constructor(container: HTMLElement, options: PaginationOptions);
		on(
			event: 'beforeMove' | 'afterMove',
			handler: (e: PaginationEvent) => void
		): void;
		reset(totalItems: number): void;
		movePageTo(page: number): void;
	}
}
