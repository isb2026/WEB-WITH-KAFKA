import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { breakpoints, capitalize } from '@repo/utils';
import { topNavbarBreakpoint } from '../../../config';

export interface NavbarDropdownProps {
	title?: string;
	children?: React.ReactNode;
}

export const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
	title = '',
	children,
}) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	return (
		<Dropdown
			show={dropdownOpen}
			onToggle={() => setDropdownOpen(!dropdownOpen)}
			onMouseOver={() => {
				let windowWidth = window.innerWidth;
				if (windowWidth >= breakpoints[topNavbarBreakpoint]) {
					setDropdownOpen(true);
				}
			}}
			onMouseLeave={() => {
				let windowWidth = window.innerWidth;
				if (windowWidth >= breakpoints[topNavbarBreakpoint]) {
					setDropdownOpen(false);
				}
			}}
		>
			<Dropdown.Toggle as={Link} to="#!" className="nav-link fw-semibold">
				{capitalize(title)}
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-card mt-0 dropdown-caret">
				{/* {children} */}
				<Card
					className={classNames('shadow-none dark__bg-1000', {
						'navbar-card-app': title === 'app',
						'navbar-card-pages': title === 'pages',
						'navbar-card-components': title === 'modules',
					})}
				>
					<Card.Body
						className={classNames('scrollbar max-h-dropdown', {
							'p-0 py-2':
								title === 'dashboard' ||
								title === 'documentation',
						})}
					>
						{children}
					</Card.Body>
				</Card>
			</Dropdown.Menu>
		</Dropdown>
	);
};
