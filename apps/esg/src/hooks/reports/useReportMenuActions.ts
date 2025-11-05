import { useCallback, useState } from 'react';
import { useReport } from './useReport';
import { ReportAction } from '@esg/components/reports/ReportMenu';
import { useNavigate } from 'react-router-dom';

export const useReportMenuActions = (report: any) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { remove, update } = useReport({ page: 0, size: 10 });
	const navigate = useNavigate();

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleRenameStart = useCallback((e?: React.MouseEvent) => {
		e?.preventDefault();
		e?.stopPropagation();
		// Batch state updates / Prevents unwanted re-renders
		requestAnimationFrame(() => {
			setAnchorEl(null);
			setIsEditing(true);
		});
	}, []);

	const handleAction = useCallback(
		async (action: ReportAction) => {
			switch (action) {
				case ReportAction.OPEN:
					navigate(`/report/${report.id}`);
					break;
				case ReportAction.SHARE:
					console.log('Share:', report.id);
					break;
				case ReportAction.RENAME:
					handleRenameStart();
					break;
				case ReportAction.DELETE:
					setOpenDeleteDialog(true);
					break;
			}
		},
		[navigate, report.id, handleRenameStart]
	);

	const handleReportDelete = async () => {
		try {
			await remove.mutateAsync(report.id);
			setOpenDeleteDialog(false);
		} catch (error) {
			console.error('Failed to delete report:', error);
		}
	};

	const handleReportRename = async (newTitle: string) => {
		if (newTitle.trim() && newTitle !== report.title) {
			try {
				await update.mutateAsync({
					id: report.id,
					data: { title: newTitle },
				});
			} catch (error) {
				console.error('Failed to rename report:', error);
			}
		}
		setIsEditing(false);
	};

	return {
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
	};
};
