import { Link, useLocation } from 'react-router-dom';
import { Dialog } from '@repo/radix-ui/components';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@repo/radix-ui/components';

// Chevron icon component
const ChevronDown = ({ open }: { open: boolean }) => (
	<svg
		className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		viewBox="0 0 24 24"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
	</svg>
);

// Define menu item type
interface MenuItem {
	name: string;
	path: string;
}

// Drawer/Aside component
export default function Aside() {
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const [radixOpen, setRadixOpen] = useState(true);
	const [echartOpen, setEchartOpen] = useState(true);

	const menus: MenuItem[] = [
		{ name: 'Tabs', path: '/radix-ui/tabs' },
		{ name: 'Dialog', path: '/radix-ui/dialog' },
		{ name: 'Avatar', path: '/radix-ui/avatar' },
		{ name: 'Button', path: '/radix-ui/button' },
		{ name: 'Accordion', path: '/radix-ui/accordion' },
		{ name: 'Text', path: '/radix-ui/text' },
		{ name: 'Heading', path: '/radix-ui/heading' },
		{ name: 'Datalist', path: '/radix-ui/datalist' },
		{ name: 'Icon Button', path: '/radix-ui/icon-button' },
		{ name: 'Layout', path: '/radix-ui/layout' },
		{ name: 'Spinner', path: '/radix-ui/spinner' },
		{ name: 'Badge', path: '/radix-ui/badge' },
		{ name: 'Checkbox', path: '/radix-ui/checkbox' },
		{ name: 'Checkbox Group', path: '/radix-ui/checkbox-group' },
		{ name: 'Popover', path: '/radix-ui/popover' },
		{ name: 'Radio Cards', path: '/radix-ui/radio-cards' },
		{ name: 'Switch', path: '/radix-ui/switch' },
		{ name: 'File Upload', path: '/radix-ui/file-upload' },
		{ name: 'Dropdown', path: '/radix-ui/dropdown' },
		{ name: 'Text Field', path: '/radix-ui/text-field' },
		{ name: 'Kanban', path: '/radix-ui/kanban' },
		{ name: 'Select', path: '/radix-ui/select' },
		{ name: 'Data Table', path: '/radix-ui/data-table' },
		{ name: 'Draggable Dialog', path: '/radix-ui/draggable-dialog' },
		{ name: 'Editable', path: '/radix-ui/editable' },
		{ name: 'Tooltip', path: '/radix-ui/tooltip' },
		{
			name: 'Icon Button Component',
			path: '/radix-ui/icon-button-component',
		},
		{ name: 'Badge Component', path: '/radix-ui/badge-component' },
		{ name: 'Segmented Control', path: '/radix-ui/segmented-control' },
		{ name: 'Item Search Modal', path: '/radix-ui/item-search-modal' },
	];

	const echartMenus: MenuItem[] = [
		{ name: 'Line Chart', path: '/echart/line' },
		{ name: 'Bar Chart', path: '/echart/bar' },
		{ name: 'Pie Chart', path: '/echart/pie' },
	];

	return (
		<>
			{/* Mobile Drawer Trigger */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<Dialog.Root open={open} onOpenChange={setOpen}>
					<Dialog.Trigger asChild>
						<Button variant="ghost">
							<HamburgerMenuIcon className="w-6 h-6" />
						</Button>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay className="fixed inset-0 bg-black/50" />
						<Dialog.Content
							className="
                fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 
                transform transition-transform duration-300 ease-in-out
                data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full
              "
						>
							<div className="flex justify-between items-center mb-4">
								<Link
									to="/"
									className="
                    block py-2 rounded-md text-lg text-blue-500 
                    font-bold hover:text-gray-700 hover:bg-gray-200 
                    hover:no-underline
                  "
									onClick={() => setOpen(false)}
								>
									Moornmo UI Demo
								</Link>
								<Dialog.Close asChild>
									<Button variant="ghost">
										<Cross2Icon className="w-6 h-6" />
									</Button>
								</Dialog.Close>
							</div>
							<div className="max-h-[calc(100vh-100px)] overflow-auto scrollbar-none">
								<button
									className="mt-6 text-sm font-bold mb-4 flex items-center w-full text-left text-gray-700 bg-white transition-colors rounded"
									onClick={() =>
										setRadixOpen((prev) => !prev)
									}
									type="button"
								>
									Radix UI Components
									<ChevronDown open={radixOpen} />
								</button>
								{radixOpen && (
									<nav className="space-y-2 py-2 flex flex-col">
										{menus.map((menu) => {
											const isActive =
												location.pathname === menu.path;
											return (
												<Link
													key={menu.name}
													to={menu.path}
													className={`
                        flex-1 px-3 py-1 rounded-md
                        ${isActive ? 'bg-blue-200 text-gray-700 font-semibold' : 'text-gray-700'}
                        hover:text-gray-700 hover:bg-gray-200 hover:underline
                      `}
													onClick={() =>
														setOpen(false)
													}
												>
													{menu.name}
												</Link>
											);
										})}
									</nav>
								)}
								{/* Echart Components Section (Mobile) */}
								<button
									className="text-sm font-bold mb-4 flex items-center w-full text-left text-gray-700 bg-white transition-colors rounded"
									onClick={() =>
										setEchartOpen((prev) => !prev)
									}
									type="button"
								>
									Echart Components
									<ChevronDown open={echartOpen} />
								</button>
								{echartOpen && (
									<nav className="space-y-2 py-2 flex flex-col">
										{echartMenus.map((menu) => (
											<Link
												key={menu.name}
												to={menu.path}
												className="flex-1 px-3 py-1 rounded-md text-gray-700"
											>
												{menu.name}
											</Link>
										))}
									</nav>
								)}
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>

			{/* Desktop Sidebar */}
			<aside className="hidden lg:block w-64 bg-gray-100 border-r p-4 text-sm ">
				<div className="font-bold mb-4">
					<Link
						to="/"
						className="
              block py-2 rounded-md text-lg text-blue-500 
              font-bold hover:text-gray-700 hover:bg-gray-200 
              hover:no-underline
            "
					>
						Moornmo UI Demo
					</Link>
				</div>
				<div className="max-h-[calc(100vh-100px)] overflow-auto scrollbar-none">
					<button
						className="text-sm font-bold mb-4 flex items-center w-full text-left text-gray-700 bg-white transition-colors rounded"
						onClick={() => setRadixOpen((prev) => !prev)}
						type="button"
					>
						Radix UI Components
						<ChevronDown open={radixOpen} />
					</button>
					{radixOpen && (
						<nav className="space-y-2 py-2 flex flex-col">
							{menus.map((menu) => {
								const isActive =
									location.pathname === menu.path;
								return (
									<Link
										key={menu.name}
										to={menu.path}
										className={`
                  flex-1 px-3 py-1 rounded-md
                  ${isActive ? 'bg-blue-200 text-gray-700 font-semibold' : 'text-gray-700'}
                  hover:text-gray-700 hover:bg-gray-200 hover:underline
                `}
									>
										{menu.name}
									</Link>
								);
							})}
						</nav>
					)}
					{/* Echart Components Section (Desktop) */}
					<button
						className="text-sm font-bold mb-4 flex items-center w-full text-left text-gray-700 bg-white transition-colors rounded"
						onClick={() => setEchartOpen((prev) => !prev)}
						type="button"
					>
						Echart Components
						<ChevronDown open={echartOpen} />
					</button>
					{echartOpen && (
						<nav className="space-y-2 py-2 flex flex-col">
							{echartMenus.map((menu) => (
								<Link
									key={menu.name}
									to={menu.path}
									className="flex-1 px-3 py-1 rounded-md text-gray-700"
								>
									{menu.name}
								</Link>
							))}
						</nav>
					)}
				</div>
			</aside>
		</>
	);
}
