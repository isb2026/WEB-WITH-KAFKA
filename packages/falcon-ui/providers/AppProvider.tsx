import React, {
	createContext,
	useContext,
	useEffect,
	useReducer,
	ReactNode,
	Dispatch,
} from 'react';
import { settings } from '../config';
import { getColor, getItemFromStore } from '@repo/utils';
import useToggleStyle from '../hooks/useToggleStyle';
import { configReducer, ConfigAction } from '../reducers/configReducer';

export type DialogType = 'popup' | 'side' | 'page';

// 👇 ConfigState 타입 정의
export interface ConfigState {
	isFluid: boolean;
	isRTL: boolean;
	isDark: boolean;
	theme: string;
	navbarPosition: string;
	disabledNavbarPosition: string[];
	isNavbarVerticalCollapsed: boolean;
	navbarStyle: string;
	currency: string;
	showBurgerMenu: boolean;
	showSettingPanel: boolean;
	navbarCollapsed: boolean;
	openAuthModal: boolean;
	showGroupPanel: boolean;
	dialogType: DialogType;
}

// 👇 Context value 타입 정의
interface AppContextProps {
	config: ConfigState;
	setConfig: (key: keyof ConfigState, value: any) => void;
	configDispatch: Dispatch<ConfigAction>;
	changeTheme: (theme: string) => void;
	getThemeColor: (name: string) => string;
}

// 👇 실제 Context 생성 (초기값은 null → provider 없이 접근 막기 위함)
const AppContext = createContext<AppContextProps | undefined>(undefined);

// 👇 props 타입
interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const configState: ConfigState = {
		isFluid: getItemFromStore('isFluid', settings.isFluid),
		isRTL: getItemFromStore('isRTL', settings.isRTL),
		isDark: getItemFromStore('isDark', settings.isDark),
		theme: getItemFromStore('theme', settings.theme),
		dialogType: getItemFromStore('dialogType', 'popup'),
		navbarPosition: getItemFromStore(
			'navbarPosition',
			settings.navbarPosition
		),
		disabledNavbarPosition: [],
		isNavbarVerticalCollapsed: getItemFromStore(
			'isNavbarVerticalCollapsed',
			settings.isNavbarVerticalCollapsed
		),
		navbarStyle: getItemFromStore('navbarStyle', settings.navbarStyle),
		currency: settings.currency,
		showBurgerMenu: settings.showBurgerMenu,
		showSettingPanel: false,
		navbarCollapsed: false,
		openAuthModal: false,
		showGroupPanel: false,
	};

	const [config, configDispatch] = useReducer(configReducer, configState);

	const setConfig = (key: keyof ConfigState, value: any) => {
		configDispatch({
			type: 'SET_CONFIG',
			payload: {
				key,
				value,
				setInStore: [
					'isFluid',
					'isRTL',
					'isDark',
					'theme',
					'navbarPosition',
					'isNavbarVerticalCollapsed',
					'navbarStyle',
					'dialogType',
				].includes(key),
			},
		});
	};

	const { isLoaded } = useToggleStyle(config.isRTL, config.isDark);

	useEffect(() => {
		const isDark =
			config.theme === 'auto'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
				: config.theme === 'dark';

		setConfig('isDark', isDark);
	}, [config.theme]);

	const changeTheme = (theme: string) => {
		const isDark =
			theme === 'auto'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
				: theme === 'dark';

		document.documentElement.setAttribute(
			'data-bs-theme',
			isDark ? 'dark' : 'light'
		);

		setConfig('theme', theme);
		setConfig('isDark', isDark);
	};

	const getThemeColor = (name: string): string => getColor(name);

	if (!isLoaded) {
		return (
			<div
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: config.isDark
						? getThemeColor('dark')
						: getThemeColor('light'),
				}}
			/>
		);
	}

	return (
		<AppContext.Provider
			value={{
				config,
				setConfig,
				configDispatch,
				changeTheme,
				getThemeColor,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

// 👇 타입 안전한 useContext
export const useAppContext = (): AppContextProps => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};

export default AppProvider;
