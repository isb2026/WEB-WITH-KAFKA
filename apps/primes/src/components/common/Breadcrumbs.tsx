import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { PrimesMenus } from '@primes/routes/menu';
import { MenuType } from '@primes/types/menus';
import { useTranslation } from '@repo/i18n';

interface BreadcrumbsProps {
	className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
	const location = useLocation();
	const { t } = useTranslation('menu');
	const { t: tCommon } = useTranslation('common');

	// Function to generate breadcrumb array based on current pathname
	const generateBreadcrumbs = (): string[] => {
		const pathname = location.pathname;
		const pathSegments = pathname.split('/').filter(Boolean);

		if (pathSegments.length === 0) {
			return ['Home'];
		}

		const breadcrumbs: string[] = [];
		// Find the solution (main menu) based on the first path segment
		const solution = PrimesMenus.find((menu) => {
			if ('type' in menu && menu.type === 'divider') return false;
			const menuType = menu as MenuType;
			return menuType.children.some((child) => {
				const childPath = child.to?.replace(/^\/+/, '') || '';
				const matches = childPath.startsWith(pathSegments[0]);

				return matches;
			});
		}) as MenuType | undefined;

		if (solution) {
			// Add solution name
			breadcrumbs.push(t(solution.label) || solution.label);

			// Find the specific menu item by matching the first two path segments
			const menuItem = solution.children.find((child) => {
				if (!child.to) return false;
				const childPath = child.to.replace(/^\/+/, '');
				const childSegments = childPath.split('/');

				// Check if the first two segments match
				const matches =
					childSegments.length >= 2 &&
					childSegments[0] === pathSegments[0] &&
					childSegments[1] === pathSegments[1];

				return matches;
			});

			if (menuItem) {
				// Add menu name
				breadcrumbs.push(t(menuItem.name) || menuItem.name);

				// Check if there's a submenu match by looking at the third path segment
				if (menuItem.children && pathSegments.length >= 3) {
					const submenuItem = menuItem.children.find((submenu) => {
						if (!submenu.to) return false;
						const submenuPath = submenu.to.replace(/^\/+/, '');
						const submenuSegments = submenuPath.split('/');

						// Check if the third segment matches
						const matches =
							submenuSegments.length >= 3 &&
							submenuSegments[0] === pathSegments[0] &&
							submenuSegments[1] === pathSegments[1] &&
							submenuSegments[2] === pathSegments[2];

						return matches;
					});

					if (submenuItem) {
						// Add submenu name
						breadcrumbs.push(
							t(submenuItem.name) || submenuItem.name
						);
					} else {
						// If no exact submenu match, check if the third segment is a number (ID)
						const thirdSegment = pathSegments[2];
						if (/^\d+$/.test(thirdSegment)) {
							// If it's a number, display "Edit" instead
							breadcrumbs.push(tCommon('edit'));
						} else {
							// Otherwise, add the third path segment as a fallback
							breadcrumbs.push(
								thirdSegment.charAt(0).toUpperCase() +
									thirdSegment.slice(1)
							);
						}
					}
				}
			} else {
				// If no exact menu match, add the second path segment as a fallback
				if (pathSegments.length >= 2) {
					breadcrumbs.push(
						pathSegments[1].charAt(0).toUpperCase() +
							pathSegments[1].slice(1)
					);
				}
			}
		}

		// If no menu match found, create breadcrumbs from path segments
		if (breadcrumbs.length === 0) {
			pathSegments.forEach((segment, index) => {
				if (index === 0) {
					// First segment is usually the solution
					breadcrumbs.push(
						segment.charAt(0).toUpperCase() + segment.slice(1)
					);
				} else {
					// Other segments
					breadcrumbs.push(
						segment.charAt(0).toUpperCase() + segment.slice(1)
					);
				}
			});
		}

		return breadcrumbs;
	};

	const breadcrumbItems = generateBreadcrumbs();

	if (breadcrumbItems.length === 0) {
		return null;
	}

	return (
		<nav
			className={`flex items-center space-x-1 text-sm ${className}`}
			aria-label="Breadcrumb"
		>
			{breadcrumbItems.map((item, index) => (
				<React.Fragment key={index}>
					<span
						className={`font-medium ${
							index === breadcrumbItems.length - 1
								? 'text-gray-900 dark:text-gray-100 font-semibold'
								: 'text-gray-600 dark:text-gray-300'
						}`}
					>
						{item}
					</span>
					{index < breadcrumbItems.length - 1 && (
						<ChevronRight
							size={16}
							className="text-Colors-Brand-500"
						/>
					)}
				</React.Fragment>
			))}
		</nav>
	);
};

export default Breadcrumbs;
