// ReportPage.tsx (Main component)
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { SplitPanelComponent, StyledContainer } from '@moornmo/components';
import { ReportTabList } from '@esg/components/reports/ReportTabList';
import Editor from '@repo/editor-js/editor';
import { useReportPdf } from '@esg/hooks/reports/useReportPdf';
import { EditorOutputData } from '@editor-js/types';
import { useTab } from '@esg/hooks/reports/tabs/useTab';
import { useReportQuery } from '@esg/hooks/reports/useReportQuery';
import { Spinner } from '@repo/moornmo-ui/components';
import { ReportTab } from '@esg/types/report';

const ReportContent: React.FC<{
	reportId?: number;
}> = ({ reportId }) => {
	const { handleDownloadPdf } = useReportPdf();
	const { data: report, isLoading } = useReportQuery(reportId);
	const [selectedTab, setSelectedTab] = useState<ReportTab | any | null>(
		null
	);

	const { createTab, deleteTab, updateTab, updateTabBlocks } = useTab(
		reportId || 0,
		selectedTab?.tabId || 0
	);

	const handleCreateTab = async () => {
		const tabOrder = (report?.tabs?.length ?? 0) + 1;
		if (!reportId) return;
		try {
			const newTabData = await createTab.mutateAsync({
				name: `Tab ${tabOrder}`,
				tabOrder: tabOrder,
			});
			// Convert to ReportTab format
			const formattedNewTab: ReportTab = {
				tabId: newTabData?.id ?? 0,
				name: newTabData?.name || '',
				tabOrder: newTabData?.tabOrder || 0,
				blocks: newTabData?.blocks ? newTabData?.blocks : [],
				createdAt: new Date().toISOString(),
				updatedAt: newTabData?.updatedAt || new Date().toISOString(),
			};

			setSelectedTab(formattedNewTab);
		} catch (error) {
			console.error('Failed to create tab:', error);
		}
	};

	const handleUpdateTab = async (tabId: number, newTitle: string) => {
		if (!reportId) return;
		try {
			await updateTab.mutateAsync({
				tabId,
				data: { name: newTitle },
			});
		} catch (error) {
			console.error('Failed to update tab:', error);
		}
	};

	const handleDeleteTab = async (tabId: number) => {
		if (!reportId) return;
		try {
			await deleteTab.mutateAsync(tabId);
		} catch (error) {
			console.error('Failed to delete tab:', error);
		}
	};

	const handleSelectTab = useCallback((tab: ReportTab) => {
		setSelectedTab(tab);
	}, []);

	const handleEditorSave = async (editorData: EditorOutputData) => {
		if (!selectedTab?.tabId) return;
		try {
			const payload = {
				blocks: JSON.stringify(editorData.blocks),
			};
			await updateTabBlocks.mutateAsync(payload);
		} catch (error) {
			console.error('Failed to save editor content:', error);
		}
	};

	useEffect(() => {
		if (report?.tabs && report.tabs.length > 0) {
			if (!selectedTab) {
				setSelectedTab(report.tabs[0]);
			}
		}
	}, [report?.tabs]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!report) {
		return (
			<StyledContainer>
				<Typography variant="h6">Report not found</Typography>
			</StyledContainer>
		);
	}

	return (
		<SplitPanelComponent
			direction="horizontal"
			sizes={[25, 75]}
			minSize={200}
			height={'calc(100% - 30px)'}
			overflow={'hidden'}
		>
			<ReportTabList
				tabs={report?.tabs || []}
				selectedTab={selectedTab}
				onSelectTab={handleSelectTab}
				onCreateTab={handleCreateTab}
				onUpdateTab={handleUpdateTab}
				onCopyTab={(pageId) => {
					console.log('Copying page:', pageId);
				}}
				onDeleteTab={handleDeleteTab}
				onDownloadPdf={() => handleDownloadPdf(report)}
			/>
			<StyledContainer>
				<Box
					sx={{
						overflowY: 'auto',
						height: '100vh',
					}}
				>
					{selectedTab ? (
						<Editor tab={selectedTab} onSave={handleEditorSave} />
					) : (
						<Typography sx={{ px: 1 }}>
							Select a page to edit or create a new one.
						</Typography>
					)}
				</Box>
			</StyledContainer>
		</SplitPanelComponent>
	);
};

const ReportPage: React.FC = () => {
	const { reportId } = useParams<{ reportId?: string }>();
	const numericReportId = reportId ? parseInt(reportId) : 0;

	return <ReportContent reportId={numericReportId} />;
};

export default ReportPage;
