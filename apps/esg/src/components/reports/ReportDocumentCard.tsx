import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, IconButton, Box, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import { useReportMenuActions } from '@esg/hooks/reports/useReportMenuActions';
import { ReportMenu } from './ReportMenu';
import DeleteAlertDialog from '../DeleteAlertDialog';

// Document Card Component (Grid View)
const ReportDocumentCard: React.FC<{ report: any }> = ({ report }) => {
	const {
		anchorEl,
		openDeleteDialog,
		handleMenuClick,
		handleMenuClose,
		handleAction,
		handleReportDelete,
		setOpenDeleteDialog,
		isEditing,
		setIsEditing,
		handleReportRename,
	} = useReportMenuActions(report);

	const [editTitle, setEditTitle] = useState(
		report.title || 'Untitled Document'
	);

	const handleBlur = () => {
		handleReportRename(editTitle);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleReportRename(editTitle);
		} else if (e.key === 'Escape') {
			setEditTitle(report.title || 'Untitled Document');
			setIsEditing(false);
		}
	};

	const handleTitleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsEditing(true);
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year}. ${month}. ${day}.`;
	};

	return (
		<>
			<Box
				component={Link}
				to={`/report/${report.id}`}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					textDecoration: 'none',
					outline: '1px solid #dadce0',
					borderRadius: 1,
					overflow: 'hidden',
					transition: 'all 0.2s ease',
					width: 240,
					'&:hover': {
						outlineColor: '#1976d2',
						textDecoration: 'none',
					},
					'&:focus': {
						textDecoration: 'none',
					},
				}}
			>
				{/* Document Preview */}
				<Box
					sx={{
						height: 280,
						borderBottom: '1px solid #dadce0',
						position: 'relative',
						overflow: 'hidden',
						backgroundImage: `url("https://lh3.google.com/u/0/d/1pI1OLf7u_Q1ZnT6ati9-_tmVYni86pkb952PVq3Z-HM=w416-iv36")`,
						backgroundSize: 'cover',
						backgroundPosition: 'top',
						backgroundRepeat: 'no-repeat',
					}}
				/>

				{/* Document Info */}
				<Box
					sx={{
						p: 1.3,
						flexGrow: 1,
						display: 'flex',
						gap: 0.3,
						flexDirection: 'column',
						backgroundColor: 'rgba(255,255,255, 0.5)',
					}}
				>
					{isEditing ? (
						<TextField
							autoFocus
							fullWidth
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							onBlur={handleBlur}
							onKeyDown={handleKeyDown}
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
						<Typography
							variant="body2"
							onClick={handleTitleClick}
							sx={{
								fontWeight: 400,
								width: 'max-content',
								color: '#202124',
								fontSize: '14px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								'&:hover': {
									cursor: 'text',
								},
							}}
						>
							{report.title || 'Untitled Document'}
						</Typography>
					)}

					<Box
						sx={{
							display: 'flex',
							position: 'relative',
							alignItems: 'center',
							gap: 1,
							mt: 'auto',
						}}
					>
						<DescriptionIcon
							sx={{ color: '#4285f4', fontSize: 16 }}
						/>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ fontSize: '14px' }}
							>
								{report.createdBy}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ fontSize: '13px' }}
							>
								{formatDate(report.updatedAt)}
							</Typography>
						</Box>
						<IconButton
							onClick={handleMenuClick}
							sx={{
								position: 'absolute',
								right: 0,
								width: 32,
								height: 32,
								'&:hover': {
									backgroundColor: 'rgba(21, 20, 20, 0.2)',
								},
							}}
							size="small"
						>
							<MoreVertIcon
								sx={{ color: '#5f6368', fontSize: 18 }}
							/>
						</IconButton>
					</Box>
				</Box>
			</Box>
			<ReportMenu
				anchorEl={anchorEl}
				onClose={handleMenuClose}
				onAction={handleAction}
			/>

			<DeleteAlertDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				onConfirm={handleReportDelete}
				title={`${report.title || 'Untitled Document'} 문서를 삭제하시겠습니까?`}
				content="이 문서와 문서에 포함된 콘텐츠가 영구적으로 삭제됩니다."
			/>
		</>
	);
};

export default ReportDocumentCard;
