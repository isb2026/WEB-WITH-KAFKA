import React from 'react';

export interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: string;
	size?: string | number;
}

export const RadixIconButton = ({ children, ...props }: IconButtonProps) => (
	<button type="button" {...props}>
		{children}
	</button>
);
