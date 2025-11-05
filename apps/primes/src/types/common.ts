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

export interface Menu {
	icon?: string;
	to: string;
	name: string;
}

export interface MenusType {
	label: string;
	children: Menu[];
	to?: string;
}

export interface MenuGroup {
	id: number;
	name: string;
	children: Menu[];
}

export type SolutionName =
	| 'ini'
	| 'aps'
	| 'cmms'
	| 'erp'
	| 'mold'
	| 'production'
	| 'purchase'
	| 'qms'
	| 'sales'
	| 'scm'
	| 'wms'
	| 'admin';

export interface Solution {
	icon?: string;
	label: string;
	name: SolutionName;
}
