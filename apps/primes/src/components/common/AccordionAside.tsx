import React, { useState, useEffect } from 'react';
import { PrimesMenus } from '@primes/routes/menu';
import MainMenuDropdown from './MainMenuDropdown';
import { MenuType } from '../../types/menus';
import { PanelLeft, ChevronDown } from 'lucide-react';
import { getIconComponent } from '../../utils/iconMapping';
import SubmenuIcon from './SubmenuIcon';
import Style2Sidebar from './Style2Sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useT } from '@repo/i18n';
import Tooltip from './Tooltip';

const menuItems = PrimesMenus.filter(
	(item): item is MenuType => !('type' in item && item.type === 'divider')
);

interface AccordionAsideProps {
	sidebarMode: number;
	isDrawer?: boolean;
}

const AccordionAside: React.FC<AccordionAsideProps> = ({
	sidebarMode,
	isDrawer = false,
}) => {
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(menuItems[0]);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const [showSubmenus, setShowSubmenus] = useState(false);
	const [isClosingSubmenus, setIsClosingSubmenus] = useState(false);
	const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(
		new Set()
	);
	const t = useT('menu');
	const navigate = useNavigate();
	const location = useLocation();

	// Helper function to detect solution from URL path
	const detectSolutionFromPath = (pathname: string): MenuType | null => {
		// Extract the first segment after '/' (e.g., '/sales/orders/list' -> 'sales')
		const segments = pathname.split('/').filter(Boolean);
		if (segments.length === 0) return null;

		const solutionPath = segments[0].toLowerCase();

		// Find matching menu based on the path segment
		const matchingMenu = menuItems.find((menu) => {
			if (!menu.children || menu.children.length === 0) return false;

			// Check if any child menu item's path starts with the solution
			return menu.children.some((child) => {
				if (!('to' in child) || !child.to) return false;

				// Normalize the path - remove leading slash and convert to lowercase
				const childPath = child.to.startsWith('/')
					? child.to.slice(1)
					: child.to;
				const normalizedChildPath = childPath.toLowerCase();

				// Check if the child path starts with the solution segment
				return (
					normalizedChildPath.startsWith(solutionPath + '/') ||
					normalizedChildPath === solutionPath
				);
			});
		});

		return matchingMenu || null;
	};

	// Helper function to find which submenu should be expanded based on current URL
	const findActiveSubmenu = (pathname: string): string | null => {
		const currentSolution = detectSolutionFromPath(pathname);
		if (!currentSolution || !currentSolution.children) return null;

		// Find the submenu that contains the current path
		for (const child of currentSolution.children) {
			if (child.children && child.children.length > 0) {
				// Check if any grandchild matches the current path
				const hasMatchingGrandchild = child.children.some((grandchild) => {
					if (!grandchild.to) return false;
					const grandchildPath = grandchild.to.startsWith('/') 
						? grandchild.to 
						: `/${grandchild.to}`;
					return pathname.startsWith(grandchildPath);
				});
				
				if (hasMatchingGrandchild) {
					return child.name;
				}
			} else {
				// If child has no children, check if it matches the current path directly
				if (child.to) {
					const childPath = child.to.startsWith('/') 
						? child.to 
						: `/${child.to}`;
					if (pathname.startsWith(childPath)) {
						return child.name;
					}
				}
			}
		}
		
		return null;
	};

	// Track if this is a page refresh or normal navigation
	const [hasInitialized, setHasInitialized] = useState(false);

	// Sync selectedMenu with current URL on mount and route changes
	useEffect(() => {
		const currentSolution = detectSolutionFromPath(location.pathname);
		if (currentSolution && currentSolution.label !== selectedMenu.label) {
			setSelectedMenu(currentSolution);
		}
	}, [location.pathname, selectedMenu.label]);

	// Initialize submenu expansion only once on component mount (page refresh)
	useEffect(() => {
		if (!hasInitialized) {
			// Check if this is a page refresh by checking if navigation type is reload
			const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
			const isPageRefresh = 
				performance.navigation?.type === 1 || // TYPE_RELOAD
				navigationEntry?.type === 'reload' ||
				!location.state; // No state usually means direct navigation or refresh

			if (isPageRefresh) {
				// Auto-expand the submenu that contains the current active page only on page refresh
				const activeSubmenu = findActiveSubmenu(location.pathname);
				if (activeSubmenu) {
					setExpandedSubmenus(new Set([activeSubmenu]));
				} else {
					// If no active submenu found, collapse all
					setExpandedSubmenus(new Set());
				}
			}
			setHasInitialized(true);
		}
	}, []); // Run only once on mount

	// Helper function to get the first menu item's route from a solution
	const getFirstMenuRoute = (menu: MenuType): string | null => {
		if (!menu.children || menu.children.length === 0) {
			return null;
		}

		const firstChild = menu.children[0];
		if (firstChild && 'to' in firstChild && firstChild.to) {
			// Ensure the route starts with '/'
			return firstChild.to.startsWith('/')
				? firstChild.to
				: `/${firstChild.to}`;
		}

		return null;
	};

	// Enhanced menu change handler with navigation
	const handleMenuChange = (menu: MenuType) => {
		setSelectedMenu(menu);

		// Navigate to the first menu item of the selected solution
		const firstRoute = getFirstMenuRoute(menu);
		if (firstRoute) {
			navigate(firstRoute);
		}
	};

	const handleCollapseToggle = () => {
		if (sidebarMode === 1) {
			setIsTransitioning(true);
			setIsCollapsed((prev) => !prev);

			setTimeout(() => {
				setIsTransitioning(false);
			}, 300);
		} else {
			if (showSubmenus) {
				setIsClosingSubmenus(true);
				setTimeout(() => {
					setShowSubmenus(false);
					setIsClosingSubmenus(false);
				}, 300);
			} else {
				setShowSubmenus(true);
			}
		}
	};

	const handleIconClick = (menu: MenuType) => {
		handleMenuChange(menu);
		if (sidebarMode === 2) {
			setShowSubmenus(true);
		}
	};

	const toggleSubmenu = (itemName: string) => {
		setExpandedSubmenus((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(itemName)) {
				newSet.delete(itemName);
			} else {
				newSet.add(itemName);
			}
			return newSet;
		});
	};

	return sidebarMode === 1 ? (
		<aside
			className={
				'border-r flex flex-col h-full transition-[width] duration-300 ease-in-out ' +
				(isCollapsed ? 'w-20' : 'w-64') +
				' bg-[color:var(--sidebar-background)]'
			}
		>
			{/* Solution Select */}
			{/* <div
				className={`transition-all duration-300 ease-in-out ${
					isCollapsed
						? 'opacity-0 max-h-0 overflow-hidden'
						: 'opacity-100 max-h-96'
				}`}
			>
				<MainMenuDropdown
					menus={menuItems}
					selected={selectedMenu}
					onChange={handleMenuChange}
					textClassName="text-gray-900 dark:text-gray-100"
				/>
			</div> */}
			{/* Menus */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isCollapsed
						? 'opacity-100 max-h-96'
						: 'opacity-0 max-h-0 overflow-hidden'
				}`}
			>
				<div className="p-4 space-y-2">
					{menuItems.map((menu) => {
						const Icon = menu.icon && getIconComponent(menu.icon);
						return (
							<Tooltip
								key={menu.label}
								label={t(menu.label)}
								side="right"
							>
								<button
									className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${
										selectedMenu.label === menu.label
											? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
											: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
									}`}
									onClick={() => handleMenuChange(menu)}
								>
									{Icon && <Icon className="w-5 h-5" />}
								</button>
							</Tooltip>
						);
					})}
				</div>
			</div>
			<div
				className={`flex-1 min-h-0 overflow-y-auto p-2 transition-all duration-300 ease-in-out ${
					isCollapsed
						? 'opacity-0 max-h-0 overflow-hidden'
						: 'opacity-100 max-h-full'
				}`}
			>
				<div className="w-full flex flex-col gap-1 mt-3">
					{selectedMenu.children.map((item) => (
						<div key={item.to}>
							{item.children ? (
								// Nested sub-menu with children
								<div className="mb-2">
									<button
										onClick={() => toggleSubmenu(item.name)}
										className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									>
										<div className="flex items-center gap-2">
											<SubmenuIcon
												iconName={item.icon}
												size={20}
											/>
											<span className="font-bold text-sm leading-[20px] whitespace-nowrap text-gray-900 dark:text-gray-100">
												{t(item.name)}
											</span>
										</div>
										<ChevronDown
											size={16}
											className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
												expandedSubmenus.has(item.name)
													? 'rotate-180'
													: ''
											}`}
										/>
									</button>
									{expandedSubmenus.has(item.name) && (
										<div className="ml-6">
											{item.children.map((subItem) => {
												const toPath =
													subItem.to.startsWith('/')
														? subItem.to
														: `/${subItem.to}`;
												const active =
													location.pathname ===
														toPath ||
													location.pathname.startsWith(
														`${toPath}/`
													);

												return (
													<Link
														key={subItem.to}
														to={subItem.to}
														className={`flex items-center gap-2 px-4 py-2 rounded transition-colors text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 ${active ? 'bg-Colors-Brand-100 dark:bg-Colors-Brand-800' : ''}`}
													>
														<SubmenuIcon
															iconName={
																subItem.icon
															}
															size={16}
														/>
														<span className="font-medium text-sm leading-[20px] whitespace-nowrap text-gray-700 dark:text-gray-300">
															{t(subItem.name)}
														</span>
													</Link>
												);
											})}
										</div>
									)}
								</div>
							) : (
								// Regular sub-menu item
								<Link
									key={item.to}
									to={item.to}
									className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
								>
									<SubmenuIcon
										iconName={item.icon}
										size={20}
									/>
									<span className="font-bold text-sm leading-[20px] whitespace-nowrap text-gray-900 dark:text-gray-100">
										{t(item.name)}
									</span>
								</Link>
							)}
						</div>
					))}
				</div>
			</div>
			{/* Menus */}
			{/* Aside Footer */}
			{!isDrawer && (
				<div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 mt-auto">
					<Tooltip
						label={isCollapsed ? '패널 펼치기' : '패널 접기'}
						side="right"
					>
						<button
							className="ml-auto flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
							onClick={handleCollapseToggle}
							disabled={isTransitioning}
						>
							<PanelLeft
								className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
									isCollapsed ? 'rotate-180' : ''
								}`}
							/>
						</button>
					</Tooltip>
				</div>
			)}
		</aside>
	) : (
		<Style2Sidebar
			selectedMenu={selectedMenu}
			onMenuSelect={handleIconClick}
			onToggleSubmenus={handleCollapseToggle}
			showSubmenus={showSubmenus}
			isClosingSubmenus={isClosingSubmenus}
			expandedSubmenus={expandedSubmenus}
			onToggleSubmenu={toggleSubmenu}
		/>
	);
};

export default AccordionAside;
