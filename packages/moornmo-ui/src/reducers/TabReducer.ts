import { TabStateInterface, TabActionType } from '../types/tab';

export const initialAlertState: TabStateInterface = {
	tabs: [],
	activeTab: null,
};

export const tabReducer = (state: TabStateInterface, action: TabActionType) => {
	switch (action.type) {
		case 'SET_TAB': {
			const { path, search, name } = action.payload;
			const newTab = { path, search, name };

			const filteredTabs = state.tabs.filter((tab) => tab.path !== path);
			let updatedTabs = [...filteredTabs, newTab];

			if (updatedTabs.length > 5) {
				updatedTabs = updatedTabs.slice(updatedTabs.length - 5);
			}

			return {
				...state,
				tabs: updatedTabs,
				activeTab: path, // 새로 설정한 탭을 활성 탭으로 설정
			};
		}

		case 'REMOVE_TAB': {
			const { path } = action.payload;
			const updatedTabs = state.tabs.filter((tab) => tab.path !== path);
			// 활성 탭이 제거되는 탭과 같다면, activeTab 업데이트 (예: 마지막 탭으로)
			let newActiveTab = state.activeTab;
			if (state.activeTab === path) {
				newActiveTab = updatedTabs.length
					? updatedTabs[updatedTabs.length - 1].path
					: null;
			}
			return {
				...state,
				tabs: updatedTabs,
				activeTab: newActiveTab,
			};
		}

		case 'UPDATE_TAB': {
			const { path, search, name } = action.payload;
			const updatedTabs = state.tabs.map((tab) => {
				if (tab.path === path) {
					return { ...tab, search, name };
				}
				return tab;
			});
			return { ...state, tabs: updatedTabs };
		}

		case 'SET_ACTIVE_TAB': {
			const { path } = action.payload;
			return { ...state, activeTab: path };
		}

		case 'CLEAR_TABS': {
			// 모든 탭을 제거하고 초기 상태로 리셋
			return { ...initialAlertState };
		}

		default:
			return state;
	}
};
