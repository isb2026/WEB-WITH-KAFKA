import { ActionButtonsState, ActionButtonsAction } from '../types/actionButton';

export const initialActionButtonsState: ActionButtonsState = {
	isCreate: false,
	isEdit: false,
	isDelete: false,
	onHandleCreate: () => {},
	onHandleEdit: () => {},
	onHandleDelete: () => {},
};

export const actionButtonsReducer = (
	state: ActionButtonsState,
	action: ActionButtonsAction
): ActionButtonsState => {
	switch (action.type) {
		case 'SET_CREATE':
			return { ...state, isCreate: action.payload };
		case 'SET_EDIT':
			return { ...state, isEdit: action.payload };
		case 'SET_DELETE':
			return { ...state, isDelete: action.payload };
		case 'SET_CREATE_ACTION_HANDLERS':
			return { ...state, onHandleCreate: action.payload ?? (() => {}) }; // 기본값 처리
		case 'SET_EDIT_ACTION_HANDLERS':
			return { ...state, onHandleEdit: action.payload ?? (() => {}) };
		case 'SET_DELETE_ACTION_HANDLERS':
			return { ...state, onHandleDelete: action.payload ?? (() => {}) };
		case 'SET_ACTION_HANDLERS':
			return {
				...state,
				onHandleCreate: action.payload.onHandleCreate ?? (() => {}),
				onHandleEdit: action.payload.onHandleEdit ?? (() => {}),
				onHandleDelete: action.payload.onHandleDelete ?? (() => {}),
			};
		default:
			return state;
	}
};
