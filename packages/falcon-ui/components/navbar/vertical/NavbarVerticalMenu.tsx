// src/components/Navigation/NavbarVerticalMenu.tsx
import React, { FC, useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import { Collapse, Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SolutionType } from './NavbarVertical';
import { NavbarVerticalMenuItem } from './NavbarVerticalMenuItem';
import { useAppContext } from '../../../providers/AppProvider';

export interface Route {
	name: string;
	icon?: IconProp;
	to?: string;
	exact?: boolean;
	newtab?: boolean;
	active?: boolean;
	children?: Route[];
}

interface CollapseItemsProps {
	route: Route;
	solution?: SolutionType;
}

export const CollapseItems: FC<CollapseItemsProps> = ({ route, solution }) => {
	const { pathname } = useLocation();

	const openCollapse = (children: Route[]): boolean => {
		const checkLink = (child: Route): boolean => {
			const path =
				solution?.name && child.to
					? `/${solution.name}/${child.to}`
					: child.to || '';
			if (path === pathname) return true;
			return child.children ? child.children.some(checkLink) : false;
		};
		return children.some(checkLink);
	};

	const [open, setOpen] = useState<boolean>(
		openCollapse(route.children ?? [])
	);

	return (
		<Nav.Item as="li">
			<Nav.Link
				onClick={() => setOpen(!open)}
				className={classNames('dropdown-indicator cursor-pointer', {
					'text-500': !route.active,
				})}
				aria-expanded={open}
			>
				<NavbarVerticalMenuItem route={route} />
			</Nav.Link>
			<Collapse in={open}>
				<Nav as="ul" className="flex-column nav">
					<NavbarVerticalMenu
						routes={route.children ?? []}
						solution={solution}
					/>
				</Nav>
			</Collapse>
		</Nav.Item>
	);
};

interface NavbarVerticalMenuProps {
	routes: Route[];
	solution?: SolutionType;
}

export const NavbarVerticalMenu: FC<NavbarVerticalMenuProps> = ({
	routes,
	solution,
}) => {
	const {
		config: { showBurgerMenu },
		setConfig,
	} = useAppContext();

	const handleNavItemClick = () => {
		if (showBurgerMenu) {
			setConfig('showBurgerMenu', false);
		}
	};

	return (
		<>
			{routes.map((route) =>
				route.children ? (
					<CollapseItems
						key={route.name}
						route={route}
						solution={solution}
					/>
				) : (
					<Nav.Item
						as="li"
						key={route.name}
						onClick={handleNavItemClick}
					>
						<NavLink
							end={route.exact}
							to={
								solution?.name && route.to
									? `/${solution.name}/${route.to}`
									: route.to || '#'
							}
							target={route.newtab ? '_blank' : undefined}
							className={({ isActive }) =>
								isActive && route.to !== '#!'
									? 'active nav-link'
									: 'nav-link'
							}
						>
							<NavbarVerticalMenuItem route={route} />
						</NavLink>
					</Nav.Item>
				)
			)}
		</>
	);
};
