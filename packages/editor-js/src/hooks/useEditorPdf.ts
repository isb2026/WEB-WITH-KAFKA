import { useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import { Report, ReportTab } from '@esg/types/report';

interface EditorPdfOptions {
	filename?: string;
	margin?: number[];
}

export const useEditorPdf = () => {
	// Helper function to create HTML content for a block
	const createBlockHTML = (block: any): string => {
		switch (block.type) {
			case 'header':
				return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
			case 'paragraph':
				return `<p>${block.data.text}</p>`;
			case 'list':
				const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
				return `<${listType}>${block.data.items.map((item: string) => `<li>${item}</li>`).join('')}</${listType}>`;
			case 'table':
				const rows = block.data.content
					.map(
						(row: string[]) =>
							`<tr>${row.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`
					)
					.join('');
				return `<table>${rows}</table>`;
			default:
				return '';
		}
	};

	const downloadPdf = useCallback(
		async (report: Report, options: EditorPdfOptions = {}) => {
			try {
				// Build HTML string instead of creating DOM elements one by one
				let htmlContent = '';

				// Process all tabs at once using map and join
				htmlContent = report.tabs
					.map((tab: ReportTab) => {
						const blocks =
							typeof tab.blocks === 'string'
								? JSON.parse(tab.blocks)
								: tab.blocks;

						if (!Array.isArray(blocks)) {
							console.warn(
								`Tab ${tab.name} has no valid blocks data`
							);
							return '';
						}

						// Process all blocks at once using map and join
						const blocksHTML = blocks.map(createBlockHTML).join('');

						return `
              <div>
                <h1>${tab.name}</h1>
                <div>${blocksHTML}</div>
                <div style="page-break-after: always;"></div>
              </div>
            `;
					})
					.join('');

				// Create container and set innerHTML once
				const container = document.createElement('div');
				container.innerHTML = htmlContent;

				const pdfOptions = {
					margin: options.margin || [0, 0, 0, 0],
					filename: options.filename || `${report.title}.pdf`,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: {
						scale: 2,
						useCORS: true,
						letterRendering: true,
					},
					jsPDF: {
						unit: 'pt',
						format: 'a4',
						orientation: 'portrait',
					},
				};

				await html2pdf().from(container).set(pdfOptions).save();
			} catch (error) {
				console.error('Error generating PDF:', error);
				throw error;
			}
		},
		[]
	);

	return { downloadPdf };
};
