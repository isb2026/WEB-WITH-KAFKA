export interface MenuItem {
	name: string;
	to: string;
	icon: string;
	children?: MenuItem[];
}

export interface MenuType {
	label: string;
	desc?: string;
	icon: string;
	children: MenuItem[];
}

export type SolutionName =
	| 'home'
	| 'ini'
	| 'aps'
	| 'cmms'
	| 'mold'
	| 'production'
	| 'purchase'
	| 'qms'
	| 'sales'
	| 'scm'
	| 'wms'
	| 'admin';

export type ServiceType = {
	id: string;
	label: string;
	desc?: string;
	icon?: string;
	menus: MenuType[];
};
