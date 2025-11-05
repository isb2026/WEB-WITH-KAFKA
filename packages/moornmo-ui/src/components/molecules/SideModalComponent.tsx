import { ReactNode } from 'react';
import { Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ModalHeader, ModalTitle, SideModalContainer } from '../atoms';
import { BootstrapButtonComponent } from '../atoms/button';
import LaunchIcon from '@mui/icons-material/Launch';

interface SideModalComponentProps {
	title: string;
	open: boolean;
	onClose?: () => void;
	onSave?: () => void;
	setOpenModal?: (openModal: boolean) => void;
	children?: ReactNode;
}

export const SideModalComponent = ({
	title,
	open,
	onClose,
	onSave,
	setOpenModal,
	children,
}: SideModalComponentProps) => {
	return (
		<SideModalContainer open={open}>
			<ModalHeader style={{ padding: 12 }}>
				<ModalTitle>{title}</ModalTitle>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<LaunchIcon
						onClick={() => {
							onClose?.();
							setOpenModal?.(true);
						}}
						style={{
							cursor: 'pointer',
							transform: 'rotate(-90deg)',
						}}
					/>
					<CloseIcon
						onClick={onClose}
						style={{ cursor: 'pointer' }}
					/>
				</Box>
			</ModalHeader>

			<Box
				sx={{
					flex: 1,
					overflowY: 'auto',
				}}
			>
				{children}
			</Box>

			<Divider />
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					justifyContent: 'right',
					paddingX: '12px',
					paddingY: '18px',
				}}
			>
				<BootstrapButtonComponent variant="secondary" onClick={onClose}>
					닫기
				</BootstrapButtonComponent>
				<BootstrapButtonComponent variant="primary" onClick={onSave}>
					저장
				</BootstrapButtonComponent>
			</Box>
		</SideModalContainer>
	);
};
