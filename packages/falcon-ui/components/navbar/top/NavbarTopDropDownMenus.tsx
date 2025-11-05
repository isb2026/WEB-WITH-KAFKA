import React from 'react';
import { NavbarDropdown } from './NavbarDropDown';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../providers/AppProvider';

export const NavbarTopDropDownMenus: React.FC = () => {
	const {
		config: { navbarCollapsed, showBurgerMenu },
		setConfig,
	} = useAppContext();

	const handleDropdownItemClick = () => {
		if (navbarCollapsed) {
			setConfig('navbarCollapsed', !navbarCollapsed);
		}
		if (showBurgerMenu) {
			setConfig('showBurgerMenu', !showBurgerMenu);
		}
	};

	return (
		<>
			<NavbarDropdown />
		</>
	);
};
