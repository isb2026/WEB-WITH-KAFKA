// components/HeaderDropdownIcon.tsx
import React from 'react';
import {
	DropdownMenuRoot,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DynamicIconButton,
} from '@repo/radix-ui/components';
import Tooltip from '../Tooltip';
import { useTranslation } from '@repo/i18n';

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	shortcut?: string;
	onClick?: () => void;
};

type SeparatorItem = {
	type: 'separator';
};

type HeaderDropdownIconProps = {
	icon: React.ReactNode;
	label?: string;
	userInfo?: {
		name: string;
		email: string;
		avatar: React.ReactNode;
	};
	items: (MenuItem | SeparatorItem)[];
};

export const HeaderDropdownIcon: React.FC<HeaderDropdownIconProps> = ({
	icon,
	label,
	userInfo,
	items,
}) => {
	const { t } = useTranslation('common');

	return (
		<DropdownMenuRoot>
			<DropdownMenuTrigger asChild>
				<DynamicIconButton aria-label="Dropdown Menu">
					{userInfo ? (
						icon
					) : (
						<Tooltip label={label ? label : t('header.headerFunction')} side="bottom">
							{icon}
						</Tooltip>
					)}
				</DynamicIconButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="min-w-[248px] bg-popover border rounded-md shadow-md z-50"
				align="end"
			>
				{userInfo && (
					<div className="flex items-center gap-3 p-3 border-b">
						{userInfo.avatar}
						<div className="flex flex-col">
							<span className="font-medium text-sm">
								{userInfo.name}
							</span>
							<span className="text-xs text-muted-foreground">
								{userInfo.email}
							</span>
						</div>
					</div>
				)}
				<div className="py-2">
					{items.map((item, i) => {
						if ('type' in item && item.type === 'separator') {
							return (
								<DropdownMenuSeparator
									key={i}
									className="my-1 h-px bg-border"
								/>
							);
						}

						const menuItem = item as MenuItem;
						return (
							<DropdownMenuItem
								key={i}
								onClick={menuItem.onClick}
								className="flex items-center justify-between py-2 px-3 text-sm rounded hover:bg-muted cursor-pointer"
							>
								<div className="flex items-center gap-3">
									{menuItem.icon}
									<span>{menuItem.label}</span>
								</div>
								{menuItem.shortcut && (
									<span className="text-xs px-2 py-0.5 bg-background text-muted-foreground font-mono rounded border">
										{menuItem.shortcut}
									</span>
								)}
							</DropdownMenuItem>
						);
					})}
				</div>
			</DropdownMenuContent>
		</DropdownMenuRoot>
	);
};
