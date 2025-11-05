import React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { OpenInNew, DeleteOutline, Edit, Share } from '@mui/icons-material';

export enum ReportAction {
	OPEN = 'open',
	SHARE = 'share',
	RENAME = 'rename',
	DELETE = 'delete',
}

interface ReportMenuProps {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	onAction: (action: ReportAction) => void;
}

export const ReportMenu: React.FC<ReportMenuProps> = ({
	anchorEl,
	onClose,
	onAction,
}) => {
	const handleMenuAction =
		(action: ReportAction) => (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onAction(action);
			onClose();
		};

	return (
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={onClose}
			onClick={(e) => e.stopPropagation()}
			sx={{
				'& .MuiPaper-root': {
					minWidth: '180px',
					boxShadow: 1,
					border: '1px solid #e0e0e0',
					borderRadius: '8px',
				},
				'& .MuiMenuItem-root': {
					padding: '10px 16px',
					fontSize: '14px',
				},
			}}
		>
			<MenuItem onClick={handleMenuAction(ReportAction.OPEN)}>
				<ListItemIcon>
					<OpenInNew fontSize="small" />
				</ListItemIcon>
				<ListItemText>열기</ListItemText>
			</MenuItem>
			<MenuItem onClick={handleMenuAction(ReportAction.SHARE)}>
				<ListItemIcon>
					<Share fontSize="small" />
				</ListItemIcon>
				<ListItemText>공유</ListItemText>
			</MenuItem>
			<MenuItem onClick={handleMenuAction(ReportAction.RENAME)}>
				<ListItemIcon>
					<Edit fontSize="small" />
				</ListItemIcon>
				<ListItemText>이름 바꾸기</ListItemText>
			</MenuItem>
			<MenuItem onClick={handleMenuAction(ReportAction.DELETE)}>
				<ListItemIcon sx={{ color: 'red' }}>
					<DeleteOutline fontSize="small" />
				</ListItemIcon>
				<ListItemText sx={{ color: 'red' }}>삭제</ListItemText>
			</MenuItem>
		</Menu>
	);
};
