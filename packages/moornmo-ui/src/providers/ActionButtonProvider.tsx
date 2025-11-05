import React, { createContext, useContext, useReducer } from 'react';
import { ActionButtonsState, ActionButtonsAction } from '@moornmo/types/actionButton';
import {
	actionButtonsReducer,
	initialActionButtonsState,
} from '../reducers/ActionButtonReducer';

interface ActionButtonContextValue {
	state: ActionButtonsState;
	dispatch: React.Dispatch<any>;
}

const ActionButtonContext = createContext<ActionButtonContextValue | undefined>(
	undefined
);

interface ActionButtonProviderProps {
	children: React.ReactNode;
}

export const ActionButtonProvider: React.FC<ActionButtonProviderProps> = ({
	children,
}) => {
	const [state, dispatch] = useReducer<
		React.Reducer<ActionButtonsState, ActionButtonsAction>
	>(actionButtonsReducer, initialActionButtonsState);

	return (
		<ActionButtonContext.Provider value={{ state, dispatch }}>
			{children}
		</ActionButtonContext.Provider>
	);
};

export const useActionButtonContext = (): ActionButtonContextValue => {
	const context = useContext(ActionButtonContext);
	if (!context) {
		throw new Error(
			'useActionButtonContext must be used within an ActionButtonProvider'
		);
	}
	return context;
};
