// components/SolutionSelect.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useT } from '@repo/i18n';
import { MenuType, ServiceType } from '@primes/types/menus';
import { getIconComponent } from '../../utils/iconMapping';
import { LayoutGrid } from 'lucide-react';
import Tooltip from './Tooltip';

type Props = {
	services: ServiceType[];
	selectedService: ServiceType;
	onServiceChange: (svc: ServiceType) => void;
	onMenuClick: (menu: MenuType) => void;
	textClassName?: string;
};

const SolutionSelect: React.FC<Props> = ({
	services,
	selectedService,
	onServiceChange,
	onMenuClick,
}) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const t = useT('menu');

	// close on outside click
	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			)
				setOpen(false);
		};
		if (open) document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, [open]);

	// close on ESC
	useEffect(() => {
		const onKey = (e: KeyboardEvent) =>
			e.key === 'Escape' && setOpen(false);
		if (open) document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open]);

	return (
		<div ref={dropdownRef} className="relative inline-block ml-[145px]">
			{/* Trigger */}
			<Tooltip label="Explore menus" side="left">
				<button
					className="p-2 text-sm rounded hover:bg-muted mt-1"
					onClick={() => setOpen((v) => !v)}
					aria-haspopup="true"
					aria-expanded={open}
				>
					<LayoutGrid size={20} color="gray" />
				</button>
			</Tooltip>

			{open && (
				<div
					role="menu"
					className="
      absolute top-full left-0 z-50 mt-1
      w-[520px] overflow-hidden
      rounded-xl bg-white border border-gray-300 shadow-xl
      transition-all duration-100
    "
				>
					<div className="flex">
						{/* LEFT: Services rail */}
						<aside className="w-[160px] bg-gray-50 border-r z-20">
							<ul className="py-2 max-h-[70vh] overflow-y-auto">
								{services.map((svc) => {
									const Icon =
										svc.icon && getIconComponent(svc.icon);
									const isActive =
										svc.id === selectedService.id;
									return (
										<li key={svc.id}>
											<button
												onClick={() =>
													onServiceChange(svc)
												}
												className="group relative w-full flex items-center gap-3 px-3 py-2 text-left"
											>
												{/* left active bar */}
												<span
													className={[
														'absolute left-0 top-1 bottom-1 w-1 rounded-r-md',
														isActive
															? 'bg-Colors-Brand-600'
															: 'bg-transparent',
													].join(' ')}
												/>
												<span
													className={`flex p-1.5 items-center justify-center rounded-lg bg-Colors-Brand-600`}
												>
													{Icon && (
														<Icon
															size={24}
															className="text-white"
														/>
													)}
												</span>
												<span className="text-sm font-semibold text-gray-900">
													{t(svc.label)}
												</span>
											</button>
										</li>
									);
								})}
							</ul>
						</aside>

						<section className="flex-1 z-10">
							<div className="px-3 py-3 border-b">
								<div className="text-[15px] font-bold text-gray-900">
									{t(selectedService.label)}
								</div>
								<p className="text-[13px] line-clamp-1">
									{t(selectedService.desc || '')}
								</p>
							</div>

							<ul className="px-3 py-2 max-h-[60vh] overflow-y-auto">
								{selectedService.menus.length > 0 ? (
									selectedService.menus.map((menu) => {
										const MenuIcon =
											menu.icon &&
											getIconComponent(menu.icon);
										return (
											<li key={menu.label}>
												<button
													onClick={() => {
														setOpen(false);
														onMenuClick(menu);
													}}
													className="py-2 rounded-lg hover:bg-gray-100 focus:bg-gray-50 transition-colors w-full"
												>
													<div className="flex items-end gap-3">
														{/* icon chip */}
														<span className="flex p-2 items-center justify-center rounded-lg bg-gray-100">
															{MenuIcon && (
																<MenuIcon
																	size={20}
																	className="text-gray-700"
																/>
															)}
														</span>
														<div className="block text-left">
															<span className="text-sm font-semibold text-gray-900">
																{t(menu.label)}
															</span>
															<p className="text-xs line-clamp-1">
																{t(
																	menu.desc ||
																		''
																)}
															</p>
														</div>
													</div>
												</button>
											</li>
										);
									})
								) : (
									<li className="py-6 text-sm text-center text-gray-500">
										메뉴가 곧 제공됩니다!
									</li>
								)}
							</ul>
						</section>
					</div>
				</div>
			)}
		</div>
	);
};

export default SolutionSelect;
