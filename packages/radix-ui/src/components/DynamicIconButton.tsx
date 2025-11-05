// components/DynamicIconButton.tsx
import React, { forwardRef } from 'react';
import { IconButton, IconButtonProps } from '@radix-ui/themes';

type AllowedColors =
	| 'gray'
	| 'blue'
	| 'green'
	| 'red'
	| 'yellow'
	| 'crimson'
	| 'tomato'
	| 'violet'
	| 'purple'
	| 'indigo'
	| 'cyan'
	| 'teal'
	| 'lime'
	| 'pink'
	| 'brown'
	| 'orange'
	| 'gold'
	| 'bronze'
	| 'plum'
	| 'ruby';

interface DynamicIconButtonProps extends Omit<IconButtonProps, 'color'> {
	color?: AllowedColors;
	className?: string;
	children: React.ReactNode;
}

export const DynamicIconButton = forwardRef<
	HTMLButtonElement,
	DynamicIconButtonProps
>(({ className, size = '2', color, children, ...props }, ref) => {
	return (
		<IconButton
			ref={ref}
			variant="ghost"
			size={size}
			color={color}
			className={className}
			style={{ cursor: 'pointer' }}
			{...props}
		>
			{children}
		</IconButton>
	);
});

DynamicIconButton.displayName = 'DynamicIconButton';

export default DynamicIconButton;
