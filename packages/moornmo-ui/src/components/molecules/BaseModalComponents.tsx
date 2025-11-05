import React, { ReactNode, useRef, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
	ModalContainer,
	ModalHeader,
	ModalTitle,
	ModalBody,
	ModalFooter,
} from '../atoms';
import { BootstrapButtonComponent, ButtonSize } from '../atoms/button';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
import { ModalDialogProps, ModalDialog } from 'react-bootstrap';

const DraggableDialog = ({
	modalHeight,
	...props
}: ModalDialogProps & { modalHeight?: number }) => {
	const yPosition = (window.innerHeight - (modalHeight ?? 0)) / 2;
	return (
		<Draggable
			handle=".modal-header"
			defaultPosition={{ x: 0, y: yPosition }}
		>
			<div>
				<ModalDialog {...props} />
			</div>
		</Draggable>
	);
};
interface BaseModalClassNames {
	modalContainer?: string;
	modalHeader?: string;
	modalBody?: string;
	modalFooter?: string;
}
interface BaseModalStyles {
	modalContainer?: React.CSSProperties;
	modalHeader?: React.CSSProperties;
	modalBody?: React.CSSProperties;
	modalFooter?: React.CSSProperties;
}
export interface BaseModalProps {
	open: boolean;
	title?: string;
	children?: ReactNode;
	size?: ButtonSize;
	onClose?: () => void;
	onSave?: () => void;
	useSideMode?: boolean;
	setSideModalOpen?: (isSideModalOpen: boolean) => void;
	hideFooterButtons?: boolean;
	className?: BaseModalClassNames;
	styles?: BaseModalStyles;
}

export const BaseModalComponent: React.FC<BaseModalProps> = ({
	open,
	title,
	children,
	size = 'lg',
	onClose,
	onSave,
	useSideMode = false,
	setSideModalOpen,
	hideFooterButtons = false,
	className,
	styles,
}) => (
	<ModalContainer
		centered
		show={open}
		onHide={onClose}
		size={size}
		className={className?.modalContainer}
		style={styles?.modalContainer}
	>
		<ModalHeader
			className={className?.modalHeader}
			style={styles?.modalHeader}
		>
			<ModalTitle>{title}</ModalTitle>
			<Box sx={{ display: 'flex', gap: 2 }}>
				{useSideMode && (
					<MenuOpenIcon
						onClick={() => {
							onClose?.();
							setSideModalOpen?.(true);
						}}
						style={{
							cursor: 'pointer',
							transform: 'rotate(180deg)',
						}}
					/>
				)}

				<CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
			</Box>
		</ModalHeader>
		<ModalBody
			className={className?.modalBody}
			style={{ overflow: 'auto', ...styles?.modalBody }}
		>
			{children}
		</ModalBody>
		{!hideFooterButtons && (
			<ModalFooter
				className={className?.modalFooter}
				style={styles?.modalFooter}
			>
				<BootstrapButtonComponent variant="secondary" onClick={onClose}>
					닫기
				</BootstrapButtonComponent>
				<BootstrapButtonComponent variant="primary" onClick={onSave}>
					저장
				</BootstrapButtonComponent>
			</ModalFooter>
		)}
	</ModalContainer>
);
