import React from 'react';
import {
	ListItem,
	ListItemText,
	Box,
	IconButton,
	TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ReportTab } from '@esg/types/report';

interface ReportTabListItemProps {
	tab: ReportTab;
	selectedTab: ReportTab | null;
	editState: {
		isEditing: boolean;
		tabId: number | null;
		title: string;
	};
	menuState: {
		pageId: number | null;
	};
	onSelectTab: (tab: ReportTab) => void;
	onRenameStart: (tab: ReportTab, e: React.MouseEvent) => void;
	onRenameSubmit: (tabId: number, newTitle: string) => void;
	onRenameCancel: () => void;
	onMenuClick: (event: React.MouseEvent<HTMLElement>, tabId: number) => void;
	onEditStateChange: (title: string) => void;
}

export const ReportTabListItem: React.FC<ReportTabListItemProps> = ({
	tab,
	selectedTab,
	editState,
	menuState,
	onSelectTab,
	onRenameStart,
	onRenameSubmit,
	onRenameCancel,
	onMenuClick,
	onEditStateChange,
}) => {
	return (
		<ListItem
			onClick={() => onSelectTab(tab)}
			sx={{
				width: '100%',
				mb: 0.1,
				py: 0.5,
				borderRadius: 5,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				overflow: 'hidden',
				backgroundColor:
					menuState.pageId === tab.tabId
						? 'action.hover'
						: selectedTab?.tabId === tab.tabId
							? 'action.selected'
							: 'transparent',
				cursor: 'pointer',
				'&:hover': {
					backgroundColor: 'action.hover',
				},
			}}
		>
			{editState.tabId === tab.tabId ? (
				<TextField
					autoFocus
					fullWidth
					value={editState.title}
					onChange={(e) => onEditStateChange(e.target.value)}
					onBlur={() => onRenameSubmit(tab.tabId, editState.title)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							onRenameSubmit(tab.tabId, editState.title);
						} else if (e.key === 'Escape') {
							onRenameCancel();
						}
					}}
					onClick={(e) => e.stopPropagation()}
					variant="standard"
					sx={{
						'& .MuiInput-root': {
							fontSize: '14px',
							fontWeight: 400,
							color: '#202124',
						},
					}}
				/>
			) : (
				<ListItemText
					primary={tab.name}
					sx={{
						cursor: 'text',
						maxWidth: 'max-content',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
					onClick={(e) => onRenameStart(tab, e)}
				/>
			)}
			<Box
				sx={{
					visibility:
						selectedTab?.tabId === tab.tabId ||
						menuState.pageId === tab.tabId
							? 'visible'
							: 'hidden',
					'.MuiListItem-root:hover &': {
						visibility: 'visible',
					},
				}}
			>
				<IconButton
					onClick={(e) => onMenuClick(e, tab.tabId)}
					size="small"
					sx={{
						color: '#5f6368',
						width: 32,
						height: 32,
						'&:hover': {
							backgroundColor: 'rgba(0,0,0,0.04)',
						},
					}}
				>
					<MoreVertIcon fontSize="small" />
				</IconButton>
			</Box>
		</ListItem>
	);
};
