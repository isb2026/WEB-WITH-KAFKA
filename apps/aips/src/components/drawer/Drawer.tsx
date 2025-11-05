import React from 'react';
import { X } from 'lucide-react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
	logo?: React.ReactNode;
	side?: DrawerSide;
	width?: string;
}

const Drawer: React.FC<DrawerProps> = ({
	isOpen,
	onClose,
	title,
	logo,
	children,
	side = 'right',
	width = 'w-80',
}) => {
	// Determine position styles based on side
	const getPositionStyles = () => {
		switch (side) {
			case 'left':
				return {
					drawer: `fixed left-0 top-0 h-full ${width} transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-2xl z-50`,
					transform: isOpen ? 'translate-x-0' : '-translate-x-full',
				};
			case 'right':
				return {
					drawer: `fixed right-0 top-0 h-full ${width} transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-2xl z-50`,
					transform: isOpen ? 'translate-x-0' : 'translate-x-full',
				};
			case 'top':
				return {
					drawer: 'fixed left-0 top-0 w-full h-80 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-2xl z-50',
					transform: isOpen ? 'translate-y-0' : '-translate-y-full',
				};
			case 'bottom':
				return {
					drawer: 'fixed left-0 bottom-0 w-full h-80 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-2xl z-50',
					transform: isOpen ? 'translate-y-0' : 'translate-y-full',
				};
			default:
				return {
					drawer: `fixed right-0 top-0 h-full ${width} transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-2xl z-50`,
					transform: isOpen ? 'translate-x-0' : 'translate-x-full',
				};
		}
	};

	const styles = getPositionStyles();

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-60 z-40"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`${styles.drawer} ${styles.transform} flex flex-col`}
			>
				<div className="p-4 flex-shrink-0">
					<div className="flex items-center justify-between">
						{title && (
							<div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{title}
							</div>
						)}
						{logo && logo}

						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							<X size={24} />
						</button>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto">{children}</div>
			</div>
		</>
	);
};

export default Drawer;
