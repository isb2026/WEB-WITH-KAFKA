import React from 'react';
import { RadixSpinner } from './Spinner';

export interface IconButtonComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	loading?: boolean;
}

export const RadixIconButtonComponent = ({ 
	children, 
	loading = false,
	...props 
}: IconButtonComponentProps) => (
	<button type="button" {...props}>
		{loading ? <RadixSpinner /> : children}
	</button>
);
