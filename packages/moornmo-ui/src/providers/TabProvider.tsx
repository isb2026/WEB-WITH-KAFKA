// contexts/TabContext.tsx
import React, {
	createContext,
	useReducer,
	useContext,
	useEffect,
	ReactNode,
} from 'react';
import { TabStateInterface } from '@moornmo/types/tab';
import { tabReducer, initialAlertState } from '@moornmo/reducers/TabReducer';
import { getItemFromStore, setItemToStore } from '@repo/utils';

interface TabContextValue {
	state: TabStateInterface;
	dispatch: React.Dispatch<any>;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

interface TabProviderProps {
	children: ReactNode;
}

const persistedState = getItemFromStore('tabState', initialAlertState);

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(tabReducer, persistedState);

	useEffect(() => {
		setItemToStore('tabState', JSON.stringify(state));
	}, [state]);

	return (
		<TabContext.Provider value={{ state, dispatch }}>
			{children}
		</TabContext.Provider>
	);
};

export const useTabContext = (): TabContextValue => {
	const context = useContext(TabContext);
	if (!context) {
		throw new Error('useTabContext must be used within a TabProvider');
	}
	return context;
};
