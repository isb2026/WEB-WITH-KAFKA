export interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

export interface Pageable {
	offset: number;
	sort: Sort;
	paged: boolean;
	pageNumber: number;
	pageSize: number;
	unpaged: boolean;
}
