export type TabType = {
	path: string;
	name: string;
	search?: any;
};

export interface TabStateInterface {
	tabs: TabType[];
	activeTab: string | null;
}

// ==========================
// Reducer
// ==========================

export type TabActionType =
	| { type: 'SET_TAB'; payload: TabType }
	| { type: 'REMOVE_TAB'; payload: { path: string } }
	| { type: 'UPDATE_TAB'; payload: TabType }
	| { type: 'SET_ACTIVE_TAB'; payload: { path: string } }
	| { type: 'CLEAR_TABS' };

// ==========================
// Context Interface
// ==========================
export interface TabContextInterface {
	state: TabStateInterface;
	addTab: (payload: { path: string; name: string; search?: any }) => void;
	removeTab: (payload: { path: string }) => void;
	updateTab: (payload: { path: string; name: string; search?: any }) => void;
	setActiveTab: (payload: { path: string }) => void;
	clearTabs: () => void;
}
