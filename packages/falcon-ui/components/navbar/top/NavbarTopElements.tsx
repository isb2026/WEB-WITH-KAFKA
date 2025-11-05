import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { TopNavRightSideNavItem } from './TopNavRightSideNavItem';

export interface NavbarTopElementsProps {
	navbarPosition: 'top' | 'double-top' | 'vertical' | 'combo';
	handleBurgerMenu: () => void;
	navbarCollapsed: boolean;
	navbarBreakPoint: string;
	topNavbarBreakpoint: string;
	logo: React.ReactNode;
}

export const NavbarTopElements: React.FC<NavbarTopElementsProps> = ({
	navbarPosition,
	handleBurgerMenu,
	navbarCollapsed,
	topNavbarBreakpoint,
	navbarBreakPoint,
	logo,
}) => {
	const burgerMenuRef = useRef<HTMLDivElement>(null);
	return (
		<>
			<Navbar.Toggle
				ref={burgerMenuRef}
				className={classNames('toggle-icon-wrapper me-md-3 me-2', {
					'd-lg-none':
						navbarPosition === 'top' ||
						navbarPosition === 'double-top',
					[`d-${navbarBreakPoint}-none`]:
						navbarPosition === 'vertical' ||
						navbarPosition === 'combo',
				})}
				as="div"
			>
				<button
					className="navbar-toggler-humburger-icon btn btn-link d-flex flex-center"
					onClick={handleBurgerMenu}
					id="burgerMenu"
				>
					<span className="navbar-toggle-icon">
						<span className="toggle-line" />
					</span>
				</button>
			</Navbar.Toggle>

			{logo}

			{navbarPosition === 'top' || navbarPosition === 'combo' ? (
				<Navbar.Collapse
					in={navbarCollapsed}
					className="scrollbar pb-3 pb-lg-0"
				>
					<Nav navbar></Nav>
				</Navbar.Collapse>
			) : (
				<Nav
					navbar
					className={`align-items-center d-none d-${topNavbarBreakpoint}-block`}
					as="ul"
				>
					<Nav.Item as="li"></Nav.Item>
				</Nav>
			)}

			<TopNavRightSideNavItem />
		</>
	);
};
