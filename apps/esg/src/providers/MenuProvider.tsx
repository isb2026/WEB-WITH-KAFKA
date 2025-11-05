import React, {
	createContext,
	useEffect,
	useContext,
	useReducer,
	ReactNode,
} from 'react';
import { menuReducer, initialMenuState } from '../reducers/menuReducer';
import { MenuState, MenuAction } from '../types/menus';
import { getItemFromStore, setItemToStore } from '@repo/utils';

// Context의 타입 정의
interface MenuContextProps {
	menuState: MenuState;
	menuDispatch: React.Dispatch<MenuAction>;
}
interface MenuProviderProps {
	children: ReactNode;
}

export const MenuContext = createContext<MenuContextProps>({
	menuState: initialMenuState,
	menuDispatch: () => null,
});

const persistedState = getItemFromStore('menuState', initialMenuState);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
	const [menuState, menuDispatch] = useReducer(menuReducer, {
		...initialMenuState,
	});

	return (
		<MenuContext.Provider value={{ menuState, menuDispatch }}>
			{children}
		</MenuContext.Provider>
	);
};

export const useMenuContext = () => useContext(MenuContext);
