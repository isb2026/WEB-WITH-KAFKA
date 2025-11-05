import React, { useRef, useEffect } from 'react';
import { MenuType } from '../../types/menus';
import { getIconComponent } from '../../utils/iconMapping';
import { ChevronDown } from 'lucide-react';
import { useT } from '@repo/i18n';

interface MainMenuDropdownProps {
	menus: MenuType[];
	selected: MenuType;
	onChange: (menu: MenuType) => void;
	textClassName?: string;
}

const MainMenuDropdown: React.FC<MainMenuDropdownProps> = ({
	menus,
	selected,
	onChange,
	textClassName = '',
}) => {
	const [open, setOpen] = React.useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const Icon = selected.icon && getIconComponent(selected.icon);
	const t = useT('menu');

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	return (
		<div
			ref={dropdownRef}
			className="relative w-full"
			style={{ width: 250 }}
		>
			<button
				className="flex items-center justify-between px-1.5 h-[44px] border border-border rounded-lg bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-base text-foreground shadow-sm transition mx-auto mt-1 md:mt-[20px]"
				style={{
					width: 220,
					minHeight: 44,
					maxHeight: 44,
				}}
				onClick={() => setOpen((prev) => !prev)}
			>
				<span className="flex items-center">
					{Icon && (
						<Icon
							className="w-5 h-5 text-foreground mr-1.5"
							size={20}
						/>
					)}
					<span
						className={`font-bold text-sm leading-[20px] text-left whitespace-nowrap ${textClassName}`}
					>
						{t(selected.label)}
					</span>
				</span>
				<ChevronDown
					className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''} text-foreground`}
				/>
			</button>
			{open && (
				<div
					className="absolute left-1/2 z-10 mt-1 bg-card border border-border rounded-lg shadow-lg mx-auto"
					style={{
						width: 220,
						minWidth: 220,
						transform: 'translateX(-50%)',
					}}
				>
					{menus.length > 0 &&
						menus.map((menu, idx) => {
							const MenuIcon =
								menu.icon && getIconComponent(menu.icon);
							return (
								<React.Fragment key={menu.label}>
									<button
										className={`w-full flex items-center px-1.5 h-[44px] text-left rounded-lg transition font-medium text-base text-foreground hover:bg-muted ${menu.label === selected.label ? 'bg-muted font-bold' : ''}`}
										style={{ minHeight: 44, maxHeight: 44 }}
										onClick={() => {
											setOpen(false);
											onChange(menu);
										}}
									>
										{MenuIcon && (
											<MenuIcon
												className="w-5 h-5 text-foreground mr-1.5"
												size={20}
											/>
										)}
										<span
											className={`font-bold text-sm leading-[20px] text-left whitespace-nowrap ${textClassName}`}
										>
											{t(menu.label)}
										</span>
									</button>
									{idx === 0 && (
										<hr
											className="my-1 border-t border-border"
											style={{ height: 1, minHeight: 1 }}
										/>
									)}
								</React.Fragment>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default MainMenuDropdown;
