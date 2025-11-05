// types/menu.ts

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

export interface MenuItem {
	name: string;
	to: string;
	icon?: string;
}

export interface Menustype {
	label: string;
	children: MenuItem[];
}

export interface Solution {
	label: string;
	name: SolutionName;
}

export interface MenuGroup {
	id: number;
	name: string;
	children: MenuItem[];
}

export interface MenuState {
	menus: Record<SolutionName, Menustype[]>;
	menu_groups: MenuGroup[];
	solutions: Solution[];
	solution: Solution;
}

export type MenuAction =
	| { type: 'SET_SOLUTION'; payload: Solution }
	| { type: 'SET_MENUS'; payload: MenuState['menus'] }
	| { type: 'SET_MENU_GROUPS'; payload: MenuGroup[] };
