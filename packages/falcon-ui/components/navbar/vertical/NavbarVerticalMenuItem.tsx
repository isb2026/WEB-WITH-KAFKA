// src/components/Navigation/NavbarVerticalMenuItem.tsx
import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Flex } from '../../common/Flex';
import { SubtleBadge, statusType } from '../../common/SubtleBadge';

export interface RouteItem {
	active?: boolean;
	name: string;
	to?: string;
	icon?: IconProp;
	badge?: {
		type: statusType;
		text: string;
	};
	children?: RouteItem[];
}

export interface NavbarVerticalMenuItemProps {
	route: RouteItem;
}

export const NavbarVerticalMenuItem: FC<NavbarVerticalMenuItemProps> = ({
	route,
}) => (
	<Flex alignItems="center">
		{route.icon && (
			<span className="nav-link-icon">
				<FontAwesomeIcon icon={route.icon} />
			</span>
		)}
		<span className="nav-link-text ps-1">{route.name}</span>
		{route.badge && (
			<SubtleBadge pill bg={route.badge.type} className="ms-2">
				{route.badge.text}
			</SubtleBadge>
		)}
	</Flex>
);
