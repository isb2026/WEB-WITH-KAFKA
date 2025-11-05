import { useEditorPdf } from '@editor-js/hooks/useEditorPdf';
import { useCallback } from 'react';
import { Report } from '@esg/types/report';

export const useReportPdf = () => {
	const { downloadPdf } = useEditorPdf();

	const handleDownloadPdf = useCallback(
		async (report: Report) => {
			if (!report?.tabs?.length) {
				console.warn('No report content found');
				return;
			}

			try {
				await downloadPdf(report, {
					filename: `${report.title || 'Untitled Document'}-${Date.now()}.pdf`,
					margin: [40, 40, 40, 40],
				});
			} catch (error) {
				console.error('Error downloading PDF:', error);
			}
		},
		[downloadPdf]
	);

	return { handleDownloadPdf };
};
