import {
	RadixAccordionItem,
	RadixAccordionTrigger,
	RadixAccordionRoot,
	RadixAccordionContent,
} from '@radix-ui/components';
import {
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipContent,
	TooltipArrow,
} from '@repo/radix-ui/components';
import { MenuAggregator } from '../../routes/menuAggregator';
import { Link } from 'react-router-dom';
import { getIconComponent } from '../../utils/iconMapping';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import SubmenuIcon from './SubmenuIcon';

interface MenuAccordionProps {
	isCollapsed?: boolean;
	onExpandMenu?: () => void;
}

const MenuAccordion = ({
	isCollapsed = false,
	onExpandMenu,
}: MenuAccordionProps) => {
	const menus = MenuAggregator;
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		undefined
	);

	return (
		<TooltipProvider>
			<RadixAccordionRoot
				type="single"
				className="w-full p-4 flex-1"
				collapsible
				value={openAccordion}
				onValueChange={setOpenAccordion}
			>
				{menus
					.filter((menu) => menu.children.length > 0)
					.map((menu, idx) => {
						const Icon = menu.icon && getIconComponent(menu.icon);
						return (
							<RadixAccordionItem
								key={`${menu.label}-${idx}`}
								value={`${menu.label}-${idx}`}
							>
								<RadixAccordionTrigger asChild>
									{isCollapsed ? (
										<TooltipRoot>
											<TooltipTrigger asChild>
												<button
													onClick={() => {
														onExpandMenu?.();
													}}
													className={`
														group w-full flex items-center px-3 py-2
														text-sm font-medium rounded-md transition-all duration-300 ease-in-out
														text-gray-600 hover:text-gray-900 hover:bg-gray-50
														data-[state=open]:text-gray-900
														data-[state=open]:bg-gray-100
														dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800
														dark:data-[state=open]:text-white dark:data-[state=open]:bg-gray-700
													`}
												>
													<span className="inline-flex items-center justify-center w-7 flex-shrink-0">
														{Icon && (
															<Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
														)}
													</span>
												</button>
											</TooltipTrigger>
											<TooltipContent
												side="right"
												sideOffset={5}
												className="bg-black text-white px-3 py-2 rounded min-w-fit w-auto text-sm border border-gray-700 dark:bg-white dark:text-black dark:border-gray-200"
												style={{
													boxShadow: `0px 2px 2px -1px rgba(10,13,18,0.04), 0px 4px 6px -2px rgba(10,13,18,0.03)`,
												}}
											>
												{menu.label}
												<TooltipArrow className="fill-black dark:fill-white" />
											</TooltipContent>
										</TooltipRoot>
									) : (
										<button
											onClick={() => {
												if (isCollapsed) {
													onExpandMenu?.();
												}
											}}
											className={`
											group w-full flex items-center px-3 py-2
											text-sm font-medium rounded-md transition-all duration-300 ease-in-out
											text-gray-600 hover:text-gray-900 hover:bg-gray-50
											data-[state=open]:text-gray-900
											data-[state=open]:bg-gray-100
											dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800
											dark:data-[state=open]:text-white dark:data-[state=open]:bg-gray-700
										`}
										>
											<span className="inline-flex items-center justify-center w-7 flex-shrink-0">
												{Icon && (
													<Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
												)}
											</span>
											<div
												className={`
												transition-all duration-300 ease-in-out
												${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-xs'}
												overflow-hidden
												whitespace-nowrap
											`}
												style={{
													transitionDelay: isCollapsed
														? '0ms'
														: '100ms',
													transitionProperty:
														'opacity, max-width',
												}}
											>
												<span className="ml-2 block">
													{menu.label}
												</span>
											</div>
											<div
												className={`
												transition-all duration-300 ease-in-out
												${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-4'}
												overflow-hidden
												flex-shrink-0
												ml-auto
											`}
												style={{
													transitionDelay: isCollapsed
														? '0ms'
														: '150ms',
													transitionProperty:
														'opacity, max-width',
												}}
											>
												<ChevronDown
													className="
                                            w-4 h-4 transition-transform duration-300 ease-in-out
                                            group-data-[state=open]:rotate-180
                                            text-gray-600 dark:text-gray-300
                                        "
												/>
											</div>
										</button>
									)}
								</RadixAccordionTrigger>

								{!isCollapsed && (
									<RadixAccordionContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
										<div className="px-6 py-2 data-[state=open]:animate-fade-in">
											<ul className="space-y-1">
												{menu.children.map(
													(child, cidx) => (
														<li
															key={cidx}
															className="transition-all duration-300 ease-in-out"
														>
															<Link
																to={child.to}
																className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-all duration-300 ease-in-out transform dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
															>
																<span className="mr-2 flex-shrink-0">
																	<SubmenuIcon
																		iconName={
																			child.icon
																		}
																	/>
																</span>
																<span>
																	{child.name}
																</span>
															</Link>
														</li>
													)
												)}
											</ul>
										</div>
									</RadixAccordionContent>
								)}
							</RadixAccordionItem>
						);
					})}
			</RadixAccordionRoot>
		</TooltipProvider>
	);
};

export default MenuAccordion;
