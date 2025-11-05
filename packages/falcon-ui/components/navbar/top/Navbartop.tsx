import { useEffect, useRef, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { NavbarTopDropDownMenus } from './NavbarTopDropDownMenus';
import { navbarBreakPoint, topNavbarBreakpoint } from '../../../config';
import { TopNavRightSideNavItem } from './TopNavRightSideNavItem';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../../providers/AppProvider';
import { BreadcrumbsComponent } from '@repo/moornmo-ui/components';
import { SolutionSelect } from '@falcon/components/common/SolutionSelect';
import { SolutionType } from '../vertical';

type NavbarTopElementsProps = {
	navbarPosition: string;
	handleBurgerMenu: () => void;
	navbarCollapsed: boolean;
	useTransition?: boolean;
	breadcrumb?: string[];
	solutions?: SolutionType[];
	solution?: SolutionType;
	onSolutionChange?: (e: any) => void;
};

interface NavbarTopProps {
	useTransition?: boolean;
	breadcrumb?: string[];
	solutions?: SolutionType[];
	solution?: SolutionType;
	onSolutionChange?: (e: any) => void;
}

const NavbarTopElements: React.FC<NavbarTopElementsProps> = ({
	navbarPosition,
	handleBurgerMenu,
	navbarCollapsed,
	useTransition = false,
	breadcrumb,
	solutions,
	solution,
	onSolutionChange,
}) => {
	const burgerMenuRef = useRef<HTMLDivElement | null>(null);
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

			{/* <Logo
				at="navbar-top"
				textClass="text-primary"
				width={40}
				id="topLogo"
			/> */}

			{navbarPosition === 'top' || navbarPosition === 'combo' ? (
				<Navbar.Collapse
					in={navbarCollapsed}
					className="scrollbar pb-3 pb-lg-0"
				>
					<Nav navbar>
						<NavbarTopDropDownMenus />
					</Nav>
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
			{solutions && solution && (
				<SolutionSelect
					solution={solution}
					solutions={solutions!}
					onChange={onSolutionChange}
				/>
			)}
			{breadcrumb && <BreadcrumbsComponent items={breadcrumb} />}
			<TopNavRightSideNavItem useTransition={useTransition} />
		</>
	);
};

export const NavbarTop: React.FC<NavbarTopProps> = ({
	useTransition = false,
	breadcrumb,
	solutions,
	solution,
	onSolutionChange,
}) => {
	const {
		config: { showBurgerMenu, navbarPosition, navbarCollapsed },
		setConfig,
	} = useAppContext();
	// const { InitState, InitDispatch } = useInitContext();

	const location = useLocation();
	const pathname: string = location.pathname;
	const isChat: boolean = pathname.includes('chat');

	const [showDropShadow, setShowDropShadow] = useState(false);

	const handleBurgerMenu = () => {
		if (navbarPosition === 'top' || navbarPosition === 'double-top') {
			setConfig('navbarCollapsed', !navbarCollapsed);
		}
		if (navbarPosition === 'vertical' || navbarPosition === 'combo') {
			setConfig('showBurgerMenu', !showBurgerMenu);
		}
	};

	const setDropShadow = () => {
		const el = document.documentElement;
		setShowDropShadow(el.scrollTop > 0);
	};

	useEffect(() => {
		window.addEventListener('scroll', setDropShadow);
		return () => window.removeEventListener('scroll', setDropShadow);
	}, []);

	const burgerMenuRef = useRef<HTMLDivElement | null>(null);

	return (
		<Navbar
			className={classNames('navbar-glass fs-10 navbar-top sticky-kit', {
				'navbar-glass-shadow': showDropShadow && !isChat,
			})}
			expand={
				navbarPosition === 'top' ||
				navbarPosition === 'combo' ||
				navbarPosition === 'double-top'
					? topNavbarBreakpoint
					: true
			}
		>
			{navbarPosition === 'double-top' ? (
				<div className="w-100">
					<div className="d-flex flex-between-center">
						<NavbarTopElements
							navbarCollapsed={navbarCollapsed}
							navbarPosition={navbarPosition}
							handleBurgerMenu={handleBurgerMenu}
							breadcrumb={breadcrumb}
							solutions={solutions}
							solution={solution}
							onSolutionChange={onSolutionChange}
						/>
					</div>
					<hr className="my-2 d-none d-lg-block" />
					<Navbar.Collapse
						in={navbarCollapsed}
						className="scrollbar py-2"
					>
						<Nav navbar>
							<NavbarTopDropDownMenus />
						</Nav>
					</Navbar.Collapse>
				</div>
			) : (
				<NavbarTopElements
					navbarCollapsed={navbarCollapsed}
					navbarPosition={navbarPosition}
					handleBurgerMenu={handleBurgerMenu}
					useTransition={useTransition}
					breadcrumb={breadcrumb}
					solutions={solutions}
					solution={solution}
					onSolutionChange={onSolutionChange}
				/>
			)}
		</Navbar>
	);
};
