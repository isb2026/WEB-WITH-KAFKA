import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: string;
	size?: string | number;
}

export const RadixButton = ({
	className = '',
	children,
	...props
}: ButtonProps) => (
	<button className={className} {...props}>
		{children}
	</button>
);
