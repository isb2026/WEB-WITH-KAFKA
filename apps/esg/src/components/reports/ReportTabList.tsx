import React, { useState } from 'react';
import { Typography, List, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { StyledContainer, PaperComponent } from '@moornmo/components';
import DeleteAlertDialog from '@esg/components/DeleteAlertDialog';
import { TabMenu } from './TabMenu';
import { ReportTab } from '@esg/types/report';
import { ReportTabListItem } from './ReportTabListItem';

interface ReportTabListProps {
	tabs: ReportTab[];
	selectedTab: ReportTab | null;
	onSelectTab: (page: ReportTab) => void;
	onCreateTab: () => void;
	onUpdateTab: (pageId: number, updatedTitle: string) => void;
	onCopyTab: (pageId: number) => void;
	onDeleteTab: (pageId: number) => void;
	onDownloadPdf?: () => void;
}

export const ReportTabList: React.FC<ReportTabListProps> = ({
	tabs,
	selectedTab,
	onSelectTab,
	onCreateTab,
	onUpdateTab,
	onCopyTab,
	onDeleteTab,
	onDownloadPdf,
}) => {
	const [menuState, setMenuState] = useState<{
		anchorEl: HTMLElement | null;
		pageId: number | null;
	}>({ anchorEl: null, pageId: null });

	const [editState, setEditState] = useState<{
		isEditing: boolean;
		tabId: number | null;
		title: string;
	}>({ isEditing: false, tabId: null, title: '' });

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [pageToDelete, setPageToDelete] = useState<number | null>(null);

	const isMenuOpen = Boolean(menuState.anchorEl);

	const handleMenuClick = (
		event: React.MouseEvent<HTMLElement>,
		tabId: number
	) => {
		event.stopPropagation();
		setMenuState({ anchorEl: event.currentTarget, pageId: tabId });
	};

	const handleMenuClose = () => {
		setMenuState({ anchorEl: null, pageId: null });
	};

	const isDeleteDisabled = (tabId: number) => tabs.length <= 1;

	const handleMenuAction = (action: 'rename' | 'copy' | 'delete') => {
		const { pageId } = menuState;
		if (!pageId) return;

		handleMenuClose();

		Promise.resolve().then(() => {
			switch (action) {
				case 'rename':
					const tab = tabs.find((t) => t.tabId === pageId);
					if (tab) {
						setEditState({
							isEditing: true,
							tabId: tab.tabId,
							title: tab.name,
						});
					}
					break;
				case 'copy':
					onCopyTab(pageId);
					break;
				case 'delete':
					if (!isDeleteDisabled(pageId)) {
						setPageToDelete(pageId);
						setDeleteDialogOpen(true);
					}
					break;
			}
		});
	};

	const handleRenameStart = (tab: ReportTab, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		Promise.resolve().then(() => {
			setEditState({
				isEditing: true,
				tabId: tab.tabId,
				title: tab.name,
			});
		});
	};

	const handleRenameSubmit = (tabId: number, newTitle: string) => {
		const currentTab = tabs.find((t) => t.tabId === tabId);
		if (newTitle.trim() && currentTab && newTitle !== currentTab.name) {
			onUpdateTab(tabId, newTitle.trim());
		}
		setEditState({ isEditing: false, tabId: null, title: '' });
	};

	const handleRenameCancel = () => {
		setEditState({ isEditing: false, tabId: null, title: '' });
	};

	const handleDeleteConfirm = () => {
		if (!pageToDelete) return;

		if (selectedTab?.tabId === pageToDelete) {
			const currentIndex = tabs.findIndex(
				(tab) => tab.tabId === pageToDelete
			);
			let nextTab: ReportTab | null = null;

			if (currentIndex > 0) {
				nextTab = tabs[currentIndex - 1];
			} else if (tabs.length > 1) {
				nextTab = tabs[1];
			}

			if (nextTab) {
				onSelectTab(nextTab);
			}
		}

		if (tabs.length > 1) {
			onDeleteTab(pageToDelete);
		}

		setDeleteDialogOpen(false);
		setPageToDelete(null);
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setPageToDelete(null);
	};

	const handleEditStateChange = (title: string) => {
		setEditState((prev) => ({
			...prev,
			title,
		}));
	};

	return (
		<StyledContainer>
			<DeleteAlertDialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="이 탭을 삭제하시겠습니까?"
				content="이 탭과 탭에 포함된 콘텐츠가 삭제됩니다."
			/>
			<PaperComponent
				sx={{
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					overflowY: 'auto',
					padding: '0 !important',
				}}
			>
				<Box
					sx={{
						position: 'sticky',
						top: 0,
						zIndex: 1,
						backgroundColor: 'background.paper',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mx: 1.5,
						py: 1,
						borderBottom: '1px solid',
						borderBottomColor: 'divider',
					}}
				>
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 600,
							color: 'text.primary',
							fontSize: '0.95rem',
						}}
					>
						문서 탭
					</Typography>
					<Box sx={{ display: 'flex', gap: 1 }}>
						{selectedTab && onDownloadPdf && (
							<IconButton
								onClick={onDownloadPdf}
								size="small"
								sx={{
									width: 32,
									height: 32,
									color: 'primary.main',
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										backgroundColor: 'primary.secondary',
										transform: 'scale(1.05)',
									},
									'&:active': {
										transform: 'scale(0.95)',
									},
								}}
								aria-label="Download PDF"
							>
								<DownloadIcon sx={{ fontSize: 24 }} />
							</IconButton>
						)}
						<IconButton
							onClick={onCreateTab}
							size="small"
							sx={{
								width: 32,
								height: 32,
								color: 'primary.main',
								transition: 'all 0.2s ease-in-out',
								'&:hover': {
									backgroundColor: 'primary.secondary',
									transform: 'scale(1.05)',
								},
								'&:active': {
									transform: 'scale(0.95)',
								},
							}}
							aria-label="Add new page"
						>
							<AddIcon sx={{ fontSize: 24 }} />
						</IconButton>
					</Box>
				</Box>
				<List sx={{ mx: 1.5, py: 1 }}>
					{tabs.map((tab) => (
						<ReportTabListItem
							key={tab.tabId}
							tab={tab}
							selectedTab={selectedTab}
							editState={editState}
							menuState={menuState}
							onSelectTab={onSelectTab}
							onRenameStart={handleRenameStart}
							onRenameSubmit={handleRenameSubmit}
							onRenameCancel={handleRenameCancel}
							onMenuClick={handleMenuClick}
							onEditStateChange={handleEditStateChange}
						/>
					))}
				</List>
				<TabMenu
					anchorEl={menuState.anchorEl}
					isOpen={isMenuOpen}
					onClose={handleMenuClose}
					onAction={handleMenuAction}
					tabsCount={tabs.length}
				/>
			</PaperComponent>
		</StyledContainer>
	);
};
