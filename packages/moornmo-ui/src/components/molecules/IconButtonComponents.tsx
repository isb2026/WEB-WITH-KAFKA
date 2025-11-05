import React from 'react';
import { Button } from 'react-bootstrap';
import { MaterialIconComponent } from '@moornmo/components/atoms';
import styled from 'styled-components';
import * as Icons from '@mui/icons-material';

export interface IconButtonProps extends React.ComponentProps<typeof Button> {
	icon: keyof typeof Icons;
	iconClassName?: string;
	IconSize?: string | number;
	label: string;
	onClick?: () => void;
	iconAlign?: 'left' | 'right';
	variant?: string;
	transform?: string;
	size?: 'sm' | 'lg';
}

const BorderedIconButton = styled(Button)`
	// border: 1px solid #ddd;
	align-items: center;
	display: flex;
	gap: 5px;
`;

export const IconButtonComponent: React.FC<IconButtonProps> = ({
	icon,
	iconClassName,
	IconSize,
	label,
	onClick,
	iconAlign = 'left',
	variant = 'light',
	transform = 'none',
	size = 'sm',
	...props
}) => (
	<BorderedIconButton
		{...props}
		size={size}
		variant={variant}
		style={{ transform }}
		onClick={() => {
			if (onClick) onClick();
		}}
	>
		{iconAlign === 'left' && (
			<MaterialIconComponent
				fontSize={IconSize}
				iconName={icon}
				className={iconClassName}
			/>
		)}
		{label}
		{iconAlign === 'right' && (
			<MaterialIconComponent
				fontSize={IconSize}
				iconName={icon}
				className={iconClassName}
			/>
		)}
	</BorderedIconButton>
);
