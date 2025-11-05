import React, { ReactNode } from 'react';

import { Button as BootstrapButton } from 'react-bootstrap';

export type ButtonSize = 'sm' | 'lg' | 'xl';

export interface ModalButtonProps {
	variant?: 'primary' | 'secondary' | string;
	onClick?: () => void;
	children: ReactNode;
}
export const BootstrapButtonComponent: React.FC<ModalButtonProps> = ({
	variant = 'primary',
	onClick,
	children,
}) => (
	<BootstrapButton variant={variant} onClick={onClick}>
		{children}
	</BootstrapButton>
);
