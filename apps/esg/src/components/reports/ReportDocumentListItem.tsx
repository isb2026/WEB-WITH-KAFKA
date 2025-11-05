// Document List Item Component (List View)
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import { Link } from 'react-router-dom';
import {
	Box,
	IconButton,
	ListItem,
	TextField,
	Typography,
} from '@mui/material';
import { useReportMenuActions } from '@esg/hooks/reports/useReportMenuActions';
import { ReportMenu } from './ReportMenu';
import DeleteAlertDialog from '../DeleteAlertDialog';
import { useState } from 'react';

const ReportDocumentListItem: React.FC<{ report: any }> = ({ report }) => {
	const [editTitle, setEditTitle] = useState(
		report.title || 'Untitled Document'
	);
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

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year}. ${month}. ${day}.`;
	};

	const getDocumentIcon = (type: string) => {
		return type === 'form' ? (
			<AssignmentIcon sx={{ color: '#34a853', fontSize: 20 }} />
		) : (
			<DescriptionIcon sx={{ color: '#4285f4', fontSize: 20 }} />
		);
	};

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

	return (
		<>
			<ListItem
				component={Link}
				to={`/report/${report.id}`}
				sx={{
					textDecoration: 'none',
					color: 'inherit',
					py: 1.5,
					px: 2,
					borderBottom: '1px solid #dadce0',
					transition: 'all 0.2s ease',
					mb: 0.5,
					'&:hover': {
						backgroundColor: '#f8f9fa',
						textDecoration: 'none',
					},
					'&:focus': {
						textDecoration: 'none',
					},
					display: 'flex',
					gap: 2,
					alignItems: 'center',
					minHeight: 48,
				}}
			>
				{/* Document Icon */}
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{getDocumentIcon(report.type)}
				</Box>

				{/* Document Title - takes up remaining space */}
				<Box sx={{ flexGrow: 1 }}>
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
								maxWidth: 'max-content',
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
				</Box>

				<Box
					sx={{
						width: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					{/* Owner Column */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							minWidth: 120,
							mr: 3,
						}}
					>
						<Typography
							variant="caption"
							sx={{
								fontSize: '13px',
								color: '#5f6368',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{report.createdBy}
						</Typography>
					</Box>

					{/* Last Modified Date */}
					<Box
						sx={{
							minWidth: 100,
							mr: 2,
							textAlign: 'left',
						}}
					>
						<Typography
							variant="caption"
							sx={{
								fontSize: '13px',
								color: '#5f6368',
							}}
						>
							{formatDate(report.updatedAt)}
						</Typography>
					</Box>

					{/* Menu Button */}
					<Box>
						<IconButton
							onClick={handleMenuClick}
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
				</Box>
			</ListItem>

			<ReportMenu
				anchorEl={anchorEl}
				onClose={handleMenuClose}
				onAction={handleAction}
			/>

			<DeleteAlertDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				onConfirm={handleReportDelete}
				title={`"${report.title || 'Untitled Document'}" 문서를 삭제하시겠습니까?`}
				content="이 문서와 문서에 포함된 콘텐츠가 영구적으로 삭제됩니다."
			/>
		</>
	);
};

export default ReportDocumentListItem;
