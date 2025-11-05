import { MenuState, MenuAction } from '../types/menus';
import { AnalyzeNavPath } from '../routes/analyze.route';
import { CollectNavPath } from '../routes/collect.route';
import { LocationNavPath } from '@esg/routes/locations.route';
import { ReportNavPath } from '@esg/routes/report.route';

export const initialMenuState: MenuState = {
	menus: [
		...LocationNavPath,
		...CollectNavPath,
		...AnalyzeNavPath,
		...ReportNavPath,
	],
	menu_groups: [],
};

export const menuReducer = (
	state: MenuState,
	action: MenuAction
): MenuState => {
	switch (action.type) {
		// case 'SET_SOLUTION':
		// 	console.log('action.payload', action.payload);
		// 	return {
		// 		...state,
		// 		solution: action.payload,
		// 	};
		case 'SET_MENUS':
			return {
				...state,
				menus: action.payload,
			};
		case 'SET_MENU_GROUPS':
			return {
				...state,
				menu_groups: action.payload,
			};
		default:
			return state;
	}
};
