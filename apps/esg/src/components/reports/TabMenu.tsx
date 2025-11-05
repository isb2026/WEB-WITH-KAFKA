import React, { MouseEvent } from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { ContentCopy, DeleteOutline, Edit } from '@mui/icons-material';

interface PageMenuProps {
	anchorEl: HTMLElement | null;
	isOpen: boolean;
	onClose: () => void;
	onAction: (action: 'rename' | 'copy' | 'delete') => void;
	tabsCount?: number;
}

export enum ReportAction {
	COPY = 'copy',
	RENAME = 'rename',
	DELETE = 'delete',
}

export const TabMenu: React.FC<PageMenuProps> = ({
	anchorEl,
	isOpen,
	onClose,
	onAction,
	tabsCount = 0,
}) => {
	const handleMenuClick =
		(action: 'rename' | 'copy' | 'delete') =>
		(event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			event.preventDefault();
			onAction(action);
			onClose();
		};

	return (
		<Menu
			anchorEl={anchorEl}
			open={isOpen}
			onClose={onClose}
			onClick={(e) => e.stopPropagation()}
			sx={{
				'& .MuiPaper-root': {
					minWidth: '160px',
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
			<MenuItem onClick={handleMenuClick(ReportAction.RENAME)}>
				<ListItemIcon>
					<Edit fontSize="small" />
				</ListItemIcon>
				<ListItemText>제목 바꾸기</ListItemText>
			</MenuItem>
			<MenuItem onClick={handleMenuClick(ReportAction.COPY)}>
				<ListItemIcon>
					<ContentCopy fontSize="small" />
				</ListItemIcon>
				<ListItemText>복사</ListItemText>
			</MenuItem>
			{tabsCount > 1 && (
				<MenuItem
					sx={{ color: 'red' }}
					onClick={handleMenuClick(ReportAction.DELETE)}
				>
					<ListItemIcon sx={{ color: 'red' }}>
						<DeleteOutline fontSize="small" />
					</ListItemIcon>
					<ListItemText sx={{ color: 'red' }}>삭제</ListItemText>
				</MenuItem>
			)}
		</Menu>
	);
};
