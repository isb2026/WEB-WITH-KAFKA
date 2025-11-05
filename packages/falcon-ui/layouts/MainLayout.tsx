import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { NavbarVertical, NavbarTop, SolutionType } from '../components';
import styled from 'styled-components';

// import classNames from 'classnames';

interface MainLayoutProps {
	logo?: React.ReactNode;
	children: React.ReactNode;
	menus: any;
	solutions?: SolutionType[];
	solution?: SolutionType;
	onSolutionChange?: (e: any) => void;
	useTransition?: boolean;
	breadcrumb?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
	logo,
	children,
	menus,
	solutions,
	solution,
	onSolutionChange,
	useTransition = false,
	breadcrumb,
}) => {
	const location = useLocation();
	const path = location.pathname.split('/')[1];

	useEffect(() => {
		if (!path) return;

		document.documentElement.classList.add(path);
		return () => {
			document.documentElement.classList.remove(path);
		};
	}, [path]);

	return (
		<div className={'container-fluid'}>
			<NavbarVertical
				menus={menus}
				solutions={solutions}
				solution={solution}
				onSolutionChange={onSolutionChange}
				logo={logo ? logo : <div className="logo">Logo</div>}
			/>
			<div className="content pb-0">
				<NavbarTop
					useTransition={useTransition}
					breadcrumb={breadcrumb}
				/>
				{children}
			</div>
		</div>
	);
};
