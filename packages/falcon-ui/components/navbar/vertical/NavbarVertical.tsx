import { useEffect, useRef, Fragment } from 'react';
import { navbarBreakPoint, topNavbarBreakpoint } from '../../../config';
import classNames from 'classnames';
import { Flex } from '@falcon/components/common/Flex';
import { Nav, Navbar, Row, Col } from 'react-bootstrap';
import { capitalize } from '@repo/utils';
import { useAppContext } from '@falcon/providers/AppProvider';
import { ToggleButton } from './ToggleButton';
import { Box } from '@mui/material';
import { NavbarVerticalMenu } from './NavbarVerticalMenu';
import { SolutionSelect } from '@falcon/components/common/SolutionSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
// import is from 'is_js';

export interface SolutionType {
	label: string;
	name: string;
}
interface NavbarVerticalProps {
	logo?: React.ReactNode;
	menus?: any;
	solutions?: SolutionType[];
	solution?: SolutionType;
	onSolutionChange?: (e: any) => void;
}

interface NavbarLabelProps {
	label: string;
	icon?: IconProp;
}

export const NavbarVertical: React.FC<NavbarVerticalProps> = ({
	logo,
	menus,
	solutions,
	solution,
	onSolutionChange,
}) => {
	const {
		config: {
			navbarPosition,
			navbarStyle,
			isNavbarVerticalCollapsed,
			showBurgerMenu,
		},
	} = useAppContext();
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const htmlClassList = document.documentElement.classList;
		if (isNavbarVerticalCollapsed) {
			htmlClassList.add('navbar-vertical-collapsed');
		} else {
			htmlClassList.remove('navbar-vertical-collapsed');
		}

		return () => {
			htmlClassList.remove('navbar-vertical-collapsed-hover');
		};
	}, [isNavbarVerticalCollapsed]);

	const handleMouseEnter = () => {
		if (isNavbarVerticalCollapsed) {
			timeoutRef.current = setTimeout(() => {
				document.documentElement.classList.add(
					'navbar-vertical-collapsed-hover'
				);
			}, 100);
		}
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		document.documentElement.classList.remove(
			'navbar-vertical-collapsed-hover'
		);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const NavbarLabel: React.FC<NavbarLabelProps> = ({ label, icon }) => {
		return (
			<Nav.Item as="li">
				<Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
					<Col
						xs="auto"
						className="navbar-vertical-label navbar-vertical-label"
					>
						{icon && (
							<span className="nav-link-icon">
								<FontAwesomeIcon icon={icon} />
							</span>
						)}
						{label}
					</Col>
					<Col className="ps-0">
						<hr className="mb-0 navbar-vertical-divider"></hr>
					</Col>
				</Row>
			</Nav.Item>
		);
	};

	const hasSolutions = Array.isArray(solutions) && solutions.length > 0;

	return (
		<Navbar
			expand={navbarBreakPoint}
			className={classNames('navbar-vertical', {
				[`navbar-${navbarStyle}`]: navbarStyle !== 'transparent',
			})}
			variant="light"
		>
			<Flex
				alignItems="center"
				className="navbar-vertical-wrapper"
				style={{ width: '100%' }}
			>
				<ToggleButton />
				{!isNavbarVerticalCollapsed && logo && (
					<Box
						sx={{
							display: 'flex',
							whiteSpace: 'nowrap',
							alignItems: 'center',
							width: '100%',
							marginBottom: '5px',
						}}
						className="logo"
					>
						{logo}
					</Box>
				)}
			</Flex>
			<Navbar.Collapse
				in={showBurgerMenu}
				role={'navigation'}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className="navbar-vertical-content scrollbar">
					<Nav className="flex-column" as="ul">
						{/* 솔루션 적용 여부에 따른 분기 */}
						{hasSolutions && solution ? (
							<>
								<SolutionSelect
									solution={solution}
									solutions={solutions!}
									onChange={onSolutionChange}
								/>
								{menus?.[solution.name]?.map((route: any) => (
									<Fragment key={route.label}>
										{!route.labelDisable && (
											<NavbarLabel
												label={capitalize(route.label)}
												icon={route.icon}
											/>
										)}
										<NavbarVerticalMenu
											routes={route.children}
											solution={solution}
										/>
									</Fragment>
								))}
							</>
						) : (
							// solutions 미사용 시 menus 전체 출력
							menus &&
							menus.map((route: any, i: number) => (
								<Fragment key={`${i}-${route.label}`}>
									{!route.labelDisable && (
										<NavbarLabel
											label={capitalize(route.label)}
										/>
									)}
									<NavbarVerticalMenu
										routes={route.children}
										solution={undefined as any}
									/>
								</Fragment>
							))
						)}
					</Nav>
				</div>
			</Navbar.Collapse>
		</Navbar>
	);
};
