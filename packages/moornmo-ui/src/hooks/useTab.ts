// hooks/useTab.ts
import { useCallback } from 'react';
import { useTabContext } from '@moornmo/providers/TabProvider';
import { TabType } from '@moornmo/types/tab';

export const useTab = () => {
	const { dispatch, state } = useTabContext();

	const addTab = useCallback(
		(tab: TabType) => {
			dispatch({ type: 'SET_TAB', payload: tab });
		},
		[dispatch]
	);

	const removeTab = useCallback(
		(path: string) => {
			dispatch({ type: 'REMOVE_TAB', payload: { path } });
		},
		[dispatch]
	);

	const updateTab = useCallback(
		(tab: TabType) => {
			dispatch({ type: 'UPDATE_TAB', payload: tab });
		},
		[dispatch]
	);

	const setActiveTab = useCallback(
		(path: string) => {
			dispatch({ type: 'SET_ACTIVE_TAB', payload: { path } });
		},
		[dispatch]
	);

	const clearTabs = useCallback(() => {
		dispatch({ type: 'CLEAR_TABS' });
	}, [dispatch]);

	return {
		tabs: state.tabs,
		activeTab: state.activeTab,
		addTab,
		removeTab,
		updateTab,
		setActiveTab,
		clearTabs,
	};
};
