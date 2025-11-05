import React, { useState } from 'react';

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
	children: React.ReactNode;
	label: string;
	side?: TooltipSide;
	delay?: number;
	className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	label,
	side = 'top',
	delay = 300,
	className = '',
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isDelayed, setIsDelayed] = useState(false);

	const handleMouseEnter = () => {
		const timer = setTimeout(() => {
			setIsDelayed(true);
		}, delay);

		setIsVisible(true);

		return () => clearTimeout(timer);
	};

	const handleMouseLeave = () => {
		setIsVisible(false);
		setIsDelayed(false);
	};

	const getTooltipPosition = (): string => {
		switch (side) {
			case 'top':
				return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
			case 'right':
				return 'left-full top-1/2 transform -translate-y-1/2 ml-3';
			case 'bottom':
				return 'top-full left-1/2 transform -translate-x-1/2 mt-3';
			case 'left':
				return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
			default:
				return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
		}
	};

	return (
		<div
			className="relative inline-flex items-center"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			{isVisible && (
				<div
					className={`
						absolute z-50 whitespace-nowrap px-2 py-1 text-xs rounded-md
						bg-gray-800 dark:bg-gray-100 text-white dark:text-black pointer-events-none
						transition-opacity duration-200
						${isDelayed ? 'opacity-100' : 'opacity-0'}
						${getTooltipPosition()}
						${className}
					`}
				>
					{label}
					<div
						className={`
							absolute w-2 h-2 bg-gray-800 dark:bg-gray-100 transform rotate-45
							${side === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
							${side === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
							${side === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
							${side === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
						`}
					/>
				</div>
			)}
		</div>
	);
};

export default Tooltip;
