import React from 'react';
// import { MainMenus } from '../../routes/menu';
import { MenuType } from '../../types/menus';
import { PanelLeft } from 'lucide-react';
import { getIconComponent } from '../../utils/iconMapping';
import Tooltip from './Tooltip';
import { Link } from 'react-router-dom';

const menuItems = [];

interface Style2SidebarProps {
	selectedMenu: MenuType;
	onMenuSelect: (menu: MenuType) => void;
	onToggleSubmenus: () => void;
	showSubmenus: boolean;
	isClosingSubmenus: boolean;
	expandedSubmenus?: Set<string>;
	onToggleSubmenu?: (itemName: string) => void;
}

const Style2Sidebar: React.FC<Style2SidebarProps> = ({
	selectedMenu,
	onMenuSelect,
	onToggleSubmenus,
	showSubmenus,
	isClosingSubmenus,
	expandedSubmenus = new Set(),
	onToggleSubmenu = () => {},
}) => {
	return (
		<div className="flex h-full">
			<aside className="border-r border-gray-200 dark:border-gray-700 flex flex-col h-full w-24 bg-[color:var(--sidebar-background)]">
				<div className="flex flex-col items-center p-4 space-y-4">
					{/* {menuItems.map((menu) => {
						const Icon = menu.icon && getIconComponent(menu.icon);
						return (
							<button
								key={menu.label}
								className={`flex flex-col items-center p-2 rounded-md transition-colors w-full ${
									selectedMenu.label === menu.label
										? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
										: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
								}`}
								onClick={() => onMenuSelect(menu)}
							>
								{Icon && (
									<Icon className="w-6 h-6 mb-1" size={24} />
								)}
								<span
									className="text-sm font-medium text-gray-500 dark:text-gray-300"
									style={{ width: 26, height: 20 }}
								>
									{menu.label}
								</span>
							</button>
						);
					})} */}
				</div>
			</aside>

			{/* {showSubmenus && (
				<aside
					className={`border-r border-gray-200 dark:border-gray-700 flex flex-col h-full w-64 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out ${
						isClosingSubmenus
							? 'opacity-0 transform translate-x-4'
							: 'opacity-100 transform translate-x-0'
					}`}
				>
					<div className="p-4">
						<h2 className="text-sm leading-5 text-violet-900 dark:text-violet-300 font-semibold">
							{selectedMenu.label}
						</h2>
					</div>

					<div className="flex-1 min-h-0 overflow-y-auto p-2">
						<ul className="space-y-0">
							{selectedMenu.children.map((item) => {
								const SubIcon =
									item.icon && getIconComponent(item.icon);
								return (
									<li
										key={item.to}
										className="flex overflow-hidden items-center px-0 py-0.5 w-full"
									>
										{item.children ? (
											// Nested sub-menu with children
											<div className="w-full">
												<button
													onClick={() =>
														onToggleSubmenu(
															item.name
														)
													}
													className="flex flex-1 shrink gap-3 items-center self-stretch px-3 py-2 my-auto w-full rounded-md basis-0 bg-white dark:bg-gray-900 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors"
												>
													<div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto basis-0">
														{SubIcon && (
															<SubIcon
																className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square text-gray-600 dark:text-gray-400"
																size={20}
															/>
														)}
														<span className="self-stretch my-auto text-md leading-6 text-gray-700 dark:text-gray-300 font-bold">
															{item.name}
														</span>
													</div>
													<div className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square">
														<svg
															className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
																expandedSubmenus.has(
																	item.name
																)
																	? 'rotate-180'
																	: ''
															}`}
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 9l-7 7-7-7"
															/>
														</svg>
													</div>
												</button>
												{expandedSubmenus.has(
													item.name
												) && (
													<div className="ml-6 mt-1">
														{item.children.map(
															(subItem) => {
																const SubSubIcon =
																	subItem.icon &&
																	getIconComponent(
																		subItem.icon
																	);
																return (
																	<Link
																		key={
																			subItem.to
																		}
																		to={
																			subItem.to
																		}
																		className="flex flex-1 shrink gap-3 items-center self-stretch px-3 py-2 my-auto w-full rounded-md basis-0 bg-white dark:bg-gray-900 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors"
																	>
																		<div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto basis-0">
																			{SubSubIcon && (
																				<SubSubIcon
																					className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square text-gray-600 dark:text-gray-400"
																					size={
																						16
																					}
																				/>
																			)}
																			<span className="self-stretch my-auto text-sm leading-5 text-gray-600 dark:text-gray-400 font-medium">
																				{
																					subItem.name
																				}
																			</span>
																		</div>
																	</Link>
																);
															}
														)}
													</div>
												)}
											</div>
										) : (
											// Regular sub-menu item
											<Link
												to={item.to}
												className="flex flex-1 shrink gap-3 items-center self-stretch px-3 py-2 my-auto w-full rounded-md basis-0 bg-white dark:bg-gray-900 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors"
											>
												<div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto basis-0">
													{SubIcon && (
														<SubIcon
															className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square text-gray-600 dark:text-gray-400"
															size={20}
														/>
													)}
													<span className="self-stretch my-auto text-md leading-6 text-gray-700 dark:text-gray-300 font-bold">
														{item.name}
													</span>
												</div>
												<div className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square">
													<svg
														className="w-4 h-4 text-gray-400 dark:text-gray-500"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</div>
											</Link>
										)}
									</li>
								);
							})}
						</ul>
					</div>

					<div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
						<button
							className="flex items-center justify-center p-2 rounded-md transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
							onClick={onToggleSubmenus}
						>
							<Tooltip label="메뉴 닫기">
								<PanelLeft className="w-5 h-5" />
							</Tooltip>
						</button>
					</div>
				</aside>
			)} */}
		</div>
	);
};

export default Style2Sidebar;
