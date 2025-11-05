import React from 'react';
import { Nav } from 'react-bootstrap';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { ToggleLocales } from './ToggleLocales';

interface TopNavRightSideNavItemProps {
	useTransition?: boolean;
}

export const TopNavRightSideNavItem: React.FC<TopNavRightSideNavItemProps> = ({
	useTransition = false,
}) => {
	return (
		<Nav
			navbar
			className="navbar-nav-icons ms-auto flex-row align-items-center"
			as="ul"
		>
			{useTransition && <ToggleLocales />}
			<NotificationDropdown />
			<ProfileDropdown />
		</Nav>
	);
};
