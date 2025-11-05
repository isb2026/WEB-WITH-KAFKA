// types/menu.ts

export type SolutionName = 'location' | 'collect' | 'analyze' | 'report';

export interface MenuItem {
	name: string;
	to: string;
	icon?: string;
  exact?: boolean;
}

export interface Menustype {
	label: string;
	icon?: string;
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
	menus: Menustype[];
	menu_groups: MenuGroup[];
	// solutions: Solution[];
	// solution: Solution;
}

export type MenuAction =
	| { type: 'SET_SOLUTION'; payload: Solution }
	| { type: 'SET_MENUS'; payload: MenuState['menus'] }
	| { type: 'SET_MENU_GROUPS'; payload: MenuGroup[] };
