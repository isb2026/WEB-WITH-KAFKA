import { useEffect, useState, useMemo } from 'react';
import is from 'is_js';
import jQuery from 'jquery';
import { Outlet, useLocation } from 'react-router-dom';
import { initI18n, useLocale, useT } from '@repo/i18n';
import { MainLayout } from '@repo/falcon-ui/layouts';
import { useMenuContext } from './providers/MenuProvider';
import { Logo } from './components/Logo';
import { TabbarTemplate } from '@repo/moornmo-ui/components';
import { useTab } from '@repo/moornmo-ui/hooks';
import { useAuth } from './hooks/auth/useAuth';
import LogoutButton from './components/auth/LogoutButton';
import { tokenManager } from './utils/tokenManager';
import commonKo from './locales/ko/common.json';
import menuKo from './locales/ko/menu.json';
import commonEn from './locales/en/common.json';
import menuEn from './locales/en/menu.json';
import styled from 'styled-components';
import { MenuItem } from './types/menus';

initI18n({
	fallbackLng: 'ko',
	ns: ['common', 'menu'],
	resources: {
		en: {
			common: commonEn,
			menu: menuEn,
		},
		ko: {
			common: commonKo,
			menu: menuKo,
		},
	},
});
// import { solutions } from './constants/solutions';
const OutletContainer = styled.div`
	width: 100%;
	flex: 1 1 0;
	padding: 0 0 20px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

function App() {
	Object.assign(window, { $: jQuery, jQuery: jQuery });
	const { menuState, menuDispatch } = useMenuContext();
	const { logout, isLoggingOut } = useAuth();
	// const t = useT();
	const menuT = useT('menu');
	const [locale] = useLocale();
	const { pathname } = useLocation();
	const { menus } = menuState;
	const { addTab, clearTabs } = useTab();
	const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

	const translatedMenus = useMemo(() => {
		return menus.map((menu) => ({
			label: menuT(`menuGroup.${menu.label}`),
			children: menu.children.map((child) => ({
				...child,
				name: menuT(`menu.${child.name}`),
			})),
		}));
	}, [menus, locale]);

	useEffect(() => {
		menus.some((menu) => {
			const _children = menu.children.find(
				(child) => `/${child.to}` === pathname
			);
			if (_children) {
				setBreadcrumbs([
					menuT(`menuGroup.${menu.label}`),
					menuT(`menu.${_children.name}`),
				]);
				return true;
			}
			return false;
		});
	}, [pathname, locale]);

	const HTMLClassList: DOMTokenList =
		document.getElementsByTagName('html')[0].classList;

	useEffect(() => {
		if (is.windows()) {
			HTMLClassList.add('windows');
		}
		if (is.chrome()) {
			HTMLClassList.add('chrome');
		}
		if (is.firefox()) {
			HTMLClassList.add('firefox');
		}
		if (is.safari()) {
			HTMLClassList.add('safari');
		}
	}, [HTMLClassList]);

	// JWT 토큰 디버그 정보 (개발 환경에서만)
	useEffect(() => {
		if (import.meta.env.DEV) {
			tokenManager.debugTokenInfo();
		}
	}, [pathname]);

	return (
		<MainLayout
			logo={<Logo />}
			menus={translatedMenus}
			useTransition={true}
			breadcrumb={breadcrumbs}
		>
			<OutletContainer>
				<TabbarTemplate locale={locale} />
				<Outlet />
			</OutletContainer>
		</MainLayout>
	);
}

export default App;
