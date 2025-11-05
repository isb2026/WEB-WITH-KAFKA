import React, { useState } from 'react';
import {
	Container,
	Typography,
	IconButton,
	Box,
	Grid,
	List,
	CircularProgress,
	Pagination,
	Button,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import { useReport } from '@esg/hooks/reports/useReport';
import ReportDocumentListItem from '@esg/components/reports/ReportDocumentListItem';
import ReportDocumentCard from '@esg/components/reports/ReportDocumentCard';
import { Spinner } from '@repo/moornmo-ui/components';

// Main ReportsListPage Component
const ReportsListPage: React.FC = () => {
	const PAGE_SIZE = 6;
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [page, setPage] = useState(1);
	const { reportList, create } = useReport({
		page: page - 1,
		size: PAGE_SIZE,
	});
	const { data, isLoading } = reportList;

	const toggleViewMode = () => {
		setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
	};

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const handleCreateReport = () => {
		create.mutate({});
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<Container
				maxWidth="xl"
				sx={{ position: 'relative', py: 2, px: { sm: 3, md: 12 } }}
			>
				{/* Header */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
						position: 'sticky',
						top: 66,
						py: 2,
						zIndex: 1000,
						bgcolor: '#edf2f9',
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 400,
							color: '#202124',
							fontSize: '16px',
						}}
					>
						최근 문서
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Button
							startIcon={<AddIcon />}
							variant="outlined"
							onClick={handleCreateReport}
							disabled={create.isPending}
						>
							New
						</Button>
						<Typography
							variant="body2"
							sx={{ color: '#5f6368', mr: 1, fontSize: '14px' }}
						>
							모든 항목
						</Typography>

						<IconButton
							size="small"
							sx={{
								color:
									viewMode === 'list' ? '#1976d2' : '#5f6368',
								backgroundColor:
									viewMode === 'list'
										? 'rgba(25, 118, 210, 0.08)'
										: 'transparent',
							}}
							onClick={toggleViewMode}
							title={
								viewMode === 'grid' ? '목록 보기' : '격자 보기'
							}
						>
							{viewMode === 'grid' ? (
								<ViewListIcon fontSize="small" />
							) : (
								<ViewModuleIcon fontSize="small" />
							)}
						</IconButton>

						<IconButton size="small" sx={{ color: '#5f6368' }}>
							<SortByAlphaIcon fontSize="small" />
						</IconButton>

						<IconButton size="small" sx={{ color: '#5f6368' }}>
							<FolderOpenIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>

				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							py: 4,
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<>
						{/* Document Display - Grid or List */}
						{viewMode === 'grid' ? (
							<Grid container spacing={1.5}>
								{data?.content.map((report: any) => (
									<Grid key={report.id}>
										<ReportDocumentCard report={report} />
									</Grid>
								))}
							</Grid>
						) : (
							<Box sx={{ overflow: 'hidden' }}>
								<List sx={{ py: 1 }}>
									{data?.content.map((report: any) => (
										<ReportDocumentListItem
											key={report.id}
											report={report}
										/>
									))}
								</List>
							</Box>
						)}
					</>
				)}
			</Container>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					position: 'absolute',
					bottom: 25,
					left: '50%',
					transform: 'translateX(-100%)',
				}}
			>
				<Pagination
					count={Math.ceil((data?.totalElements || 0) / PAGE_SIZE)}
					page={page}
					onChange={handlePageChange}
					color="primary"
					showFirstButton
					showLastButton
					disabled={isLoading}
				/>
			</Box>
		</>
	);
};

export default ReportsListPage;
