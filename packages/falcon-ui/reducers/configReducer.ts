import { settings } from '../config';
import { setItemToStore } from '@repo/utils';
import type { ConfigState } from '../providers/AppProvider'; // 앞서 만든 타입 사용

// 액션 타입 정의
export type ConfigAction =
	| {
			type: 'SET_CONFIG';
			payload: {
				key: keyof ConfigState;
				value: any;
				setInStore: boolean;
			};
	  }
	| { type: 'REFRESH'; payload?: never }
	| { type: 'RESET'; payload?: never };

export const configReducer = (state: ConfigState, action: ConfigAction) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_CONFIG':
			if (payload.setInStore) {
				setItemToStore(payload.key, payload.value);
			}
			return {
				...state,
				[payload.key]: payload.value,
			};
		case 'REFRESH':
			return {
				...state,
			};
		case 'RESET':
			localStorage.clear();
			document.documentElement.setAttribute(
				'data-bs-theme',
				settings.theme
			);
			return {
				...state,
				...settings,
			};
		default:
			return state;
	}
};
