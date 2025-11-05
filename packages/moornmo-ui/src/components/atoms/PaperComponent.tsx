import React from 'react';
import { Paper } from '@mui/material';

interface PaperProps {
	children: React.ReactNode;
	sx?: React.CSSProperties;
	className?: string;
	evolution?: number;
	[key: string]: any;
}

export const PaperComponent: React.FC<PaperProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<Paper
			className={'d-flex ' + className}
			sx={{
				backgroundColor: 'transparent',
				overflow: 'auto',
				borderRadius: 2,
				width: '100%',
				height: 'fit-content',
				...props.sx,
			}}
			evolution={props.evolution ? props.evolution : 0}
			{...props}
		>
			{children}
		</Paper>
	);
};
