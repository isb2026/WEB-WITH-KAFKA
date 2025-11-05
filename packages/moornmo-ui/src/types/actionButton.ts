export interface ActionButtonsState {
	isCreate: boolean;
	isEdit: boolean;
	isDelete: boolean;
	onHandleCreate: () => void;
	onHandleEdit: () => void;
	onHandleDelete: () => void;
}

export type ActionButtonsAction =
	| { type: 'SET_CREATE'; payload: boolean }
	| { type: 'SET_EDIT'; payload: boolean }
	| { type: 'SET_DELETE'; payload: boolean }
	| {
			type: 'SET_ACTION_HANDLERS';
			payload: Partial<
				Omit<ActionButtonsState, 'isCreate' | 'isEdit' | 'isDelete'>
			>;
	  }
	| { type: 'SET_CREATE_ACTION_HANDLERS'; payload: () => void }
	| { type: 'SET_EDIT_ACTION_HANDLERS'; payload: () => void }
	| { type: 'SET_DELETE_ACTION_HANDLERS'; payload: () => void };
